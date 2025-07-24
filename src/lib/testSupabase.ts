import { supabase } from './supabaseClient';

// Simple test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  // Check environment variables
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment variables:');
  console.log('VITE_SUPABASE_URL:', url ? 'Set' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', key ? 'Set' : 'Missing');
  
  if (!url || !key) {
    console.error('❌ Missing environment variables!');
    return false;
  }
  
  try {
    // Test basic connection by trying to get session
    console.log('🔐 Testing auth session...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return false;
    }
    
    console.log('✅ Auth session:', authData.session ? 'Logged in' : 'Anonymous');
    
    // Test database connection by trying to query gallery table
    console.log('📊 Testing database connection...');
    const { data, error } = await supabase
      .from('gallery')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database error:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log('Gallery table count:', data);
    
    return true;
  } catch (error) {
    console.error('💥 Connection test failed:', error);
    return false;
  }
};

// Test function specifically for gallery API
export const testGalleryAPI = async () => {
  console.log('🖼️ Testing Gallery API...');
  
  try {
    // Test SELECT
    console.log('Testing SELECT...');
    const { data: selectData, error: selectError } = await supabase
      .from('gallery')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('❌ SELECT failed:', selectError);
      return false;
    }
    
    console.log('✅ SELECT successful, found', selectData?.length || 0, 'items');
    
    // Test INSERT
    console.log('Testing INSERT...');
    const testItem = {
      title: 'Test Image ' + Date.now(),
      category: 'Test',
      image_url: 'https://via.placeholder.com/300x200?text=Test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('gallery')
      .insert([testItem])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ INSERT failed:', insertError);
      return false;
    }
    
    console.log('✅ INSERT successful:', insertData);
    
    // Test UPDATE
    if (insertData?.id) {
      console.log('Testing UPDATE...');
      const { data: updateData, error: updateError } = await supabase
        .from('gallery')
        .update({ title: 'Updated Test Image' })
        .eq('id', insertData.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ UPDATE failed:', updateError);
      } else {
        console.log('✅ UPDATE successful:', updateData);
      }
      
      // Test DELETE (cleanup)
      console.log('Testing DELETE (cleanup)...');
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        console.error('❌ DELETE failed:', deleteError);
      } else {
        console.log('✅ DELETE successful');
      }
    }
    
    return true;
  } catch (error) {
    console.error('💥 Gallery API test failed:', error);
    return false;
  }
};
