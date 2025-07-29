import React from 'react';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-gray-900 section-padding border-t border-gray-200/50 bg-gradient-to-br from-slate-50 to-white shadow-inner transition-all duration-300">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-cyan-500 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
                <div className="absolute inset-0 h-8 w-8 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-black tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
                SPAARK ELITE EVENTS
              </h3>
            </div>
            <p className="text-lg italic text-black mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Luxury. Celebration. Perfection.
            </p>
            <h4 className="text-lg font-light dark-blue-hero-text mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Where Your Vision Becomes a Masterpiece
            </h4>
            <p className="body-md text-gray-600 max-w-md leading-relaxed">
              Creating unforgettable moments with passion, creativity, and flawless execution. Your dreams, our expertise.
            </p>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up animate-delay-100">
            <h4 className="text-xl font-semibold text-cyan-700 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <Mail className="h-5 w-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                <a href="mailto:spaarkeliteevents@gmail.com" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  spaarkeliteevents@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-5 w-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                <a href="tel:+918919732484" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  +91 9391833475
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-5 w-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                <a href="tel:+918522967932" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                  +91 85229 67932
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="h-5 w-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 font-medium">Hyderabad, Telangana</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-xl font-semibold text-cyan-700 mb-6">Services</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="hover:text-cyan-600 transition-colors cursor-pointer font-medium">Wedding Planning</li>
              <li className="hover:text-cyan-600 transition-colors cursor-pointer font-medium">Corporate Events</li>
              <li className="hover:text-cyan-600 transition-colors cursor-pointer font-medium">Private Parties</li>
              <li className="hover:text-cyan-600 transition-colors cursor-pointer font-medium">Anniversary Celebrations</li>
              <li className="hover:text-cyan-600 transition-colors cursor-pointer font-medium">Event Coordination</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/50 mt-12 pt-8 text-center animate-fade-in-up animate-delay-300">
          <p className="text-gray-500 font-medium">
            © 2025 Spaark Elite Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;