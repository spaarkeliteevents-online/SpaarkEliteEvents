import React, { useEffect, useState } from 'react';
import { Heart, Building, PartyPopper, Users, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesAPI, Service } from '../lib/api';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Building,
  PartyPopper,
  Users,
  Calendar,
  Sparkles,
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesAPI.getAll();
        setServices(data || []);
      } catch (err) {
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    // Update page title and meta description
    document.title = 'Our Services - Luxury Event Planning | Spaark Elite Events Hyderabad';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover our comprehensive event planning services in Hyderabad. Wedding planning, corporate events, private parties, and anniversary celebrations with luxury touch.');
    }
  }, []);

  return (
    <div className="py-20 min-h-screen bg-white" aria-label="Services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-700" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 dark-blue-hero-text" style={{ fontFamily: 'Playfair Display, serif' }}>
            Comprehensive Event Solutions
          </p>
          <p className="text-lg mb-12 leading-relaxed max-w-3xl mx-auto text-gray-600">
            From intimate gatherings to grand celebrations, we offer a complete range of event planning and management services tailored to your unique vision.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading services...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon || 'Heart'] || Heart;
              return (
                <div
                  key={service.id || index}
                  className="glass p-8 rounded-lg border border-cyan-200 bg-white hover:border-cyan-500 transition-all duration-300 hover:scale-105 group shadow-md reveal animate-glass-fade-in section-animate"
                  tabIndex={0}
                  aria-label={service.name}
                >
                  <div className="bg-cyan-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-700 mb-4" style={{ fontFamily: 'Playfair Display, Inter, Arial, sans-serif' }}>{service.name}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {(service.features ?? []).map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="p-12 rounded-lg border border-cyan-200 text-center bg-white shadow-md reveal animate-fade-in-up">
          <h2 className="text-3xl font-bold text-cyan-700 mb-6">Ready to Plan Your Perfect Event?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your vision and create an unforgettable experience tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="elegant-btn bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-400 transition-all duration-300 hover:scale-105"
              aria-label="Get Free Consultation"
            >
              Get Free Consultation
            </Link>
            <Link
              to="/gallery"
              className="elegant-btn border-2 border-cyan-500 text-cyan-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105"
              aria-label="View Our Work"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;