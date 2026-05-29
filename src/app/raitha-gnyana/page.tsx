'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { getBlogs } from '../../data/blogsData';
import { BlogCard } from '../../components/BlogCard';
import { PlayCircle, Users, Sprout, TrendingUp, ExternalLink } from 'lucide-react';

export default function RaithaGnyanaPage() {
  const { t } = useApp();
  const blogs = getBlogs();
  
  // Mix of Expert Blogs and Dummy Feed Posts
  const feedItems = [
    { type: 'video', id: 'v1', title: 'How to Setup Drip Irrigation', author: 'FarmTech India', views: '12K', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop' },
    { type: 'blog', data: blogs[0] }, // Expert Blog
    { type: 'creator', id: 'c1', content: 'Just harvested the first batch of organic tomatoes! Yield looks promising despite the early rains. Make sure you adjust your watering schedules.', author: 'Ramesh (Progressive Farmer)', likes: 450, location: 'Nashik' },
    { type: 'blog', data: blogs[1] }, // Expert Blog
    { type: 'video', id: 'v2', title: 'Recognizing Early Signs of Leaf Blight', author: 'AgriScience', views: '34K', img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop' },
    { type: 'blog', data: blogs[2] }, // Expert Blog
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-emerald-400" />
            RaithaGnyana Feed
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium">Community updates, expert blogs, and farming videos.</p>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {feedItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {item.type === 'blog' && item.data ? (
              <div className="bg-white rounded-2xl p-1 border border-emerald-800/10 shadow-sm relative">
                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-400" /> Expert Article
                </div>
                <BlogCard blog={item.data} />
              </div>
            ) : item.type === 'video' ? (
              <div className="bg-white rounded-2xl overflow-hidden border border-emerald-800/10 shadow-sm group cursor-pointer">
                <div className="relative h-64">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
                  </div>
                  <div className="absolute top-4 right-4 bg-red-600 px-2 py-1 rounded-md text-[10px] font-bold text-white tracking-widest uppercase">
                    Video
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-emerald-950 mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {item.views} views</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-emerald-800/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                      R
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">{item.author}</h4>
                      <p className="text-xs text-stone-500">{item.location}</p>
                    </div>
                  </div>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    Community Post
                  </span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-4">"{item.content}"</p>
                <div className="flex items-center gap-4 text-xs font-bold text-stone-500">
                  <span className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer transition-colors"><Users className="w-4 h-4" /> {item.likes} Likes</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <button className="bg-emerald-50 text-emerald-700 font-bold px-6 py-3 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">
          Load More Content
        </button>
      </div>
    </div>
  );
}
