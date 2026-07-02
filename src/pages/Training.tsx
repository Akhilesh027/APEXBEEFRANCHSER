import React, { useState, useEffect } from 'react';
import type { TrainingVideo } from '../types';
import { GraduationCap, PlayCircle, BookOpen, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrainingPage: React.FC = () => {
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://server.apexbee.in/api/training-videos?roleType=franchise')
      .then(r => r.json())
      .then(data => {
        const list: TrainingVideo[] = (data.videos || data || []).map((v: any) => ({
          id: v._id || v.id,
          title: v.title,
          duration: v.duration || '',
          targetRole: v.targetRole || v.roleType || 'Franchise',
          category: v.category || '',
          videoUrl: v.videoUrl || v.url || ''
        }));
        setVideos(list);
        if (list.length > 0) setSelectedVideo(list[0]);
      })
      .catch(err => console.error('Error fetching training videos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="p-6 text-center text-slate-450">
        <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">No training videos available for this role profile yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Training & Onboarding Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Learn how to build pools, onboard delivery riders, verify vendor KYC, and earn certificates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlist Player */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center text-white">
            <PlayCircle size={64} className="text-white/80 cursor-pointer hover:scale-105 active:scale-95 transition-transform" />
            <span className="absolute bottom-3 left-3 text-xs bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 font-bold">
              Playing Tutorial: {selectedVideo.title}
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">{selectedVideo.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Duration: {selectedVideo.duration} • Category: {selectedVideo.category} • Target: {selectedVideo.targetRole}</p>
          </div>
        </div>

        {/* Playlist list */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={18} />
              <span>Available Video Modules</span>
            </h3>

            <div className="space-y-3">
              {videos.map(vid => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedVideo.id === vid.id
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/20 text-slate-700 dark:text-slate-300 hover:border-primary/20'
                  }`}
                >
                  <PlayCircle size={20} className="shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold truncate max-w-[160px]">{vid.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{vid.duration} • {vid.targetRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/10 rounded-2xl space-y-1.5 mt-4">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Award size={16} />
              <span className="text-xs font-bold">Certification Status</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete all target video modules to generate your official Franchise Onboarding Seal.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
