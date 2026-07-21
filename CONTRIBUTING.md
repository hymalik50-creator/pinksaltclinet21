# Contributing to Himalayan Pink Salt E-commerce Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/himalayan-salt-ecommerce.git
cd himalayan-salt-ecommerce
```

### 2. Set Up Environment
```bash
# Copy environment templates
cp .env.example .env
cd frontend
cp .env.example .env.local
cd ..
```

### 3. Fill in Credentials
- Request Firebase credentials from project owner
- Request ImgBB API key from project owner
- Update both `.env` files with your credentials

### 4. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 5. Run Development Servers
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📋 Development Workflow

### Branch Strategy

We use feature branches for development:

1. **Main Branch** (`main`): Production-ready code
2. **Feature Branches** (`feature/*`): New features
3. **Fix Branches** (`fix/*`): Bug fixes
4. **Docs Branches** (`docs/*`): Documentation updates

### Creating a New Branch

```bash
# Update your local main
git checkout main
git pull origin main

# Create new branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/add-product-reviews` - New features
- `fix/category-display-bug` - Bug fixes
- `docs/update-api-docs` - Documentation
- `refactor/optimize-queries` - Code refactoring
- `test/add-unit-tests` - Tests

## 💻 Making Changes

### Code Style Guidelines

1. **Follow Existing Patterns**: Match the style of surrounding code
2. **Use Meaningful Names**: Variables and functions should be self-explanatory
3. **Comment Complex Logic**: Explain why, not what
4. **Keep Functions Small**: Single responsibility principle
5. **Use TypeScript Types**: Add proper types in frontend code

### Backend Code Style

```javascript
// Good
async function createCategory(categoryData) {
  try {
    const category = await categoryService.create(categoryData);
    return ApiResponse.success(res, category, 'Category created');
  } catch (error) {
    next(error);
  }
}

// Avoid
async function cat(d) {
  let c = await service.create(d);
  return c;
}
```

### Frontend Code Style

```typescript
// Good
interface Category {
  id: string;
  name: string;
  slug: string;
}

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return <div>{category.name}</div>;
};

// Avoid
const Card = ({ c }) => <div>{c.name}</div>;
```

## 📝 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good
git commit -m "feat(products): add sorting by price feature"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs: update API endpoints in README"

# Avoid
git commit -m "updates"
git commit -m "fix bug"
git commit -m "changes"
```

## 🔍 Testing

### Before Committing

1. **Test your changes locally**
   - Backend: Test API endpoints
   - Frontend: Test UI in browser
   
2. **Check for errors**
   - No console errors
   - No TypeScript errors
   - No ESLint warnings

3. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Network errors

## 🔄 Pull Request Process

### 1. Push Your Branch

```bash
# Stage your changes
git add .

# Commit with meaningful message
git commit -m "feat(categories): add category filtering"

# Push to GitHub
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to the repository on GitHub
2. Click **"Pull requests"** → **"New pull request"**
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of what this PR does

## Changes
- Added category filtering feature
- Updated category component
- Added filter controls

## Testing
- Tested with 10+ categories
- Verified filtering works correctly
- Checked responsive design

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code tested locally
- [ ] No console errors
- [ ] Documentation updated
- [ ] Follows code style guidelines
```

5. Click **"Create pull request"**

### 3. Code Review

- Wait for review from maintainer
- Address feedback promptly
- Make requested changes
- Push updates to same branch (PR auto-updates)

### 4. After Approval

- Maintainer will merge your PR
- Delete your feature branch (GitHub prompts)
- Update your local main:

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try to reproduce consistently
3. Test on latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
How you envision the feature

**Describe alternatives you've considered**
Other solutions you thought about

**Additional context**
Mockups, examples, etc.
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email the project owner directly
2. Include detailed description
3. Wait for acknowledgment
4. Do not disclose publicly until fixed

### Security Best Practices

- Never commit `.env` files
- Never hardcode credentials
- Use environment variables
- Validate all user inputs
- Sanitize data before database operations

## 📚 Resources

### Project Documentation

- [README.md](README.md) - Setup and overview
- [API Documentation](src/routes/) - API endpoints
- [Component Documentation](frontend/components/) - Frontend components

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [React Query](https://tanstack.com/query/latest)

## ❓ Getting Help

### Where to Ask

1. **GitHub Issues**: For bugs and feature requests
2. **GitHub Discussions**: For questions and general discussion
3. **Pull Request Comments**: For code-specific questions

### Response Time

- Bug reports: Within 48 hours
- Feature requests: Within 1 week
- Pull requests: Within 3 days

## 🎯 Project Priorities

Current focus areas (in order):
1. Bug fixes and stability
2. Performance improvements
3. New features
4. Documentation
5. Refactoring

## 🙏 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Mentioned in project updates

Thank you for contributing! 🎉
