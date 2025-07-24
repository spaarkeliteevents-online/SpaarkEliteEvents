import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseTest: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      addResult('🔍 Starting Supabase tests...');
      
      // Test 1: Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      addResult(`📍 Supabase URL: ${url ? url.substring(0, 30) + '...' : 'MISSING'}`);
      addResult(`🔑 Supabase Key: ${key ? 'EXISTS' : 'MISSING'}`);
      
      if (!url || !key) {
        addResult('❌ Missing environment variables! Check your .env file');
        return;
      }

      // Test 2: Check auth session
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`);
      } else {
        addResult(`✅ Auth session: ${authData.session ? 'Logged in' : 'Anonymous'}`);
      }

      // Test 3: Test each table
      const tables = ['gallery', 'blogs', 'faqs', 'contacts', 'events'];
      
      for (const tableName of tables) {
        addResult(`\n📋 Testing table: ${tableName}`);
        
        try {
          // Try to count records
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (countError) {
            addResult(`❌ ${tableName}: ${countError.message}`);
            if (countError.code === '42P01') {
              addResult(`💡 Table '${tableName}' does not exist in database`);
            }
          } else {
            addResult(`✅ ${tableName}: ${count} records found`);
          }
        } catch (err) {
          addResult(`💥 ${tableName}: Exception - ${err.message}`);
        }
      }

      // Test 4: Try to insert into gallery table
      addResult(`\n🧪 Testing INSERT into gallery...`);
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
        addResult(`❌ Insert failed: ${insertError.message}`);
        if (insertError.code === '42501') {
          addResult(`💡 Permission denied - check Row Level Security (RLS) policies`);
        }
      } else {
        addResult(`✅ Insert successful: ${JSON.stringify(insertData)}`);
        
        // Clean up - delete the test record
        if (insertData && insertData[0]?.id) {
          const { error: deleteError } = await supabase
            .from('gallery')
            .delete()
            .eq('id', insertData[0].id);
          
          if (deleteError) {
            addResult(`❌ Cleanup failed: ${deleteError.message}`);
          } else {
            addResult(`✅ Test record cleaned up`);
          }
        }
      }

      addResult(`\n🎉 Tests completed!`);
      
    } catch (error) {
      addResult(`💥 Test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTables = async () => {
    setIsLoading(true);
    addResult('🔨 Creating tables...');
    
    const sqlCommands = [
      `CREATE TABLE IF NOT EXISTS gallery (
        id uuid primary key default gen_random_uuid(),
        title text,
        category text,
        image_url text not null,
        created_at timestamp default now()
      );`,
      
      `CREATE TABLE IF NOT EXISTS blogs (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        content text not null,
        image text,
        created_at timestamp default now()
      );`,
      
      `CREATE TABLE IF NOT EXISTS faqs (
        id uuid primary key default gen_random_uuid(),
        question text not null,
        answer text not null,
        created_at timestamp default now()
      );`,
      
      `CREATE TABLE IF NOT EXISTS contacts (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        email text,
        message text,
        created_at timestamp default now()
      );`,
      
      `CREATE TABLE IF NOT EXISTS events (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        description text,
        date date not null,
        category text,
        media text,
        created_at timestamp default now()
      );`
    ];

    for (const sql of sqlCommands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        if (error) {
          addResult(`❌ SQL Error: ${error.message}`);
        } else {
          addResult(`✅ Table created successfully`);
        }
      } catch (err) {
        addResult(`💥 Exception: ${err.message}`);
        addResult(`💡 Note: You may need to create tables manually in Supabase dashboard`);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testSupabaseConnection}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={createTables}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Create Tables
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Click "Test Connection" to start debugging...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Quick Fixes:</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• If tables don't exist: Go to Supabase dashboard → SQL Editor → Run the table creation SQL</li>
          <li>• If permission denied: Go to Authentication → Policies → Disable RLS or create policies</li>
          <li>• If environment variables missing: Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
          <li>• If still not working: Check browser network tab for failed requests</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseTest;
