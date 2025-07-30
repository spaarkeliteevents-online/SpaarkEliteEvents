import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Clock } from 'lucide-react';
import { servicesAPI, blogAPI, galleryAPI, inquiriesAPI } from '../lib/api';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);

  // Add state for responsive parallax effect
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  // Add scroll position for mobile effect
  const [scrollY, setScrollY] = useState(0);

  const testimonials = [
    {
      name: "Kesa Madhan",
      event: "Dream Wedding",
      text: "Spaark Elite Events made our wedding absolutely perfect. Every detail was flawless, and they brought our vision to life beyond our wildest dreams.",
      rating: 5
    },
    {
      name: "Kakunuri Nagarjuna",
      event: "Corporate Gala",
      text: "Professional, creative, and incredibly organized. Our annual gala was a huge success thanks to their exceptional planning and execution.",
      rating: 5
    },
    {
      name: "Thota Karthik",
      event: "Anniversary Celebration",
      text: "They turned our 25th anniversary into a magical evening. The attention to detail and personal touch made it truly unforgettable.",
      rating: 5
    }
  ];

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
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen for window resize to update isDesktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for scroll on mobile for background effect
  useEffect(() => {
    if (!isDesktop) {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isDesktop]);

  // Calculate mobile background style
  const mobileBgStyle = !isDesktop
    ? {
        transform: `scale(${1 + Math.min(scrollY / 1000, 0.08)})`,
        filter: `blur(${Math.min(scrollY / 200, 6)}px)`,
        transition: 'transform 0.2s, filter 0.2s'
      }
    : {};

  return (
    <div>
      {/* Enhanced Hero Section with Static Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
        {/* Static Background Image */}
        <div
  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat sm:bg-fixed"
  style={{
    backgroundImage: `url(https://i.postimg.cc/KzhzZ4Bk/pexels-artosuraj-33180324.jpg)`
  }}
>
  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
</div>

        
        {/* Floating floral particles effect */}
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 animate-float"
              style={{
                left: `${10 + (i * 8) % 80}%`,
                top: `${20 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + (i % 3)}s`
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM6 9C6 10.1 5.1 11 4 11C2.9 11 2 10.1 2 9C2 7.9 2.9 7 4 7C5.1 7 6 7.9 6 9ZM14.5 12C15.3 12 16 12.7 16 13.5C16 14.3 15.3 15 14.5 15C13.7 15 13 14.3 13 13.5C13 12.7 13.7 12 14.5 12ZM9.5 12C10.3 12 11 12.7 11 13.5C11 14.3 10.3 15 9.5 15C8.7 15 8 14.3 8 13.5C8 12.7 8.7 12 9.5 12ZM12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16Z" fill="currentColor"/>
              </svg>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 magnetic-hover animate-bounce-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-white animate-smooth-reveal animate-reveal-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Spaark Elite Events
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-white animate-smooth-reveal animate-reveal-2 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              Luxury. Celebration. Perfection.
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10 font-light text-white animate-smooth-reveal animate-reveal-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Where Your Vision Becomes a Masterpiece
            </h2>
            {/* <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-4xl mx-auto dark-blue-hero-text animate-fade-in-up animate-delay-300 leading-relaxed">
              Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. 
              We specialize in designing and executing luxury events that reflect your style, story, and dreams.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center animate-fade-in-up animate-delay-400">
              <Link
                to="/contact"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center group shadow-large hover-lift"
                aria-label="Start Planning"
              >
                Start Planning
                <ArrowRight className="ml-2 sm:ml-3 h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link
                to="/services"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover-lift shadow-medium"
                aria-label="View Services"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" aria-label="About Us">
        {/* Floral decorations */}
        <div className="absolute top-10 left-10 opacity-10 animate-float">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-cyan-500">
            <path d="M30 5C32.75 5 35 7.25 35 10C35 12.75 32.75 15 30 15C27.25 15 25 12.75 25 10C25 7.25 27.25 5 30 5ZM52.5 22.5C52.5 25.25 50.25 27.5 47.5 27.5C44.75 27.5 42.5 25.25 42.5 22.5C42.5 19.75 44.75 17.5 47.5 17.5C50.25 17.5 52.5 19.75 52.5 22.5ZM15 22.5C15 25.25 12.75 27.5 10 27.5C7.25 27.5 5 25.25 5 22.5C5 19.75 7.25 17.5 10 17.5C12.75 17.5 15 19.75 15 22.5ZM36.25 30C38.25 30 40 31.75 40 33.75C40 35.75 38.25 37.5 36.25 37.5C34.25 37.5 32.5 35.75 32.5 33.75C32.5 31.75 34.25 30 36.25 30ZM23.75 30C25.75 30 27.5 31.75 27.5 33.75C27.5 35.75 25.75 37.5 23.75 37.5C21.75 37.5 20 35.75 20 33.75C20 31.75 21.75 30 23.75 30ZM30 40C32.75 40 35 42.25 35 45C35 47.75 32.75 50 30 50C27.25 50 25 47.75 25 45C25 42.25 27.25 40 30 40Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-cyan-500">
            <path d="M30 5C32.75 5 35 7.25 35 10C35 12.75 32.75 15 30 15C27.25 15 25 12.75 25 10C25 7.25 27.25 5 30 5ZM52.5 22.5C52.5 25.25 50.25 27.5 47.5 27.5C44.75 27.5 42.5 25.25 42.5 22.5C42.5 19.75 44.75 17.5 47.5 17.5C50.25 17.5 52.5 19.75 52.5 22.5ZM15 22.5C15 25.25 12.75 27.5 10 27.5C7.25 27.5 5 25.25 5 22.5C5 19.75 7.25 17.5 10 17.5C12.75 17.5 15 19.75 15 22.5ZM36.25 30C38.25 30 40 31.75 40 33.75C40 35.75 38.25 37.5 36.25 37.5C34.25 37.5 32.5 35.75 32.5 33.75C32.5 31.75 34.25 30 36.25 30ZM23.75 30C25.75 30 27.5 31.75 27.5 33.75C27.5 35.75 25.75 37.5 23.75 37.5C21.75 37.5 20 35.75 20 33.75C20 31.75 21.75 30 23.75 30ZM30 40C32.75 40 35 42.25 35 45C35 47.75 32.75 50 30 50C27.25 50 25 47.75 25 45C25 42.25 27.25 40 30 40Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-cyan-700 mb-8 animate-fade-in-up">About Spaark Elite Events</h2>
            <h3 className="heading-sm dark-blue-hero-text mb-8 animate-fade-in-up animate-delay-100">Creating Extraordinary Moments</h3>
            <div className="body-md text-gray-700 max-w-4xl mx-auto space-y-6 animate-fade-in-up animate-delay-200">
              <p>At the heart of Spaark Elite Events is a passionate team of planners, designers, and coordinators who are dedicated to excellence. We believe that no detail is too small, and no idea is too big. From the first spark of inspiration to the final standing ovation, we're with you every step of the way.</p>
              <p>Every event we plan is infused with a touch of magic, tailored to perfection, and remembered for a lifetime. Because at Spaark Elite Events, we don't just manage events — we create experiences that shine.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up animate-delay-300">
              <h3 className="heading-sm text-cyan-700 mb-6">Our Mission</h3>
              <p className="body-md text-gray-700 mb-6">
                From the first spark of inspiration to the final standing ovation, we're with you every step of the way. 
                Every event we plan is infused with a touch of magic, tailored to perfection, and remembered for a lifetime.
              </p>
              <p className="body-md text-gray-700 mb-8">
                Because at Spaark Elite Events, we don't just manage events — we create experiences that shine.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Users className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">500+</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Happy Clients</p>
                </div>
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">50+</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Awards Won</p>
                </div>
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Users className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">{serviceCount !== null ? serviceCount : '...'}</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Total Services</p>
                </div>
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">{inquiryCount !== null ? inquiryCount : '...'}</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Total Inquiries</p>
                </div>
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">{blogCount !== null ? blogCount : '...'}</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Blog Posts</p>
                </div>
                <div className="text-center modern-card p-4 sm:p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-6 sm:h-8 w-6 sm:w-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-cyan-700 mb-2">{galleryCount !== null ? galleryCount : '...'}</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Gallery Items</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 animate-fade-in-up animate-delay-400">
              <div className="modern-card p-6 sm:p-8 hover-lift">
                <h4 className="text-cyan-700 font-semibold mb-4 flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Our Founders
                </h4>
                <p className="body-md text-gray-700 mb-6">
                  Meet the visionary team behind Spaark Elite Events - passionate professionals dedicated to bringing your dreams to life.
                </p>
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-cyan-50 border border-cyan-100 p-4 sm:p-6 md:p-8">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
    
    {/* Founder 1 */}
    <div className="flex flex-col items-center space-y-3">
      <img 
        src="https://i.postimg.cc/mzSN6wFt/IMG-4214.jpg" 
        alt="Founder 1" 
        className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl shadow-md"
      />
      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">
        Thakur Anmol Singh
      </span>
    </div>

    {/* Founder 2 */}
    <div className="flex flex-col items-center space-y-3">
      <img 
        src="https://i.postimg.cc/XGWk8hqR/IMG-0087.jpg" 
        alt="Founder 2" 
        className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl shadow-md"
      />
      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">
        Kalavagunta Naga Lalitha Saraswathi
      </span>
    </div>

    {/* Founder 3 */}
    <div className="flex flex-col items-center space-y-3">
      <img 
        src="https://i.postimg.cc/rzpmTyDx/founder3.jpg" 
        alt="Founder 3" 
        className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl shadow-md"
      />
      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">
        Tallapragada Annapurna
      </span>
    </div>

  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Testimonials Section - Mobile Responsive */}
      <section className="relative bg-gradient-to-br from-cyan-50 to-slate-100 py-16 sm:py-20 lg:py-24" aria-label="Testimonials Section">
        {/* Background Image - Parallax for desktop, beautiful scroll effect for mobile */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/NLhC6R8Q/pexels-vireshstudio-1444442.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...(isDesktop
              ? { backgroundAttachment: 'fixed' }
              : { minHeight: '100vh' }
            ),
            ...mobileBgStyle
          }}
        >
          {/* Slightly reduced overlay opacity for better visibility */}
          <div className="absolute inset-0 bg-white" style={{ opacity: isDesktop ? 0.88 : 0.85 }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-700 mb-6 sm:mb-8 animate-bounce-in typewriter" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Our Clients Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 animate-smooth-reveal animate-reveal-1">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          {/* Testimonials Grid - Mobile Responsive */}
          <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-white bg-opacity-95 backdrop-blur-md p-6 sm:p-8 lg:p-12 text-center magnetic-hover card-hover-3d animate-smooth-reveal animate-reveal-${(index % 5) + 1} rounded-2xl shadow-xl border border-white border-opacity-30 mx-4 sm:mx-8 lg:mx-16 ${
                  index === currentTestimonial ? 'animate-pulse-glow ring-2 ring-cyan-300' : ''
                }`}
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500 fill-current mx-0.5 animate-float" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 italic leading-relaxed hover-glow font-light">
                  "{testimonial.text}"
                </p>
                <h4 className="text-cyan-700 font-semibold text-xl sm:text-2xl mb-2 animate-slide-up-fade">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 font-medium text-lg sm:text-xl animate-rotate-in">
                  {testimonial.event}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Testimonial Selector */}
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-cyan-700 mb-6 sm:mb-8 animate-fade-in-up" style={{ fontFamily: 'Playfair Display, serif' }}>
              What we excel at
            </h3>
            <div className="modern-card p-8 sm:p-10 text-center hover-lift animate-fade-in-scale ripple max-w-4xl mx-auto">
              {/* <div className="flex justify-center mb-4 sm:mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500 fill-current mx-1 animate-float-delayed" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div> */}
              {/* <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-6 sm:mb-8 italic leading-relaxed font-light">
                "{testimonials[currentTestimonial].text}"
              </p> */}
              {/* <h4 className="text-cyan-700 font-bold text-2xl sm:text-3xl mb-2">
                {testimonials[currentTestimonial].name}
              </h4> */}
              <p className="text-gray-500 font-medium text-lg sm:text-xl">
                {testimonials[currentTestimonial].event}
              </p>
            </div>
            
            {/* Enhanced Navigation Dots */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 hover:scale-150 focus:outline-none focus:ring-4 focus:ring-cyan-200 magnetic-hover ${
                    index === currentTestimonial 
                      ? 'bg-cyan-500 shadow-large scale-125 animate-pulse-glow' 
                      : 'bg-gray-300 hover:bg-cyan-400'
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                >
                  {index === currentTestimonial && (
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="modern-card p-8 sm:p-12 magnetic-hover animate-smooth-reveal animate-reveal-5 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-cyan-700 mb-4 sm:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to Create Magic?</h3>
              <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
                Let us bring your dream event to life with our expertise and passion for perfection.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ripple animate-bounce-in"
              >
                <span>Start Planning Today</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;