import React, { useState, useEffect } from 'react';
import { galleryAPI, GalleryItem } from '../../lib/api';
import { debugSupabase, debugGalleryAPI } from '../../lib/debugAPI';
import { PlusCircle, Edit3, Trash2, Save, X, Image as ImageIcon, Bug } from 'lucide-react';

const GalleryDebug: React.FC = () => {
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
      console.log('🔍 Fetching gallery items...');
      const data = await debugGalleryAPI.getAll();
      setItems(data || []);
      console.log('✅ Gallery items loaded:', data?.length);
    } catch (error) {
      console.error('❌ Error fetching gallery:', error);
      alert(`Failed to fetch gallery items: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      alert('Image URL is required');
      return;
    }

    try {
      console.log('🔍 Submitting form data:', formData);
      
      if (editingId) {
        await debugGalleryAPI.update(editingId, formData);
        alert('Gallery item updated successfully!');
      } else {
        await debugGalleryAPI.create(formData as Omit<GalleryItem, 'id' | 'created_at'>);
        alert('Gallery item created successfully!');
      }
      
      resetForm();
      await fetchGallery(); // Refresh the list
    } catch (error) {
      console.error('❌ Error saving gallery item:', error);
      alert(`Failed to save gallery item: ${error.message}`);
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
      await debugGalleryAPI.delete(id);
      alert('Gallery item deleted successfully!');
      await fetchGallery(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting gallery item:', error);
      alert(`Failed to delete gallery item: ${error.message}`);
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

  const runDebugTests = async () => {
    console.clear();
    console.log('🚀 Running Supabase debug tests...');
    await debugSupabase();
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          Gallery Management (Debug Mode)
        </h2>
        <div className="flex gap-2">
          <button
            onClick={runDebugTests}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <Bug className="h-4 w-4" />
            Run Debug Tests
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Image
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <p className="text-yellow-700 text-sm">
          • Open browser console (F12) to see detailed logs<br/>
          • Click "Run Debug Tests" to check Supabase connection<br/>
          • All CRUD operations will show detailed logging<br/>
          • Current items count: {items.length}
        </p>
      </div>

      {/* Gallery Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview
                  </label>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
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
      <div className="bg-white rounded-lg shadow-sm border">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No gallery items found</p>
            <p className="text-gray-400">Add your first image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {items.map((item) => (
              <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                  )}
                  {item.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                      {item.category}
                    </span>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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

export default GalleryDebug;
