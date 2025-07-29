import React, { useState, useEffect } from 'react';
import { inquiriesAPI, Inquiry } from '../../lib/api';
import { Mail, Phone, User, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ContactInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'resolved'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const data = await inquiriesAPI.getAll();
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Failed to fetch inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Inquiry['status']) => {
    try {
      await inquiriesAPI.update(id, { status });
      alert('Status updated successfully!');
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      await inquiriesAPI.delete(id);
      alert('Inquiry deleted successfully!');
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const getStatusIcon = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'contacted':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    filter === 'all' || inquiry.status === filter
  );

  const getStatusCounts = () => {
    return {
      all: inquiries.length,
      pending: inquiries.filter(i => i.status === 'pending').length,
      contacted: inquiries.filter(i => i.status === 'contacted').length,
      resolved: inquiries.filter(i => i.status === 'resolved').length
    };
  };

  const statusCounts = getStatusCounts();

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
            <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
            Contact Inquiries
          </h1>
          <p className="text-base sm:text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Manage Customer Communications
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'contacted', label: 'Contacted', count: statusCounts.contacted },
            { key: 'resolved', label: 'Resolved', count: statusCounts.resolved }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                filter === key
                  ? 'bg-cyan-500 text-white shadow-medium'
                  : 'bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 border border-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2">
          <div className="modern-card">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No inquiries found</p>
                <p className="text-gray-400">
                  {filter === 'all' ? 'No contact inquiries yet' : `No ${filter} inquiries`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation ${
                      selectedInquiry?.id === inquiry.id ? 'bg-cyan-50 border-l-4 border-cyan-500' : ''
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(inquiry.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{inquiry.email}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-gray-600 mb-2">
                      <strong>Message:</strong> {inquiry.message}
                    </div>
                    
                    <div className="text-xs sm:text-sm text-gray-500 truncate">
                      {inquiry.message}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(inquiry.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-1">
          <div className="modern-card p-4 sm:p-6">
            {selectedInquiry ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Inquiry Details</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedInquiry.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Name</label>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span className="text-gray-900 text-sm sm:text-base">{selectedInquiry.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline text-sm sm:text-base break-all">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Message</label>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">{selectedInquiry.message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Received</label>
                    <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="break-all">{new Date(selectedInquiry.created_at || '').toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Status Update Buttons */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <div className="space-y-2 sm:space-y-3">
                      {['pending', 'contacted', 'resolved'].map((status) => (
                        <button
                          key={status}
                          onClick={() => selectedInquiry.id && handleStatusUpdate(selectedInquiry.id, status as Inquiry['status'])}
                          disabled={selectedInquiry.status === status}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                            selectedInquiry.status === status
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                              : status === 'pending'
                              ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 border border-yellow-300'
                              : status === 'contacted'
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border border-blue-300'
                              : 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border border-green-300'
                          }`}
                        >
                          Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <button
                      onClick={() => selectedInquiry.id && handleDelete(selectedInquiry.id)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-red-100 to-red-200 text-red-800 rounded-xl text-xs sm:text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all duration-300 border border-red-300 touch-manipulation"
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInquiries;