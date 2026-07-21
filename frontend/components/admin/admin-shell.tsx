'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Mail,
  FolderOpen,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAdmin } from '@/components/providers/admin-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/contacts', label: 'Contact Messages', icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLogin) {
      router.replace('/admin/login');
    }
  }, [loading, user, router, isLogin]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="text-sm text-stone-500">Loading admin session...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-stone-200 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 text-white">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold">
            Himala<span className="text-rose-500">Salt</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-stone-600 hover:bg-stone-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-200 p-4">
          <div className="mb-3 px-3 text-xs text-stone-500">
            Signed in as
            <div className="truncate text-sm font-medium text-stone-900">
              {user.email}
            </div>
          </div>
          <Link
            href="/"
            className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 text-white">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-display font-semibold">Admin</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-stone-700"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6">
              <span className="font-display font-semibold">Admin menu</span>
              <button onClick={() => setOpen(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4" onClick={() => setOpen(false)}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-stone-200 p-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
