import React, { useState, useEffect } from 'react';
import { galleryAPI, GalleryItem } from '../../lib/api';
import { testSupabaseConnection, testGalleryAPI } from '../../lib/testSupabase';
import { PlusCircle, Edit3, Trash2, Save, X, Image as ImageIcon, Bug } from 'lucide-react';

const GalleryManager: React.FC = () => {
  console.log('🚀 GalleryManager component loaded!');
  console.log('📦 Imports check:', { galleryAPI, testSupabaseConnection, testGalleryAPI });
  
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Starting fetchGallery - this should show in network tab');
      console.log('📡 About to call galleryAPI.getAll()');
      
      const data = await galleryAPI.getAll();
      
      console.log('✅ galleryAPI.getAll() completed, data:', data);
      setItems(data || []);
    } catch (error) {
      console.error('❌ Error fetching gallery:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to fetch gallery items: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const simpleTest = () => {
    console.log('📝 SIMPLE TEST: Button clicked!');
    console.log('📝 Environment check:', {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY
    });
    alert('Simple test clicked! Check console.');
  };

  const runDebugTests = async () => {
    console.clear();
    console.log('🚀 Running debug tests...');
    
    try {
      // Test 1: Basic connection
      console.log('📝 Calling testSupabaseConnection...');
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        alert('❌ Supabase connection failed! Check console for details.');
        return;
      }
      
      // Test 2: Gallery API
      console.log('📝 Calling testGalleryAPI...');
      const apiOk = await testGalleryAPI();
      if (!apiOk) {
        alert('❌ Gallery API test failed! Check console for details.');
        return;
      }
      
      alert('✅ All tests passed! Check console for details.');
    } catch (error) {
      console.error('💥 Debug test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Debug test failed with error: ' + errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      alert('Image URL is required');
      return;
    }

    try {
      if (editingId) {
        await galleryAPI.update(editingId, formData);
        alert('Gallery item updated successfully!');
      } else {
        await galleryAPI.create(formData as Omit<GalleryItem, 'id' | 'created_at'>);
        alert('Gallery item created successfully!');
      }
      
      resetForm();
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title || '',
      category: item.category || '',
      image_url: item.image_url
    });
    setEditingId(item.id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    
    try {
      await galleryAPI.delete(id);
      alert('Gallery item deleted successfully!');
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      image_url: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black flex items-center justify-center sm:justify-start gap-2 sm:gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
            Gallery Management
          </h1>
          <p className="text-base sm:text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Manage Event Photos and Media
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={simpleTest}
            className="btn-secondary px-3 sm:px-4 py-2 flex items-center justify-center gap-1 sm:gap-2 bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500 text-sm sm:text-base"
          >
            Simple Test
          </button>
          <button
            onClick={runDebugTests}
            className="btn-secondary px-3 sm:px-4 py-2 flex items-center justify-center gap-1 sm:gap-2 bg-red-500 text-white hover:bg-red-600 border-red-500 text-sm sm:text-base"
          >
            <Bug className="h-4 w-4" />
            Debug API
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Image
          </button>
        </div>
      </div>

      {/* Gallery Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="modern-card p-4 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                  placeholder="https://example.com/image.jpg, .jpeg, .png, .webp, .gif"
                  required
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Supported formats: .jpg, .jpeg, .png, .webp, .gif</p>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                  placeholder="Image title..."
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  <option value="Events">Events</option>
                  <option value="Team">Team</option>
                  <option value="Office">Office</option>
                  <option value="Projects">Projects</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="modern-card">
        {items.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No gallery items found</p>
            <p className="text-gray-400">Add your first image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
            {items.map((item) => (
              <div key={item.id} className="group relative modern-card overflow-hidden hover-lift">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-32 sm:h-48 object-cover hover-scale"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="p-3 sm:p-4">
                  {item.title && (
                    <h3 className="font-medium text-gray-900 mb-1 truncate text-sm sm:text-base">{item.title}</h3>
                  )}
                  {item.category && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800 border border-cyan-300 mb-2 sm:mb-3">
                      {item.category}
                    </span>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                    </span>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-cyan-600 hover:text-cyan-800 p-1 sm:p-2 rounded-lg hover:bg-cyan-50 transition-colors touch-manipulation"
                        title="Edit"
                      >
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 sm:p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;