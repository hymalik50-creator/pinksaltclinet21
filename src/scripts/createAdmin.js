require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const config = require('../config');

/**
 * Script to create initial admin user
 * Run this once to set up the admin account
 */

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const adminData = {
      email: 'admin@himalayansalt.com',
      password: 'Admin@123456', // Change this after first login
    };

    // Check if admin already exists
    const adminCollection = db.collection(config.collections.administrators);
    const existingAdmin = await adminCollection
      .where('email', '==', adminData.email)
      .limit(1)
      .get();

    if (!existingAdmin.empty) {
      console.log('❌ Admin user already exists');
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Create admin with role
    await adminCollection.add({
      email: adminData.email,
      name: 'Admin User',
      passwordHash,
      role: 'admin', // Explicitly set admin role
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    });

    console.log('✅ Admin user created successfully');
    console.log('\nAdmin Credentials:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role: admin`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
