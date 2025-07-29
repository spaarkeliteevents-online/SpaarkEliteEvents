import React, { useState, useEffect } from 'react';
import { faqAPI, FAQ } from '../../lib/api';
import { PlusCircle, Edit3, Trash2, Save, X, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: '',
    order_index: 0
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      const data = await faqAPI.getAll();
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Failed to fetch FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await faqAPI.update(editingId, formData);
        alert('FAQ updated successfully!');
      } else {
        await faqAPI.create(formData as Omit<FAQ, 'id' | 'created_at' | 'updated_at'>);
        alert('FAQ created successfully!');
      }
      
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order_index: faq.order_index || 0
    });
    setEditingId(faq.id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await faqAPI.delete(id);
      alert('FAQ deleted successfully!');
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      order_index: 0
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'order_index' ? parseInt(value) || 0 : value 
    }));
  };

  const moveUp = async (faq: FAQ, index: number) => {
    if (index === 0) return;
    
    const newOrder = faqs[index - 1].order_index || 0;
    try {
      await faqAPI.update(faq.id!, { order_index: newOrder - 1 });
      fetchFAQs();
    } catch (error) {
      console.error('Error moving FAQ up:', error);
    }
  };

  const moveDown = async (faq: FAQ, index: number) => {
    if (index === faqs.length - 1) return;
    
    const newOrder = faqs[index + 1].order_index || 0;
    try {
      await faqAPI.update(faq.id!, { order_index: newOrder + 1 });
      fetchFAQs();
    } catch (error) {
      console.error('Error moving FAQ down:', error);
    }
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
            <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
            FAQ Management
          </h1>
          <p className="text-base sm:text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Manage Frequently Asked Questions
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Add New FAQ
        </button>
      </div>

      {/* FAQ Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="modern-card p-4 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="General">General</option>
                    <option value="Services">Services</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Support">Support</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    name="order_index"
                    value={formData.order_index || 0}
                    onChange={handleInputChange}
                    className="modern-input text-sm sm:text-base"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question || ''}
                  onChange={handleInputChange}
                  className="modern-input text-sm sm:text-base"
                  placeholder="Enter the frequently asked question..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <textarea
                  name="answer"
                  value={formData.answer || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="modern-textarea text-sm sm:text-base"
                  placeholder="Provide a detailed answer..."
                  required
                />
              </div>

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
                  {editingId ? 'Update' : 'Create'} FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="modern-card">
        {faqs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No FAQs found</p>
            <p className="text-gray-400">Create your first FAQ to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="p-4 sm:p-6 hover:bg-cyan-50 transition-colors hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {faq.category && (
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800 border border-cyan-300">
                          {faq.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">Order: {faq.order_index || 0}</span>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    
                    <div className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                    <div className="flex sm:flex-col lg:flex-row items-center gap-1">
                      <button
                        onClick={() => moveUp(faq, index)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                        title="Move Up"
                      >
                        <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => moveDown(faq, index)}
                        disabled={index === faqs.length - 1}
                        className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                        title="Move Down"
                      >
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                    
                    <div className="flex sm:flex-col lg:flex-row items-center gap-1">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-cyan-600 hover:text-cyan-800 p-1 sm:p-2 rounded-lg hover:bg-cyan-50 transition-colors touch-manipulation"
                        title="Edit"
                      >
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => faq.id && handleDelete(faq.id)}
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

export default FAQManager;