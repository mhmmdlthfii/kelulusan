/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { 
  Student, 
  Subject, 
  Announcement, 
  ApplicationSettings, 
  LoginLog, 
  User, 
  VerificationCode, 
  GraduationStatus, 
  UserRole, 
  AnnouncementStatus 
} from "../types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  students: Student[];
  subjects: Subject[];
  announcements: Announcement[];
  settings: ApplicationSettings;
  login_logs: LoginLog[];
  users: User[];
  verification_codes: VerificationCode[];
}

const DEFAULT_SETTINGS: ApplicationSettings = {
  schoolName: "SMP Islam Al Hikmah Mayong",
  schoolLogo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80", // beautiful school crest Unsplash
  schoolFavicon: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=32&h=32&fit=crop&q=80",
  address: "Jl. Raya Jepara-Kudus No. 12, Mayong, Kabupaten Jepara, Jawa Tengah",
  email: "info@smpislamalhikmahmayong.sch.id",
  phone: "(0291) 751234",
  footerText: "Copyright © 2026 SMP Islam Al Hikmah Mayong. All Rights Reserved.",
  graduationDate: "2026-06-05", // Default countdown target set slightly in future (it is now May 30, 2026)
  graduationTime: "10:00",
  academicYear: "2025/2026",
  principalName: "Drs. H. Mulyadi, M.Pd.",
  principalNip: "196803121994031005",
  signatureImage: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Tandatangan_BJH.png", // tidy signature
  announcementTemplate: "Berdasarkan hasil Keputusan Rapat Pleno Dewan Pendidik SMP Islam Al Hikmah Mayong tentang Kelulusan Peserta Dididk Tahun Pelajaran 2025/2026, dengan ini menerangkan bahwa peserta didik yang namanya tertera pada lembar dokumen ini dinyatakan:",
  schoolLogoRight: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png",
  watermarkImage: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
  sklNumberTemplate: "Nomor: 421.3 / 108 / SMP-AHM / TA-{academicYear}",
  backgroundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
  isAnnouncementOpen: false
};

const DEFAULT_USERS: User[] = [
  {
    id: "1",
    username: "Luthfi",
    name: "Luthfi (Super Admin)",
    role: UserRole.SUPER_ADMIN,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    username: "operator",
    name: "Siti Rahma (Operator)",
    role: UserRole.OPERATOR,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "MAT", name: "Matematika Peminatan", kkm: 75 },
  { id: "IND", name: "Bahasa Indonesia", kkm: 75 },
  { id: "ING", name: "Bahasa Inggris", kkm: 75 },
  { id: "FIS", name: "Fisika", kkm: 70 },
  { id: "KIM", name: "Kimia", kkm: 72 },
  { id: "BIO", name: "Biologi", kkm: 72 },
  { id: "PAI", name: "Pendidikan Agama", kkm: 78 }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    nisn: "0081234561",
    nis: "220101",
    name: "Arief Budiman",
    gender: "Laki-laki",
    birthPlace: "Jakarta",
    birthDate: "2008-04-12",
    parentName: "Joko Budiman",
    className: "XII MIPA 1",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    status: GraduationStatus.LULUS,
    grades: { "MAT": 85, "IND": 88, "ING": 84, "FIS": 78, "KIM": 80, "BIO": 82, "PAI": 90 }
  },
  {
    nisn: "0081234562",
    nis: "220102",
    name: "Budi Santoso",
    gender: "Laki-laki",
    birthPlace: "Surabaya",
    birthDate: "2008-07-21",
    parentName: "Slamet Santoso",
    className: "XII MIPA 1",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    status: GraduationStatus.LULUS,
    grades: { "MAT": 78, "IND": 80, "ING": 76, "FIS": 72, "KIM": 74, "BIO": 75, "PAI": 82 }
  },
  {
    nisn: "0081234563",
    nis: "220103",
    name: "Citra Lestari",
    gender: "Perempuan",
    birthPlace: "Bandung",
    birthDate: "2008-02-15",
    parentName: "Bambang Lestari",
    className: "XII MIPA 1",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    status: GraduationStatus.LULUS,
    grades: { "MAT": 92, "IND": 95, "ING": 91, "FIS": 88, "KIM": 90, "BIO": 93, "PAI": 94 }
  },
  {
    nisn: "0081234564",
    nis: "220104",
    name: "Dewi Kartika",
    gender: "Perempuan",
    birthPlace: "Semarang",
    birthDate: "2008-09-03",
    parentName: "Sugeng Kartika",
    className: "XII MIPA 2",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    status: GraduationStatus.LULUS_BERSYARAT,
    grades: { "MAT": 75, "IND": 82, "ING": 75, "FIS": 68, "KIM": 70, "BIO": 72, "PAI": 80 }
  },
  {
    nisn: "0081234565",
    nis: "220105",
    name: "Eko Prasetyo",
    gender: "Laki-laki",
    birthPlace: "Medan",
    birthDate: "2007-11-20",
    parentName: "Hendra Prasetyo",
    className: "XII MIPA 2",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    status: GraduationStatus.TIDAK_LULUS,
    grades: { "MAT": 60, "IND": 70, "ING": 65, "FIS": 58, "KIM": 60, "BIO": 62, "PAI": 75 }
  }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Tata Cara Pengambilan Surat Keterangan Lulus (SKL)",
    content: "<p>Yth. Para Orang Tua / Wali Siswa Kelas XII,</p><p>Pengambilan dokumen fisik Surat Keterangan Lulus (SKL) resmi dapat dilakukan mulai tanggal <strong>8 Juni 2026</strong> di loket tata usaha sekolah sesuai jadwal kelas masing-masing. Harap membawa kartu ujian asli dan datang mengenakan pakaian formal rapi sopan.</p><p>Terima kasih atas kerja samanya.</p>",
    status: AnnouncementStatus.PUBLISH,
    createdAt: "2026-05-28T04:30:00Z",
    updatedAt: "2026-05-28T04:30:00Z"
  },
  {
    id: "2",
    title: "Informasi Pendaftaran Perguruan Tinggi Kelulusan Jalur UTBK",
    content: "<p>Bagi siswa-siswi yang dinyatakan lulus jalur seleksi nasional, dimohon segera melengkapi data konfirmasi pada portal masing-masing kampus sebelum <strong>15 Juni 2026</strong>. Jika memerlukan bantuan legalisir dokumen rapor atau surat keterangan pendamping, silakan hubungi tim Bimbingan Konseling (BK) di ruang utama.</p>",
    status: AnnouncementStatus.PUBLISH,
    createdAt: "2026-05-29T08:00:00Z",
    updatedAt: "2026-05-29T08:00:00Z"
  }
];

const DEFAULT_VERIFICATIONS: VerificationCode[] = [
  {
    code: "VER-0081234561-ABC",
    nisn: "0081234561",
    studentName: "Arief Budiman",
    schoolName: "SMP Islam Al Hikmah Mayong",
    isValid: true,
    createdAt: "2026-05-30T09:00:00Z"
  }
];

export class DbStore {
  private static cachedDb: DatabaseSchema | null = null;
  private static initialized = false;

  private static init() {
    if (this.initialized) return;
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const db: DatabaseSchema = {
        students: DEFAULT_STUDENTS,
        subjects: DEFAULT_SUBJECTS,
        announcements: DEFAULT_ANNOUNCEMENTS,
        settings: DEFAULT_SETTINGS,
        login_logs: [],
        users: DEFAULT_USERS,
        verification_codes: DEFAULT_VERIFICATIONS
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
      this.cachedDb = db;
    }
    this.initialized = true;
  }

  private static read(): DatabaseSchema {
    this.init();
    if (this.cachedDb) {
      return this.cachedDb;
    }
    try {
      const data = fs.readFileSync(DB_FILE, "utf8");
      this.cachedDb = JSON.parse(data);
      return this.cachedDb!;
    } catch (e) {
      console.error("Error reading database file", e);
      return {
        students: DEFAULT_STUDENTS,
        subjects: DEFAULT_SUBJECTS,
        announcements: DEFAULT_ANNOUNCEMENTS,
        settings: DEFAULT_SETTINGS,
        login_logs: [],
        users: DEFAULT_USERS,
        verification_codes: DEFAULT_VERIFICATIONS
      };
    }
  }

  private static write(db: DatabaseSchema) {
    this.init();
    this.cachedDb = db;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  }

  // Settings
  public static getSettings(): ApplicationSettings {
    const db = this.read();
    return {
      ...DEFAULT_SETTINGS,
      ...(db.settings || {})
    };
  }

  public static updateSettings(settings: ApplicationSettings): ApplicationSettings {
    const db = this.read();
    db.settings = { ...db.settings, ...settings };
    this.write(db);
    return db.settings;
  }

  // Students
  public static getStudents(): Student[] {
    const db = this.read();
    return db.students.map(s => ({
      ...s,
      parentName: s.parentName || ""
    }));
  }

  public static findStudent(nisn: string, name: string, birthDate: string): Student | null {
    const db = this.read();
    const cleanName = name.trim().toLowerCase();
    const found = db.students.find(s => 
      s.nisn === nisn && 
      s.name.trim().toLowerCase() === cleanName && 
      s.birthDate === birthDate
    );
    if (!found) return null;
    return {
      ...found,
      parentName: found.parentName || ""
    };
  }

  public static getStudent(nisn: string): Student | null {
    const db = this.read();
    const found = db.students.find(s => s.nisn === nisn);
    if (!found) return null;
    return {
      ...found,
      parentName: found.parentName || ""
    };
  }

  public static saveStudent(student: Student): Student {
    const db = this.read();
    const index = db.students.findIndex(s => s.nisn === student.nisn);
    if (index >= 0) {
      db.students[index] = student;
    } else {
      db.students.push(student);
    }
    this.write(db);
    return student;
  }

  public static deleteStudent(nisn: string): boolean {
    const db = this.read();
    const initialLength = db.students.length;
    db.students = db.students.filter(s => s.nisn !== nisn);
    if (db.students.length < initialLength) {
      this.write(db);
      return true;
    }
    return false;
  }

  public static importStudents(imported: Student[]): number {
    const db = this.read();
    let count = 0;
    for (const item of imported) {
      const index = db.students.findIndex(s => s.nisn === item.nisn);
      if (index >= 0) {
        db.students[index] = { ...db.students[index], ...item };
      } else {
        db.students.push(item);
      }
      count++;
    }
    this.write(db);
    return count;
  }

  // Subjects
  public static getSubjects(): Subject[] {
    const db = this.read();
    return db.subjects;
  }

  public static saveSubject(subj: Subject): Subject {
    const db = this.read();
    const index = db.subjects.findIndex(s => s.id === subj.id);
    if (index >= 0) {
      db.subjects[index] = subj;
    } else {
      db.subjects.push(subj);
    }
    this.write(db);
    return subj;
  }

  public static deleteSubject(id: string): boolean {
    const db = this.read();
    const initialLength = db.subjects.length;
    db.subjects = db.subjects.filter(s => s.id !== id);
    if (db.subjects.length < initialLength) {
      this.write(db);
      return true;
    }
    return false;
  }

  // Announcements
  public static getAnnouncements(): Announcement[] {
    const db = this.read();
    return db.announcements;
  }

  public static saveAnnouncement(ann: Announcement): Announcement {
    const db = this.read();
    const index = db.announcements.findIndex(a => a.id === ann.id);
    if (index >= 0) {
      db.announcements[index] = ann;
    } else {
      db.announcements.push(ann);
    }
    this.write(db);
    return ann;
  }

  public static deleteAnnouncement(id: string): boolean {
    const db = this.read();
    const initialLength = db.announcements.length;
    db.announcements = db.announcements.filter(a => a.id !== id);
    if (db.announcements.length < initialLength) {
      this.write(db);
      return true;
    }
    return false;
  }

  // Users
  public static getUsers(): User[] {
    const db = this.read();
    return db.users;
  }

  public static saveUser(user: User): User {
    const db = this.read();
    const index = db.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      db.users[index] = user;
    } else {
      db.users.push(user);
    }
    this.write(db);
    return user;
  }

  public static deleteUser(id: string): boolean {
    const db = this.read();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    if (db.users.length < initialLength) {
      this.write(db);
      return true;
    }
    return false;
  }

  // Logs
  public static getLoginLogs(): LoginLog[] {
    const db = this.read();
    return db.login_logs || [];
  }

  public static addLoginLog(log: Omit<LoginLog, "id">): LoginLog {
    const db = this.read();
    const newLog: LoginLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9)
    };
    if (!db.login_logs) db.login_logs = [];
    db.login_logs.unshift(newLog); // newest first
    // limit to 100 entries for efficiency
    if (db.login_logs.length > 100) {
      db.login_logs = db.login_logs.slice(0, 100);
    }
    this.write(db);
    return newLog;
  }

  // Verification codes
  public static getVerification(code: string): VerificationCode | null {
    const db = this.read();
    if (!db.verification_codes) db.verification_codes = [];
    return db.verification_codes.find(v => v.code === code) || null;
  }

  public static createVerification(nisn: string): VerificationCode {
    const db = this.read();
    const student = db.students.find(s => s.nisn === nisn);
    const code = `VER-${nisn}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const ver: VerificationCode = {
      code,
      nisn,
      studentName: student ? student.name : "Unknown",
      schoolName: db.settings?.schoolName || "SMP Islam Al Hikmah Mayong",
      isValid: true,
      createdAt: new Date().toISOString()
    };
    if (!db.verification_codes) db.verification_codes = [];
    db.verification_codes.push(ver);
    this.write(db);
    return ver;
  }

  // Backup and Restore
  public static getBackupJSON(): string {
    return JSON.stringify(this.read(), null, 2);
  }

  public static restoreBackup(backupContent: string): boolean {
    try {
      const parsed = JSON.parse(backupContent);
      if (
        parsed.students && 
        parsed.subjects && 
        parsed.settings && 
        parsed.users
      ) {
        this.write(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
