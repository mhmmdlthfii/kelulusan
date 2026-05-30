/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Student, Subject, GraduationStatus } from "../types";
import { X, Save, Plus, Loader2 } from "lucide-react";

interface StudentDialogProps {
  student: Student | null; // null means create mode
  subjects: Subject[];
  onClose: () => void;
  onSave: (student: Student) => Array<any> | Promise<any>;
}

export default function StudentDialog({ student, subjects, onClose, onSave }: StudentDialogProps) {
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [className, setClassName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [status, setStatus] = useState<GraduationStatus>(GraduationStatus.LULUS);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setNisn(student.nisn);
      setNis(student.nis);
      setName(student.name);
      setGender(student.gender);
      setBirthPlace(student.birthPlace || "");
      setBirthDate(student.birthDate || "");
      setClassName(student.className);
      setPhotoUrl(student.photoUrl || "");
      setStatus(student.status);
      setGrades(student.grades || {});
    } else {
      setNisn("");
      setNis("");
      setName("");
      setGender("Laki-laki");
      setBirthPlace("");
      setBirthDate("");
      setClassName("");
      setPhotoUrl("");
      setStatus(GraduationStatus.LULUS);
      
      // Seed default empty grades for each subject
      const emptyGrades: Record<string, number> = {};
      subjects.forEach(s => {
        emptyGrades[s.id] = 75; // standard defaults
      });
      setGrades(emptyGrades);
    }
  }, [student, subjects]);

  const handleGradeChange = (subId: string, value: string) => {
    const numeric = parseInt(value, 15) || 0;
    const clamped = Math.max(0, Math.min(100, numeric));
    setGrades(prev => ({
      ...prev,
      [subId]: clamped
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn.trim() || !nis.trim() || !name.trim() || !className.trim() || !birthDate) {
      setError("Semua data utama wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: Student = {
        nisn: nisn.trim(),
        nis: nis.trim(),
        name: name.trim(),
        gender,
        birthPlace: birthPlace.trim() || "Jakarta",
        birthDate,
        className: className.trim(),
        photoUrl: photoUrl.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
        status,
        grades
      };
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data siswa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-lg font-bold text-white">
            {student ? "Edit Data Siswa" : "Tambah Siswa Baru"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content Box */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Core Data Block */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Informasi Pokok</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nomor NISN *</label>
                <input
                  type="text"
                  maxLength={10}
                  pattern="[0-9]*"
                  required
                  disabled={!!student} // NISN is primary key, edit locked
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition disabled:opacity-50"
                  value={nisn}
                  onChange={e => setNisn(e.target.value.replace(/\D/g, ""))}
                  placeholder="Contoh: 0081234561"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nomor NIS *</label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition"
                  value={nis}
                  onChange={e => setNis(e.target.value)}
                  placeholder="Contoh: 220101"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1.5">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition capitalize"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nama Lengkap Sesuai Ijazah"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Jenis Kelamin *</label>
                <select
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition"
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Kelas Rombe *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="Contoh: XII MIPA 1"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tempat Lahir</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition"
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  placeholder="Contoh: Jakarta"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1.5">Tautan URL Foto Siswa</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition font-mono"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (atau kosongkan)"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1.5">Status Kelulusan Siswa *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: GraduationStatus.LULUS, label: "Lulus", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
                    { value: GraduationStatus.LULUS_BERSYARAT, label: "Lulus Bersyarat", color: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
                    { value: GraduationStatus.TIDAK_LULUS, label: "Tidak Lulus", color: "border-rose-500/30 text-rose-400 bg-rose-500/5" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition cursor-pointer ${
                        status === opt.value 
                          ? `${opt.color} ring-2 ring-cyan-500/25 border-cyan-500` 
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Leger Nilai Per Mapel */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Nilai Pokok Kompetensi Mapel (Nilai Ujian)</h4>
            
            {subjects.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4 italic">Belum ada mata pelajaran dimasukkan. Harap setup mapel terlebih dahulu.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subjects.map(s => {
                  const val = grades[s.id] !== undefined ? grades[s.id] : "";
                  return (
                    <div key={s.id} className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <span className="block text-[11px] text-slate-300 font-medium truncate" title={s.name}>
                        {s.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1 text-sm text-center font-bold font-mono text-white focus:outline-none transition"
                          value={val}
                          onChange={e => handleGradeChange(s.id, e.target.value)}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">/K:{s.kkm}</span>
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
            className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-5 py-2 rounded-xl transition shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>Simpan Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
