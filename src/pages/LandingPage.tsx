import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Clock } from 'lucide-react';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      event: "Dream Wedding",
      text: "Spaark Elite Events made our wedding absolutely perfect. Every detail was flawless, and they brought our vision to life beyond our wildest dreams.",
      rating: 5
    },
    {
      name: "Michael Chen",
      event: "Corporate Gala",
      text: "Professional, creative, and incredibly organized. Our annual gala was a huge success thanks to their exceptional planning and execution.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      event: "Anniversary Celebration",
      text: "They turned our 25th anniversary into a magical evening. The attention to detail and personal touch made it truly unforgettable.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section with Parallax and Scrolling Collage */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-cyan-50" aria-label="Hero section">
        {/* Scrolling photo collage background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-60" style={{ pointerEvents: 'none' }}>
          <div className="scrolling-collage flex h-full w-[200%] animate-scroll-x">
            {/* Repeat images for seamless loop */}
            {[1,2,3,4,5,1,2,3,4,5].map((num, idx) => (
              <img
                key={idx}
                src={`/photo${num}.jpg`}
                alt={`Collage ${num}`}
                className="h-full w-auto object-cover mx-2 rounded-2xl shadow-xl"
                style={{ minWidth: '20vw', maxHeight: '100vh' }}
              />
            ))}
          </div>
        </div>
        {/* Glassmorphism overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center container-padding glass animate-fade-in-scale overflow-y-auto" style={{ maxHeight: '85vh' }}>
          <h1 className="heading-xl mb-8 text-black animate-fade-in-up">
            SPAARK ELITE EVENTS
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl italic mb-8 text-black animate-fade-in-up animate-delay-100" style={{ fontFamily: 'Playfair Display, serif' }}>
            Luxury. Celebration. Perfection.
          </p>
          <h2 className="heading-md mb-10 font-light dark-blue-hero-text animate-fade-in-up animate-delay-200">
            Where Your Vision Becomes a Masterpiece
          </h2>
          <p className="body-lg mb-12 max-w-4xl mx-auto dark-blue-hero-text animate-fade-in-up animate-delay-300">
            Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. 
            We specialize in designing and executing luxury events that reflect your style, story, and dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center animate-fade-in-up animate-delay-400">
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center group shadow-large hover-lift"
              aria-label="Start Planning"
            >
              Start Planning
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <Link
              to="/services"
              className="btn-secondary text-lg px-8 py-4 hover-lift shadow-medium"
              aria-label="View Services"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding bg-gradient-to-b from-white to-slate-50" aria-label="About Us">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-cyan-700 mb-8 animate-fade-in-up">Spaark Elite Events</h2>
            <h3 className="heading-sm dark-blue-hero-text mb-8 animate-fade-in-up animate-delay-100">Where Your Vision Becomes a Masterpiece</h3>
            <div className="body-md text-gray-700 max-w-4xl mx-auto space-y-6 animate-fade-in-up animate-delay-200">
              <p>Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. We specialize in designing and executing luxury events that reflect your style, story, and dreams. Whether it’s a dreamy wedding, an exclusive corporate affair, or a milestone celebration, we bring creativity, elegance, and flawless coordination to every occasion.</p>
              <p>At the heart of Spaark Elite Events is a passionate team of planners, designers, and coordinators who are dedicated to excellence. We believe that no detail is too small, and no idea is too big. From the first spark of inspiration to the final standing ovation, we’re with you every step of the way.</p>
              <p>Every event we plan is infused with a touch of magic, tailored to perfection, and remembered for a lifetime. Because at Spaark Elite Events, we don’t just manage events — we create experiences that shine.</p>
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
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center modern-card p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Users className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-cyan-700 mb-2">500+</h4>
                  <p className="text-gray-600 font-medium">Happy Clients</p>
                </div>
                <div className="text-center modern-card p-6 hover-lift">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-cyan-700 mb-2">50+</h4>
                  <p className="text-gray-600 font-medium">Awards Won</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 animate-fade-in-up animate-delay-400">
              <div className="modern-card p-8 hover-lift">
                <h4 className="text-cyan-700 font-semibold mb-4 flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Our Founders
                </h4>
                <p className="body-md text-gray-700 mb-6">
                  Meet the visionary team behind Spaark Elite Events - passionate professionals dedicated to bringing your dreams to life.
                </p>
                <div className="h-56 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 border border-cyan-100">
                  <div className="flex w-full h-full gap-4 justify-center items-center">
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="/founder1.jpg" alt="Founder 1" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale" />
                      <span className="mt-2 text-xs font-semibold text-gray-700 text-center">Thakur Anmol Singh</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="/founder2.jpg" alt="Founder 2" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale" />
                      <span className="mt-2 text-xs font-semibold text-gray-700 text-center">Kalavagunta Naga Lalitha Saraswathi</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 h-full">
                      <img src="/founder3.jpg" alt="Founder 3" className="h-4/5 w-full object-cover rounded-xl shadow-soft hover-scale" />
                      <span className="mt-2 text-xs font-semibold text-gray-700 text-center">Thallapragada Annapurna</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Section: From Our Mission to Footer */}
      <section className="relative section-padding bg-gradient-to-br from-cyan-50 to-slate-100" aria-label="Testimonials Section">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="glass rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[600px] animate-fade-in-scale">
            {/* Sticky Image Placeholder */}
            <div className="lg:w-1/3 w-full flex-shrink-0 flex items-start justify-center lg:justify-start relative">
              <div className="sticky top-32 w-full flex flex-col items-center animate-fade-in-up">
                <div className="w-full max-w-sm h-80 lg:h-96 bg-gradient-to-br from-slate-100 to-cyan-100 rounded-2xl shadow-large flex items-center justify-center mb-6 overflow-hidden hover-lift">
                  <img src="/photo7.jpeg" alt="Spaark Elite Events" className="w-full h-full object-cover hover-scale" />
                </div>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="lg:w-2/3 w-full overflow-y-auto max-h-[80vh]">
              {/* Testimonials Section */}
              <section aria-label="Testimonials">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="heading-lg text-cyan-700 mb-8 animate-fade-in-up">What Our Clients Say</h2>
                    <p className="body-lg text-gray-700 animate-fade-in-up animate-delay-100">
                      Don't just take our word for it - hear from our satisfied clients
                    </p>
                  </div>
                  <div className="relative">
                    <div className="modern-card p-10 text-center hover-lift animate-fade-in-scale">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 text-cyan-500 fill-current mx-0.5" />
                        ))}
                      </div>
                      <p className="body-lg text-gray-700 mb-8 italic leading-relaxed">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <h4 className="text-cyan-700 font-semibold text-xl mb-2">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-gray-500 font-medium">{testimonials[currentTestimonial].event}</p>
                    </div>
                    <div className="flex justify-center mt-8 space-x-3">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                            index === currentTestimonial 
                              ? 'bg-cyan-500 shadow-medium scale-125' 
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