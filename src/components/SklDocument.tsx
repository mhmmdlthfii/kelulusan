/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Subject, ApplicationSettings } from "../types";
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

interface SklProps {
  student: Student;
  subjects: Subject[];
  settings: ApplicationSettings;
  verificationCode: string;
  onBack: () => void;
}

export default function SklDocument({ student, subjects, settings, verificationCode, onBack }: SklProps) {
  const verificationUrl = `${window.location.origin}/verifikasi/${verificationCode}`;
  
  // Format long Indonesian dates e.g. "5 Juni 2026"
  const formatIndoDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const day = parseInt(parts[2], 10);
      const month = months[parseInt(parts[1], 10) - 1];
      const year = parts[0];
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4">
      {/* Control Buttons (no-print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print bg-slate-900/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-lg font-medium shadow-md transition"
          >
            <Printer size={16} />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* SKL Sheet Container (Styled professionally for screens & paper print) */}
      <div className="bg-white text-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden border-4 border-slate-200 min-h-[1100px] flex flex-col justify-between glass-card">
        {/* Subtle background watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <img 
            src={settings.schoolLogo} 
            alt="Watermark" 
            className="w-96 h-96 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Header (KOP SURAT) */}
        <div>
          <div className="flex items-center border-b-4 border-double border-slate-900 pb-4 mb-6 gap-6">
            <img 
              src={settings.schoolLogo} 
              alt="Logo Sekolah" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center flex-grow">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-700">Pemerintah Provinsi DKI Jakarta</h4>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-slate-900 tracking-tight leading-tight">{settings.schoolName}</h2>
              <p className="text-xs text-slate-600 mt-1">{settings.address}</p>
              <p className="text-xs text-slate-600">Telp: {settings.phone} | Email: {settings.email}</p>
            </div>
          </div>

          {/* Surat Title */}
          <div className="text-center mb-6">
            <h1 className="text-lg md:text-xl font-bold uppercase tracking-widest decoration-dotted underline underline-offset-4 text-slate-900">
              Surat Keterangan Lulus (SKL)
            </h1>
            <p className="text-xs text-slate-600 mt-1">Nomor: 421.3 / 108 / SMAN-1 / TA-{settings.academicYear.replace("/", "-")}</p>
          </div>

          {/* Opening Statement */}
          <div className="text-sm leading-relaxed mb-6 text-slate-800 text-justify">
            {settings.announcementTemplate || "Kepala Sekolah dengan ini menerangkan bahwa peserta didik berikut:"}
          </div>

          {/* Student Identitas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-xl">
            {/* Student Photo */}
            <div className="md:col-span-3 flex flex-col items-center justify-center">
              <div className="w-28 h-36 border-2 border-slate-400 bg-slate-100 rounded-md overflow-hidden shadow-sm flex items-center justify-center relative">
                {student.photoUrl ? (
                  <img 
                    src={student.photoUrl} 
                    alt="Foto Siswa" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">PAS FOTO 3X4</span>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-2 text-sm text-slate-800">
              <span className="font-semibold text-slate-500">Nama Lengkap</span>
              <span className="sm:col-span-2 font-bold text-slate-900">: {student.name}</span>

              <span className="font-semibold text-slate-500">NISN / NIS</span>
              <span className="sm:col-span-2">: {student.nisn} / {student.nis}</span>

              <span className="font-semibold text-slate-500">Tempat, Tanggal Lahir</span>
              <span className="sm:col-span-2">: {student.birthPlace}, {formatIndoDate(student.birthDate)}</span>

              <span className="font-semibold text-slate-500">Kelas</span>
              <span className="sm:col-span-2">: {student.className}</span>

              <span className="font-semibold text-slate-500">Tahun Pelajaran</span>
              <span className="sm:col-span-2">: {settings.academicYear}</span>
            </div>
          </div>

          {/* Nilai / Leger Nilai Mapel Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2 border-b-2 border-slate-200 pb-1">
              <span>Daftar Nilai Hasil Ujian Sekolah</span>
            </h3>
            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-sm">
              <table className="w-full text-left text-sm text-slate-800 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <th className="py-2.5 px-4 text-center w-12">No</th>
                    <th className="py-2.5 px-4">Mata Pelajaran</th>
                    <th className="py-2.5 px-4 text-center w-24">KKM</th>
                    <th className="py-2.5 px-4 text-center w-24">Nilai</th>
                    <th className="py-2.5 px-4 text-center w-36">Status Kelulusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.map((sub, index) => {
                    const grade = student.grades ? student.grades[sub.id] || 0 : 0;
                    const isPassed = grade >= sub.kkm;
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-2 px-4 text-center font-mono">{index + 1}</td>
                        <td className="py-2 px-4 font-medium">{sub.name}</td>
                        <td className="py-2 px-4 text-center font-mono">{sub.kkm}</td>
                        <td className={`py-2 px-4 text-center font-bold font-mono ${!isPassed ? 'text-rose-600': 'text-slate-900'}`}>{grade}</td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isPassed 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {isPassed ? "TUNTAS" : "DI BAWAH KKM"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Rata-Rata */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td colSpan={3} className="py-3 px-4 text-right">Rata-Rata Nilai:</td>
                    <td className="py-3 px-4 text-center font-mono text-blue-700">
                      {(subjects.reduce((acc, sub) => acc + (student.grades ? student.grades[sub.id] || 0 : 0), 0) / (subjects.length || 1)).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Statement Status of Graduation */}
          <div className="my-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Dinyatakan:</p>
            <h2 className={`text-2xl md:text-3xl font-extrabold mt-1 tracking-wider ${
              student.status === "Lulus" 
                ? "text-emerald-600" 
                : student.status === "Lulus Bersyarat" 
                ? "text-amber-500" 
                : "text-rose-600"
            }`}>
              {student.status === "Lulus" && "LULUS"}
              {student.status === "Lulus Bersyarat" && "LULUS BERSYARAT"}
              {student.status === "Tidak Lulus" && "TIDAK LULUS"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-2 font-light">Status kelulusan ini adalah sah dan terdokumentasi di dalam pangkalan data e-kelulusan sekolah.</p>
          </div>
        </div>

        {/* Footer info (QR verification, Date, Principal signature) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Verification Box QR */}
          <div className="flex items-start gap-4 border border-slate-200 p-3 rounded-lg bg-slate-50">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`} 
              alt="QR Verifikasi" 
              className="w-20 h-20 object-contain border border-slate-300 rounded p-1 bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="text-slate-700">
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
                <ShieldCheck size={14} />
                <span>Dokumen Terverifikasi Siber</span>
              </span>
              <p className="text-[10px] leading-tight text-slate-500">
                Lakukan pemindaian QR Code di atas atau kunjungi verifikasi tautan berikut untuk memvalidasi keabsahan data dokumen ini:
              </p>
              <p className="text-[10px] font-mono mt-1 text-slate-800 break-all select-all font-semibold">
                {verificationCode}
              </p>
            </div>
          </div>

          {/* Signature Box */}
          <div className="text-right flex flex-col items-end justify-between min-h-[140px]">
            <div className="text-sm text-slate-800">
              <p>Jakarta, {formatIndoDate(settings.graduationDate)}</p>
              <p className="font-semibold text-slate-700 text-xs">Kepala {settings.schoolName}</p>
            </div>

            {/* Principal Signature Image & Stamp */}
            <div className="relative h-20 w-44 my-1 mr-4 flex items-center justify-end">
              {settings.signatureImage && (
                <img 
                  src={settings.signatureImage} 
                  alt="Tanda Tangan Kepala Sekolah" 
                  className="h-16 w-auto object-contain max-w-full"
                  referrerPolicy="no-referrer"
                />
              )}
              {/* Styled Stamp overlay representing blue official school stamp */}
              <div className="absolute right-12 top-0 h-16 w-16 border-2 border-blue-500/30 rounded-full flex items-center justify-center -rotate-12 pointer-events-none select-none">
                <span className="text-[6px] font-bold text-blue-500/40 text-center uppercase tracking-tighter">
                  STAMP<br/>OFFICIAL
                </span>
              </div>
            </div>

            <div className="text-sm text-slate-800">
              <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5">{settings.principalName}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {settings.principalNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
