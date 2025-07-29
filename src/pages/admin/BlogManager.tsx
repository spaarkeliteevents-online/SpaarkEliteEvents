import React, { useState, useEffect } from 'react';
import { blogAPI, BlogPost } from '../../lib/api';
import { useToast } from '../../components/Toast';
import { PlusCircle, Edit3, Trash2, Save, X, FileText } from 'lucide-react';

const BlogManager: React.FC = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await blogAPI.getAll();
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast('Failed to fetch blogs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      showToast('Please fill in title and content', 'error');
      return;
    }

    try {
      if (editingId) {
        await blogAPI.update(editingId, formData);
        showToast('Blog updated successfully!', 'success');
      } else {
        await blogAPI.create(formData as Omit<BlogPost, 'id' | 'created_at'>);
        showToast('Blog created successfully!', 'success');
      }
      
      await fetchBlogs();
      handleCancel();
    } catch (error) {
      console.error('Error saving blog:', error);
      showToast('Failed to save blog', 'error');
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setIsEditing(true);
    setEditingId(blog.id || null);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogAPI.delete(id);
        showToast('Blog deleted successfully!', 'success');
        await fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast('Failed to delete blog', 'error');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      image: ''
    });
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      image: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black flex items-center justify-center sm:justify-start" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-cyan-500" />
            Blog Manager
          </h1>
          <p className="text-base sm:text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Create and Manage Blog Content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center w-full sm:w-auto text-sm sm:text-base"
        >
          <PlusCircle className="h-4 w-4 mr-1 sm:mr-2" />
          Add Blog Post
        </button>
      </div>

      {isEditing && (
        <div className="modern-card p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="modern-input text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="modern-input text-sm sm:text-base"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="modern-textarea text-sm sm:text-base"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center bg-green-500 hover:bg-green-600 text-sm sm:text-base"
              >
                <Save className="h-4 w-4 mr-1 sm:mr-2" />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center text-sm sm:text-base"
              >
                <X className="h-4 w-4 mr-1 sm:mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {blogs.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            No blog posts found. Add your first blog post!
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="modern-card p-4 sm:p-6 hover-lift animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  
                  {blog.image && (
                    <div className="mb-3">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="text-gray-600 mb-3 text-sm sm:text-base">
                    <p className="line-clamp-3">
                      {blog.content.length > 200 
                        ? `${blog.content.substring(0, 200)}...` 
                        : blog.content}
                    </p>
                  </div>
                  
                  {blog.created_at && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Created: {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex sm:flex-col lg:flex-row gap-2 sm:ml-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-cyan-600 hover:text-cyan-800 p-2 rounded-lg hover:bg-cyan-50 transition-colors touch-manipulation"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => blog.id && handleDelete(blog.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;
