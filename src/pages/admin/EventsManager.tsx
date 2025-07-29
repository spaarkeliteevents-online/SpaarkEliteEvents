import React, { useState, useEffect } from 'react';
import { eventsAPI, Event } from '../../lib/api';
import { PlusCircle, Edit3, Trash2, Save, X, Calendar, MapPin } from 'lucide-react';

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    category: '',
    media: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) {
      alert('Please fill in title and date');
      return;
    }

    try {
      if (editingId) {
        await eventsAPI.update(editingId, formData);
        alert('Event updated successfully!');
      } else {
        await eventsAPI.create(formData as Omit<Event, 'id' | 'created_at'>);
        alert('Event created successfully!');
      }
      
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      category: event.category || '',
      media: event.media || ''
    });
    setEditingId(event.id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.delete(id);
      alert('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: '',
      media: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black flex items-center justify-center sm:justify-start gap-2 sm:gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
            Events Management
          </h1>
          <p className="text-base sm:text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Schedule and Organize Events
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Event
        </button>
      </div>

      {/* Event Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="modern-card p-4 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Event' : 'Add New Event'}
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
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                  placeholder="Enter event title..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleInputChange}
                    className="modern-input text-sm sm:text-base"
                    required
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
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="modern-textarea text-sm sm:text-base"
                  placeholder="Describe the event..."
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Media URL (Image/Video)
                </label>
                <input
                  type="url"
                  name="media"
                  value={formData.media || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Media Preview */}
              {formData.media && (
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={formData.media}
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
                  {editingId ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="modern-card">
        {events.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events found</p>
            <p className="text-gray-400">Create your first event to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-4 sm:p-6 hover:bg-cyan-50 transition-colors hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {event.category && (
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800 border border-cyan-300">
                          {event.category}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <div className="text-gray-600 mb-3 text-sm sm:text-base">
                        <p className="line-clamp-2">{event.description}</p>
                      </div>
                    )}

                    {event.media && (
                      <div className="mb-3">
                        <img
                          src={event.media}
                          alt={event.title}
                          className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-xl border border-gray-200 hover-scale"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {event.created_at && (
                      <p className="text-xs sm:text-sm text-gray-500">
                        Created: {new Date(event.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex sm:flex-col lg:flex-row items-center gap-2 justify-end sm:justify-start">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-cyan-600 hover:text-cyan-800 p-1 sm:p-2 rounded-lg hover:bg-cyan-50 transition-colors touch-manipulation"
                      title="Edit"
                    >
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => event.id && handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800 p-1 sm:p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
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

export default EventsManager;