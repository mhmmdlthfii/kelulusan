/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // HH:MM
  onComplete?: () => void;
  isDark?: boolean;
}

export default function Countdown({ targetDate, targetTime, onComplete, isDark = true }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOver: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const calculateTime = () => {
      const targetStr = `${targetDate}T${targetTime}:00`;
      const target = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        if (onComplete) onComplete();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime, onComplete]);

  if (timeLeft.isOver) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-md rounded-2xl animate-pulse">
        <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg md:text-xl tracking-wider">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          PORTAL PENGUMUMAN TELAH DIBUKA
        </div>
        <p className={`text-xs mt-1 transition-colors ${isDark ? "text-slate-400" : "text-slate-600"}`}>Silakan masukkan data NISN Anda di bawah untuk memeriksa status kelulusan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-2 text-sm mb-4 transition-colors ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        <Clock size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Pengumuman Kelulusan Dibuka Dalam:</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
        {[
          { label: "Hari", value: timeLeft.days },
          { label: "Jam", value: timeLeft.hours },
          { label: "Menit", value: timeLeft.minutes },
          { label: "Detik", value: timeLeft.seconds }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col items-center justify-center p-3 md:p-4 border backdrop-blur-md rounded-xl text-center min-w-[70px] md:min-w-[85px] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300 ${
              isDark 
                ? "bg-slate-900/60 border-white/10" 
                : "bg-slate-100 border-slate-200"
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className={`text-xl md:text-3xl font-extrabold bg-clip-text text-transparent font-mono ${
              isDark ? "bg-gradient-to-b from-white to-slate-300" : "bg-gradient-to-b from-slate-900 to-slate-700"
            }`}>
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
