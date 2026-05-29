import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '../data/blogsData';
import { Clock, ThumbsUp, MessageCircle } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-emerald-800/10 flex flex-col h-full group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
          {blog.category}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <img src={blog.expert.avatarUrl || 'https://via.placeholder.com/150'} alt={blog.expert.name} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs font-semibold text-emerald-950">{blog.expert.name}</span>
          <span className="text-xs text-stone-400">• {new Date(blog.publishDate).toLocaleDateString()}</span>
        </div>
        <Link href={`/experts-blogs/${blog.id}`} className="block group-hover:text-emerald-700 transition-colors flex-1">
          <h3 className="font-bold text-lg text-emerald-950 leading-tight mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">{blog.excerpt}</p>
        </Link>
        
        <div className="flex items-center justify-between pt-4 border-t border-emerald-800/10 text-stone-500">
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> {blog.likes}</div>
            <div className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {blog.comments.length}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime} min read
          </div>
        </div>
      </div>
    </motion.div>
  );
};
