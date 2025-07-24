import { supabase } from './supabaseClient';

// Types based on database schema
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  image?: string;
  created_at?: string;
}

export interface GalleryItem {
  id?: string;
  title?: string;
  category?: string;
  image_url: string;
  created_at?: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: 'pending' | 'contacted' | 'resolved';
  created_at?: string;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  media?: string;
  created_at?: string;
}

export interface Service {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  features?: string[];
  created_at?: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email?: string;
  message: string;
  status?: 'pending' | 'contacted' | 'resolved';
  created_at?: string;
}

// Extended types for admin functionality
export interface BlogPostExtended extends BlogPost {
  summary?: string;
  author?: string;
  category?: string;
}

export interface FAQExtended extends FAQ {
  category?: string;
  order_index?: number;
}

export interface ContactInquiryExtended extends ContactInquiry {
  phone?: string;
  subject?: string;
  status?: 'pending' | 'contacted' | 'resolved';
}

// Blog API
export const blogAPI = {
  // Get all blog posts
  getAll: async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get blog post by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new blog post
  create: async (blog: Omit<BlogPost, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update blog post
  update: async (id: string, blog: Partial<BlogPost>) => {
    const { data, error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete blog post
  delete: async (id: string) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Gallery API
export const galleryAPI = {
  // Get all gallery items
  getAll: async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get gallery item by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new gallery item
  create: async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update gallery item
  update: async (id: string, item: Partial<GalleryItem>) => {
    const { data, error } = await supabase
      .from('gallery')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete gallery item
  delete: async (id: string) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// FAQ API
export const faqAPI = {
  // Get all FAQs
  getAll: async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get FAQ by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new FAQ
  create: async (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faq])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update FAQ
  update: async (id: string, faq: Partial<FAQ>) => {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faq, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete FAQ
  delete: async (id: string) => {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Contact API
export const contactAPI = {
  // Get all contacts
  getAll: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get contact by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new contact
  create: async (contact: Omit<ContactInquiry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update contact status
  updateStatus: async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete contact
  delete: async (id: string) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const inquiriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (inquiry: Omit<Inquiry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, inquiry: Partial<Inquiry>) => {
    const { data, error } = await supabase
      .from('inquiries')
      .update(inquiry)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Events API
export const eventsAPI = {
  // Get all events
  getAll: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get event by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new event
  create: async (event: Omit<Event, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update event
  update: async (id: string, event: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete event
  delete: async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const servicesAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (service: Omit<Service, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('services').insert([service]).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, service: Partial<Service>) => {
    const { data, error } = await supabase.from('services').update(service).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  }
};
