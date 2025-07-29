import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogAPI, BlogPostExtended } from '../lib/api';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await blogAPI.getAll();
        setBlogPosts(data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="py-20 min-h-screen bg-white" aria-label="Blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-700" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 dark-blue-hero-text" style={{ fontFamily: 'Playfair Display, serif' }}>
            Insights, Tips & Event Inspiration
          </p>
          <p className="text-lg mb-12 leading-relaxed max-w-3xl mx-auto text-gray-600">
            Discover the latest trends, expert tips, and behind-the-scenes stories from our luxury event planning experiences.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Loading blog posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 elegant-btn bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!isLoading && !error && blogPosts.length > 0 && (
          <>
        {/* Featured Post */}
        <div className="mb-16">
          <div className="glass rounded-lg border border-cyan-200 overflow-hidden hover:border-cyan-500 transition-colors duration-300 bg-white shadow-md reveal animate-glass-fade-in section-animate">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-cyan-500 overlay-text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                  <span className="ml-3 overlay-text-white text-sm">{blogPosts[0].category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Playfair Display, Inter, Arial, sans-serif' }}>
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {expandedPosts.has(blogPosts[0].id || '') ? blogPosts[0].content || blogPosts[0].summary : blogPosts[0].summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{blogPosts[0].author || 'Admin'}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(blogPosts[0].created_at || new Date()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <button 
                    onClick={() => toggleExpanded(blogPosts[0].id || '')}
                    className="elegant-btn bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-all flex items-center"
                  >
                    {expandedPosts.has(blogPosts[0].id || '') ? 'Show Less' : 'Read More'}
                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${expandedPosts.has(blogPosts[0].id || '') ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="glass rounded-lg border border-cyan-200 overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:scale-105 group bg-white shadow-md reveal animate-glass-fade-in section-animate"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-cyan-500 overlay-text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2" style={{ fontFamily: 'Playfair Display, Inter, Arial, sans-serif' }}>
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  {expandedPosts.has(post.id || '') ? post.content || post.summary : post.summary}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.created_at || new Date()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleExpanded(post.id || '')}
                  className="w-full elegant-btn bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-all flex items-center justify-center"
                >
                  {expandedPosts.has(post.id || '') ? 'Show Less' : 'Read More'}
                  <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${expandedPosts.has(post.id || '') ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>
        </>
        )}

        {/* No Posts State */}
        {!isLoading && !error && blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No blog posts available at the moment.</p>
            <p className="text-gray-300 mt-2">Check back soon for new content!</p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 p-12 rounded-lg border border-cyan-200 text-center bg-white shadow-md reveal animate-fade-in-up">
          <h2 className="text-3xl font-bold text-cyan-700 mb-6">Stay Updated with Event Planning Tips</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our newsletter and never miss our latest insights, trends, and expert advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-cyan-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
            />
            <button className="elegant-btn bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;