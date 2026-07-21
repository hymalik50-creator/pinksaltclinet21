# 🚀 Quick Start Commands

## Initial Setup (One Time Only)

```bash
# Navigate to project
cd "c:\Users\Ahmad computer sdk\Desktop\project"

# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Himalayan Pink Salt E-commerce Platform"

# Create GitHub repository (via website)
# Then connect it:
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git

# Push to GitHub
git push -u origin main
```

## Add Collaborators

1. GitHub → Repository → Settings → Collaborators
2. Click "Add people"
3. Enter GitHub username
4. Choose "Write" permission
5. Send invitation

## For Collaborators - First Time

```bash
# Clone repository
git clone https://github.com/USERNAME/REPO-NAME.git
cd REPO-NAME

# Setup environment
cp .env.example .env
cd frontend
cp .env.example .env.local
cd ..

# Install dependencies
npm install
cd frontend
npm install
cd ..

# Run the app
# Terminal 1:
npm run dev

# Terminal 2:
cd frontend
npm run dev
```

## Daily Development Workflow

```bash
# 1. Update your local main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes...

# 4. Check status
git status

# 5. Add changes
git add .

# 6. Commit
git commit -m "feat: description of changes"

# 7. Push to GitHub
git push origin feature/my-feature

# 8. Create Pull Request on GitHub website

# 9. After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/my-feature
```

## Useful Git Commands

```bash
# Check current branch
git branch

# See changes
git diff

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename

# Pull latest changes
git pull origin main

# Push changes
git push origin branch-name
```

## Before First Push - Checklist

- [ ] `.env` files are NOT tracked (check `.gitignore`)
- [ ] `node_modules/` is ignored
- [ ] `.env.example` files are included
- [ ] README.md is updated
- [ ] All test/documentation files removed (if not needed)
- [ ] Project builds successfully
- [ ] No sensitive data in code

## After Pushing - Share with Team

**Send collaborators:**
1. Repository URL
2. Firebase credentials (private message)
3. ImgBB API key (private message)  
4. Admin password (private message)
5. Link to README.md for setup instructions

## Repository URL Format

```
https://github.com/YOUR-USERNAME/himalayan-salt-ecommerce
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

**Need Help?** 
- Check: GITHUB_SETUP_GUIDE.md (detailed guide)
- Check: CONTRIBUTING.md (development workflow)
- Check: README.md (project documentation)
