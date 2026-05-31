/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Student, 
  Subject, 
  Announcement, 
  ApplicationSettings, 
  LoginLog, 
  User, 
  GraduationStatus, 
  UserRole,
  AnnouncementStatus 
} from "./types";
import { 
  Building, 
  Search, 
  Lock, 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XOctagon, 
  BookOpen, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  Database, 
  RefreshCw, 
  ShieldAlert, 
  Megaphone, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Plus, 
  Edit2, 
  Trash2, 
  UserCheck, 
  Clock, 
  QrCode, 
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  ListFilter,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Countdown from "./components/Countdown";
import SklDocument from "./components/SklDocument";
import Confetti from "./components/Confetti";
import StudentDialog from "./components/StudentDialog";
import GradeDialog from "./components/GradeDialog";
import { FileText, Printer } from "lucide-react";

export default function App() {
  // Page Routing State
  // "/" | "/verifikasi/:code" | "/admin-login" | "/admin-dashboard"
  const [currentPath, setCurrentPath] = useState("/");
  const [verificationCodeParam, setVerificationCodeParam] = useState("");

  // Theme support: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem("app_theme") as 'light' | 'dark' | 'system') || 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const isDarkActive = theme === "system" ? systemIsDark : theme === "dark";

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem("app_theme", newTheme);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const body = document.body;
      if (isDarkActive) {
        root.classList.add("dark");
        body.classList.remove("bg-white", "bg-slate-50", "text-slate-800");
        body.classList.add("bg-slate-950", "text-slate-100");
      } else {
        root.classList.remove("dark");
        body.classList.remove("bg-slate-900", "bg-slate-950", "text-slate-100", "text-white");
        body.classList.add("bg-slate-50", "text-slate-800");
      }
    }
  }, [isDarkActive]);

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Global Settings and Announcements
  const [settings, setSettings] = useState<ApplicationSettings | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Public Query Form inputs
  const [searchNisn, setSearchNisn] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBirthDate, setSearchBirthDate] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResult, setSearchResult] = useState<{ student: Student; verificationCode: string } | null>(null);
  const [showGradSkl, setShowGradSkl] = useState(false);

  // Verification Page State
  const [verResult, setVerResult] = useState<{
    isValid: boolean;
    message: string;
    student: {
      nisn: string;
      nis: string;
      name: string;
      className: string;
      status: string;
    } | null;
  } | null>(null);
  const [verLoading, setVerLoading] = useState(false);

  // Admin Authentication State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [adminUser, setAdminUser] = useState<{ username: string; role: string; name: string } | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin Dashboard States
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "students" | "subjects" | "input-nilai" | "grades" | "skl" | "announcements" | "users" | "settings" | "logs">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // DB Data in Admin view
  const [adminStudents, setAdminStudents] = useState<Student[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<User[]>([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState<Announcement[]>([]);
  const [adminLogs, setAdminLogs] = useState<LoginLog[]>([]);

  // Data Actions/Modals States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importFeedback, setImportFeedback] = useState("");

  // Grade dialog/modal States
  const [selectedGradeStudent, setSelectedGradeStudent] = useState<Student | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [showGradesBulkImport, setShowGradesBulkImport] = useState(false);
  const [bulkGradesImportText, setBulkGradesImportText] = useState("");
  const [gradesImportFeedback, setGradesImportFeedback] = useState("");

  // Filters
  const [siswaSearchFilter, setSiswaSearchFilter] = useState("");
  const [siswaClassFilter, setSiswaClassFilter] = useState("");
  const [siswaStatusFilter, setSiswaStatusFilter] = useState("");

  const [gradesSearchFilter, setGradesSearchFilter] = useState("");
  const [gradesClassFilter, setGradesClassFilter] = useState("");

  const [inputNilaiSearchFilter, setInputNilaiSearchFilter] = useState("");
  const [inputNilaiClassFilter, setInputNilaiClassFilter] = useState("");

  // Manage Subjects forms
  const [newSubId, setNewSubId] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubKkm, setNewSubKkm] = useState(75);

  // Manage Announcements editor / generator helper
  const [annId, setAnnId] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annStatus, setAnnStatus] = useState<AnnouncementStatus>(AnnouncementStatus.DRAFT);
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Manage Users forms
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.OPERATOR);

  // App Settings forms
  const [formSchoolName, setFormSchoolName] = useState("");
  const [formSchoolLogo, setFormSchoolLogo] = useState("");
  const [formSchoolLogoRight, setFormSchoolLogoRight] = useState("");
  const [formWatermarkImage, setFormWatermarkImage] = useState("");
  const [formSklNumberTemplate, setFormSklNumberTemplate] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPrincipalName, setFormPrincipalName] = useState("");
  const [formPrincipalNip, setFormPrincipalNip] = useState("");
  const [formAcademicYear, setFormAcademicYear] = useState("");
  const [formSignatureImage, setFormSignatureImage] = useState("");
  const [formGradDate, setFormGradDate] = useState("");
  const [formGradTime, setFormGradTime] = useState("");
  const [formTemplateText, setFormTemplateText] = useState("");
  const [formBackgroundImage, setFormBackgroundImage] = useState("");
  const [restoreJsonText, setRestoreJsonText] = useState("");

  // Initialize and route parse
  useEffect(() => {
    // Parse Initial URL Router state
    const parseRoutes = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (pathname.startsWith("/verifikasi/")) {
        const code = pathname.replace("/verifikasi/", "");
        setCurrentPath(`/verifikasi/${code}`);
        setVerificationCodeParam(code);
      } else if (hash.startsWith("#/verifikasi/")) {
        const code = hash.replace("#/verifikasi/", "");
        setCurrentPath(`/verifikasi/${code}`);
        setVerificationCodeParam(code);
      } else if (pathname === "/admin-login" || hash === "#admin-login" || hash === "#/admin-login") {
        setCurrentPath("/admin-login");
      } else if (pathname === "/admin" || hash === "#admin" || hash === "#/admin" || pathname === "/admin-dashboard" || hash === "#/admin-dashboard") {
        if (localStorage.getItem("admin_token")) {
          setCurrentPath("/admin-dashboard");
        } else {
          setCurrentPath("/admin-login");
        }
      } else {
        setCurrentPath("/");
      }
    };

    parseRoutes();
    window.addEventListener("popstate", parseRoutes);
    window.addEventListener("hashchange", parseRoutes);

    // Initial API calls fetch
    fetchPublicData();
    if (adminToken) {
      verifyAdminToken(adminToken);
    }

    return () => {
      window.removeEventListener("popstate", parseRoutes);
      window.removeEventListener("hashchange", parseRoutes);
    };
  }, [adminToken]);

  // Protect admin dashboard from unauthenticated entry
  useEffect(() => {
    if (currentPath === "/admin-dashboard" && !adminUser && !adminToken) {
      setCurrentPath("/admin-login");
    }
  }, [currentPath, adminUser, adminToken]);

  // Dynamic tab favicon & document title synchronization
  useEffect(() => {
    if (settings) {
      if (settings.schoolName) {
        document.title = `E-Kelulusan | ${settings.schoolName}`;
      }
      const iconUrl = settings.schoolLogo || settings.schoolFavicon;
      if (iconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        link.href = iconUrl;
      }
    }
  }, [settings]);

  const fetchPublicData = async () => {
    try {
      const settingsRes = await fetch("/api/settings");
      const settingsData = await settingsRes.json();
      setSettings(settingsData);
      
      const announceRes = await fetch("/api/announcements");
      const announceData = await announceRes.json();
      setAnnouncements(announceData);

      const subjectsRes = await fetch("/api/subjects");
      const subjectsData = await subjectsRes.json();
      setSubjects(subjectsData);

      // Pre-populate settings form
      setFormSchoolName(settingsData.schoolName);
      setFormSchoolLogo(settingsData.schoolLogo);
      setFormSchoolLogoRight(settingsData.schoolLogoRight || "");
      setFormWatermarkImage(settingsData.watermarkImage || "");
      setFormSklNumberTemplate(settingsData.sklNumberTemplate || "");
      setFormAddress(settingsData.address);
      setFormEmail(settingsData.email);
      setFormPhone(settingsData.phone);
      setFormPrincipalName(settingsData.principalName);
      setFormPrincipalNip(settingsData.principalNip);
      setFormAcademicYear(settingsData.academicYear || "2025/2026");
      setFormSignatureImage(settingsData.signatureImage || "");
      setFormGradDate(settingsData.graduationDate);
      setFormGradTime(settingsData.graduationTime);
      setFormTemplateText(settingsData.announcementTemplate);
      setFormBackgroundImage(settingsData.backgroundImage || "");
    } catch (e) {
      console.error("Gagal mendapatkan konfigurasi dasar publik", e);
    }
  };

  const fetchAdminDashboardData = async () => {
    try {
      const headers = { "Authorization": `Bearer ${adminToken}` };
      
      const studentsRes = await fetch("/api/students", { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        if (Array.isArray(studentsData)) {
          setAdminStudents(studentsData);
        } else {
          console.error("Format data students salah, diharapkan array:", studentsData);
          setAdminStudents([]);
        }
      } else {
        setAdminStudents([]);
      }

      const usersRes = await fetch("/api/users", { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (Array.isArray(usersData)) {
          setAdminUsersList(usersData);
        } else {
          setAdminUsersList([]);
        }
      } else {
        setAdminUsersList([]);
      }

      const adminAnnounceRes = await fetch("/api/admin/announcements", { headers });
      if (adminAnnounceRes.ok) {
        const adminAnnounceData = await adminAnnounceRes.json();
        if (Array.isArray(adminAnnounceData)) {
          setAdminAnnouncements(adminAnnounceData);
        } else {
          setAdminAnnouncements([]);
        }
      } else {
        setAdminAnnouncements([]);
      }

      const logsRes = await fetch("/api/logs", { headers });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (Array.isArray(logsData)) {
          setAdminLogs(logsData);
        } else {
          setAdminLogs([]);
        }
      } else {
        setAdminLogs([]);
      }
    } catch (e) {
      console.error("Gagal memuat parameter data admin", e);
    }
  };

  const verifyAdminToken = async (token: string) => {
    try {
      const res = await fetch("/api/auth/verify", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.verified) {
        setAdminUser(data.user);
        fetchAdminDashboardData();
        setCurrentPath("/admin-dashboard");
      } else {
        localStorage.removeItem("admin_token");
        setAdminToken("");
      }
    } catch {
      localStorage.removeItem("admin_token");
      setAdminToken("");
    }
  };

  // Perform search kelulusan Query
  const handleGraduationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNisn.trim() || !searchName.trim() || !searchBirthDate) {
      setSearchError("Harap isi seluruh formulir data siswa dengan lengkap.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const res = await fetch("/api/grad-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nisn: searchNisn.trim(),
          name: searchName.trim(),
          birthDate: searchBirthDate
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Pencarian tidak membuahkan hasil");
      }

      setSearchResult(data);
    } catch (err: any) {
      setSearchError(err.message || "Siswa tidak ditemukan dalam pangkalan database.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Run Document Verification Action
  useEffect(() => {
    if (currentPath.startsWith("/verifikasi/") && verificationCodeParam) {
      const runVerify = async () => {
        setVerLoading(true);
        try {
          const res = await fetch(`/api/verifikasi/${verificationCodeParam}`);
          const data = await res.json();
          setVerResult(data);
        } catch {
          setVerResult({
            isValid: false,
            message: "Tidak dapat terhubung dengan validasi server.",
            student: null
          });
        } finally {
          setVerLoading(false);
        }
      };
      runVerify();
    }
  }, [currentPath, verificationCodeParam]);

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError("Masukkan kredensial login admin.");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk admin");
      }

      setAdminToken(data.token);
      setAdminUser({ username: loginUsername, role: data.role, name: data.name });
      if (rememberMe) {
        localStorage.setItem("admin_token", data.token);
      }
      fetchAdminDashboardData();
      setCurrentPath("/admin-dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Username atau sandi keliru.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
    } catch {}
    localStorage.removeItem("admin_token");
    setAdminToken("");
    setAdminUser(null);
    setCurrentPath("/admin-login");
  };

  // Students Dialog Callbacks
  const handleSaveStudent = async (student: Student) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(student)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan.");
      }

      await fetchAdminDashboardData();
      setIsStudentModalOpen(false);
      setSelectedStudent(null);
    } catch (e: any) {
      throw new Error(e.message || "Gagal menyimpan data.");
    }
  };

  const handleDeleteStudent = async (nisn: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data siswa ini? Semua leger nilai siswa terkait juga akan dihapus.")) return;

    try {
      const res = await fetch(`/api/students/${nisn}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });

      if (res.ok) {
        fetchAdminDashboardData();
      }
    } catch (e) {
      console.error("Gagal menghapus siswa", e);
    }
  };

  // Import Siswa logic parser (JSON array format or CSV parser)
  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) return;

    try {
      // Expect JSON structure or robustly compile values
      let parsedList: any[] = [];
      try {
        parsedList = JSON.parse(bulkImportText);
      } catch {
        // Fallback simple line-based csv parsing
        // FORMAT: nisn,nis,nama,jenis_kelamin,kelas,tempat_lahir,tanggal_lahir,status,link_foto
        const lines = bulkImportText.split("\n");
        parsedList = lines.map(line => {
          const parts = line.split(",");
          if (parts.length < 5) return null;
          return {
            nisn: parts[0]?.trim(),
            nis: parts[1]?.trim(),
            name: parts[2]?.trim(),
            gender: parts[3]?.trim() === "Perempuan" ? "Perempuan" : "Laki-laki",
            className: parts[4]?.trim() || "XII Rombe",
            birthPlace: parts[5]?.trim() || "Jakarta",
            birthDate: parts[6]?.trim() || "2008-01-01",
            status: (parts[7]?.trim() as GraduationStatus) || GraduationStatus.LULUS,
            photoUrl: parts[8]?.trim() || "",
            grades: {}
          };
        }).filter(Boolean);
      }

      if (parsedList.length === 0) {
        setImportFeedback("Format teks tidak dikenali atau baris kosong.");
        return;
      }

      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ students: parsedList })
      });

      const reply = await res.json();
      if (res.ok) {
        setImportFeedback(`Berhasil! ${reply.count} records diimport.`);
        fetchAdminDashboardData();
        setBulkImportText("");
      } else {
        setImportFeedback(`Error: ${reply.error}`);
      }
    } catch {
      setImportFeedback("Gagal memproses berkas data teks import.");
    }
  };

  // Bulk grades import processor (Dynamic matching of mapels headers)
  const handleGradesBulkImport = async () => {
    if (!bulkGradesImportText.trim()) return;

    try {
      const lines = bulkGradesImportText.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setGradesImportFeedback("CSV harus memiliki baris header dan minimal satu baris data.");
        return;
      }

      // First line contains headers: nisn, MAT, IND, ING...
      const headers = lines[0].split(",").map(h => h.trim().toUpperCase());
      const nisnIndex = headers.indexOf("NISN");

      if (nisnIndex === -1) {
        setGradesImportFeedback("Baris header CSV wajib berisi kolom 'nisn'!");
        return;
      }

      const updatedStudents: any[] = [];
      let successCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map(p => p.trim());
        if (parts.length < 2) continue;

        const nisnVal = parts[nisnIndex];
        if (!nisnVal) continue;

        // Find existing student in master database
        const existing = adminStudents.find(s => s.nisn === nisnVal);
        if (!existing) continue;

        const updatedGrades = { ...(existing.grades || {}) };
        headers.forEach((header, idx) => {
          if (idx !== nisnIndex && idx < parts.length) {
            const val = parseInt(parts[idx], 10);
            if (!isNaN(val)) {
              updatedGrades[header] = Math.max(0, Math.min(100, val));
            }
          }
        });

        updatedStudents.push({
          ...existing,
          grades: updatedGrades
        });
        successCount++;
      }

      if (updatedStudents.length === 0) {
        setGradesImportFeedback("Tidak ada NISN siswa cocok ditemukan dalam database saat ini.");
        return;
      }

      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ students: updatedStudents })
      });

      const reply = await res.json();
      if (res.ok) {
        setGradesImportFeedback(`Berhasil mengimpor transkrip nilai ${successCount} siswa.`);
        fetchAdminDashboardData();
        setBulkGradesImportText("");
      } else {
        setGradesImportFeedback(`Error: ${reply.error}`);
      }
    } catch {
      setGradesImportFeedback("Gagal memproses unggah data CSV nilai.");
    }
  };

  const handleSaveStudentGrades = async (student: Student) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(student)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan.");
      }

      await fetchAdminDashboardData();
    } catch (e: any) {
      throw new Error(e.message || "Gagal menyimpan data nilai.");
    }
  };

  // Manage Subjects
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubId.trim() || !newSubName.trim()) return;

    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: newSubId.trim().toUpperCase(),
          name: newSubName.trim(),
          kkm: newSubKkm
        })
      });

      if (res.ok) {
        setNewSubId("");
        setNewSubName("");
        setNewSubKkm(75);
        fetchPublicData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      if (res.ok) {
        fetchPublicData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manage Announcements (with optional AI Generation assistance!)
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      const payload: any = {
        title: annTitle.trim(),
        content: annContent,
        status: annStatus
      };
      if (annId) payload.id = annId;

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setAnnId("");
        setAnnTitle("");
        setAnnContent("");
        setAnnStatus(AnnouncementStatus.DRAFT);
        fetchAdminDashboardData();
        fetchPublicData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiWriterGenerate = async () => {
    if (!aiTopicInput.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          topic: aiTopicInput.trim(),
          tone: "formal-elegan"
        })
      });

      const reply = await res.json();
      if (res.ok && reply.content) {
        setAnnContent(reply.content);
        setAiTopicInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
      await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      fetchAdminDashboardData();
      fetchPublicData();
    } catch (e) {
      console.error(e);
    }
  };

  // Manage Users
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newName.trim()) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: newUsername.trim().toLowerCase(),
          name: newName.trim(),
          role: newUserRole
        })
      });

      if (res.ok) {
        setNewUsername("");
        setNewName("");
        setNewUserRole(UserRole.OPERATOR);
        fetchAdminDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Hapus akun pengguna admin ini?")) return;
    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminToken}` }
      });
      fetchAdminDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Application Settings Update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          schoolName: formSchoolName,
          schoolLogo: formSchoolLogo,
          schoolLogoRight: formSchoolLogoRight,
          watermarkImage: formWatermarkImage,
          sklNumberTemplate: formSklNumberTemplate,
          address: formAddress,
          email: formEmail,
          phone: formPhone,
          principalName: formPrincipalName,
          principalNip: formPrincipalNip,
          academicYear: formAcademicYear,
          signatureImage: formSignatureImage,
          graduationDate: formGradDate,
          graduationTime: formGradTime,
          announcementTemplate: formTemplateText,
          backgroundImage: formBackgroundImage
        })
      });

      if (res.ok) {
        alert("Konfigurasi sekolah sukses diupdate.");
        fetchPublicData();
      } else {
        const errReply = await res.json();
        alert(errReply.error || "Gagal mengupdate.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // DB Backup Operations
  const handleDownloadBackup = () => {
    window.open("/api/database/backup", "_blank");
  };

  const handleRestoreBackupSubmit = async () => {
    if (!restoreJsonText.trim()) return;
    try {
      const parsed = JSON.parse(restoreJsonText);
      const res = await fetch("/api/database/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ backup: parsed })
      });

      if (res.ok) {
        alert("Data pangkalan e-kelulusan berhasil direstore!");
        setRestoreJsonText("");
        fetchPublicData();
        fetchAdminDashboardData();
      } else {
        const reply = await res.json();
        alert(`Gagal: ${reply.error}`);
      }
    } catch {
      alert("Format teks backup tidak valid.");
    }
  };

  // CSV Export helper
  const handleExportStudentsCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "NISN,NIS,Nama,Jenis Kelamin,Kelas,Tempat Lahir,Tanggal Lahir,Status Kelulusan\n";
    
    adminStudents.forEach(s => {
      const row = [
        s.nisn,
        s.nis,
        `"${s.name}"`,
        s.gender,
        s.className,
        s.birthPlace,
        s.birthDate,
        s.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ekelulusan-siswa-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mass updating photo URLs helper
  const handleMassPhotoFillSeed = async () => {
    if (!confirm("Perbaharui foto siswa secara otomatis menggunakan placeholder model?")) return;
    
    const seededPhotos = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80"
    ];

    try {
      const updatedList = adminStudents.map((s, idx) => ({
        ...s,
        photoUrl: s.photoUrl || seededPhotos[idx % seededPhotos.length]
      }));

      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ students: updatedList })
      });

      if (res.ok) {
        fetchAdminDashboardData();
        alert("Foto siswa masa disesuaikan.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations for dashboard
  const totalSiswa = adminStudents.length;
  const totalLulus = adminStudents.filter(s => s.status === GraduationStatus.LULUS).length;
  const totalLulusBersyarat = adminStudents.filter(s => s.status === GraduationStatus.LULUS_BERSYARAT).length;
  const totalTidakLulus = adminStudents.filter(s => s.status === GraduationStatus.TIDAK_LULUS).length;
  const totalMapel = subjects.length;

  const filteredStudentsList = adminStudents.filter(s => {
    const sTerm = siswaSearchFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(sTerm) || s.nisn.includes(sTerm) || s.nis.includes(sTerm);
    const matchClass = !siswaClassFilter || s.className === siswaClassFilter;
    const matchStatus = !siswaStatusFilter || s.status === siswaStatusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const filteredGradesList = adminStudents.filter(s => {
    const sTerm = gradesSearchFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(sTerm) || s.nisn.includes(sTerm) || s.nis.includes(sTerm);
    const matchClass = !gradesClassFilter || s.className === gradesClassFilter;
    return matchSearch && matchClass;
  });

  const filteredInputNilaiList = adminStudents.filter(s => {
    const sTerm = inputNilaiSearchFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(sTerm) || s.nisn.includes(sTerm) || s.nis.includes(sTerm);
    const matchClass = !inputNilaiClassFilter || s.className === inputNilaiClassFilter;
    return matchSearch && matchClass;
  });

  // Get dynamic unique classes list for filter option drops
  const classFilterOptions = Array.from(new Set(adminStudents.map(s => s.className)));

  // If showing SKL print document full screen
  if (showGradSkl && searchResult) {
    return (
      <SklDocument
        student={searchResult.student}
        subjects={subjects}
        settings={settings || {
          schoolName: "SMP Islam Al Hikmah Mayong",
          schoolLogo: "",
          schoolFavicon: "",
          address: "",
          email: "",
          phone: "",
          footerText: "",
          graduationDate: "",
          graduationTime: "",
          academicYear: "2025/2026",
          principalName: "",
          principalNip: "",
          signatureImage: "",
          announcementTemplate: ""
        }}
        verificationCode={searchResult.verificationCode}
        onBack={() => setShowGradSkl(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkActive ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      
      {currentPath !== "/admin-dashboard" ? (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden overflow-y-auto font-sans transition-colors duration-350 z-0">
          {/* Beautiful Bright Academic Campus Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none z-0"
            style={{ 
              backgroundImage: settings?.backgroundImage ? `url("${settings.backgroundImage}")` : 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
              backgroundAttachment: "fixed"
            }}
          />

          {/* iOS Liquid Glass Ambient Drifting Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              animate={{
                x: [0, 80, -40, 0],
                y: [0, -100, 50, 0],
                scale: [1, 1.25, 0.85, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] mix-blend-screen"
            />
            <motion.div
              animate={{
                x: [0, -120, 60, 0],
                y: [0, 80, -120, 0],
                scale: [1, 0.9, 1.3, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-cyan-450/15 blur-[140px] mix-blend-screen"
            />
            <motion.div
              animate={{
                x: [0, 50, -50, 0],
                y: [0, 120, -60, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[110px] mix-blend-screen"
            />
          </div>
          
          {/* Translucent overlay masking to support light/dark theme content beautifully & keep text highly readable */}
          <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none z-0 ${
            isDarkActive 
              ? "bg-slate-950/85 backdrop-blur-[10px]" 
              : "bg-white/82 backdrop-blur-[12px]"
          }`} />

          {/* Subtle grid background backplane */}
          <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none transition-opacity duration-300 z-0 ${
            isDarkActive 
              ? "bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]" 
              : "bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]"
          }`} />

          {/* Top Header Navigation */}
          <header className={`fixed top-0 inset-x-0 z-50 px-6 py-4 border-b backdrop-blur-md transition-colors duration-300 ${
            isDarkActive ? "border-white/5 bg-slate-950/35" : "border-slate-200/80 bg-white/35 shadow-sm"
          }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setCurrentPath("/")}
              >
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5 rounded-2xl shadow-lg shadow-blue-500/10 flex items-center justify-center">
                  <div className={`h-full w-full rounded-[14px] flex items-center justify-center ${
                    isDarkActive ? "bg-slate-950" : "bg-white"
                  }`}>
                    <Award size={20} className="text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-sm font-black tracking-wider uppercase leading-none transition-colors duration-300 ${
                    isDarkActive ? "text-white" : "text-slate-900"
                  }`}>E-KELULUSAN</h1>
                  <p className={`text-[10px] leading-none mt-1 uppercase tracking-widest transition-colors duration-300 ${
                    isDarkActive ? "text-slate-400" : "text-slate-500"
                  }`}>Official Portal</p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                {/* Advanced Multi-state Theme Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                    className={`p-2.5 rounded-xl transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                      isDarkActive 
                        ? "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5 hover:border-white/10" 
                        : "bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200/80 shadow-sm"
                    }`}
                    title="Pilih Tema Tampilan"
                  >
                    {theme === "light" && <Sun size={15} className="text-amber-500" />}
                    {theme === "dark" && <Moon size={15} className="text-cyan-400" />}
                    {theme === "system" && <Laptop size={15} className="text-blue-500" />}
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                      {theme === "light" && "Terang"}
                      {theme === "dark" && "Gelap"}
                      {theme === "system" && "Sistem"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {themeMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setThemeMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute right-0 mt-2 w-40 rounded-2xl p-2 shadow-2xl z-50 border backdrop-blur-3xl focus:outline-none ${
                            isDarkActive 
                              ? "bg-slate-900/95 border-white/10 shadow-black/45 text-slate-200" 
                              : "bg-white/95 border-slate-250 shadow-slate-300/40 text-slate-800"
                          }`}
                        >
                          <div className={`px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest border-b mb-1 ${
                            isDarkActive ? "text-slate-550 border-white/5" : "text-slate-400 border-slate-100"
                          }`}>
                            Pilihan Tema
                          </div>
                          
                          <button
                            onClick={() => {
                              handleThemeChange("light");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "light"
                                ? isDarkActive ? "bg-white/10 text-white font-bold" : "bg-slate-100 text-slate-950 font-semibold"
                                : isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-250" : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
                            }`}
                          >
                            <Sun size={14} className={theme === "light" ? "text-amber-500" : ""} />
                            <span>Terang</span>
                            {theme === "light" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>

                          <button
                            onClick={() => {
                              handleThemeChange("dark");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "dark"
                                ? isDarkActive ? "bg-white/10 text-white font-bold" : "bg-slate-100 text-slate-950 font-semibold"
                                : isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-255" : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
                            }`}
                          >
                            <Moon size={14} className={theme === "dark" ? "text-cyan-400" : ""} />
                            <span>Gelap</span>
                            {theme === "dark" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>

                          <button
                            onClick={() => {
                              handleThemeChange("system");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "system"
                                ? isDarkActive ? "bg-white/10 text-white font-bold" : "bg-slate-100 text-slate-950 font-semibold"
                                : isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-260" : "hover:bg-slate-50 text-slate-600 hover:text-slate-955"
                            }`}
                          >
                            <Laptop size={14} className={theme === "system" ? "text-blue-500" : ""} />
                            <span>Sistem</span>
                            {theme === "system" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <a 
                  href="#admin" 
                  onClick={(e) => { e.preventDefault(); setCurrentPath("/admin-login"); }}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md ${
                    isDarkActive 
                      ? "text-slate-300 hover:text-white bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-slate-950 border border-white/10 shadow-black/20" 
                      : "text-slate-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-slate-950 border border-slate-200 hover:border-transparent shadow-slate-200/50"
                  }`}
                >
                  <Lock size={12} />
                  <span>Portal Admin</span>
                </a>
              </div>
            </div>
          </header>

          <div className="flex-grow z-10 w-full flex flex-col justify-between">
            {currentPath === "/" && (
              <main className="flex-grow z-10 max-w-5xl w-full mx-auto px-4 pt-24 pb-20 md:pt-28 md:pb-24 flex flex-col gap-10">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left Column: Title, School Name, Announcement Text & Countdown Counter */}
              <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2 border px-3.5 py-1 rounded-full text-[11px] font-bold ${
                    isDarkActive 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-blue-50 border-blue-200/60 text-blue-600"
                  }`}>
                    <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                    <span>TAHUN PELAJARAN {settings?.academicYear || "2025/2026"}</span>
                  </div>
                  
                  <h2 className={`text-4xl md:text-5xl font-black tracking-tight leading-none uppercase block ${
                    isDarkActive ? "text-white" : "text-slate-900"
                  }`}>
                    PENGUMUMAN KELULUSAN
                  </h2>
                  
                  <h3 className={`text-xl md:text-2xl font-bold bg-clip-text text-transparent leading-snug bg-gradient-to-br transition-colors duration-300 ${
                    isDarkActive ? "from-blue-400 via-cyan-400 to-indigo-400" : "from-blue-600 via-cyan-500 to-indigo-600"
                  }`}>
                    {settings?.schoolName || "SMA NEGERI 1 JAKARTA"}
                  </h3>
                  
                  <p className={`text-xs md:text-sm font-light leading-relaxed max-w-xl ${
                    isDarkActive ? "text-slate-300" : "text-slate-600"
                  }`}>
                    Sistem Informasi Kelulusan Elektronik resmi. Masukkan Nomor Induk Siswa Nasional (NISN), Nama Lengkap, dan Tanggal Lahir Anda sesuai dokumen pangkalan sekolah untuk menilik Surat Keterangan Kelulusan (SKL) digital Anda.
                  </p>
                </div>

                {/* 2. Countdown Timer Display */}
                {settings && (
                  <div className="w-full flex justify-center md:justify-start py-2">
                    <Countdown 
                      targetDate={settings.graduationDate} 
                      targetTime={settings.graduationTime} 
                      isDark={isDarkActive}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Search Form OR Search Result Card */}
              <div className="md:col-span-5 flex flex-col items-center md:items-stretch justify-center w-full max-w-sm mx-auto">
                <div className="w-full z-10">
                  <AnimatePresence mode="wait">
                    {!searchResult ? (
                      // Search Form
                      <motion.div
                        key="search-form"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        className={`p-5 md:p-6 rounded-[24px] backdrop-blur-3xl shadow-xl flex flex-col justify-between group transition-all duration-300 border ${
                          isDarkActive 
                            ? "bg-slate-900/60 border-white/10 hover:border-white/15" 
                            : "bg-white/95 border-slate-200/80 shadow-md shadow-slate-200/40 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-left">
                          <div className={`border-b pb-3 mb-4 text-center ${
                            isDarkActive ? "border-white/5" : "border-slate-100"
                          }`}>
                            <h3 className={`text-sm font-bold flex items-center justify-center gap-2 ${
                              isDarkActive ? "text-white" : "text-slate-900"
                            }`}>
                              <Search size={16} className="text-blue-500 animate-pulse" />
                              <span>Pencarian Data Kelulusan</span>
                            </h3>
                            <p className={`text-[11px] mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                              Masukkan kredensial dengan benar sesuai data Dapodik.
                            </p>
                          </div>

                          {searchError && (
                            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2.5 animate-shake font-medium">
                              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-rose-550" />
                              <span>{searchError}</span>
                            </div>
                          )}

                          <form onSubmit={handleGraduationSearch} className="space-y-3.5">
                            <div>
                              <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                                isDarkActive ? "text-slate-400" : "text-slate-600"
                              }`}>Nomor NISN *</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  maxLength={10}
                                  required
                                  placeholder="10 digit NISN Anda"
                                  className={`w-full border focus:border-blue-500/50 rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all font-mono ${
                                    isDarkActive
                                      ? "bg-slate-950/60 border-white/10 text-white"
                                      : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                                  }`}
                                  value={searchNisn}
                                  onChange={e => setSearchNisn(e.target.value.replace(/\D/g, ""))}
                                />
                                <Award size={15} className="absolute left-3.5 top-3 text-slate-500" />
                              </div>
                            </div>

                            <div>
                              <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                                isDarkActive ? "text-slate-400" : "text-slate-600"
                              }`}>Nama Lengkap *</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama lengkap sesuai ijazah"
                                  className={`w-full border focus:border-blue-500/50 rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all capitalize ${
                                    isDarkActive
                                      ? "bg-slate-950/60 border-white/10 text-white"
                                      : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white animate-none"
                                  }`}
                                  value={searchName}
                                  onChange={e => setSearchName(e.target.value)}
                                />
                                <Users size={15} className="absolute left-3.5 top-3 text-slate-500" />
                              </div>
                            </div>

                            <div>
                              <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                                isDarkActive ? "text-slate-400" : "text-slate-600"
                              }`}>Tanggal Lahir *</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  required
                                  className={`w-full border focus:border-blue-500/50 rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all font-sans ${
                                    isDarkActive
                                      ? "bg-slate-950/60 border-white/10 text-white scheme-dark"
                                      : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white scheme-light"
                                  }`}
                                  value={searchBirthDate}
                                  onChange={e => setSearchBirthDate(e.target.value)}
                                />
                                <Clock size={15} className="absolute left-3.5 top-3 text-slate-500" />
                              </div>
                            </div>

                            <div className="pt-1.5">
                              <button
                                type="submit"
                                disabled={searchLoading}
                                className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-505 hover:opacity-95 py-2.5 rounded-xl font-bold text-xs text-slate-950 tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/5 cursor-pointer"
                              >
                                {searchLoading ? (
                                  <>
                                    <RefreshCw className="animate-spin text-slate-950" size={14} />
                                    <span>MENGHUBUNGKAN...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>LIHAT HASIL EVALUASI</span>
                                    <ArrowRight size={14} />
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    ) : (
                      // Search Result box
                      <motion.div
                        key="search-result"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        className={`p-5 md:p-6 rounded-[24px] backdrop-blur-3xl shadow-xl flex flex-col items-center justify-between space-y-5 transition-all duration-300 border ${
                          isDarkActive 
                            ? "bg-slate-900/60 border-white/10 hover:border-white/15" 
                            : "bg-white/95 border-slate-200/80 shadow-md shadow-slate-200/40 hover:border-slate-350"
                        }`}
                      >
                        {/* CONFETTI TRIGGER ON LULUS */}
                        {(searchResult.student.status === "Lulus" || searchResult.student.status === "Lulus Bersyarat") && (
                          <Confetti />
                        )}

                        {/* Result Profile Avatar Header */}
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="relative">
                            <div className={`w-20 h-20 rounded-full overflow-hidden border-2 shadow-lg flex items-center justify-center relative ${
                              isDarkActive ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"
                            }`}>
                              {searchResult.student.photoUrl ? (
                                <img 
                                  src={searchResult.student.photoUrl} 
                                  alt="Foto Profil Siswa" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-500">
                                  {searchResult.student.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            
                            {/* Status Stamp */}
                            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-md ${
                              searchResult.student.status === "Lulus" 
                                ? "bg-emerald-500 text-white" 
                                : searchResult.student.status === "Lulus Bersyarat" 
                                ? "bg-amber-500 text-slate-950" 
                                : "bg-rose-500 text-white"
                            }`}>
                              {searchResult.student.status === "Lulus" && <CheckCircle size={14} />}
                              {searchResult.student.status === "Lulus Bersyarat" && <AlertTriangle size={14} />}
                              {searchResult.student.status === "Tidak Lulus" && <XOctagon size={14} />}
                            </div>
                          </div>

                          <div>
                            <h4 className={`text-lg font-black capitalize tracking-tight ${
                              isDarkActive ? "text-white" : "text-slate-900"
                            }`}>{searchResult.student.name}</h4>
                            <p className={`text-[10px] font-mono mt-0.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>NISN: {searchResult.student.nisn} | Kelas: {searchResult.student.className}</p>
                          </div>
                        </div>

                        {/* Result Statement Wrapper Card */}
                        <div className={`w-full border rounded-xl p-4 text-center space-y-1 relative overflow-hidden ${
                          isDarkActive ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"
                        }`}>
                          <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">KEPUTUSAN KELULUSAN:</span>
                          
                          {searchResult.student.status === "Lulus" && (
                            <div className={`${isDarkActive ? "text-emerald-400" : "text-emerald-600"} space-y-1`}>
                              <h2 className="text-xl font-black tracking-wider animate-pulse">SELAMAT!</h2>
                              <p className={`text-[11px] font-light max-w-sm mx-auto leading-relaxed ${isDarkActive ? "text-slate-300" : "text-slate-600"}`}>
                                Anda dinyatakan LULUS SEPENUHNYA dari satuan pendidikan tahun pelajaran {settings?.academicYear || "2025/2026"}.
                              </p>
                            </div>
                          )}

                          {searchResult.student.status === "Lulus Bersyarat" && (
                            <div className={`${isDarkActive ? "text-amber-400" : "text-amber-600"} space-y-1`}>
                              <h2 className="text-lg font-extrabold tracking-wider">LULUS BERSYARAT</h2>
                              <p className={`text-[11px] font-light max-w-sm mx-auto leading-relaxed ${isDarkActive ? "text-slate-300" : "text-slate-600"}`}>
                                Anda dinyatakan LULUS BERSYARAT. Verifikasi kriteria khusus atau administrasi diperlukan.
                              </p>
                            </div>
                          )}

                          {searchResult.student.status === "Tidak Lulus" && (
                            <div className={`${isDarkActive ? "text-rose-400" : "text-rose-600"} space-y-1`}>
                              <h2 className="text-lg font-extrabold tracking-wider">BELUM LULUS</h2>
                              <p className={`text-[11px] font-light max-w-sm mx-auto leading-relaxed ${isDarkActive ? "text-slate-300" : "text-slate-600"}`}>
                                Anda dinyatakan BELUM LULUS. Mohon segera berkonsultasi mengenai evaluasi perbaikan.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons (Preview SKL if passed) */}
                        <div className="w-full flex flex-col gap-2">
                          {searchResult.student.status !== "Tidak Lulus" && (
                            <button
                              onClick={() => setShowGradSkl(true)}
                              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 shadow-md shadow-emerald-500/10 hover:scale-[1.01]"
                            >
                              <Award size={14} />
                              <span>CETAK SURAT KELULUSAN (SKL)</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSearchResult(null)}
                            className={`w-full py-2 px-3 outline-none rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                              isDarkActive 
                                ? "bg-slate-950 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white" 
                                : "bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Cari Siswa Lain
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Minimalist verification indicator below search card */}
                <div className={`inline-flex items-center justify-center gap-2 mt-4 text-[10px] font-mono transition-colors duration-300 leading-none ${
                  isDarkActive ? "text-slate-500" : "text-slate-400"
                }`}>
                  <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                  <span>Sistem Terverifikasi & Aman</span>
                </div>
              </div>

            </div>

            {/* Tightened & Smaller School Announcements Section */}
            {announcements.length > 0 && (
              <div className={`w-full max-w-5xl space-y-3.5 border-t pt-6 mt-4 z-10 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                    <Megaphone size={12} className="text-blue-550" />
                    <span>Pengumuman Sekolah</span>
                  </h3>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    isDarkActive ? "text-slate-500 bg-white/5 border-white/5" : "text-slate-500 bg-slate-100 border-slate-200"
                  }`}>{announcements.length} Kiriman</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {announcements.map((ann) => (
                    <div 
                      key={ann.id} 
                      className={`p-3.5 rounded-xl border backdrop-blur-3xl space-y-1.5 text-left group transition-all duration-300 ${
                        isDarkActive 
                          ? "bg-slate-900/40 border-white/5 hover:border-white/10 text-white" 
                          : "bg-white border-slate-200 shadow-sm hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className={`flex items-center justify-between border-b pb-1 text-[8.5px] font-mono ${
                        isDarkActive ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"
                      }`}>
                        <span className="flex items-center gap-1">
                          <Clock size={9} className="text-cyan-550" />
                          {new Date(ann.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                        </span>
                        <span className="text-indigo-500 font-bold tracking-wider">RESMI</span>
                      </div>
                      <h4 className={`font-bold text-[11px] leading-snug group-hover:text-blue-550 transition-all line-clamp-1 ${
                        isDarkActive ? "text-white" : "text-slate-900"
                      }`}>{ann.title}</h4>
                      <div 
                        className={`text-[10px] font-light leading-relaxed max-h-12 overflow-y-auto pr-1 ${
                          isDarkActive ? "text-slate-400" : "text-slate-550"
                        }`}
                        dangerouslySetInnerHTML={{ __html: ann.content }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* QR VERIFICATION ROUTE VIEW */}
        {/* --------------------------------------------------------------------------------- */}
        {currentPath.startsWith("/verifikasi/") && (
          <div className="flex-grow z-10 w-full flex items-center justify-center px-4 pt-24 pb-20 md:pt-28 md:pb-24">
            <div className={`w-full max-w-md p-6 rounded-2xl border backdrop-blur-xl shadow-glass text-center space-y-6 ${
              isDarkActive ? "bg-slate-900/40 border-white/10 text-slate-100" : "bg-white/60 border-slate-200 text-slate-800"
            }`}>
              <div className="flex justify-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center border ${
                  isDarkActive ? "bg-white/5 border-white/15" : "bg-slate-100 border-slate-200"
                }`}>
                  <QrCode size={32} className="text-blue-500 dark:text-purple-400" />
                </div>
              </div>

              {verLoading ? (
                <div className="py-8 space-y-3 font-semibold">
                  <RefreshCw size={24} className="text-blue-500 dark:text-purple-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Memeriksa kunci siber surat kelulusan...</p>
                </div>
              ) : verResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-black tracking-tight ${verResult.isValid ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {verResult.isValid ? "DOKUMEN VALID & RESMI" : "DOKUMEN TIDAK VALID / PALSU"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{verResult.message}</p>
                  </div>

                  {verResult.isValid && verResult.student && (
                    <div className={`p-4 rounded-xl border space-y-3 text-left ${
                      isDarkActive ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50/50"
                    }`}>
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-purple-400">Metadata Siswa:</span>
                      <div className="space-y-1.5 text-xs font-mono">
                        <p><span className="text-slate-500">Nama :</span> <span className="font-sans font-bold capitalize">{verResult.student.name}</span></p>
                        <p><span className="text-slate-500">NISN :</span> {verResult.student.nisn}</p>
                        <p><span className="text-slate-500">NIS  :</span> {verResult.student.nis}</p>
                        <p><span className="text-slate-500">Kelas:</span> {verResult.student.className}</p>
                        <p><span className="text-slate-500">Status:</span> <span className={`font-sans font-bold ${verResult.student.status === "Lulus" ? 'text-emerald-500 dark:text-emerald-400': 'text-rose-550'}`}>{verResult.student.status}</span></p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentPath("/")}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        isDarkActive 
                          ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" 
                          : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
                      }`}
                    >
                      Kembali Ke Portal Utama
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-xs font-semibold">Gagal melakukan verifikasi.</p>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* ADMIN PORTAL LOGIN */}
        {/* --------------------------------------------------------------------------------- */}
        {currentPath === "/admin-login" && (
          <div className="flex-grow z-10 w-full flex items-center justify-center px-4 pt-24 pb-20 md:pt-28 md:pb-24">
            <div className={`w-full max-w-sm p-6 md:p-8 rounded-2xl border backdrop-blur-xl shadow-glass space-y-6 ${
              isDarkActive ? "bg-slate-900/40 border-white/10 text-slate-100" : "bg-white/60 border-slate-200 text-slate-800"
            }`}>
              <div className="text-center space-y-2">
                <div className={`inline-flex h-12 w-12 rounded-full items-center justify-center border mb-2 ${
                  isDarkActive ? "bg-white/5 border-white/15" : "bg-slate-100 border-slate-200"
                }`}>
                  <Lock size={20} className="text-blue-500 dark:text-cyan-400" />
                </div>
                <h2 className="text-lg font-black tracking-tight">LOGIN PANEL ADMIN</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gunakan kredensial yang disiapkan oleh sistem.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs rounded-xl flex items-start gap-1.5 font-semibold">
                  <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-1.5">Username Admin</label>
                  <input
                    type="text"
                    required
                    placeholder="admin atau operator"
                    className={`w-full rounded-xl px-3 py-2 text-sm focus:outline-none transition font-sans border ${
                      isDarkActive 
                        ? "bg-slate-950 border-white/10 focus:border-cyan-500/50 text-white" 
                        : "bg-white border-slate-200 focus:border-blue-500/50 text-slate-800 shadow-inner"
                    }`}
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-1.5">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan password..."
                      className={`w-full rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none transition font-sans border ${
                        isDarkActive 
                          ? "bg-slate-950 border-white/10 focus:border-cyan-500/50 text-white" 
                          : "bg-white border-slate-200 focus:border-blue-500/50 text-slate-800 shadow-inner"
                      }`}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 dark:border-white/10 text-cyan-500 focus:ring-0 cursor-pointer"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span>Ingat login saya</span>
                  </label>
                  <span className="hover:text-blue-500 dark:hover:text-cyan-400 transition cursor-help font-medium" title="Password default: Luthfi -> lthf23, operator -> operator123">Bantuan Akun?</span>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 py-2.5 rounded-xl font-bold text-sm text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>MEMERIKSA DATA AUTH...</span>
                    </>
                  ) : (
                    <span>MASUK SEKARANG</span>
                  )}
                </button>
              </form>

              <button
                onClick={() => setCurrentPath("/")}
                className={`w-full border py-2 rounded-xl text-xs font-semibold transition ${
                  isDarkActive 
                    ? "border-white/5 hover:bg-white/5 text-slate-400 hover:text-white" 
                    : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                }`}
              >
                Kembali Ke Portal Depan
              </button>
            </div>
          </div>
        )}

        {/* Elegant Bento Footer - Floating Fixed Bottom */}
        <footer className={`fixed bottom-0 inset-x-0 py-2.5 px-6 border-t text-center z-40 transition-colors duration-300 backdrop-blur-md ${
          isDarkActive 
            ? "bg-slate-950/40 border-white/5 text-slate-400" 
            : "bg-white/40 border-slate-200 text-slate-600 shadow-sm"
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 text-[11px] leading-tight">
            <div className="text-center md:text-left">
              <span className={`font-bold uppercase tracking-wide mr-2 ${isDarkActive ? "text-slate-300" : "text-slate-700"}`}>
                {settings?.schoolName || "SMP Islam Al Hikmah Mayong"}
              </span>
              <span className={`hidden md:inline text-[10px] ${isDarkActive ? "text-slate-500" : "text-slate-400"}`}>
                {settings?.address}
              </span>
            </div>
            <div className="text-center md:text-right flex flex-wrap justify-center md:justify-end items-center gap-x-2 gap-y-0.5">
              <p className="m-0 text-[11px] leading-none">
                Powered by <a href="https://educita.id" target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-500 dark:text-cyan-400 font-bold cursor-pointer">educita.id</a> -- <span className="font-extrabold bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">Muhammad Luthfi</span> v2026
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  ) : null}

      {/* --------------------------------------------------------------------------------- */}
      {/* ADMIN MAIN DASHBOARD SYSTEM */}
      {/* --------------------------------------------------------------------------------- */}
      {currentPath === "/admin-dashboard" && adminUser && (
        <div className="min-h-screen flex">
          
          {/* Sidebar Section */}
          <aside className={`no-print border-r z-20 transition-all duration-300 w-64 flex flex-col justify-between ${
            isDarkActive ? "border-white/10 bg-slate-950" : "border-slate-200 bg-white"
          } ${sidebarOpen ? 'relative' : 'hidden'}`}>
            <div className="flex-grow">
              {/* Sidebar Header Title Crest */}
              <div className={`p-4 flex items-center gap-2 border-b ${
                isDarkActive ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
              }`}>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center">
                  <LayoutDashboard size={16} className={isDarkActive ? "text-slate-950" : "text-white"} />
                </div>
                <div>
                  <h3 className={`text-xs font-extrabold leading-none ${isDarkActive ? "text-white" : "text-slate-800"}`}>E-KELULUSAN</h3>
                  <p className={`text-[9px] mt-1 font-mono tracking-widest ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>{adminUser.role.toUpperCase()}</p>
                </div>
              </div>

              {/* Sidebar Nav Links */}
              <nav className="p-3 space-y-1">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "students", label: "Data Siswa", icon: Users },
                  { id: "subjects", label: "Mata Pelajaran", icon: BookOpen },
                  { id: "input-nilai", label: "Input Nilai", icon: Edit2 },
                  { id: "grades", label: "Leger Nilai (Grades)", icon: TrendingUp },
                  { id: "skl", label: "Form SKL", icon: FileText },
                  { id: "announcements", label: "Pengumuman", icon: Megaphone },
                  ...(adminUser.role === UserRole.SUPER_ADMIN ? [
                    { id: "users", label: "Manajemen User", icon: UserCheck },
                    { id: "settings", label: "Setting Aplikasi", icon: SettingsIcon }
                  ] : []),
                  { id: "logs", label: "Aktivitas Login", icon: Clock }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeAdminTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveAdminTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                        isActive 
                          ? (isDarkActive 
                              ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-l-4 border-cyan-500 text-white" 
                              : "bg-blue-50 border-l-4 border-blue-600 text-blue-600 font-bold") 
                          : (isDarkActive 
                              ? "text-slate-400 hover:bg-white/5 hover:text-white" 
                              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900")
                      }`}
                    >
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout footer of sidebar */}
            <div className={`p-3 border-t font-sans space-y-3 ${
              isDarkActive ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs capitalize">
                  {adminUser.username.charAt(0)}
                </div>
                <div className="truncate">
                  <p className={`text-[11px] font-bold leading-tight ${isDarkActive ? "text-white" : "text-slate-800"}`}>{adminUser.name}</p>
                  <p className={`text-[9px] tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Online</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isDarkActive 
                    ? "bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border-rose-500/20" 
                    : "bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border-rose-200"
                }`}
              >
                <LogOut size={12} />
                <span>LOGOUT SYSTEM</span>
              </button>
            </div>
          </aside>

          {/* Main workspace platform right */}
          <main className={`flex-grow flex flex-col justify-between overflow-x-hidden min-h-screen ${
            isDarkActive ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
          }`}>
            {/* Platform Topbar */}
            <header className={`no-print border-b p-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md transition-colors duration-300 ${
              isDarkActive ? "bg-slate-950/45 border-white/10 text-white" : "bg-white/45 border-slate-200 text-slate-800 shadow-sm"
            }`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-1.5 rounded-lg transition ${
                    isDarkActive ? "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <Menu size={18} />
                </button>
                <div className={`hidden sm:flex items-center gap-2 border rounded-xl px-2 py-1 text-[11px] font-mono ${
                  isDarkActive ? "bg-slate-900 border-white/10 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                }`}>
                  <Building size={12} className="text-blue-500" />
                  <span>{settings?.schoolName || "Pangkalan e-Kelulusan"}</span>
                </div>
              </div>

              {/* Status information right topbar */}
              <div className="flex items-center gap-4">
                {/* Theme Selector directly in Admin Header */}
                <div className="relative">
                  <button
                    onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                    className={`p-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      isDarkActive ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                    title="Pilih Tema Tampilan"
                  >
                    {theme === "light" && <Sun size={14} className="text-amber-500" />}
                    {theme === "dark" && <Moon size={14} className="text-cyan-400" />}
                    {theme === "system" && <Laptop size={14} className="text-blue-500" />}
                  </button>

                  <AnimatePresence>
                    {themeMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setThemeMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute right-0 mt-2 w-40 rounded-2xl p-2 border shadow-2xl z-50 backdrop-blur-3xl ${
                            isDarkActive ? "bg-slate-900 border-white/10 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className={`px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest border-b mb-1 ${
                            isDarkActive ? "text-slate-500 border-white/5" : "text-slate-400 border-slate-100"
                          }`}>
                            Pilihan Tema
                          </div>
                          
                          <button
                            onClick={() => {
                              handleThemeChange("light");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "light" 
                                ? (isDarkActive ? "bg-white/10 text-white font-bold" : "bg-blue-50 text-blue-600 font-bold") 
                                : (isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-200" : "hover:bg-slate-50 text-slate-500 hover:text-slate-805")
                            }`}
                          >
                            <Sun size={14} className={theme === "light" ? "text-amber-500" : ""} />
                            <span>Terang</span>
                            {theme === "light" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>

                          <button
                            onClick={() => {
                              handleThemeChange("dark");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "dark" 
                                ? (isDarkActive ? "bg-white/10 text-white font-bold" : "bg-blue-50 text-blue-600 font-bold") 
                                : (isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-200" : "hover:bg-slate-50 text-slate-500 hover:text-slate-805")
                            }`}
                          >
                            <Moon size={14} className={theme === "dark" ? "text-cyan-400" : ""} />
                            <span>Gelap</span>
                            {theme === "dark" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>

                          <button
                            onClick={() => {
                              handleThemeChange("system");
                              setThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                              theme === "system" 
                                ? (isDarkActive ? "bg-white/10 text-white font-bold" : "bg-blue-50 text-blue-600 font-bold") 
                                : (isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-200" : "hover:bg-slate-50 text-slate-500 hover:text-slate-805")
                            }`}
                          >
                            <Laptop size={14} className={theme === "system" ? "text-blue-500" : ""} />
                            <span>Sistem</span>
                            {theme === "system" && <span className="ml-auto text-emerald-500 text-[10px]">●</span>}
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={fetchAdminDashboardData}
                  className={`p-1.5 rounded-lg transition ${
                    isDarkActive ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                  title="Reload DB Data"
                >
                  <RefreshCw size={14} className="hover:rotate-180 transition duration-500" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className={`text-[10px] font-mono font-medium lowercase ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                    {adminUser.role === UserRole.SUPER_ADMIN ? 'super_admin' : 'operator'}
                  </span>
                </div>
              </div>
            </header>

            {/* Dashboard Sub-layouts workspace */}
            <div className="p-4 md:p-8 flex-grow space-y-8 max-w-7xl w-full mx-auto">
              
               {/* 1. DASHBOARD OVERVIEW TAB */}
              {activeAdminTab === "dashboard" && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Dashboard Monitoring Akademik</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Sapaan hangat, {adminUser.name}. Berikut ringkasan parameter siswa hari ini.</p>
                  </div>

                  {/* Gradient stats widgets (AdminLTE style) */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: "Total Siswa", value: totalSiswa, color: "from-blue-600 to-indigo-600", desc: "Siswa Terdaftar" },
                      { label: "Siswa Lulus", value: totalLulus, color: "from-emerald-600 to-teal-600", desc: `(${(totalLulus / (totalSiswa || 1) * 100).toFixed(1)}%)` },
                      { label: "Lulus Bersyarat", value: totalLulusBersyarat, color: "from-amber-600 to-orange-600", desc: `(${(totalLulusBersyarat / (totalSiswa || 1) * 100).toFixed(1)}%)` },
                      { label: "Belum Lulus", value: totalTidakLulus, color: "from-rose-600 to-red-600", desc: `(${(totalTidakLulus / (totalSiswa || 1) * 100).toFixed(1)}%)` },
                      { label: "Mata Pelajaran", value: totalMapel, color: "from-purple-600 to-pink-600", desc: "KKM Aktif" }
                    ].map((c, i) => (
                      <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg relative overflow-hidden group`}>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-3 translate-y-3 group-hover:scale-125 transition-transform">
                          <LayoutDashboard size={96} />
                        </div>
                        <span className="block text-[10px] text-white/75 font-semibold uppercase tracking-wider">{c.label}</span>
                        <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{c.value}</h3>
                        <p className="text-[10px] text-white/95 mt-1 font-light">{c.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* SVG visualizations for gender ratios & passing classes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visualizer card 1: Gender split */}
                    <div className={`p-5 rounded-2xl space-y-4 border ${isDarkActive ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Rasio Kelulusan Berdasarkan Hasil</h3>
                      <div className="flex items-center gap-6 py-6 font-mono">
                        {/* Circular progress representations as direct responsive inline SVG charts */}
                        <div className="relative w-32 h-32 flex-shrink-0 mx-auto">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke={isDarkActive ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="12" />
                            <circle 
                              cx="64" 
                              cy="64" 
                              r="50" 
                              fill="transparent" 
                              stroke="#10B981" 
                              strokeWidth="12" 
                              strokeDasharray="314"
                              strokeDashoffset={314 - (314 * (totalLulus / (totalSiswa || 1)))}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                            <span className={`text-xl font-extrabold ${isDarkActive ? "text-white" : "text-slate-800"}`}>{(totalLulus / (totalSiswa || 1) * 100 || 0).toFixed(0)}%</span>
                            <span className={`text-[9px] font-semibold tracking-wide ${isDarkActive ? "text-emerald-400" : "text-emerald-600"}`}>Lulus Murni</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs flex-grow">
                          <div className={`flex justify-between border-b pb-1 ${isDarkActive ? "border-white/5" : "border-slate-100"}`}>
                            <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>Lulus Penuh:</span>
                            <span className={`font-bold ${isDarkActive ? "text-emerald-400" : "text-emerald-600"}`}>{totalLulus}</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1 ${isDarkActive ? "border-white/5" : "border-slate-100"}`}>
                            <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>Lulus Bersyarat:</span>
                            <span className={`font-bold ${isDarkActive ? "text-amber-400" : "text-amber-600"}`}>{totalLulusBersyarat}</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1 ${isDarkActive ? "border-white/5" : "border-slate-100"}`}>
                            <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>Belum Lulus:</span>
                            <span className={`font-bold ${isDarkActive ? "text-rose-400" : "text-rose-600"}`}>{totalTidakLulus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={isDarkActive ? "text-slate-500" : "text-slate-405"}>Total:</span>
                            <span className={`font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>{totalSiswa}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visualizer card 2: Class level analysis */}
                    <div className={`p-5 rounded-2xl space-y-4 border ${isDarkActive ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Statistik Per Rombel Kelas</h3>
                      <div className="space-y-3 py-2 max-h-48 overflow-y-auto pr-1">
                        {classFilterOptions.map(clsName => {
                          const clsSiswa = adminStudents.filter(s => s.className === clsName);
                          const clsPass = clsSiswa.filter(s => s.status === GraduationStatus.LULUS || s.status === GraduationStatus.LULUS_BERSYARAT).length;
                          const ratio = (clsPass / (clsSiswa.length || 1)) * 100;
                          return (
                            <div key={clsName} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-bold ${isDarkActive ? "text-slate-200" : "text-slate-700"}`}>{clsName}</span>
                                <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>{clsPass} / {clsSiswa.length} Siswa ({ratio.toFixed(0)}%)</span>
                              </div>
                              <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkActive ? "bg-white/5" : "bg-slate-100"}`}>
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                  style={{ width: `${ratio}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Audit details footer */}
                  <div className={`p-4 rounded-2xl flex flex-wrap gap-4 justify-between items-center text-xs border ${
                    isDarkActive ? "bg-white/5 border-white/5" : "bg-slate-100/50 border-slate-200"
                  }`}>
                    <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>Status Database: <span className={`font-bold ${isDarkActive ? "text-emerald-400" : "text-emerald-600"}`}>Terhubung</span></span>
                    <span className={isDarkActive ? "text-slate-400" : "text-slate-500"}>Tahun Ajaran Aktif: <span className={`font-bold ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>{settings?.academicYear}</span></span>
                    <span className={isDarkActive ? "text-slate-500" : "text-slate-400"}>Backup terintegrasi dan siap diekspor.</span>
                  </div>
                </div>
              )}

              {/* 2. DATA SISWA CRUD PANEL */}
              {activeAdminTab === "students" && (
                <div className="space-y-6">
                  <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <div>
                      <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Manajemen Database Siswa</h2>
                      <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Kelola data individual siswa, import, export, dan status kelulusan siber.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleExportStudentsCsv}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-xl text-slate-300 transition ${
                          isDarkActive ? "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                        }`}
                      >
                        <Download size={14} />
                        <span>Export CSV (Excel)</span>
                      </button>
                      <button
                        onClick={() => setShowBulkImport(!showBulkImport)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-xl text-slate-300 transition ${
                          isDarkActive ? "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                        }`}
                      >
                        <Upload size={14} />
                        <span>Import Massal</span>
                      </button>
                      <button
                        onClick={() => { setSelectedStudent(null); setIsStudentModalOpen(true); }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-xs font-semibold rounded-xl text-white transition shadow cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Tambah Siswa</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Import panel wrapper */}
                  {showBulkImport && (
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Import Massal Siswa Baru</h3>
                        <p className={`text-[10px] mt-1 leading-normal ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                          Masukkan array data JSON valid berisi struktur siswa OR salinkan baris CSV format: <span className="font-mono text-cyan-400">nisn,nis,nama,jenis_kelamin,kelas,tempat_lahir,tanggal_lahir,status,link_foto</span> (Baris baru untuk records berikutnya).
                        </p>
                      </div>

                      {importFeedback && (
                        <p className="p-2 border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono roundedLg">{importFeedback}</p>
                      )}

                      <textarea
                        className={`w-full border rounded-xl p-3 text-xs font-mono h-32 focus:outline-none transition ${
                          isDarkActive ? "bg-slate-950 border-white/15 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-850 focus:border-blue-500/50 shadow-inner"
                        }`}
                        placeholder='Contoh CSV:&#10;0081234569,220109,Galih Sugiarto,Laki-laki,XII MIPA 3,Bandung,2008-01-20,Lulus,https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d&#10;0081234570,220110,Hesti Wulandari,Perempuan,XII MIPA 3,Surabaya,2008-04-14,Lulus,https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                        value={bulkImportText}
                        onChange={e => setBulkImportText(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setShowBulkImport(false); setBulkImportText(""); setImportFeedback(""); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleBulkImport}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                            isDarkActive ? "bg-cyan-500 text-slate-950 hover:bg-cyan-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          }`}
                        >
                          Proses Data Import
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filters Search controls */}
                  <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl border ${
                    isDarkActive ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari nama, NISN, atau NIS..."
                        className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none transition font-sans ${
                          isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                        }`}
                        value={siswaSearchFilter}
                        onChange={e => setSiswaSearchFilter(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    <select
                      className={`border rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                        isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                      }`}
                      value={siswaClassFilter}
                      onChange={e => setSiswaClassFilter(e.target.value)}
                    >
                      <option value="">Semua Kelas Rombel</option>
                      {classFilterOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>

                    <select
                      className={`border rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                        isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                      }`}
                      value={siswaStatusFilter}
                      onChange={e => setSiswaStatusFilter(e.target.value)}
                    >
                      <option value="">Semua Status Kelulusan</option>
                      <option value="Lulus">Lulus</option>
                      <option value="Lulus Bersyarat">Lulus Bersyarat</option>
                      <option value="Tidak Lulus">Tidak Lulus</option>
                    </select>

                    <div className="text-right flex items-center justify-end">
                      <span className={`text-[11px] font-mono ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                        Ditemukan: <span className={`font-bold ${isDarkActive ? "text-white" : "text-slate-850"}`}>{filteredStudentsList.length}</span> / {totalSiswa}
                      </span>
                    </div>
                  </div>

                  {/* Students Table with CRUD links */}
                  <div className={`border rounded-2xl overflow-hidden ${
                    isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`font-medium border-b ${
                            isDarkActive ? "bg-white/5 text-slate-400 border-white/10" : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            <th className="py-3 px-4">Foto / Profil</th>
                            <th className="py-3 px-4">NISN / NIS</th>
                            <th className="py-3 px-4">Jenis Kelamin</th>
                            <th className="py-3 px-4">Tempat, Tgl Lahir</th>
                            <th className="py-3 px-4">Kelas Rombel</th>
                            <th className="py-3 px-4 text-center">Status Kelulusan</th>
                            <th className="py-3 px-4 text-right w-24">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkActive ? "divide-white/5" : "divide-slate-105"}`}>
                          {filteredStudentsList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-500 italic font-light">Tidak ada records siswa cocok dengan filter pencarian.</td>
                            </tr>
                          ) : (
                            filteredStudentsList.map(s => (
                              <tr key={s.nisn} className={`group transition ${isDarkActive ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}>
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full overflow-hidden border flex-shrink-0 flex items-center justify-center ${
                                      isDarkActive ? "border-white/10 bg-slate-800" : "border-slate-200 bg-slate-100"
                                    }`}>
                                      {s.photoUrl ? (
                                        <img 
                                          src={s.photoUrl} 
                                          alt={s.name} 
                                          className="w-full h-full object-cover" 
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <span className="text-[9px] font-bold text-slate-500">{s.name.charAt(0)}</span>
                                      )}
                                    </div>
                                    <span className={`font-bold capitalize text-xs tracking-wide ${isDarkActive ? "text-white" : "text-slate-850"}`}>{s.name}</span>
                                  </div>
                                </td>
                                <td className={`py-2.5 px-4 font-mono font-medium ${isDarkActive ? "text-slate-300" : "text-slate-700"}`}>
                                  {s.nisn} / <span className="text-slate-550">{s.nis}</span>
                                </td>
                                <td className={`py-2.5 px-4 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>{s.gender}</td>
                                <td className={`py-2.5 px-4 shrink-0 font-mono text-[11px] ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                                  {s.birthPlace || "Jakarta"}, {s.birthDate}
                                </td>
                                <td className={`py-2.5 px-4 font-semibold ${isDarkActive ? "text-slate-300" : "text-slate-700"}`}>{s.className}</td>
                                <td className="py-2.5 px-4 text-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    s.status === "Lulus" 
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                      : s.status === "Lulus Bersyarat" 
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  }`}>
                                    {s.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                                    <button
                                      onClick={() => { setSelectedStudent(s); setIsStudentModalOpen(true); }}
                                      className="p-1.5 hover:bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded transition"
                                      title="Edit Parameter / Leger Siswa"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(s.nisn)}
                                      className="p-1.5 hover:bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded transition"
                                      title="Hapus Record"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MATA PELAJARAN TAB */}
              {activeAdminTab === "subjects" && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>KKM Mata Pelajaran</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-50s"}`}>Atur kriteria kelayakan kompetensi dasar (KKM) untuk memilah status leger dokumen SKL.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add subject form left side */}
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Masukkan Mapel Baru</h3>
                      
                      <form onSubmit={handleSaveSubject} className="space-y-4">
                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Kode Mapel (Singkatan)</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: MAT, IND, FIS"
                            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition font-sans uppercase ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={newSubId}
                            onChange={e => setNewSubId(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Nama Lengkap Mata Pelajaran</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Matematika Peminatan"
                            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition font-sans ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={newSubName}
                            onChange={e => setNewSubName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Batas Minimum KKM (0-100)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none transition font-mono font-bold ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={newSubKkm}
                            onChange={e => setNewSubKkm(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition shadow"
                        >
                          <Plus size={14} />
                          <span>TAMBAHKAN MAPEL</span>
                        </button>
                      </form>
                    </div>

                    {/* Subjects list column right side */}
                    <div className={`md:col-span-2 border rounded-2xl p-5 space-y-4 ${
                      isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Daftar Aktif Mapel ({subjects.length})</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {subjects.map(s => (
                          <div key={s.id} className={`p-3 border rounded-xl flex items-center justify-between group ${
                            isDarkActive ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100 shadow-sm"
                          }`}>
                            <div>
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                                {s.id}
                              </span>
                              <h4 className={`font-semibold text-xs leading-none ${isDarkActive ? "text-white" : "text-slate-800"}`}>{s.name}</h4>
                              <p className={`text-[10px] mt-1.5 font-mono ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                                Target KKM: <span className={`font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>{s.kkm}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteSubject(s.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INPUT NILAI TAB */}
              {activeAdminTab === "input-nilai" && (
                <div className="space-y-6">
                  {/* Clean Page Title Header section */}
                  <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <div>
                      <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Input & Edit Nilai Kompetensi</h2>
                      <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Kelola dan input nilai rapor/Ujian Sekolah masing-masing siswa, atau import massal seluruh Mapel via CSV.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setShowGradesBulkImport(!showGradesBulkImport)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-xl transition cursor-pointer ${
                          isDarkActive ? "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                        }`}
                      >
                        <Upload size={14} />
                        <span>Import Nilai CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Import panel wrapper inside Input Nilai view */}
                  {showGradesBulkImport && (
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Import Nilai Siswa (CSV)</h3>
                        <p className={`text-[10px] mt-1 leading-normal ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                          Masukkan baris CSV dengan baris header mengandung <span className="font-mono text-cyan-400">nisn</span> diikuti kode singkatan Mata Pelajaran Anda yang aktif demi pencocokan nilai dinamis.
                        </p>
                      </div>

                      {gradesImportFeedback && (
                        <p className="p-2 border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono rounded-lg">{gradesImportFeedback}</p>
                      )}

                      <textarea
                        className={`w-full border rounded-xl p-3 text-xs font-mono h-32 focus:outline-none transition ${
                          isDarkActive ? "bg-slate-950 border-white/15 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-850 focus:border-blue-500/50 shadow-inner"
                        }`}
                        placeholder={`Masukkan format CSV seperti berikut:\nnisn,${subjects.map(s => s.id).join(",")}\n0081234561,${subjects.map((_, idx) => 80 + (idx % 3) * 5).join(",")}\n0081234562,${subjects.map((_, idx) => 75 + (idx % 2) * 10).join(",")}`}
                        value={bulkGradesImportText}
                        onChange={e => setBulkGradesImportText(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setShowGradesBulkImport(false); setBulkGradesImportText(""); setGradesImportFeedback(""); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleGradesBulkImport}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                            isDarkActive ? "bg-cyan-500 text-slate-950 hover:bg-cyan-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          }`}
                        >
                          Proses Impor Nilai
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search and class Filters panel */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl border no-print ${
                    isDarkActive ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="relative font-sans">
                      <input
                        type="text"
                        placeholder="Cari siswa berdasarkan nama, NISN, atau NIS..."
                        className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none transition font-sans ${
                          isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                        }`}
                        value={inputNilaiSearchFilter}
                        onChange={e => setInputNilaiSearchFilter(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    <select
                      className={`border rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                        isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                      }`}
                      value={inputNilaiClassFilter}
                      onChange={e => setInputNilaiClassFilter(e.target.value)}
                    >
                      <option value="">Semua Kelas Rombel</option>
                      {classFilterOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>

                    <div className="text-right flex items-center justify-end font-mono">
                      <span className={`text-[11px] ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                        Jumlah Siswa: <span className={`font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>{filteredInputNilaiList.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Input Nilai Student Cards Table List */}
                  <div className={`border rounded-2xl overflow-hidden ${
                    isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b font-semibold font-sans ${
                            isDarkActive ? "bg-white/5 text-slate-400 border-white/10" : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            <th className={`py-3.5 px-4 font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Identitas Siswa</th>
                            <th className="py-3.5 px-4">Kelas</th>
                            <th className="py-3.5 px-4 text-center">Status Kelulusan</th>
                            <th className="py-3.5 px-4">Daftar Nilai Mapel</th>
                            <th className="py-3.5 px-4 text-center">Rata-Rata</th>
                            <th className="py-3.5 px-4 text-right w-36">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y font-sans ${isDarkActive ? "divide-white/5" : "divide-slate-200"}`}>
                          {filteredInputNilaiList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-500 italic font-light">Tidak ada data siswa ditemukan untuk di-input nilainya.</td>
                            </tr>
                          ) : (
                            filteredInputNilaiList.map(student => {
                              const totalGrade = subjects.reduce((a, s) => a + (student.grades ? student.grades[s.id] || 0 : 0), 0);
                              const average = totalGrade / (subjects.length || 1);
                              const totalSubjects = subjects.length;
                              const gradedCount = subjects.filter(sub => student.grades && student.grades[sub.id] !== undefined).length;
                              
                              return (
                                <tr key={student.nisn} className={`transition group ${isDarkActive ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}>
                                  <td className="py-3 px-4">
                                    <div className={`font-bold capitalize leading-tight ${isDarkActive ? "text-white" : "text-slate-800"}`}>{student.name}</div>
                                    <div className={`text-[10px] mt-1 font-mono ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                                      NISN: {student.nisn} | NIS: {student.nis}
                                    </div>
                                  </td>
                                  <td className={`py-3 px-4 font-medium ${isDarkActive ? "text-slate-300" : "text-slate-700"}`}>{student.className}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      student.status === GraduationStatus.LULUS 
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                        : student.status === GraduationStatus.LULUS_BERSYARAT 
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    }`}>
                                      {student.status.replace("_", " ")}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 max-w-sm">
                                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                                      {subjects.map(s => {
                                        const score = student.grades ? student.grades[s.id] : undefined;
                                        const isBelowKkm = score !== undefined && score < s.kkm;
                                        
                                        return (
                                          <div 
                                            key={s.id} 
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                              score === undefined 
                                                ? (isDarkActive ? "bg-slate-100/5 bg-slate-900 border-white/5 text-slate-500" : "bg-slate-100 border-slate-205 text-slate-400")
                                                : isBelowKkm 
                                                ? "bg-rose-500/10 border-rose-500/20 text-rose-600 font-bold" 
                                                : "bg-cyan-500/10 border-cyan-500/25 text-cyan-600 font-semibold"
                                            }`}
                                            title={`${s.name} (KKM: ${s.kkm})`}
                                          >
                                            {s.id}: <span className="font-bold">{score !== undefined ? score : "—"}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className={`text-[9px] mt-1 font-medium font-sans ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                                      Terisi {gradedCount} dari {totalSubjects} Mata Pelajaran
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center font-mono font-bold">
                                    <span className={average >= 75 ? (isDarkActive ? "text-emerald-400" : "text-emerald-600") : (isDarkActive ? "text-amber-400" : "text-amber-600")}>
                                      {average.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() => { setSelectedGradeStudent(student); setIsGradeModalOpen(true); }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 hover:text-cyan-600 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-xs font-semibold cursor-pointer transition shadow"
                                    >
                                      <Edit2 size={12} />
                                      <span>Input Nilai</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
                  {/* 4. LEGER NILAI & DATA MASTER TAB */}
              {activeAdminTab === "grades" && (
                <div className="space-y-6">
                  {/* Clean Page Title Header section */}
                  <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <div>
                      <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Pratinjau Leger Nilai & Kompetensi</h2>
                      <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Review ledger transkrip kelulusan siswa, rata-rata kompetensi ujian, cetak leger per kelas, atau import transkrip nilai.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-xs font-semibold rounded-xl text-slate-950 transition shadow"
                      >
                        <Printer size={14} />
                        <span>Cetak Leger Rombel</span>
                      </button>
                      <button
                        onClick={() => setShowGradesBulkImport(!showGradesBulkImport)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-xl transition ${
                          isDarkActive ? "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                        }`}
                      >
                        <Upload size={14} />
                        <span>Import Nilai CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Import panel wrapper for grades */}
                  {showGradesBulkImport && (
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Import Nilai Siswa Baru (CSV)</h3>
                        <p className={`text-[10px] mt-1 leading-normal ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                          Gunakan baris CSV yang memiliki baris header berisi <span className="font-mono text-cyan-400">nisn</span> diikuti kode singkatan Mata Pelajaran Anda yang aktif demi pencocokan nilai dinamis.
                        </p>
                      </div>

                      {gradesImportFeedback && (
                        <p className="p-2 border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono rounded-lg">{gradesImportFeedback}</p>
                      )}

                      <textarea
                        className={`w-full border rounded-xl p-3 text-xs font-mono h-32 focus:outline-none transition ${
                          isDarkActive ? "bg-slate-950 border-white/15 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-850 focus:border-blue-500/50 shadow-inner"
                        }`}
                        placeholder={`Masukkan format CSV seperti berikut:\nnisn,${subjects.map(s => s.id).join(",")}\n0081234561,${subjects.map((_, idx) => 80 + (idx % 3) * 5).join(",")}\n0081234562,${subjects.map((_, idx) => 75 + (idx % 2) * 10).join(",")}`}
                        value={bulkGradesImportText}
                        onChange={e => setBulkGradesImportText(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setShowGradesBulkImport(false); setBulkGradesImportText(""); setGradesImportFeedback(""); }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition ${
                            isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleGradesBulkImport}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                            isDarkActive ? "bg-cyan-500 text-slate-950 hover:bg-cyan-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          }`}
                        >
                          Proses Impor Nilai
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search and class Filters panel */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl border no-print ${
                    isDarkActive ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari siswa, NISN, atau NIS..."
                        className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none transition font-sans ${
                          isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                        }`}
                        value={gradesSearchFilter}
                        onChange={e => setGradesSearchFilter(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    <select
                      className={`border rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                        isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                      }`}
                      value={gradesClassFilter}
                      onChange={e => setGradesClassFilter(e.target.value)}
                    >
                      <option value="">Semua Kelas Rombel</option>
                      {classFilterOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>

                    <div className="text-right flex items-center justify-end">
                      <span className={`text-[11px] font-mono ${isDarkActive ? "text-slate-400" : "text-slate-505"}`}>
                        Records: <span className={`font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>{filteredGradesList.length}</span> cocok
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Master ledger screen table layout */}
                  <div className={`border rounded-2xl overflow-hidden no-print ${
                    isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`font-medium border-b ${
                            isDarkActive ? "bg-white/5 text-slate-400 border-white/10" : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            <th className="py-3 px-4">Nama Siswa</th>
                            <th className="py-3 px-4">Kelas Rombel</th>
                            {subjects.map(s => (
                              <th key={s.id} className="py-3 px-3 text-center" title={`${s.name} (KKM:${s.kkm})`}>
                                {s.id}
                                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">K:{s.kkm}</span>
                              </th>
                            ))}
                            <th className="py-3 px-4 text-center bg-cyan-500/5">Rata-Rata</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-right w-16">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkActive ? "divide-white/5" : "divide-slate-200"}`}>
                          {filteredGradesList.length === 0 ? (
                            <tr>
                              <td colSpan={subjects.length + 5} className="py-12 text-center text-slate-500 italic font-light">Tidak ada records leger nilai terdaftar.</td>
                            </tr>
                          ) : (
                            filteredGradesList.map(student => {
                              const totalGrade = subjects.reduce((a, s) => a + (student.grades ? student.grades[s.id] || 0 : 0), 0);
                              const average = totalGrade / (subjects.length || 1);
                              return (
                                <tr key={student.nisn} className={`transition group ${isDarkActive ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}>
                                  <td className={`py-3 px-4 font-bold capitalize ${isDarkActive ? "text-white" : "text-slate-800"}`}>{student.name}</td>
                                  <td className={`py-3 px-4 font-medium ${isDarkActive ? "text-slate-400" : "text-slate-700"}`}>{student.className}</td>
                                  {subjects.map(s => {
                                    const score = student.grades ? student.grades[s.id] || 0 : 0;
                                    const isBelow = score < s.kkm;
                                    return (
                                      <td 
                                        key={s.id} 
                                        className={`py-3 px-3 text-center font-mono font-bold text-[11px] ${
                                          isBelow ? 'text-rose-600 bg-rose-500/5' : (isDarkActive ? 'text-slate-300' : 'text-slate-700')
                                        }`}
                                      >
                                        {score}
                                      </td>
                                    );
                                  })}
                                  <td className={`py-3 px-4 text-center font-mono font-extrabold ${isDarkActive ? "text-cyan-400 bg-cyan-400/5" : "text-blue-600 bg-blue-50"}`}>{average.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      student.status === "Lulus" 
                                        ? "bg-emerald-500/10 text-emerald-600" 
                                        : student.status === "Lulus Bersyarat" 
                                        ? "bg-amber-500/10 text-amber-600" 
                                        : "bg-rose-500/10 text-rose-600"
                                    }`}>
                                      {student.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() => { setSelectedGradeStudent(student); setIsGradeModalOpen(true); }}
                                      className="p-1.5 hover:bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 rounded-lg transition opacity-80 group-hover:opacity-100"
                                      title="Input / Edit Nilai Siswa"
                                    >
                                      <Award size={14} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Special dedicated prints ledger markup view (Only displays during window.print matches) */}
                  <div className="hidden print:block print:p-8 bg-white text-black font-serif my-4">
                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                      <h1 className="text-xl font-bold uppercase tracking-wide">LEGER NILAI HASIL UJIAN SEKOLAH</h1>
                      <h2 className="text-lg font-bold uppercase">{settings?.schoolName || "SMA NEGERI 1 JAKARTA"}</h2>
                      <p className="text-xs mt-1">Tahun Pelajaran: {settings?.academicYear || "2025/2026"} | Rombel: {gradesClassFilter || "Semua Kelas"}</p>
                    </div>

                    <table className="w-full text-left text-xs border border-black border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-black border-b border-black font-semibold">
                          <th className="py-2 px-3 border-r border-black">Nama Siswa</th>
                          <th className="py-2 px-3 border-r border-black">NISN / NIS</th>
                          <th className="py-2 px-3 border-r border-black">Kelas</th>
                          {subjects.map(s => (
                            <th key={s.id} className="py-2 px-1 border-r border-black text-center" title={s.name}>
                              {s.id}
                            </th>
                          ))}
                          <th className="py-2 px-2 border-r border-black text-center">Rata-Rata</th>
                          <th className="py-2 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black">
                        {filteredGradesList.map((student) => {
                          const totalGrade = subjects.reduce((a, s) => a + (student.grades ? student.grades[s.id] || 0 : 0), 0);
                          const average = totalGrade / (subjects.length || 1);
                          return (
                            <tr key={student.nisn} className="border-b border-black">
                              <td className="py-2 px-3 border-r border-black font-bold uppercase">{student.name}</td>
                              <td className="py-2 px-3 border-r border-black font-mono">{student.nisn} / {student.nis}</td>
                              <td className="py-2 px-3 border-r border-black">{student.className}</td>
                              {subjects.map(s => {
                                const score = student.grades ? student.grades[s.id] || 0 : 0;
                                return (
                                  <td key={s.id} className="py-2 px-1 border-r border-black text-center font-mono">
                                    {score}
                                  </td>
                                );
                              })}
                              <td className="py-2 px-2 border-r border-black text-center font-mono font-bold">{average.toFixed(2)}</td>
                              <td className="py-2 px-2 text-center">{student.status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    
                    <div className="mt-12 text-right text-xs">
                      <p>Jakarta, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                      <p className="mt-1 font-semibold">Kepala {settings?.schoolName || "SMP Islam Al Hikmah Mayong"}</p>
                      <div className="h-16" />
                      <p className="font-bold underline">{settings?.principalName}</p>
                      <p className="text-[10px] text-gray-500 font-mono">NIP. {settings?.principalNip}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form SKL - Draft Customize Editor */}
              {activeAdminTab === "skl" && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Draft & Desain KOP Surat SKL</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Sesuaikan konten draf Surat Keterangan Lulus (SKL), logo instansi kemendikbud (kiri) & logo sekolah (kanan), format nomor otomatis, dan unggah e-tanda tangan digital.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs bg-transparent p-1">
                    {/* Left Column Config fields */}
                    <div className={`md:col-span-7 space-y-5 p-5 rounded-2xl border ${
                      isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>Parameter KOP Surat & Redaksi</h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Nama Instansi Sekolah *</label>
                          <input
                            type="text"
                            required
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formSchoolName}
                            onChange={e => setFormSchoolName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Tahun Pelajaran *</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 2025/2026"
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formAcademicYear}
                            onChange={e => setFormAcademicYear(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Alamat Surat Sekolah</label>
                        <input
                          type="text"
                          required
                          className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                            isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                          }`}
                          value={formAddress}
                          onChange={e => setFormAddress(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1.5 font-mono ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Email Surat Resmi</label>
                          <input
                            type="email"
                            required
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formEmail}
                            onChange={e => setFormEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block mb-1.5 font-mono ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>No. Telepon / Fax</label>
                          <input
                            type="text"
                            required
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formPhone}
                            onChange={e => setFormPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block mb-1.5 font-mono ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Template Penomoran SKL (Otomatis)</label>
                        <input
                          type="text"
                          required
                          placeholder="Nomor: 421.3/ {academicYear} /SMAN1/SKL"
                          className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 font-mono focus:outline-none transition ${
                            isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                          }`}
                          value={formSklNumberTemplate}
                          onChange={e => setFormSklNumberTemplate(e.target.value)}
                        />
                        <span className={`text-[10px] block mt-1 ${isDarkActive ? "text-slate-500" : "text-slate-400"}`}>Gunakan token <span className={`font-mono ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>{`{academicYear}`}</span> untuk menyisipkan tahun pelajaran saat ini secara otomatis.</span>
                      </div>

                      <div>
                        <label className={`block mb-1.5 font-sans ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Sandi Redaksi Pembuka Dokumen SKL *</label>
                        <textarea
                          required
                          className={`w-full border focus:border-cyan-500/50 rounded-xl p-3 h-24 focus:outline-none transition ${
                            isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 shadow-inner"
                          }`}
                          value={formTemplateText}
                          onChange={e => setFormTemplateText(e.target.value)}
                        />
                        <span className={`text-[10px] block ${isDarkActive ? "text-slate-500" : "text-slate-400"}`}>Kalimat pembuka surat pernyataan kelulusan resmi.</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1.5 font-sans ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Tanggal Kelulusan (Tgl Surat)</label>
                          <input
                            type="date"
                            required
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-inner font-sans"
                            }`}
                            value={formGradDate}
                            onChange={e => setFormGradDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block mb-1.5 font-sans ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Waktu Countdown Pengumuman</label>
                          <input
                            type="time"
                            required
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-inner font-sans"
                            }`}
                            value={formGradTime}
                            onChange={e => setFormGradTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column Signature / Logos upload triggers */}
                    <div className="md:col-span-5 space-y-5 flex flex-col">
                      {/* Logo Configuration Blocks */}
                      <div className={`p-5 rounded-2xl border space-y-4 ${
                        isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                      }`}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>Konfigurasi Visual Logo KOP</h4>
                        
                        {/* Logo Left Spot */}
                        <div className="space-y-2">
                          <label className={`block ${isDarkActive ? "text-slate-400" : "text-slate-650"}`}>Logo Instansi Kiri (Default: Logo Tut Wuri / Kemendikbud)</label>
                          <div className="flex items-center gap-3">
                            <img src={formSchoolLogo || "https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Tut_Wuri_Handayani.png"} alt="Left Logo" className={`w-12 h-12 object-contain p-1.5 border rounded-lg shrink-0 ${isDarkActive ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"}`} referrerPolicy="no-referrer" />
                            <div className="space-y-1.5 flex-1">
                              <input
                                type="text"
                                placeholder="Tautan Logo URL"
                                className={`w-full border rounded-xl px-3 py-1.5 focus:outline-none font-mono text-[10px] ${
                                  isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-805 focus:border-blue-500/50 shadow-inner"
                                }`}
                                value={formSchoolLogo}
                                onChange={e => setFormSchoolLogo(e.target.value)}
                              />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className={`text-[10px] block ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (rl) => {
                                      setFormSchoolLogo(rl.target?.result as string);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                  }
                                }} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Logo Right Spot */}
                        <div className="space-y-2">
                          <label className={`block ${isDarkActive ? "text-slate-400" : "text-slate-650"}`}>Logo Sekolah Kanan (Default: Kosong / Dapat diisi logo Sklh)</label>
                          <div className="flex items-center gap-3">
                            <img src={formSchoolLogoRight || "https://placehold.co/100x100?text=Logo+Kanan"} alt="Right Logo" className={`w-12 h-12 object-contain p-1.5 border rounded-lg shrink-0 ${isDarkActive ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"}`} referrerPolicy="no-referrer" />
                            <div className="space-y-1.5 flex-1">
                              <input
                                type="text"
                                placeholder="Tautan Logo URL"
                                className={`w-full border rounded-xl px-3 py-1.5 text-white focus:outline-none font-mono text-[10px] ${
                                  isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-805"
                                }`}
                                value={formSchoolLogoRight}
                                onChange={e => setFormSchoolLogoRight(e.target.value)}
                              />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className={`text-[10px] block ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (rl) => {
                                      setFormSchoolLogoRight(rl.target?.result as string);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                  }
                                }} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Logo Background (Watermark SKL) */}
                        <div className="space-y-2 border-t pt-3 border-slate-200/50 dark:border-white/5">
                          <label className={`block ${isDarkActive ? "text-slate-400" : "text-slate-650"}`}>Logo Watermark Latar Belakang SKL (Watermark Tengah)</label>
                          <div className="flex items-center gap-3">
                            <img src={formWatermarkImage || "https://placehold.co/100x100?text=Watermark"} alt="Watermark Logo" className={`w-12 h-12 object-contain p-1.5 border rounded-lg shrink-0 ${isDarkActive ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"}`} referrerPolicy="no-referrer" />
                            <div className="space-y-1.5 flex-1">
                              <input
                                type="text"
                                placeholder="Tautan Watermark URL"
                                className={`w-full border rounded-xl px-3 py-1.5 focus:outline-none font-mono text-[10px] ${
                                  isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-805"
                                }`}
                                value={formWatermarkImage}
                                onChange={e => setFormWatermarkImage(e.target.value)}
                              />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className={`text-[10px] block ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (rl) => {
                                      setFormWatermarkImage(rl.target?.result as string);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                  }
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Headmaster and e-TTD settings block */}
                      <div className={`p-5 rounded-2xl border space-y-4 flex-1 ${
                        isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                      }`}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>Tanda Tangan Kepala Sekolah</h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Nama Lengkap Kepala Sekolah *</label>
                            <input
                              type="text"
                              required
                              className={`w-full border rounded-xl px-3 py-2 text-white focus:outline-none transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-805 shadow-inner"
                              }`}
                              value={formPrincipalName}
                              onChange={e => setFormPrincipalName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>NIP Kepala Sekolah *</label>
                            <input
                              type="text"
                              required
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none font-mono ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-805 shadow-inner"
                              }`}
                              value={formPrincipalNip}
                              onChange={e => setFormPrincipalNip(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* E-Signature upload widget */}
                        <div className="space-y-2">
                          <label className={`block ${isDarkActive ? "text-slate-400" : "text-slate-600"}`}>Berkas E-Tanda Tangan (PNG Transparan Sangat Direkomendasikan)</label>
                          <div className="flex items-center gap-3">
                            <div className={`w-16 h-16 border rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0 ${
                              isDarkActive ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-202"
                            }`}>
                              {formSignatureImage ? (
                                <img src={formSignatureImage} alt="E-Signature" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-[10px] text-slate-500 italic text-center">No E-Ttd</span>
                              )}
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <input
                                type="text"
                                placeholder="URL Tanda Tangan"
                                className={`w-full border rounded-xl px-3 py-1.5 text-white focus:outline-none font-mono text-[10px] ${
                                  isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-805"
                                }`}
                                value={formSignatureImage}
                                onChange={e => setFormSignatureImage(e.target.value)}
                              />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className={`text-[10px] block ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (rl) => {
                                      setFormSignatureImage(rl.target?.result as string);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                  }
                                }} 
                              />
                            </div>
                          </div>
                        </div>

                        <div className={`pt-4 border-t flex items-center justify-between ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                          <div className={`text-[10px] italic ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                            Tanpa stempel overlay di bagian ttd sesuai instruksi.
                          </div>
                          <button
                            type="submit"
                            className={`px-6 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow ${
                              isDarkActive ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-slate-950" : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            SIMPAN DRAF SKL
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* 5. ANNOUNCEMENTS TAB WITH AI GENERATOR CO-PILOT */}
              {activeAdminTab === "announcements" && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Berita & Pengumuman Sekolah</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Publish pengumuman tata kelola kesiswaan, pengambilan berkas SKL, dibantu naskah AI asisten.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Notice authoring space */}
                    <div className={`md:col-span-5 p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>
                          {annId ? "Revisi/Edit Pengumuman" : "Buat Notice Pengumuman Baru"}
                        </h3>
                        {annId && (
                          <button 
                            type="button" 
                            onClick={() => { setAnnId(""); setAnnTitle(""); setAnnContent(""); }}
                            className={`text-[10px] hover:underline ${isDarkActive ? "text-cyan-400" : "text-blue-500"}`}
                          >
                            Reset Form
                          </button>
                        )}
                      </div>

                      {/* GEMINI AI ASSIST WRITER (Major Capability) */}
                      <div className={`p-3 border rounded-xl space-y-2 ${
                        isDarkActive 
                          ? "from-indigo-500/10 to-blue-500/5 bg-gradient-to-r border-indigo-500/20" 
                          : "bg-indigo-50/50 border-indigo-200"
                      }`}>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest leading-none ${
                          isDarkActive ? "text-indigo-400" : "text-indigo-610"
                        }`}>
                          <Sparkles size={12} />
                          <span>Gemini AI Penulis Pengumuman</span>
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: Jadwal her-registrasi PPDB"
                            className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-grow ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-indigo-500/50" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500/50"
                            }`}
                            value={aiTopicInput}
                            onChange={e => setAiTopicInput(e.target.value)}
                          />
                          <button
                            type="button"
                            disabled={aiLoading}
                            onClick={handleAiWriterGenerate}
                            className="px-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-sans transition flex items-center justify-center cursor-pointer flex-shrink-0"
                          >
                            {aiLoading ? <RefreshCw className="animate-spin" size={12} /> : "Tulis"}
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Judul Pengumuman</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jadwal Pembagian Berkas SKL"
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs focus:outline-none transition font-sans ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-850"
                            }`}
                            value={annTitle}
                            onChange={e => setAnnTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Konten Teks HTML</label>
                          <textarea
                            required
                            placeholder="Isi berita pengumuman..."
                            className={`w-full border focus:border-cyan-500/50 rounded-xl p-3 text-xs font-sans h-44 focus:outline-none transition leading-relaxed ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-850"
                            }`}
                            value={annContent}
                            onChange={e => setAnnContent(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Status Draft / Publish</label>
                            <select
                              className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-850"
                              }`}
                              value={annStatus}
                              onChange={e => setAnnStatus(e.target.value as any)}
                            >
                              <option value="Draft">Draft (Simpen)</option>
                              <option value="Publish">Publish (Tampil)</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              type="submit"
                              className={`w-full py-2 font-bold rounded-xl text-xs transition cursor-pointer ${
                                isDarkActive ? "bg-cyan-400 text-slate-950 hover:bg-cyan-500" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                              }`}
                            >
                              SUBMIT POST
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Announcement Lists view right */}
                    <div className={`md:col-span-7 border rounded-2xl p-5 space-y-4 ${
                      isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Arsip Pengumuman Aktif ({adminAnnouncements.length})</h3>
                      
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {adminAnnouncements.map(ann => (
                          <div key={ann.id} className={`p-4 border rounded-xl space-y-2 group ${
                            isDarkActive ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-500">
                                {new Date(ann.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                              </span>
                              
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  ann.status === "Publish" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'
                                }`}>
                                  {ann.status}
                                </span>
                                <button
                                  onClick={() => {
                                    setAnnId(ann.id);
                                    setAnnTitle(ann.title);
                                    setAnnContent(ann.content);
                                    setAnnStatus(ann.status);
                                  }}
                                  className={`p-1 rounded transition ${isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-800"}`}
                                  title="Edit Post"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAnnouncement(ann.id)}
                                  className={`p-1 rounded transition ${isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-rose-400" : "hover:bg-slate-200 text-slate-500 hover:text-rose-600"}`}
                                  title="Delete Post"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <h4 className={`font-bold text-xs ${isDarkActive ? "text-white" : "text-slate-800"}`}>{ann.title}</h4>
                            <div className={`text-[11px] font-light truncate ${isDarkActive ? "text-slate-400" : "text-slate-600"}`} dangerouslySetInnerHTML={{ __html: ann.content }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. MANAJEMEN USER TAB */}
              {activeAdminTab === "users" && adminUser.role === UserRole.SUPER_ADMIN && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Kredensial Operator & Manajemen User</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-550"}`}>Tambah akun login operator sistem sekunder yang membantu update nilai ledger harian.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add User form columns left side */}
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Daftarkan Admin/Operator</h3>
                      
                      <form onSubmit={handleSaveUser} className="space-y-4">
                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Username Login</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: rahmat88"
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs focus:outline-none transition lowercase ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-800"
                            }`}
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Nama Lengkap Pemegang Akun</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Drs. Rahmat Hidayat"
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-800"
                            }`}
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Hak Akses Role</label>
                          <select
                            className={`w-full border focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-800"
                            }`}
                            value={newUserRole}
                            onChange={e => setNewUserRole(e.target.value as any)}
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Operator">Operator (Hanya update data kesiswaan)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                            isDarkActive 
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 hover:opacity-90" 
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          }`}
                        >
                          <Plus size={14} />
                          <span>DAFTARKAN PENGGUNA</span>
                        </button>
                      </form>
                    </div>

                    {/* Users view lists right side */}
                    <div className={`md:col-span-2 border rounded-2xl p-5 space-y-4 ${
                      isDarkActive ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Akun Petugas e-Kelulusan Aktif ({adminUsersList.length})</h3>
                      
                      <div className="space-y-3">
                        {adminUsersList.map(u => (
                          <div key={u.id} className={`p-4 border rounded-xl flex items-center justify-between group ${
                            isDarkActive ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs capitalize border ${
                                isDarkActive ? "bg-white/5 text-cyan-400 border-white/10" : "bg-white text-blue-600 border-slate-250 shadow-sm"
                              }`}>
                                {u.username.charAt(0)}
                              </div>
                              <div>
                                <h4 className={`font-bold text-xs ${isDarkActive ? "text-white" : "text-slate-800"}`}>{u.name}</h4>
                                <p className={`text-[10px] font-mono mt-0.5 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>
                                  Username: {u.username} | Role: <span className={isDarkActive ? "text-cyan-400" : "text-blue-600 font-semibold"}>{u.role}</span>
                                </p>
                              </div>
                            </div>

                            <button
                              disabled={u.username === "admin"} // basic admin protected
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded transition disabled:opacity-30"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. SETTING APLIKASI TAB */}
              {activeAdminTab === "settings" && adminUser.role === UserRole.SUPER_ADMIN && (
                <div className="space-y-6">
                  <div className={`border-b pb-4 ${isDarkActive ? "border-white/5" : "border-slate-200"}`}>
                    <h2 className={`text-xl font-bold ${isDarkActive ? "text-white" : "text-slate-800"}`}>Pengaturan Portal Sekolah & Database</h2>
                    <p className={`text-xs mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Konfigurasikan target tanggal countdown kesiswaan, Kop ijazah, backup dan restore.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* UI configuration left space */}
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-202 shadow-sm"
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Metadata Header KOP & Countdown</h3>
                      
                      <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Nama Instansi Sekolah *</label>
                            <input
                              type="text"
                              required
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                              }`}
                              value={formSchoolName}
                              onChange={e => setFormSchoolName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Tautan URL Logo Sekolah</label>
                            <input
                              type="text"
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition font-mono ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                              }`}
                              value={formSchoolLogo}
                              onChange={e => setFormSchoolLogo(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Alamat Surat Sekolah</label>
                          <input
                            type="text"
                            required
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formAddress}
                            onChange={e => setFormAddress(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className={`block mb-1.5 font-semibold ${isDarkActive ? "text-cyan-400" : "text-blue-600"}`}>Tautan URL Gambar Background (Landing Page)</label>
                          <input
                            type="text"
                            placeholder="Contoh: https://images.unsplash.com/... atau tautan gambar Anda"
                            className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition font-mono ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                            }`}
                            value={formBackgroundImage}
                            onChange={e => setFormBackgroundImage(e.target.value)}
                          />
                          <p className={`text-[10px] mt-1 ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>Gunakan URL gambar (misal Unsplash, Imgur, server Anda) untuk mengganti latar belakang halaman utama.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Email Hubungan</label>
                            <input
                              type="email"
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                              }`}
                              value={formEmail}
                              onChange={e => setFormEmail(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>No Telepon Sekolah</label>
                            <input
                              type="text"
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800 focus:border-blue-500/50 shadow-inner"
                              }`}
                              value={formPhone}
                              onChange={e => setFormPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Nama Kepala Sekolah</label>
                            <input
                              type="text"
                              className={`w-full border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-800"
                              }`}
                              value={formPrincipalName}
                              onChange={e => setFormPrincipalName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Nomor NIP Kepala Sekolah</label>
                            <input
                              type="text"
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition font-mono ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white focus:border-cyan-500/50" : "bg-white border-slate-202 text-slate-800"
                              }`}
                              value={formPrincipalNip}
                              onChange={e => setFormPrincipalNip(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Tanggal Countdown Pengumuman</label>
                            <input
                              type="date"
                              required
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition font-sans ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-805"
                              }`}
                              value={formGradDate}
                              onChange={e => setFormGradDate(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Jam Pengumuman (HH:MM)</label>
                            <input
                              type="time"
                              required
                              className={`w-full border rounded-xl px-3 py-2 focus:outline-none transition font-sans ${
                                isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-805"
                              }`}
                              value={formGradTime}
                              onChange={e => setFormGradTime(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block mb-1.5 ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>Teks Pernyataan Kelulusan SKL</label>
                          <textarea
                            className={`w-full border rounded-xl p-3 text-xs focus:outline-none transition h-20 ${
                              isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-805"
                            }`}
                            value={formTemplateText}
                            onChange={e => setFormTemplateText(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2 font-bold rounded-xl text-xs transition cursor-pointer ${
                            isDarkActive 
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 hover:opacity-95" 
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          }`}
                        >
                          SIMPAN PERUBAHAN CONFIG
                        </button>
                      </form>
                    </div>

                    {/* DB Actions right space (Backup / Restore) */}
                    <div className="space-y-6">
                      <div className={`p-5 rounded-2xl border space-y-4 ${
                        isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-202 shadow-sm"
                      }`}>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-white" : "text-slate-800"}`}>Pencadangan Database backup</h3>
                        <p className={`text-xs font-light leading-relaxed ${isDarkActive ? "text-slate-400" : "text-slate-550"}`}>
                          Anda dapat mengunduh seluruh salinan data e-kelulusan dalam format file backup JSON. File ini menyimpan data murid, subjek pelajaran, leger nilai, pengumuman, dan setting sekolah secara utuh.
                        </p>

                        <button
                          onClick={handleDownloadBackup}
                          className={`flex items-center justify-center gap-2 w-full py-2 font-semibold rounded-xl text-xs border transition cursor-pointer ${
                            isDarkActive 
                              ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          <Database size={14} className="text-cyan-400" />
                          <span>UNDUH BACKUP DATABASE JSON</span>
                        </button>
                      </div>

                      <div className={`p-5 rounded-2xl border space-y-4 ${
                        isDarkActive ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-202 shadow-sm"
                      }`}>
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkActive ? "text-rose-450" : "text-rose-600"}`}>Pemulihan / Restore Database</h3>
                        <p className={`text-xs font-light leading-relaxed ${isDarkActive ? "text-slate-400" : "text-slate-550"}`}>
                          Kembalikan data backup yang sudah diunduh sebelumnya dengan cara menempel isian JSON ke editor teks pemulihan di bawah ini. Tindakan ini bersifat sensitif dan akan menimpa database aktif saat ini.
                        </p>

                        <textarea
                          placeholder="Paste teks backup JSON Anda disini..."
                          className={`w-full border rounded-xl p-3 text-xs font-mono h-24 focus:outline-none focus:border-rose-500/30 ${
                            isDarkActive ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-202 text-slate-800"
                          }`}
                          value={restoreJsonText}
                          onChange={e => setRestoreJsonText(e.target.value)}
                        />

                        <button
                          onClick={handleRestoreBackupSubmit}
                          className={`w-full py-2 border font-bold rounded-xl text-xs transition cursor-pointer ${
                            isDarkActive 
                              ? "bg-rose-500/10 hover:bg-rose-500 border-rose-500/20 text-rose-400 hover:text-white" 
                              : "bg-rose-50 hover:bg-rose-600 border-rose-200 text-rose-600 hover:text-white"
                          }`}
                        >
                          RESTORE PEMULIHAN DATA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. AKTIVITAS LOGIN / LOGS TAB */}
              {activeAdminTab === "logs" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Log Aktivitas Login Pengguna</h2>
                    <p className="text-xs text-slate-400 mt-1">Audit trail login security, merekam alamat IP petugas kesiswaan.</p>
                  </div>

                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-slate-400 border-b border-white/10 font-medium">
                            <th className="py-3 px-4">Waktu Akses</th>
                            <th className="py-3 px-4">Username Petugas</th>
                            <th className="py-3 px-4">IP Address Klien</th>
                            <th className="py-3 px-4">Status Akses</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {adminLogs.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-500 italic font-light">Belum ada aktivitas login terekam.</td>
                            </tr>
                          ) : (
                            adminLogs.map(log => (
                              <tr key={log.id} className="hover:bg-white/5 transition">
                                <td className="py-3 px-4 font-mono text-slate-300">
                                  {new Date(log.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" })}
                                </td>
                                <td className="py-3 px-4 text-white font-bold">{log.username}</td>
                                <td className="py-3 px-4 font-mono text-slate-400">{log.ip}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    log.status === "Success" 
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  }`}>
                                    {log.status === "Success" ? "BERHASIL" : "GAGAL"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Admin workspace Platform Footer */}
            <footer className={`no-print border-t p-4 text-center text-[10px] font-sans tracking-wide sticky bottom-0 z-20 backdrop-blur-md transition-colors duration-300 ${
              isDarkActive 
                ? "bg-slate-950/45 border-white/10 text-slate-400" 
                : "bg-white/45 border-slate-200 text-slate-600 shadow-sm"
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-1 text-[11px] leading-tight">
                <div className="text-center md:text-left">
                  <span className={`font-bold uppercase tracking-wide mr-2 ${isDarkActive ? "text-slate-300" : "text-slate-705"}`}>
                    {settings?.schoolName || "SMP Islam Al Hikmah Mayong"}
                  </span>
                  <span className={`hidden md:inline text-[10px] ${isDarkActive ? "text-slate-500" : "text-slate-450"}`}>
                    {settings?.address}
                  </span>
                </div>
                <div className="text-center md:text-right flex flex-wrap justify-center md:justify-end items-center gap-x-2 gap-y-0.5 font-medium">
                  <p className={`m-0 text-[11px] leading-none ${isDarkActive ? "text-slate-400" : "text-slate-655"}`}>
                    Powered by <a href="https://educita.id" target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-555 font-bold cursor-pointer">educita.id</a> -- <span className="font-extrabold bg-gradient-to-r from-blue-400 dark:from-blue-400 via-cyan-400 dark:via-cyan-400 to-teal-400 dark:to-teal-400 bg-clip-text text-transparent">Muhammad Luthfi</span> v2026
                  </p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      )}

      {/* Embedded Student edit modal inside overlays */}
      {isStudentModalOpen && (
        <StudentDialog
          student={selectedStudent}
          subjects={subjects}
          onClose={() => { setIsStudentModalOpen(false); setSelectedStudent(null); }}
          onSave={handleSaveStudent}
        />
      )}

      {/* Embedded Grade edit modal inside overlays */}
      {isGradeModalOpen && (
        <GradeDialog
          student={selectedGradeStudent}
          subjects={subjects}
          onClose={() => { setIsGradeModalOpen(false); setSelectedGradeStudent(null); }}
          onSave={handleSaveStudentGrades}
        />
      )}

    </div>
  );
}
