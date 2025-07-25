import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Clock } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import LuxuryButton from '../components/LuxuryButton';
import { servicesAPI, blogAPI, galleryAPI, inquiriesAPI } from '../lib/api';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);

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
        // Optionally handle error
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

  return (
    <div>
      {/* Hero Section with Parallax and Scrolling Collage */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden luxury-bg-glass" aria-label="Hero section">
        {/* Scrolling photo collage background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-40" style={{ pointerEvents: 'none' }}>
          <div className="scrolling-collage flex h-full w-[200%] animate-scroll-x">
            {/* Repeat images for seamless loop */}
            {[1,2,3,4,5,1,2,3,4,5].map((num, idx) => (
              <img
                key={idx}
                src={`/photo${num}.jpg`}
                alt={`Collage ${num}`}
                className="h-full w-auto object-cover mx-2 rounded-2xl shadow-large hover-scale will-change-transform"
                style={{ minWidth: '20vw', maxHeight: '100vh' }}
              />
            ))}
          </div>
        </div>
        {/* Glassmorphism overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center container-padding glass animate-fade-in-scale overflow-y-auto" style={{ maxHeight: '85vh' }}>
          <h1 className="heading-xl mb-8 luxury-text-primary animate-fade-in-up will-change-transform">
            SPAARK ELITE EVENTS
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl italic mb-8 luxury-text-primary animate-fade-in-up animate-delay-100 will-change-transform" style={{ fontFamily: 'Playfair Display, serif' }}>
            Luxury. Celebration. Perfection.
          </p>
          <h2 className="heading-md mb-10 font-light luxury-text-secondary animate-fade-in-up animate-delay-200 will-change-transform">
            Where Your Vision Becomes a Masterpiece
          </h2>
          <p className="body-lg mb-12 max-w-4xl mx-auto luxury-text-primary animate-fade-in-up animate-delay-300 will-change-transform">
            Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. 
            We specialize in designing and executing luxury events that reflect your style, story, and dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center animate-fade-in-up animate-delay-400 will-change-transform">
            <Link to="/contact" aria-label="Start Planning">
              <LuxuryButton variant="primary" size="lg" icon={ArrowRight}>
                Start Planning
              </LuxuryButton>
            </Link>
            <Link to="/services" aria-label="View Services">
              <LuxuryButton variant="secondary" size="lg">
                View Services
              </LuxuryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding luxury-bg-glass" aria-label="About Us">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="heading-lg luxury-text-secondary mb-8 animate-fade-in-up will-change-transform">Spaark Elite Events</h2>
            <h3 className="heading-sm luxury-text-primary mb-8 animate-fade-in-up animate-delay-100 will-change-transform">Where Your Vision Becomes a Masterpiece</h3>
            <div className="body-md luxury-text-primary max-w-4xl mx-auto space-y-6 animate-fade-in-up animate-delay-200 will-change-transform">
              <p>Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. We specialize in designing and executing luxury events that reflect your style, story, and dreams. Whether it’s a dreamy wedding, an exclusive corporate affair, or a milestone celebration, we bring creativity, elegance, and flawless coordination to every occasion.</p>
              <p>At the heart of Spaark Elite Events is a passionate team of planners, designers, and coordinators who are dedicated to excellence. We believe that no detail is too small, and no idea is too big. From the first spark of inspiration to the final standing ovation, we’re with you every step of the way.</p>
              <p>Every event we plan is infused with a touch of magic, tailored to perfection, and remembered for a lifetime. Because at Spaark Elite Events, we don’t just manage events — we create experiences that shine.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up animate-delay-300 will-change-transform">
              <h3 className="heading-sm luxury-text-secondary mb-6">Our Mission</h3>
              <p className="body-md luxury-text-primary mb-6">
                From the first spark of inspiration to the final standing ovation, we're with you every step of the way. 
                Every event we plan is infused with a touch of magic, tailored to perfection, and remembered for a lifetime.
              </p>
              <p className="body-md luxury-text-primary mb-8">
                Because at Spaark Elite Events, we don't just manage events — we create experiences that shine.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Users className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    <AnimatedCounter end={500} suffix="+" />
                  </h4>
                  <p className="luxury-text-primary font-medium">Happy Clients</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    <AnimatedCounter end={50} suffix="+" />
                  </h4>
                  <p className="luxury-text-primary font-medium">Awards Won</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Users className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    {serviceCount !== null ? <AnimatedCounter end={serviceCount} /> : '...'}
                  </h4>
                  <p className="luxury-text-primary font-medium">Total Services</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    {inquiryCount !== null ? <AnimatedCounter end={inquiryCount} /> : '...'}
                  </h4>
                  <p className="luxury-text-primary font-medium">Total Inquiries</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    {blogCount !== null ? <AnimatedCounter end={blogCount} /> : '...'}
                  </h4>
                  <p className="luxury-text-primary font-medium">Blog Posts</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift will-change-transform">
                  <div className="luxury-bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold luxury-text-secondary mb-2">
                    {galleryCount !== null ? <AnimatedCounter end={galleryCount} /> : '...'}
                  </h4>
                  <p className="luxury-text-primary font-medium">Gallery Items</p>
                </div>
                {(serviceCount === 0 && inquiryCount === 0 && blogCount === 0 && galleryCount === 0) && (
                  <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center p-8">
                    <p className="luxury-text-secondary text-lg font-semibold mb-2">No analytics data available yet!</p>
                    <p className="luxury-text-primary">Add some services, inquiries, blog posts, or gallery items to see your stats here.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6 animate-fade-in-up animate-delay-400 will-change-transform">
              <div className="modern-card p-8 hover-lift will-change-transform">
                <h4 className="luxury-text-secondary font-semibold mb-4 flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Our Founders
                </h4>
                <p className="body-md luxury-text-primary mb-6">
                  Meet the visionary team behind Spaark Elite Events - passionate professionals dedicated to bringing your dreams to life.
                </p>
                <div className="h-56 rounded-xl flex items-center justify-center luxury-bg-glass border border-pink-200">
                  <div className="flex w-full h-full gap-4 justify-center items-center">
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="https://i.postimg.cc/fkgbR4dF/founder1.jpg" alt="Founder 1" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale will-change-transform" />
                      <span className="mt-2 text-xs font-semibold luxury-text-primary text-center">Thakur Anmol Singh</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="https://i.postimg.cc/sG1D4mkw/founder2.jpg" alt="Founder 2" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale will-change-transform" />
                      <span className="mt-2 text-xs font-semibold luxury-text-primary text-center">Kalavagunta Naga Lalitha Saraswathi</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="https://i.postimg.cc/rzpmTyDx/founder3.jpg" alt="Founder 3" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale will-change-transform" />
                      <span className="mt-2 text-xs font-semibold luxury-text-primary text-center">Thallapragada Annapurna</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Section: From Our Mission to Footer */}
      <section className="relative section-padding luxury-bg-glass" aria-label="Testimonials Section">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="glass rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[600px] animate-fade-in-scale will-change-transform">
            {/* Sticky Image Placeholder */}
            <div className="lg:w-1/3 w-full flex-shrink-0 flex items-start justify-center lg:justify-start relative">
              <div className="sticky top-32 w-full flex flex-col items-center animate-fade-in-up will-change-transform">
                <div className="w-full max-w-sm h-80 lg:h-96 luxury-bg-glass rounded-2xl shadow-large flex items-center justify-center mb-6 overflow-hidden hover-lift will-change-transform">
                  <img src="https://i.postimg.cc/QCywHs5R/clients.avif" alt="Spaark Elite Events Clients" className="w-full h-full object-cover hover-scale will-change-transform" />
                </div>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="lg:w-2/3 w-full overflow-y-auto max-h-[80vh]">
              {/* Testimonials Section */}
              <section aria-label="Testimonials">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="heading-lg luxury-text-secondary mb-8 animate-fade-in-up will-change-transform">What Our Clients Say</h2>
                    <p className="body-lg luxury-text-primary animate-fade-in-up animate-delay-100 will-change-transform">
                      Don't just take our word for it - hear from our satisfied clients
                    </p>
                  </div>
                  <div className="relative">
                    <div className="modern-card p-10 text-center hover-lift animate-fade-in-scale will-change-transform">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 luxury-text-secondary fill-current mx-0.5" />
                        ))}
                      </div>
                      <p className="body-lg luxury-text-primary mb-8 italic leading-relaxed">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <h4 className="luxury-text-secondary font-semibold text-xl mb-2">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="luxury-text-primary font-medium">{testimonials[currentTestimonial].event}</p>
                    </div>
                    <div className="flex justify-center mt-8 space-x-3">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-pink-200 will-change-transform ${
                            index === currentTestimonial 
                              ? 'luxury-bg-primary shadow-medium scale-125' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Show testimonial ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;