'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Sprout, 
  Droplet, 
  ShieldAlert, 
  BadgeIndianRupee, 
  CheckCircle2, 
  Circle,
  Plus, 
  ArrowLeft, 
  TrendingUp, 
  FolderHeart,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage() {
  const { activities, addActivity, t } = useApp();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<'soil' | 'water' | 'crop' | 'pest' | 'harvest' | 'finance'>('crop');
  const [status, setStatus] = useState<'Completed' | 'Scheduled'>('Completed');
  const [showForm, setShowForm] = useState(false);

  // Stateful tracking of activity statuses in this view
  const [localActivities, setLocalActivities] = useState(activities);

  const handleToggleStatus = (id: string) => {
    setLocalActivities(prev => 
      prev.map(act => 
        act.id === id 
          ? { ...act, status: act.status === 'Completed' ? 'Scheduled' : 'Completed' } 
          : act
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newAct = addActivity({
      title,
      notes,
      type,
      status
    });
    
    // Add to local state display immediately
    const defaultDate = new Date().toISOString().split('T')[0];
    setLocalActivities(prev => [
      {
        id: Math.random().toString(),
        title,
        notes,
        type,
        status,
        date: defaultDate
      },
      ...prev
    ]);

    setTitle('');
    setNotes('');
    setShowForm(false);
  };

  // Pre-made crop templates loader
  const loadCropTemplate = (crop: 'wheat' | 'paddy' | 'tomato') => {
    const today = new Date().toISOString().split('T')[0];
    let templates: any[] = [];

    if (crop === 'paddy') {
      templates = [
        { title: 'Paddy Nursery Sowing', notes: 'Sowed high yield Basmati seeds in raised seedbeds.', type: 'crop', status: 'Completed' },
        { title: 'Water Ponding Check', notes: 'Maintained 5cm standing water in the main field post-transplanting.', type: 'water', status: 'Completed' },
        { title: 'Urea First Top Dressing', notes: 'Apply 35kg Nitrogen/acre at tillering stage.', type: 'crop', status: 'Scheduled' },
        { title: 'Stem Borer Pest Watch', notes: 'Check field for dead hearts or whiteheads.', type: 'pest', status: 'Scheduled' }
      ];
    } else if (crop === 'wheat') {
      templates = [
        { title: 'Wheat Seed Treatment', notes: 'Treated seeds with fungicide before mechanical sowing.', type: 'soil', status: 'Completed' },
        { title: 'Crown Root Irrigation', notes: 'First watering scheduled 21 days after sowing.', type: 'water', status: 'Completed' },
        { title: 'Broadleaf Weed Spray', notes: 'Apply recommended herbicide to clear weeds.', type: 'pest', status: 'Scheduled' },
        { title: 'Grain Harvest Planning', notes: 'Combine harvester booking for late April.', type: 'harvest', status: 'Scheduled' }
      ];
    } else {
      templates = [
        { title: 'Tomato Bed Preparation', notes: 'Prepared beds with organic manure and mulch sheets.', type: 'soil', status: 'Completed' },
        { title: 'Drip System Maintenance', notes: 'Flushed lateral lines and cleaned filter caps.', type: 'water', status: 'Completed' },
        { title: 'Neem Oil Spraying', notes: 'Organic pest prevention spray on foliage.', type: 'pest', status: 'Completed' },
        { title: 'Staking & Trellising', notes: 'Provide support sticks for vegetative growth branch weight.', type: 'crop', status: 'Scheduled' }
      ];
    }

    // Add all template logs
    templates.forEach(t => {
      addActivity({
        title: t.title,
        notes: t.notes,
        type: t.type,
        status: t.status
      });
    });

    // Sync to local display state
    const formatted = templates.map((t, idx) => ({
      id: `template-${crop}-${idx}-${Math.random()}`,
      title: t.title,
      notes: t.notes,
      type: t.type,
      status: t.status,
      date: today
    }));

    setLocalActivities(prev => [...formatted, ...prev]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'soil': return <Wrench className="h-4.5 w-4.5 text-amber-700" />;
      case 'water': return <Droplet className="h-4.5 w-4.5 text-blue-600" />;
      case 'pest': return <ShieldAlert className="h-4.5 w-4.5 text-red-650" />;
      case 'harvest': return <Sprout className="h-4.5 w-4.5 text-emerald-650" />;
      case 'finance': return <BadgeIndianRupee className="h-4.5 w-4.5 text-green-700" />;
      default: return <Sprout className="h-4.5 w-4.5 text-emerald-700" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'soil': return 'bg-amber-100/50 border-amber-300/40';
      case 'water': return 'bg-blue-50 border-blue-200/50';
      case 'pest': return 'bg-red-55/10 border-red-200/50';
      case 'harvest': return 'bg-emerald-50 border-emerald-200/50';
      case 'finance': return 'bg-green-50 border-green-200/50';
      default: return 'bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">{t('timeline')}</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Record and track history of actions taken on your crops.</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>{t('addTask')}</span>
        </button>
      </div>

      {/* Templates Loader panel */}
      <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
          <FolderHeart className="h-4.5 w-4.5 text-emerald-600" />
          <span>ಬೆಳೆ ವೇಳಾಪಟ್ಟಿ ಟೆಂಪ್ಲೇಟ್‌ಗಳು (Load Crop Activity Templates)</span>
        </h3>
        <p className="text-[11px] text-emerald-800/60 font-semibold leading-relaxed">
          Load standard crop growth logs and task schedules automatically to your timeline:
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1.5">
          <button
            onClick={() => loadCropTemplate('paddy')}
            className="text-xs font-bold bg-blue-50 hover:bg-blue-100/70 border border-blue-200/50 text-blue-800 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            🌾 Paddy (धान) Template
          </button>
          <button
            onClick={() => loadCropTemplate('wheat')}
            className="text-xs font-bold bg-amber-50 hover:bg-amber-100/70 border border-amber-200/50 text-amber-800 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            🌾 Wheat (गेहूं) Template
          </button>
          <button
            onClick={() => loadCropTemplate('tomato')}
            className="text-xs font-bold bg-red-50 hover:bg-red-100/70 border border-red-200/50 text-red-800 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            🍅 Tomato (टमाटर) Template
          </button>
        </div>
      </div>

      {/* New Activity Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <h3 className="font-bold text-sm text-emerald-950 border-b border-emerald-800/5 pb-2">नया कार्य दर्ज करें (Log New Activity)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('taskName')} *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Applied Urea"
                className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('category')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              >
                <option value="crop">Crop Care</option>
                <option value="water">Irrigation</option>
                <option value="pest">Pest Control</option>
                <option value="soil">Soil Sampling</option>
                <option value="harvest">Harvesting</option>
                <option value="finance">Finance/Loan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide field specifications or notes..."
              rows={3}
              className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'Completed'} 
                  onChange={() => setStatus('Completed')}
                  className="text-emerald-600 focus:ring-emerald-500" 
                />
                <span>Completed</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'Scheduled'} 
                  onChange={() => setStatus('Scheduled')}
                  className="text-emerald-600 focus:ring-emerald-500" 
                />
                <span>Scheduled</span>
              </label>
            </div>
            
            <div className="flex gap-2">
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
                {t('saveLog')}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline list */}
      <div className="relative border-l-2 border-emerald-800/10 ml-4 pl-6 space-y-6">
        {localActivities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline node */}
            <span className={`absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-800/10 bg-white shadow-sm transition-transform group-hover:scale-110`}>
              {getActivityIcon(act.type)}
            </span>
            
            <div className={`border rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md bg-white/70 backdrop-blur-sm ${getActivityColor(act.type)}`}>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex items-start gap-2.5">
                  <button 
                    onClick={() => handleToggleStatus(act.id)}
                    className="mt-0.5 text-emerald-750 hover:text-emerald-800 cursor-pointer"
                  >
                    {act.status === 'Completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-750" />
                    ) : (
                      <Circle className="h-5 w-5 text-stone-400" />
                    )}
                  </button>
                  <div>
                    <h3 className={`font-extrabold text-sm text-emerald-950 leading-snug ${act.status === 'Completed' ? 'line-through opacity-75' : ''}`}>
                      {act.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800/50 uppercase tracking-wide mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {act.date}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                  act.status === 'Completed' 
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-850' 
                    : 'bg-amber-100 border-amber-200 text-amber-850'
                }`}>
                  {act.status}
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium leading-relaxed pl-7">{act.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
