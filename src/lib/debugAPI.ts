import { supabase } from './supabaseClient';

// Debug function to test Supabase connection and table access
export const debugSupabase = async () => {
  console.log('🔍 Starting Supabase debug...');
  
  try {
    // Test 1: Check Supabase client configuration
    console.log('1. Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('2. Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Test 2: Check if we can connect to Supabase
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('3. Auth session:', authData);
    if (authError) console.error('3. Auth error:', authError);
    
    // Test 3: Try to query each table
    const tables = ['gallery', 'blogs', 'faqs', 'contacts', 'events'];
    
    for (const table of tables) {
      console.log(`\n📋 Testing table: ${table}`);
      
      try {
        // Try to select from table
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.error(`❌ Error querying ${table}:`, error);
        } else {
          console.log(`✅ ${table} table exists, count: ${count}, sample data:`, data);
        }
      } catch (err) {
        console.error(`💥 Exception querying ${table}:`, err);
      }
    }
    
    // Test 4: Try to insert a test record into gallery
    console.log('\n🧪 Testing gallery insert...');
    const testData = {
      title: 'Test Image',
      category: 'Test',
      image_url: 'https://via.placeholder.com/300x200.png?text=Test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('gallery')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up - delete the test record
      if (insertData && insertData[0]?.id) {
        const { error: deleteError } = await supabase
          .from('gallery')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('❌ Cleanup delete error:', deleteError);
        } else {
          console.log('✅ Test record cleaned up');
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
  
  console.log('🔍 Debug complete!');
};

// Enhanced gallery API with detailed logging
export const debugGalleryAPI = {
  getAll: async () => {
    console.log('🔍 Gallery API: Getting all items...');
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Gallery getAll error:', error);
        throw error;
      }
      
      console.log('✅ Gallery getAll success:', data?.length, 'items');
      return data;
    } catch (err) {
      console.error('💥 Gallery getAll exception:', err);
      throw err;
    }
  },

  create: async (item: any) => {
    console.log('🔍 Gallery API: Creating item...', item);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Gallery create error:', error);
        throw error;
      }
      
      console.log('✅ Gallery create success:', data);
      return data;
    } catch (err) {
      console.error('💥 Gallery create exception:', err);
      throw err;
    }
  },

  update: async (id: string, item: any) => {
    console.log('🔍 Gallery API: Updating item...', id, item);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Gallery update error:', error);
        throw error;
      }
      
      console.log('✅ Gallery update success:', data);
      return data;
    } catch (err) {
      console.error('💥 Gallery update exception:', err);
      throw err;
    }
  },

  delete: async (id: string) => {
    console.log('🔍 Gallery API: Deleting item...', id);
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Gallery delete error:', error);
        throw error;
      }
      
      console.log('✅ Gallery delete success');
    } catch (err) {
      console.error('💥 Gallery delete exception:', err);
      throw err;
    }
  }
};
