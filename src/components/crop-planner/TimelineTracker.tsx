'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { CropTimelineStage } from '../../data/cropPlannerData';

interface TimelineTrackerProps {
  cropId: string;
  timeline: CropTimelineStage[];
}

export default function TimelineTracker({ cropId, timeline }: TimelineTrackerProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedStage, setExpandedStage] = useState<string | null>(timeline[0]?.id || null);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`cropplanner_timeline_${cropId}`);
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse timeline state");
      }
    }
  }, [cropId]);

  // Save state when it changes
  const toggleTask = (stageId: string, taskIdx: number) => {
    const key = `${stageId}-${taskIdx}`;
    const newTasks = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(newTasks);
    localStorage.setItem(`cropplanner_timeline_${cropId}`, JSON.stringify(newTasks));
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    timeline.forEach(stage => {
      stage.tasks.forEach((_, idx) => {
        total++;
        if (completedTasks[`${stage.id}-${idx}`]) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-800/10 p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="font-black text-emerald-950 text-lg mb-1">Cultivation Timeline</h3>
          <p className="text-xs font-semibold text-stone-500">Track your progress step-by-step</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-600">{progress}%</span>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="space-y-4">
        {timeline.map((stage, sIdx) => {
          const isExpanded = expandedStage === stage.id;
          
          // Check stage completion
          const stageTotal = stage.tasks.length;
          const stageCompleted = stage.tasks.filter((_, tIdx) => completedTasks[`${stage.id}-${tIdx}`]).length;
          const isStageComplete = stageTotal > 0 && stageTotal === stageCompleted;

          return (
            <div key={stage.id} className={`border rounded-xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-300 bg-emerald-50/30' : 'border-stone-200 hover:border-emerald-200'}`}>
              <button 
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className="w-full px-5 py-4 flex items-center justify-between bg-transparent outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isStageComplete ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 text-stone-400'}`}>
                    {isStageComplete ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{sIdx + 1}</span>}
                  </div>
                  <div className="text-left">
                    <h4 className={`font-bold text-sm ${isStageComplete ? 'text-emerald-700' : 'text-emerald-950'}`}>{stage.stage}</h4>
                    <p className="text-[10px] font-semibold text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {stage.duration}
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>
              
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-emerald-100/50">
                  <div className="space-y-2 mt-3 pl-11">
                    {stage.tasks.map((task, tIdx) => {
                      const isDone = completedTasks[`${stage.id}-${tIdx}`];
                      return (
                        <div 
                          key={tIdx} 
                          onClick={() => toggleTask(stage.id, tIdx)}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group"
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300 group-hover:text-emerald-300 transition-colors" />
                            )}
                          </div>
                          <span className={`text-sm font-medium transition-colors ${isDone ? 'text-stone-400 line-through' : 'text-emerald-900 group-hover:text-emerald-700'}`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
