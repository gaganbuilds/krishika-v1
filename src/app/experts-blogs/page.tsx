'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getBlogs, CATEGORIES } from '../../data/blogsData';
import { BlogCard } from '../../components/BlogCard';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function ExpertsBlogsPage() {
  const { t } = useApp();
  const blogs = getBlogs();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.expert.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header section */}
      <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
          <BookOpen className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md px-3 py-1.5 rounded-full text-emerald-200 text-xs font-bold mb-6 border border-emerald-700/50">
            <BookOpen className="w-4 h-4" />
            <span>Premium Insights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Experts Blogs</h1>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Read professional articles, market insights, and sustainable farming tips directly from leading agricultural experts.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-emerald-800/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search blogs, experts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-700">No blogs found</h3>
          <p className="text-stone-500 text-sm mt-1">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
