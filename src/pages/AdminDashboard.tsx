import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import GalleryManager from './admin/GalleryManager';
import BlogManager from './admin/BlogManager';
import FAQManager from './admin/FAQManager';
import ContactInquiries from './admin/ContactInquiries';
import EventsManager from './admin/EventsManager';
import { servicesAPI, blogAPI, galleryAPI, inquiriesAPI } from '../lib/api';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Image, 
  FileText, 
  LogOut,
  Calendar,
  User,
  Settings,
  BarChart3,
  MessageSquare,
  Heart,
  Building,
  PartyPopper,
  Users,
  Sparkles,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Menu,
  Home,
  HelpCircle
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'pending' | 'contacted';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'services' | 'inquiries' | 'blog' | 'gallery' | 'faq' | 'events' | 'profile'>('analytics');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('adminLoggedIn');
      const adminToken = localStorage.getItem('adminToken');
      
      if (!isLoggedIn || !adminToken) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const [services, setServices] = useState<any[]>([]); // Changed to any[] to match API response
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]); // Changed to BlogPost[] to match API response
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]); // Changed to GalleryItem[] to match API response
  const [inquiries, setInquiries] = useState<Inquiry[]>([]); // Changed to Inquiry[] to match API response

  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [services, blogs, gallery, inquiries] = await Promise.all([
          servicesAPI.getAll(),
          blogAPI.getAll(),
          galleryAPI.getAll(),
          inquiriesAPI.getAll()
        ]);
        setServiceCount(services.length);
        setBlogCount(blogs.length);
        setGalleryCount(gallery.length);
        setInquiryCount(inquiries.length);
      } catch (err) {
        setServiceCount(null);
        setBlogCount(null);
        setGalleryCount(null);
        setInquiryCount(null);
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const data = await inquiriesAPI.getAll();
        setInquiries(data || []);
      } catch (error) {
        // Optionally handle error
      }
    }
    fetchInquiries();
  }, []);

  const [formData, setFormData] = useState<any>({});

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleAdd = (type: 'services' | 'blog' | 'gallery') => {
    setIsEditing(true);
    setEditingId(null);
    if (type === 'services') {
      setFormData({
        name: '',
        description: '',
        icon: 'Heart',
        features: ['']
      });
    } else if (type === 'blog') {
      setFormData({
        title: '',
        summary: '',
        content: '',
        author: '',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: '',
        category: ''
      });
    } else {
      setFormData({
        src: '',
        title: '',
        category: ''
      });
    }
  };

  const handleEdit = (item: any, type: string) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData(item);
  };

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Optionally show a toast or alert
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async () => {
    try {
      if (activeTab === 'services') {
        if (editingId) {
          await servicesAPI.update(String(editingId), formData);
        } else {
          await servicesAPI.create(formData as Omit<any, 'id' | 'created_at'>); // Changed to any
        }
        await fetchServices();
      } else if (activeTab === 'blog') {
        if (editingId) {
          setBlogPosts((prev: BlogPost[]) => prev.map(post => 
            post.id === editingId ? { ...formData, id: editingId } : post
          ));
        } else {
          const newId = Math.max(...blogPosts.map(p => p.id)) + 1;
          setBlogPosts((prev: BlogPost[]) => [...prev, { ...formData, id: newId }]);
        }
      } else if (activeTab === 'gallery') {
        if (editingId) {
          setGalleryItems((prev: GalleryItem[]) => prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          ));
        } else {
          const newId = Math.max(...galleryItems.map(i => i.id)) + 1;
          setGalleryItems((prev: GalleryItem[]) => [...prev, { ...formData, id: newId }]);
        }
      }
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving service:', error);
      // Optionally show a toast or alert
    }
  };

  const handleDelete = async (id: number | string | undefined, type: 'services' | 'blog' | 'gallery') => {
    if (id === undefined) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'services') {
        try {
          await servicesAPI.delete(String(id));
          await fetchServices();
        } catch (error) {
          console.error('Error deleting service:', error);
        }
      } else if (type === 'blog') {
        setBlogPosts((prev: BlogPost[]) => prev.filter(post => post.id !== id));
      } else {
        setGalleryItems((prev: GalleryItem[]) => prev.filter(item => item.id !== id));
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({});
  };

  const updateInquiryStatus = (id: number, status: 'pending' | 'contacted') => {
    setInquiries(prev => prev.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status } : inquiry
    ));
  };

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart, Building, PartyPopper, Users, Sparkles
    };
    return icons[iconName] || Heart;
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
          SPAARK ELITE EVENTS
        </h1>
        <p className="text-xl md:text-2xl italic mb-8 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
          Luxury. Celebration. Perfection.
        </p>
        <h2 className="text-2xl md:text-3xl mb-8 font-light dark-blue-hero-text">
          Admin Dashboard Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="modern-card p-6 hover-lift animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Services</p>
              <p className="text-3xl font-bold text-cyan-700">{serviceCount !== null ? serviceCount : '...'}</p>
            </div>
            <Settings className="h-8 w-8 text-cyan-500" />
          </div>
        </div>
        <div className="modern-card p-6 hover-lift animate-fade-in-up animate-delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Inquiries</p>
              <p className="text-3xl font-bold text-cyan-700">{inquiryCount !== null ? inquiryCount : '...'}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="modern-card p-6 hover-lift animate-fade-in-up animate-delay-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Blog Posts</p>
              <p className="text-3xl font-bold text-cyan-700">{blogCount !== null ? blogCount : '...'}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="modern-card p-6 hover-lift animate-fade-in-up animate-delay-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Gallery Items</p>
              <p className="text-3xl font-bold text-cyan-700">{galleryCount !== null ? galleryCount : '...'}</p>
            </div>
            <Image className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="modern-card p-6 hover-lift animate-fade-in-up animate-delay-400">
          <h3 className="text-xl font-semibold text-cyan-700 mb-4">Recent Inquiries</h3>
          <div className="space-y-3">
            {inquiries.slice(0, 3).map(inquiry => (
              <div key={inquiry.id} className="flex items-center justify-between p-3 bg-cyan-50 rounded">
                <div>
                  <p className="text-cyan-700 font-medium">{inquiry.name}</p>
                  <p className="text-gray-500 text-sm">{inquiry.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  inquiry.status === 'contacted' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-400 text-cyan-900'
                }`}>
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modern-card p-6 hover-lift animate-fade-in-up animate-delay-500">
          <h3 className="text-xl font-semibold text-cyan-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => {setActiveTab('services'); handleAdd('services');}}
              className="w-full btn-primary p-3 flex items-center justify-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Service
            </button>
            <button
              onClick={() => {setActiveTab('blog'); handleAdd('blog');}}
              className="w-full btn-secondary p-3 flex items-center justify-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Blog Post
            </button>
            <button
              onClick={() => {setActiveTab('gallery'); handleAdd('gallery');}}
              className="w-full btn-ghost p-3 flex items-center justify-center border border-cyan-200"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Gallery Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Services Manager
          </h1>
          <p className="text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
            Manage Your Event Services
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => handleAdd('services')}
            className="btn-primary px-6 py-3 flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Service
          </button>
        )}
      </div>

      {isEditing && (
        <div className="modern-card p-8 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-cyan-700 mb-6">{editingId ? 'Edit' : 'Add'} Service</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-cyan-700 font-semibold mb-2">Service Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-cyan-700 font-semibold mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                className="modern-textarea"
              />
            </div>
            <div>
              <label className="block text-cyan-700 font-semibold mb-2">Icon</label>
              <select
                value={formData.icon || 'Heart'}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, icon: e.target.value }))}
                className="modern-input"
              >
                <option value="Heart">Heart</option>
                <option value="Building">Building</option>
                <option value="PartyPopper">Party Popper</option>
                <option value="Users">Users</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>
            <div>
              <label className="block text-cyan-700 font-semibold mb-2">Features (one per line)</label>
              <textarea
                rows={4}
                value={formData.features?.join('\n') || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, features: e.target.value.split('\n').filter((f: string) => f.trim()) }))}
                className="modern-textarea"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="btn-primary px-6 py-3 flex items-center bg-green-500 hover:bg-green-600"
            >
              <Save className="h-5 w-5 mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary px-6 py-3 flex items-center"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div key={service.id} className="modern-card p-6 hover-lift animate-fade-in-up group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-medium">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-700 group-hover:text-cyan-500 transition-colors">{service.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service, 'services')}
                      className="text-cyan-600 hover:text-cyan-800 p-2 rounded-lg hover:bg-cyan-50 transition-all"
                      aria-label="Edit Service"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id, 'services')}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                      aria-label="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {(service.features ?? []).map((feature, index) => (
                    <div key={index} className="flex items-center text-cyan-700">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderInquiries = () => (
    <div className="bg-white rounded-lg p-6">
      <ContactInquiries />
    </div>
  );

  const renderBlog = () => (
    <div className="bg-white rounded-lg p-6">
      <BlogManager />
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-lg p-6">
      <EventsManager />
    </div>
  );

  const renderFAQ = () => (
    <div className="bg-white rounded-lg p-6">
      <FAQManager />
    </div>
  );

  const renderGallery = () => (
    <div className="bg-white rounded-lg p-6">
      <GalleryManager />
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
          Admin Profile
        </h1>
        <p className="text-lg italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
          Account Management
        </p>
      </div>

      <div className="modern-card p-8 animate-fade-in-up">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mr-6 shadow-medium">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-cyan-700">Administrator</h3>
            <p className="text-gray-500">spaarkeliteevents@gmail.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
            <h4 className="text-cyan-700 font-semibold mb-2">Account Status</h4>
            <p className="text-green-500">Active</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
            <h4 className="text-cyan-700 font-semibold mb-2">Last Login</h4>
            <p className="text-gray-500">Today, 2:30 PM</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="btn-primary px-6 py-3 flex items-center bg-red-500 hover:bg-red-600"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return renderAnalytics();
      case 'services': return renderServices();
      case 'inquiries': return renderInquiries();
      case 'blog': return renderBlog();
      case 'gallery': return renderGallery();
      case 'events': return renderEvents();
      case 'faq': return renderFAQ();
      case 'profile': return renderProfile();
      default: return renderAnalytics();
    }
  };

  // Update main background and card styles
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50 flex flex-col overflow-x-hidden" aria-label="Admin Dashboard">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-3 sm:p-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500 mr-2 transition-all duration-300 hover:scale-110 hover:rotate-12" />
              <div className="absolute inset-0 h-6 w-6 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-black tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg p-2 transition-all duration-300 touch-manipulation"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 lg:top-0 left-0 lg:self-start w-64 sm:w-72 lg:w-64 h-full lg:h-screen bg-white/95 backdrop-blur-xl border-r border-gray-200/50 transition-transform duration-300 ease-in-out shadow-lg z-50 lg:z-auto overflow-y-auto`}>
          <div className="p-4 sm:p-6 flex flex-col h-full min-h-screen lg:min-h-0">
            <div className="flex items-center mb-8">
              <div className="relative">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500 mr-2 sm:mr-3 transition-all duration-300 hover:scale-110 hover:rotate-12" />
                <div className="absolute inset-0 h-8 w-8 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-black tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>SPAARK ELITE EVENTS</h1>
                <p className="text-xs sm:text-sm italic text-black" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-1 sm:space-y-2 mt-4 sm:mt-8 flex-1">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setSidebarOpen(false);
                      setIsEditing(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all font-semibold futuristic-btn ${
                      isActive
                        ? 'bg-cyan-500 text-white font-bold shadow-medium' : 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'
                    } touch-manipulation`}
                  >
                    <IconComponent className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-cyan-700'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-cyan-200 pb-4 sm:pb-8">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-all font-semibold touch-manipulation"
              >
                <Home className="h-5 w-5 mr-3" />
                Back to Website
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 touch-manipulation"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
            <div className="modern-card p-4 sm:p-6 lg:p-8 animate-fade-in-up">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      {/* Footer (shared with main site) */}
      <footer>
        <div className="border-t border-gray-200/50 py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm bg-white/95 backdrop-blur-xl px-4">
          © 2025 Spaark Elite Events. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;