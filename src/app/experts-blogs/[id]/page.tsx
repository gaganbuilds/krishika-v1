'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getBlogs, getLocalInteractions, toggleLocalInteraction, BlogPost } from '../../../data/blogsData';
import { ArrowLeft, Heart, Bookmark, Share2, Clock, Calendar, MessageSquare, Send } from 'lucide-react';

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [interactions, setInteractions] = useState({ liked: false, saved: false });
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const blogs = getBlogs();
    const foundBlog = blogs.find(b => b.id === id);
    if (foundBlog) {
      setBlog(foundBlog);
      setInteractions(getLocalInteractions(foundBlog.id));
      setLocalComments(foundBlog.comments);
      setLikesCount(foundBlog.likes);
    }
  }, [id]);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-emerald-800 font-medium">Loading article...</p>
      </div>
    );
  }

  const handleInteraction = (type: 'liked' | 'saved') => {
    const newState = toggleLocalInteraction(blog.id, type);
    setInteractions(prev => ({ ...prev, [type]: newState }));
    if (type === 'liked') {
      setLikesCount(prev => newState ? prev + 1 : prev - 1);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `c-${Date.now()}`,
      userName: 'Current Farmer', // in real app, get from context
      text: commentText,
      date: new Date().toISOString().split('T')[0]
    };
    
    setLocalComments([...localComments, newComment]);
    setCommentText('');
  };

  const relatedBlogs = getBlogs()
    .filter(b => b.category === blog.category && b.id !== blog.id)
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-800/10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blogs
      </button>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-800/10"
      >
        {/* Hero Image */}
        <div className="relative h-[400px] w-full">
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {blog.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime} min read
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight shadow-sm text-balance">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-emerald-50">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(blog.publishDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar (Expert & Social) */}
          <div className="md:w-72 bg-emerald-50/50 p-8 border-r border-emerald-800/10">
            {/* Expert Profile */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Written By</h3>
              <div className="flex flex-col items-center text-center">
                <img src={blog.expert.avatarUrl || 'https://via.placeholder.com/150'} alt={blog.expert.name} className="w-24 h-24 rounded-full object-cover shadow-md mb-4 ring-4 ring-white" />
                <h4 className="font-bold text-lg text-emerald-950">{blog.expert.name}</h4>
                <p className="text-emerald-700 text-sm font-medium mb-1">{blog.expert.specialization}</p>
                <p className="text-stone-500 text-xs mb-4">{blog.expert.location}</p>
                <p className="text-stone-600 text-sm italic leading-relaxed">"{blog.expert.bio}"</p>
              </div>
            </div>

            {/* Social Interactions */}
            <div className="sticky top-24">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Interact</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleInteraction('liked')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    interactions.liked 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${interactions.liked ? 'fill-current' : ''}`} />
                  <span>{likesCount} Likes</span>
                </button>
                <button 
                  onClick={() => handleInteraction('saved')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    interactions.saved 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${interactions.saved ? 'fill-current' : ''}`} />
                  <span>{interactions.saved ? 'Saved' : 'Save'}</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 transition-all">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 sm:p-12">
            {/* Render HTML content securely (using dangerouslySetInnerHTML for mock data) */}
            <div 
              className="prose prose-emerald lg:prose-lg max-w-none text-stone-700 mb-12
                         prose-headings:text-emerald-950 prose-headings:font-bold
                         prose-p:leading-relaxed prose-a:text-emerald-600"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <hr className="border-emerald-800/10 mb-12" />

            {/* Comments Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                Discussion ({localComments.length})
              </h3>
              
              {/* Comment Form */}
              <form onSubmit={handleComment} className="mb-8 flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Post</span>
                </button>
              </form>

              {/* Comment List */}
              <div className="space-y-4">
                {localComments.length > 0 ? localComments.map(comment => (
                  <div key={comment.id} className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-emerald-950">{comment.userName}</span>
                      <span className="text-xs text-stone-400">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-700 text-sm">{comment.text}</p>
                  </div>
                )) : (
                  <p className="text-stone-500 text-sm italic">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-emerald-950 mb-6">More in {blog.category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedBlogs.map(related => (
                    <div key={related.id} className="group cursor-pointer border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors" onClick={() => router.push(`/experts-blogs/${related.id}`)}>
                      <div className="h-32 overflow-hidden">
                        <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-emerald-950 line-clamp-2 mb-1 group-hover:text-emerald-700">{related.title}</h4>
                        <p className="text-xs text-stone-500">{related.expert.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.article>
    </div>
  );
}
