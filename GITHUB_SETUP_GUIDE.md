# 🚀 GitHub Setup Guide - Push & Collaborate

Complete guide to push your Himalayan Salt project to GitHub and enable team collaboration.

---

## 📋 Prerequisites

- Git installed on your computer
- GitHub account created
- Project cleaned and ready (✅ Done!)

---

## 🔐 Step 1: Secure Your Environment Variables

**IMPORTANT:** Before pushing, verify sensitive data is protected!

### ✅ Already Protected (DO NOT COMMIT):
- `.env` files (backend and frontend)
- `node_modules/`
- Firebase service account keys
- API keys

### 📝 Create Environment Variable Templates:

**Update `.env.example` in root:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_generate_a_strong_random_string
JWT_EXPIRES_IN=7d

# Firebase Admin SDK Configuration
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key-with-escaped-newlines"
FIREBASE_CLIENT_EMAIL=your-firebase-service-account-email

# ImgBB API Configuration
# Get your API key from https://api.imgbb.com/
IMGBB_API_KEY=your_imgbb_api_key_here
```

**Create `frontend/.env.example`:**
```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## 🎯 Step 2: Initialize Git Repository

Open terminal in your project root and run:

```bash
# Navigate to project directory
cd "c:\Users\Ahmad computer sdk\Desktop\project"

# Initialize Git repository (if not already done)
git init

# Check current status
git status
```

**You should see:**
- Green: Files ready to commit
- Red: Untracked files
- `.env` files should NOT appear (they're in .gitignore)

---

## 📝 Step 3: Create Initial Commit

```bash
# Add all files to staging
git add .

# Check what will be committed (verify no .env files!)
git status

# Create initial commit
git commit -m "Initial commit: Himalayan Pink Salt E-commerce Platform

- Complete backend API with Express.js
- Next.js frontend with admin dashboard
- Product, category, inquiry, and contact management
- Firebase Firestore integration
- JWT authentication
- Image upload functionality
- Responsive design with Tailwind CSS"
```

---

## 🌐 Step 4: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in the details:
   - **Repository name:** `himalayan-salt-ecommerce` (or your choice)
   - **Description:** `Full-stack e-commerce platform for Himalayan pink salt products with admin dashboard`
   - **Visibility:** 
     - ✅ **Private** (recommended for client projects)
     - ⚪ Public (if open source)
   - ❌ **DO NOT** initialize with README (you already have one)
   - ❌ **DO NOT** add .gitignore (you already have one)
4. Click **"Create repository"**

### Option B: Via GitHub CLI (if installed)

```bash
gh repo create himalayan-salt-ecommerce --private --source=. --remote=origin
```

---

## 🔗 Step 5: Connect to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/himalayan-salt-ecommerce.git

# Verify remote was added
git remote -v

# Push code to GitHub
git push -u origin main
```

**Note:** If your default branch is `master` instead of `main`, use:
```bash
git branch -M main  # Rename to main
git push -u origin main
```

---

## 👥 Step 6: Set Up Collaborators

### Add Team Members:

1. Go to your GitHub repository
2. Click **"Settings"** tab
3. Click **"Collaborators"** in left sidebar
4. Click **"Add people"**
5. Enter collaborator's GitHub username or email
6. Select permission level:
   - **Read:** View only
   - **Write:** Can push to repository (recommended for developers)
   - **Admin:** Full control

### Invite Collaborators:
They'll receive an email invitation and must accept it.

---

## 📋 Step 7: Create Collaboration Guidelines

### Create `CONTRIBUTING.md`:

```markdown
# Contributing Guidelines

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run `npm install` in root and frontend directories
4. Follow setup instructions in README.md

## Development Workflow

1. Create a new branch for each feature/fix
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create Pull Request

## Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/what-refactored` - Code refactoring

## Commit Message Format

```
type(scope): brief description

Detailed description if needed
```

Types: feat, fix, docs, style, refactor, test, chore

## Pull Request Process

1. Update README.md if needed
2. Ensure all tests pass
3. Request review from team member
4. Address review comments
5. Merge after approval

## Code Style

- Follow existing code structure
- Use meaningful variable names
- Comment complex logic
- Run linter before committing
```

---

## 🔒 Step 8: Protect Main Branch

### Recommended Settings:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

---

## 🚀 Step 9: Set Up GitHub Actions (Optional CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build
```

---

## 📖 Step 10: Update README for Collaborators

Add this section to your README.md:

```markdown
## 👥 For Collaborators

### First Time Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/himalayan-salt-ecommerce.git
   cd himalayan-salt-ecommerce
   ```

2. Copy environment files:
   ```bash
   cp .env.example .env
   cd frontend
   cp .env.example .env.local
   cd ..
   ```

3. Fill in your credentials in both `.env` files
   (Ask project owner for Firebase and ImgBB keys)

4. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

5. Run the application:
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

4. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create Pull Request on GitHub

6. Wait for review and approval

7. After merge, update your local main:
   ```bash
   git checkout main
   git pull origin main
   ```
```

---

## 🎯 Step 11: Create GitHub Project Board (Optional)

For better project management:

1. Go to **Projects** tab
2. Click **"New project"**
3. Choose **"Board"** template
4. Add columns:
   - 📋 To Do
   - 🚧 In Progress
   - 👀 In Review
   - ✅ Done
5. Create issues and add to board

---

## 📱 Step 12: Share Repository Access

### For Each Collaborator:

**Send them:**
1. Repository URL: `https://github.com/YOUR-USERNAME/himalayan-salt-ecommerce`
2. Invitation link (from email)
3. Required credentials:
   - Firebase credentials (privately)
   - ImgBB API key (privately)
   - Admin password (privately)

**Security Note:** Share credentials via secure channels (encrypted chat, password manager, etc.)

---

## ✅ Verification Checklist

Before collaborators start:

- [ ] Repository is created on GitHub
- [ ] Code is pushed successfully
- [ ] `.env` files are NOT in repository
- [ ] `.env.example` files are included
- [ ] Collaborators are invited
- [ ] README.md has setup instructions
- [ ] CONTRIBUTING.md guidelines are clear
- [ ] Branch protection rules are set (if needed)
- [ ] Credentials are shared securely

---

## 🔄 Common Git Commands for Team

### Daily Workflow:
```bash
# Get latest changes from main
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# See what changed
git status

# Stage changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature
```

### Syncing with Main:
```bash
# Switch to main branch
git checkout main

# Get latest changes
git pull origin main

# Switch back to your branch
git checkout feature/your-feature

# Merge main into your branch
git merge main
```

### Fixing Mistakes:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to a file
git checkout -- filename

# See commit history
git log --oneline
```

---

## 🆘 Troubleshooting

### "Permission denied" when pushing:
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/USERNAME/REPO.git
```

### Merge Conflicts:
1. Open conflicted files
2. Look for `<<<<<<`, `======`, `>>>>>>`
3. Keep the code you want
4. Remove conflict markers
5. `git add .` → `git commit` → `git push`

### ".env file accidentally committed":
```bash
# Remove from Git (keep local file)
git rm --cached .env
git commit -m "Remove .env from repository"
git push origin main
```

**Then immediately:**
1. Rotate all credentials in the exposed .env
2. Update .gitignore to prevent future commits

---

## 📞 Support for Collaborators

If collaborators face issues:

1. Check README.md for setup instructions
2. Check CONTRIBUTING.md for guidelines
3. Create an Issue on GitHub
4. Contact repository owner

---

## 🎉 You're Ready!

Your project is now:
- ✅ On GitHub
- ✅ Protected from sensitive data leaks
- ✅ Ready for collaboration
- ✅ Set up with best practices

**Next Steps:**
1. Push the code
2. Invite collaborators
3. Share credentials securely
4. Start collaborating!

---

**Repository Structure After Push:**
```
himalayan-salt-ecommerce/
├── .github/workflows/      # CI/CD pipelines
├── src/                    # Backend source
├── frontend/               # Next.js frontend
├── .gitignore             # Protected files
├── .env.example           # Template for credentials
├── README.md              # Main documentation
├── CONTRIBUTING.md        # Collaboration guidelines
├── package.json           # Backend dependencies
└── LICENSE                # Project license
```
