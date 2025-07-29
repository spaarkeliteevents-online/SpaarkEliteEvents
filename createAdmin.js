const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123!';
  
  try {
    console.log('Creating admin user...');
    
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin'
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
      return true;
    }
  } catch (err) {
    console.error('Failed to create admin user:', err);
    return false;
  }
}

createAdminUser();
