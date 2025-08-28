import Admin from '../models/Admin.js';

export const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL || 'admin@digitalchunab.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'System Administrator'
      });

      await admin.save();
      console.log('Default admin created');
      console.log('Email:', process.env.ADMIN_EMAIL || 'admin@digitalchunab.com');
      console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};