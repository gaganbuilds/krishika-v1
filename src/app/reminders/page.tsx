'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BellRing, 
  CheckCircle, 
  Circle, 
  Trash2, 
  PlusCircle, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag 
} from 'lucide-react';
import Link from 'next/link';

export default function RemindersPage() {
  const { reminders, addReminder, toggleReminder, deleteReminder, t } = useApp();
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'Sowing' | 'Irrigation' | 'Fertilizer' | 'Harvesting' | 'Pesticides' | 'General'>('General');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({
      title,
      crop: crop || 'General',
      date,
      time,
      type
    });
    setTitle('');
    setCrop('');
    setDate('');
    setTime('');
    setShowForm(false);
  };

  const getReminderBadgeColor = (type: string) => {
    switch (type) {
      case 'Irrigation': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Fertilizer': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Pesticides': return 'bg-red-50 border-red-200 text-red-800';
      case 'Harvesting': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Sowing': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-stone-50 border-stone-200 text-stone-800';
    }
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">ರಿಮಾಂಡರ್ಸ್ (Reminders)</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Set alerts to ensure crop feeding, watering, and sprays happen on schedule.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>नया रिमाइंडर (Add Alert)</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <h3 className="font-bold text-sm text-emerald-950 border-b border-emerald-800/5 pb-2">नया अलर्ट सेट करें (Set New Alert)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">रिमाइंडर का नाम (Task Name) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. खाद डालना (e.g. Fertilizer top-up)"
                className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">फसल का नाम (Crop Name)</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="उदा. गेहूं, धान (e.g. Wheat, Rice)"
                className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">तारीख (Date)</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">समय (Time)</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">अलर्ट का प्रकार (Category)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              >
                <option value="General">सामान्य (General)</option>
                <option value="Sowing">बुवाई (Sowing)</option>
                <option value="Irrigation">सिंचाई (Irrigation)</option>
                <option value="Fertilizer">उर्वरक/खाद (Fertilizer)</option>
                <option value="Pesticides">कीटनाशक (Pesticide)</option>
                <option value="Harvesting">कटाई (Harvesting)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-800/5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-emerald-800/10 hover:bg-emerald-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Set Reminder
            </button>
          </div>
        </form>
      )}

      {/* Reminders Lists */}
      <div className="space-y-6">
        {/* Pending Section */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-emerald-800/80 uppercase tracking-widest block px-1">
            सक्रिय अलर्ट (Active Reminders - {activeReminders.length})
          </h2>
          
          {activeReminders.length === 0 ? (
            <div className="text-center py-10 bg-white/50 border border-dashed border-emerald-800/10 rounded-2xl text-xs text-emerald-800/60 font-medium">
              कोई सक्रिय अलर्ट नहीं है। (No active reminders. Start by setting one!)
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {activeReminders.map((rem) => (
                <div 
                  key={rem.id} 
                  className="flex items-center justify-between gap-4 bg-white border border-emerald-800/10 p-4.5 rounded-2xl shadow-sm transition-all hover:border-emerald-800/20"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button 
                      onClick={() => toggleReminder(rem.id)} 
                      className="mt-0.5 text-emerald-600 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                    >
                      <Circle className="h-5.5 w-5.5" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-emerald-950 leading-snug">{rem.title}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-emerald-800/50 font-bold mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {rem.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rem.time}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700/80 px-1.5 py-0.5 rounded font-semibold">
                          {rem.crop}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getReminderBadgeColor(rem.type)}`}>
                      {rem.type}
                    </span>
                    <button 
                      onClick={() => deleteReminder(rem.id)} 
                      className="p-1.5 hover:bg-red-50 hover:text-red-650 rounded-lg transition-colors text-stone-400 cursor-pointer"
                      title="Delete alert"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Section */}
        {completedReminders.length > 0 && (
          <div className="space-y-3 opacity-75">
            <h2 className="text-xs font-bold text-emerald-800/60 uppercase tracking-widest block px-1">
              पूरे हुए अलर्ट (Completed Alerts)
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {completedReminders.map((rem) => (
                <div 
                  key={rem.id} 
                  className="flex items-center justify-between gap-4 bg-stone-50 border border-stone-200 p-4.5 rounded-2xl"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button 
                      onClick={() => toggleReminder(rem.id)} 
                      className="mt-0.5 text-emerald-600 hover:text-emerald-750 transition-colors shrink-0 cursor-pointer"
                    >
                      <CheckCircle className="h-5.5 w-5.5 text-emerald-700" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-600 line-through leading-snug">{rem.title}</p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-400 font-medium mt-1">
                        <span>{rem.date}</span>
                        <span>{rem.time}</span>
                        <span className="bg-stone-100 text-stone-500 px-1 rounded">{rem.crop}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => deleteReminder(rem.id)} 
                      className="p-1.5 hover:bg-red-50 hover:text-red-655 rounded-lg transition-colors text-stone-400 cursor-pointer"
                      title="Delete alert"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
