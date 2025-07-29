import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser'; // <-- Add this import
import { contactAPI, inquiriesAPI } from '../lib/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // <-- Add this ref

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Replace handleSubmit with EmailJS logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (!formRef.current) return;
    // Read EmailJS credentials from environment variables
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError('Email service is not configured. Please try again later.');
      setIsSubmitting(false);
      return;
    }
    try {
      // Send email
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      // Save inquiry to database
      await inquiriesAPI.create({
        name: formData.user_name,
        email: formData.user_email,
        message: formData.message,
        status: 'pending'
      });
      setSubmitted(true);
      setFormData({ user_name: '', user_email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919391833475', '_blank');
  };

  return (
    <div className="section-padding min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50 relative" aria-label="Contact">
      {/* Floating WhatsApp Button */}
      <button
      
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-large hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 z-50 group"
        title="Chat on WhatsApp"
      >
        <img
          src="https://i.postimg.cc/xdg2nwxS/whatsapp.png"
          alt="WhatsApp"
          className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </button>

      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-700" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl mb-8 dark-blue-hero-text animate-fade-in-up animate-delay-100" style={{ fontFamily: 'Playfair Display, serif' }}>
            Let's Plan Your Perfect Event
          </p>
          <p className="text-lg mb-12 leading-relaxed max-w-3xl mx-auto text-gray-600 animate-fade-in-up animate-delay-200">
            Ready to bring your vision to life? Contact us today to discuss your upcoming event and discover how we can make it extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <div className="animate-fade-in-up animate-delay-400">
            <h2 className="heading-md text-cyan-700 mb-8">Get In Touch</h2>
            <p className="body-md text-gray-700 mb-10">
              We'd love to hear about your upcoming event and discuss how we can make it extraordinary. 
              Reach out to us through any of the channels below.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-4 rounded-2xl shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-cyan-700 font-semibold text-xl mb-3">Email</h3>
                  <span className="text-cyan-600 font-medium text-lg">
                    spaarkeliteevents@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-4 rounded-2xl shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-cyan-700 font-semibold text-xl mb-3">Phone</h3>
                  <p className="text-gray-700 font-medium text-lg mb-1">+91 8919732484</p>
                  <p className="text-gray-700 font-medium text-lg">+91 85229 67932</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-4 rounded-2xl shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-cyan-700 font-semibold text-xl mb-3">Location</h3>
                  <p className="text-gray-700 font-medium text-lg">Hyderabad, Telangana</p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up animate-delay-500">
            <div className="modern-card p-10 hover-lift">
              <h2 className="heading-md text-cyan-700 mb-10">Send Us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-16 animate-fade-in-scale">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-large">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-green-700 text-2xl font-semibold mb-4">Message Sent!</h3>
                  <p className="body-md text-gray-700 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-cyan-700 font-semibold mb-3 text-lg">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="user_name" // <-- Change to match EmailJS template
                      required
                      value={formData.user_name}
                      onChange={handleInputChange}
                      className="modern-input text-lg"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-cyan-700 font-semibold mb-3 text-lg">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="user_email" // <-- Change to match EmailJS template
                      required
                      value={formData.user_email}
                      onChange={handleInputChange}
                      className="modern-input text-lg"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-cyan-700 font-semibold mb-3 text-lg">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message" // <-- Keep as 'message' for EmailJS
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="modern-textarea text-lg"
                      placeholder="Tell us about your event, preferred dates, budget, and any specific requirements..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 animate-fade-in-up">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center shadow-large"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-3 h-6 w-6" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;