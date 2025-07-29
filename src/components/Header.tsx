import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Home, Briefcase, Image, FileText, HelpCircle, Mail, Shield } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin-login', label: 'Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const navItemsWithIcons = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/blog', label: 'Blog', icon: FileText },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/admin-login', label: 'Admin', icon: Shield },
  ];

  return (
    <header className="border-b border-gray-200/50 sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <img
  src="https://i.postimg.cc/TwMgsHWv/events.jpg"
  alt="Decorative"
  className="h-10 w-10 lg:h-20 lg:w-40 transition-all duration-300 hover:scale-110 "
/>

              <div className="absolute inset-0 h-8 w-8 lg:h-10 lg:w-10 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <div className="text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-black tracking-wider">
                SPAARK ELITE EVENTS
              </h1>
              {/* <p className="text-xs lg:text-sm italic text-black hidden sm:block">
                Luxury. Celebration. Perfection.
              </p> */}
              {/* <h2 className="text-xs font-light dark-blue-hero-text mt-1 hidden lg:block">
                Where Your Vision Becomes a Masterpiece
              </h2> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItemsWithIcons.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-2 px-5 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                  isActive(item.path) 
                    ? 'text-cyan-600 bg-cyan-50' 
                    : 'text-gray-700 hover:text-cyan-600'
                }`}
              >
                <item.icon className={`h-6 w-6 transition-colors duration-300 ${
                  isActive(item.path) ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                }`} />
                <span className="text-lg">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Simplified to only show hamburger menu */}
          <div className="hidden md:flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="space-y-2 pt-4 border-t border-gray-100 w-full">
            {navItemsWithIcons.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 animate-fade-in-up w-full ${
                  isActive(item.path) 
                    ? 'text-cyan-600 bg-cyan-50 border-l-4 border-cyan-600' 
                    : 'text-gray-700 hover:text-cyan-600'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={`h-6 w-6 transition-colors duration-300 ${
                  isActive(item.path) ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                }`} />
                <span className="text-lg">{item.label}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-2.5 h-2.5 bg-cyan-600 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;