/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Student, Subject } from "../types";
import { X, Save, Loader2, Award } from "lucide-react";

interface GradeDialogProps {
  student: Student;
  subjects: Subject[];
  onClose: () => void;
  onSave: (updatedStudent: Student) => Promise<void> | void;
}

export default function GradeDialog({ student, subjects, onClose, onSave }: GradeDialogProps) {
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setGrades(student.grades || {});
    }
  }, [student]);

  const handleGradeChange = (subId: string, value: string) => {
    const numeric = parseInt(value, 10);
    // Standard clamping for Indonesian grades 0-100
    const clamped = isNaN(numeric) ? 0 : Math.max(0, Math.min(100, numeric));
    setGrades(prev => ({
      ...prev,
      [subId]: clamped
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedStudent: Student = {
        ...student,
        grades
      };
      await onSave(updatedStudent);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal mengubah nilai siswa.");
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const totalSubjects = subjects.length;
  const gradedSubjects = subjects.filter(s => grades[s.id] !== undefined).length;
  const averageGrade = totalSubjects > 0 
    ? (subjects.reduce((sum, s) => sum + (grades[s.id] || 0), 0) / totalSubjects)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header banner glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500" />
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Input & Edit Nilai Siswa</h3>
              <p className="text-[11px] text-slate-400 font-medium">Ubah transkrip nilai ujian sekolah resmi siswa.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content Box */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Student details header (Read Only) */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">Nama Siswa</span>
                <span className="text-xs font-bold text-white capitalize">{student.name}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">NISN / NIS</span>
                <span className="text-xs font-semibold text-slate-300 font-mono">{student.nisn} / {student.nis}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">Kelas Rombel</span>
                <span className="text-xs font-bold text-cyan-400">{student.className}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">Rata-rata Sementara</span>
                <span className="text-xs font-black text-emerald-400 font-mono">{averageGrade.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Core grades list */}
          <div>
            <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>Nilai Pokok Kompetensi Mapel</span>
              <span className="text-[9px] font-mono text-slate-500 normal-case">({gradedSubjects}/{totalSubjects} Mapel Terisi)</span>
            </h4>
            
            {subjects.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8 italic bg-slate-950/20 rounded-xl border border-white/5">
                Belum ada mata pelajaran dimasukkan. Harap setup mapel terlebih dahulu.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map(s => {
                  const val = grades[s.id] !== undefined ? grades[s.id] : "";
                  const isBelowKkm = grades[s.id] !== undefined && grades[s.id] < s.kkm;
                  return (
                    <div 
                      key={s.id} 
                      className={`p-3 rounded-xl border transition flex items-center justify-between ${
                        isBelowKkm 
                          ? "bg-rose-500/5 border-rose-500/20" 
                          : "bg-slate-950/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="max-w-[70%]">
                        <span className="block text-[11px] font-bold text-white tracking-wide truncate" title={s.name}>
                          {s.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          Kode: {s.id} | KKM Kelulusan: <span className="font-semibold text-slate-400">{s.kkm}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          required
                          className={`w-16 bg-slate-950 border rounded-lg px-2 py-1 text-sm text-center font-bold font-mono focus:outline-none transition ${
                            isBelowKkm 
                              ? "border-rose-500/40 text-rose-400 focus:border-rose-500" 
                              : "border-white/10 text-white focus:border-cyan-500/50"
                          }`}
                          value={val}
                          onChange={e => handleGradeChange(s.id, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        {/* Footer controls */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-5 py-2 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>Simpan Nilai</span>
          </button>
        </div>
      </div>
    </div>
  );
}
