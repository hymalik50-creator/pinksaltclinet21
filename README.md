# Himalayan Pink Salt Products Website

Full-stack e-commerce platform for Himalayan pink salt products with admin dashboard, built with Next.js and Express.js.

## 🚀 Features

### Public Website
- 🏠 Homepage with featured products and category showcase
- 📦 Product catalog with search, filters, and sorting
- 🔍 Product detail pages with inquiry forms
- 📧 Contact form and inquiry submission
- 📱 Responsive design for all devices

### Admin Dashboard
- 🔐 Secure authentication with JWT
- 📊 Dashboard with real-time statistics
- 🏷️ Product management (CRUD operations)
- 📂 Category management
- 📨 Inquiry management
- ✉️ Contact message management
- 🖼️ Image upload (ImgBB integration)

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Authentication:** JWT
- **Validation:** express-validator
- **Security:** Helmet, CORS, bcrypt
- **Image Upload:** ImgBB API

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form
- **Animations:** Framer Motion

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- ImgBB API key (for image uploads)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd project
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Environment Setup

#### Backend (.env)
Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# ImgBB
IMGBB_API_KEY=your_imgbb_api_key
```

#### Frontend (frontend/.env.local)
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 5. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Extract the following from the JSON:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY
   - `client_email` → FIREBASE_CLIENT_EMAIL

### 6. Create Admin User

Run this script to create an admin user in Firestore:

```javascript
// create-admin.js
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  
  await db.collection('users').add({
    email: 'admin@himalayansalt.com',
    password: hashedPassword,
    role: 'admin',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  console.log('✅ Admin user created');
  console.log('Email: admin@himalayansalt.com');
  console.log('Password: Admin@123456');
}

createAdmin();
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
npm run dev
```
Backend will run on: http://localhost:5000

#### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### Production Mode

#### Build Backend
```bash
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run start
```

## 📱 Usage

### Public Website
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

### Admin Dashboard
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin
- Products: http://localhost:3000/admin/products
- Categories: http://localhost:3000/admin/categories
- Inquiries: http://localhost:3000/admin/inquiries
- Contacts: http://localhost:3000/admin/contacts

**Default Admin Credentials:**
- Email: `admin@himalayansalt.com`
- Password: `Admin@123456`

## 📚 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug
- `GET /api/categories` - Get all categories
- `POST /api/inquiries` - Submit inquiry
- `POST /api/contact` - Submit contact message

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/inquiries` - List all inquiries
- `PUT /api/admin/inquiries/:id/status` - Update inquiry status
- `DELETE /api/admin/inquiries/:id` - Delete inquiry
- `GET /api/admin/contact` - List all contact messages
- `DELETE /api/admin/contact/:id` - Delete contact message
- `POST /api/admin/images/upload` - Upload image
- `GET /api/admin/stats` - Get dashboard statistics

## 🗂️ Project Structure

```
project/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── services/            # Business logic
│   ├── repositories/        # Database operations
│   ├── middlewares/         # Express middlewares
│   ├── routes/              # API routes
│   ├── validators/          # Input validation
│   ├── utils/               # Utility functions
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── frontend/                # Frontend Next.js app
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and helpers
│   └── hooks/              # Custom React hooks
├── .env                    # Backend environment variables
├── package.json            # Backend dependencies
└── README.md              # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet security headers
- Admin role verification

## 🐛 Known Issues & Limitations

1. **Firestore Queries:** Composite indexes not created to avoid complexity. Queries sort in memory (suitable for small-medium datasets).
2. **Search:** Basic in-memory search. For production, consider Algolia or Elasticsearch for large catalogs.
3. **Image URL Validation:** Empty imageUrl is allowed for categories (optional field).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues and questions, please create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Blog functionality
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Shopping cart and checkout
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] PDF catalog generation
- [ ] Inventory management
- [ ] Customer accounts

---

**Built with ❤️ for Himalayan Pink Salt Products**
