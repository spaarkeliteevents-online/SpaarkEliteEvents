import { supabase } from '../lib/supabaseClient';

/**
 * Script to create an admin user in Supabase
 * Run this once to set up your admin account
 */
export const createAdminUser = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123!'; // Change this to a secure password
  
  try {
    console.log('Creating admin user...');
    
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin' // Set admin role in user metadata
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return false;
    }

    if (data.user) {
      console.log('✅ Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('User ID:', data.user.id);
      
      // Note: In production, you might want to verify the email first
      // or set up additional admin privileges in your database
      
      return true;
    }
  } catch (err) {
    console.error('Failed to create admin user:', err);
    return false;
  }
};

// Uncomment the line below and run this script to create the admin user
// createAdminUser();
