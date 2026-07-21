'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderOpen,
  Loader2,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isPublished: true,
  });
  
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-categories', search],
    queryFn: async () => {
      console.log('🔄 Fetching categories with search:', search);
      const result = await adminApi.getCategories({ search });
      console.log('📦 Categories API response:', result);
      return result;
    },
    retry: 1,
  });

  console.log('📁 Categories Page State:', { 
    isLoading, 
    hasData: !!data, 
    dataStructure: data ? Object.keys(data) : null,
    categoriesArray: data?.data,
    categoriesCount: data?.data?.length,
    error: error?.message 
  });

  // Extract categories array from response
  // Backend returns: { success: true, data: [...], pagination: {...} }
  const categories: Category[] = data?.data || [];

  console.log('📊 Final categories to display:', categories.length);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('🆕 Creating category with data:', data);
      const result = await adminApi.createCategory(data);
      console.log('✅ Category created, response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Create mutation success, invalidating queries');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (e) => {
      console.error('❌ Create mutation error:', e);
      toast({
        title: 'Failed to create category',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log('🔄 Updating category', id, 'with data:', data);
      const result = await adminApi.updateCategory(id, data);
      console.log('✅ Category updated, response:', result);
      return result;
    },
    onSuccess: () => {
      console.log('✅ Update mutation success, invalidating queries');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category updated successfully' });
      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
    },
    onError: (e) => {
      console.error('❌ Update mutation error:', e);
      toast({
        title: 'Failed to update category',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting category:', id);
      const result = await adminApi.deleteCategory(id);
      console.log('✅ Category deleted, response:', result);
      return result;
    },
    onSuccess: () => {
      console.log('✅ Delete mutation success, invalidating queries');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Category deleted successfully' });
      setDeletingId(null);
    },
    onError: (e) => {
      console.error('❌ Delete mutation error:', e);
      toast({
        title: 'Failed to delete category',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
      setDeletingId(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isPublished: true,
    });
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageUrl: category.image || category.imageUrl || '',
        isPublished: category.isPublished !== false,
      });
    } else {
      setEditingCategory(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      imageUrl: formData.imageUrl,
      isPublished: formData.isPublished,
    };

    console.log('📝 Form submitted:', { editingCategory, payload });

    if (editingCategory) {
      console.log('🔄 Triggering update mutation');
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      console.log('🆕 Triggering create mutation');
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            Categories
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Organize your products into categories for better navigation.
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-rose-500 to-amber-400 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">All categories</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="h-9 pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FolderOpen className="h-12 w-12 text-stone-300" />
              <div>
                <p className="font-medium text-stone-900">No categories found</p>
                <p className="mt-1 text-sm text-stone-500">
                  {search
                    ? 'Try adjusting your search'
                    : 'Create your first category to get started'}
                </p>
              </div>
              {!search && (
                <Button
                  onClick={() => handleOpenDialog()}
                  className="mt-2 bg-gradient-to-r from-rose-500 to-amber-400 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create category
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((cat) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-rose-50">
                    {cat.image || cat.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={cat.image || cat.imageUrl}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FolderOpen className="h-12 w-12 text-rose-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-stone-900">
                          {cat.name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-stone-500">
                          /{cat.slug}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                          cat.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cat.isPublished ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-stone-600">
                        {cat.description}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(cat)}
                        className="flex-1"
                      >
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(cat.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit category' : 'Create new category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category information below.'
                : 'Add a new category to organize your products.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-900">
                Category name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Salt Lamps"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-900">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g. salt-lamps (auto-generated if empty)"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-stone-500">
                URL-friendly identifier. Auto-generated from name if left empty.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-900">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this category..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-900">
                Image URL
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                type="url"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-stone-200 p-3">
              <div>
                <p className="text-sm font-medium text-stone-900">Published</p>
                <p className="text-xs text-stone-500">
                  Show this category on the website
                </p>
              </div>
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-gradient-to-r from-rose-500 to-amber-400 text-white"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category. Products in this
              category will not be deleted, but will need to be re-categorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
