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
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "students" | "subjects" | "grades" | "announcements" | "users" | "settings" | "logs">("dashboard");
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

  // Filters
  const [siswaSearchFilter, setSiswaSearchFilter] = useState("");
  const [siswaClassFilter, setSiswaClassFilter] = useState("");
  const [siswaStatusFilter, setSiswaStatusFilter] = useState("");

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
  const [formAddress, setFormAddress] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPrincipalName, setFormPrincipalName] = useState("");
  const [formPrincipalNip, setFormPrincipalNip] = useState("");
  const [formGradDate, setFormGradDate] = useState("");
  const [formGradTime, setFormGradTime] = useState("");
  const [formTemplateText, setFormTemplateText] = useState("");
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
      setFormAddress(settingsData.address);
      setFormEmail(settingsData.email);
      setFormPhone(settingsData.phone);
      setFormPrincipalName(settingsData.principalName);
      setFormPrincipalNip(settingsData.principalNip);
      setFormGradDate(settingsData.graduationDate);
      setFormGradTime(settingsData.graduationTime);
      setFormTemplateText(settingsData.announcementTemplate);
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
        // FORMAT: nisn,nis,nama,jenis_kelamin,kelas,tempat_lahir,tanggal_lahir,status
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
          address: formAddress,
          email: formEmail,
          phone: formPhone,
          principalName: formPrincipalName,
          principalNip: formPrincipalNip,
          graduationDate: formGradDate,
          graduationTime: formGradTime,
          announcementTemplate: formTemplateText
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

  // Get dynamic unique classes list for filter option drops
  const classFilterOptions = Array.from(new Set(adminStudents.map(s => s.className)));

  // If showing SKL print document full screen
  if (showGradSkl && searchResult) {
    return (
      <SklDocument
        student={searchResult.student}
        subjects={subjects}
        settings={settings || {
          schoolName: "SMA Negeri 1 Jakarta",
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
      
      {/* --------------------------------------------------------------------------------- */}
      {/* PUBLIC HOME/LANDING PAGE */}
      {/* --------------------------------------------------------------------------------- */}
      {currentPath === "/" && (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden overflow-y-auto font-sans transition-colors duration-305">
          {/* Beautiful Bright Academic Campus Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
              backgroundAttachment: "fixed"
            }}
          />
          
          {/* Translucent overlay masking to support light/dark theme content beautifully & keep text highly readable */}
          <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${
            isDarkActive 
              ? "bg-slate-950/92 backdrop-blur-[2px]" 
              : "bg-white/88 backdrop-blur-[1px]"
          }`} />

          {/* Subtle grid background backplane */}
          <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none transition-opacity duration-300 ${
            isDarkActive 
              ? "bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]" 
              : "bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]"
          }`} />

          {/* Top Header Navigation */}
          <header className={`w-full z-10 px-6 py-4 border-b backdrop-blur-md relative transition-colors duration-300 ${
            isDarkActive ? "border-white/5 bg-slate-950/40" : "border-slate-200/85 bg-white/40"
          }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                    {theme === "system" && <Laptop size={15} className="text-blue-505" />}
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
                                : isDarkActive ? "hover:bg-white/5 text-slate-400 hover:text-slate-260" : "hover:bg-slate-50 text-slate-600 hover:text-slate-950"
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

          {/* Main Content Layout - Split Grid Presentation with sunlit campus backdrop */}
          <main className="flex-grow z-10 max-w-5xl w-full mx-auto px-4 py-8 lg:py-12 flex flex-col gap-10">
            
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

          {/* Elegant Bento Footer */}
          <footer className={`w-full py-10 px-6 border-t text-center z-10 space-y-3 mt-12 transition-colors duration-300 ${
            isDarkActive ? "bg-slate-950 border-white/5 text-slate-500" : "bg-white border-slate-250 text-slate-600 shadow-sm"
          }`}>
            <p className={`font-bold uppercase tracking-widest text-xs ${isDarkActive ? "text-slate-300" : "text-slate-700"}`}>{settings?.schoolName || "SMA Negeri 1 Jakarta"}</p>
            <p className={`max-w-md mx-auto leading-relaxed ${isDarkActive ? "text-slate-400" : "text-slate-500"}`}>{settings?.address}</p>
            <p className={`pt-2 text-[10px] ${isDarkActive ? "text-slate-600" : "text-slate-400"}`}>{settings?.footerText || "Copyright © 2026. All Rights Reserved"}</p>
          </footer>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* QR VERIFICATION ROUTE VIEW */}
      {/* --------------------------------------------------------------------------------- */}
      {currentPath.startsWith("/verifikasi/") && (
        <div className="min-h-screen py-16 px-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-purple-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
          
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-glass text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/15">
                <QrCode size={32} className="text-purple-400" />
              </div>
            </div>

            {verLoading ? (
              <div className="py-8 space-y-3">
                <RefreshCw size={24} className="text-purple-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Memeriksa kunci siber surat kelulusan...</p>
              </div>
            ) : verResult ? (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-bold ${verResult.isValid ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {verResult.isValid ? "DOKUMEN VALID & RESMI" : "DOKUMEN TIDAK VALID / PALSU"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{verResult.message}</p>
                </div>

                {verResult.isValid && verResult.student && (
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3 text-left">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-purple-400">Metadata Siswa:</span>
                    <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                      <p><span className="text-slate-500">Nama :</span> <span className="font-sans font-bold text-white capitalize">{verResult.student.name}</span></p>
                      <p><span className="text-slate-500">NISN :</span> {verResult.student.nisn}</p>
                      <p><span className="text-slate-500">NIS  :</span> {verResult.student.nis}</p>
                      <p><span className="text-slate-500">Kelas:</span> {verResult.student.className}</p>
                      <p><span className="text-slate-500">Status:</span> <span className={`font-sans font-bold ${verResult.student.status === "Lulus" ? 'text-emerald-400': 'text-rose-400'}`}>{verResult.student.status}</span></p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentPath("/")}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition"
                  >
                    Kembali Ke Portal Utama
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">Gagal melakukan verifikasi.</p>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* ADMIN PORTAL LOGIN */}
      {/* --------------------------------------------------------------------------------- */}
      {currentPath === "/admin-login" && (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          {/* Subtle decoration elements */}
          <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-cyan-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          
          <div className="w-full max-w-sm p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-glass space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 bg-white/5 rounded-full items-center justify-center border border-white/15 mb-2">
                <Lock size={20} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">LOGIN PANEL ADMIN</h2>
              <p className="text-xs text-slate-400">Gunakan kredensial yang disiapkan oleh sistem.</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-1.5">
                <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Username Admin</label>
                <input
                  type="text"
                  required
                  placeholder="admin atau operator"
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition font-sans"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password..."
                    className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white focus:outline-none transition font-sans"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded bg-slate-950 border-white/10 text-cyan-500 focus:ring-0 cursor-pointer"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Ingat login saya</span>
                </label>
                <span className="hover:text-cyan-400 transition cursor-help" title="Password default: admin -> admin123, operator -> operator123">Bantuan Akun?</span>
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
              className="w-full border border-white/5 hover:bg-white/5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
            >
              Kembali Ke Portal Depan
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* ADMIN MAIN DASHBOARD SYSTEM */}
      {/* --------------------------------------------------------------------------------- */}
      {currentPath === "/admin-dashboard" && adminUser && (
        <div className="min-h-screen flex">
          
          {/* Sidebar Section */}
          <aside className={`no-print border-r border-white/10 bg-slate-950 z-20 transition-all duration-300 w-64 flex flex-col justify-between ${sidebarOpen ? 'relative' : 'hidden'}`}>
            <div className="flex-grow">
              {/* Sidebar Header Title Crest */}
              <div className="p-4 flex items-center gap-2 border-b border-white/10 bg-white/5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center">
                  <LayoutDashboard size={16} className="text-slate-950" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white leading-none">E-KELULUSAN</h3>
                  <p className="text-[9px] text-cyan-400 mt-1 font-mono tracking-widest">{adminUser.role.toUpperCase()}</p>
                </div>
              </div>

              {/* Sidebar Nav Links */}
              <nav className="p-3 space-y-1">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "students", label: "Data Siswa", icon: Users },
                  { id: "subjects", label: "Mata Pelajaran", icon: BookOpen },
                  { id: "grades", label: "Leger Nilai (Grades)", icon: TrendingUp },
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
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-l-4 border-cyan-500 text-white" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
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
            <div className="p-3 border-t border-white/10 bg-slate-900/60 font-sans space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs capitalize">
                  {adminUser.username.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-white leading-tight">{adminUser.name}</p>
                  <p className="text-[9px] text-slate-400 tracking-wider">Online</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer border border-rose-500/20"
              >
                <LogOut size={12} />
                <span>LOGOUT SYSTEM</span>
              </button>
            </div>
          </aside>

          {/* Main workspace platform right */}
          <main className="flex-grow flex flex-col justify-between overflow-x-hidden min-h-screen">
            {/* Platform Topbar */}
            <header className="no-print bg-slate-950 border-b border-white/10 p-4 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                >
                  <Menu size={18} />
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-2 py-1 text-[11px] text-slate-400 font-mono">
                  <Building size={12} className="text-blue-400" />
                  <span>{settings?.schoolName || "Pangkalan e-Kelulusan"}</span>
                </div>
              </div>

              {/* Status information right topbar */}
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchAdminDashboardData}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Reload DB Data"
                >
                  <RefreshCw size={14} className="hover:rotate-180 transition duration-500" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium lowercase">
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
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Dashboard Monitoring Akademik</h2>
                    <p className="text-xs text-slate-400 mt-1">Sapaan hangat, {adminUser.name}. Berikut ringkasan parameter siswa hari ini.</p>
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
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rasio Kelulusan Berdasarkan Hasil</h3>
                      <div className="flex items-center gap-6 py-6 font-mono">
                        {/* Circular progress representations as direct responsive inline SVG charts */}
                        <div className="relative w-32 h-32 flex-shrink-0 mx-auto">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
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
                            <span className="text-xl font-extrabold text-white">{(totalLulus / (totalSiswa || 1) * 100 || 0).toFixed(0)}%</span>
                            <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">Lulus Murni</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs flex-grow">
                          <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-slate-400">Lulus Penuh:</span><span className="text-emerald-400 font-bold">{totalLulus}</span></div>
                          <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-slate-400">Lulus Bersyarat:</span><span className="text-amber-400 font-bold">{totalLulusBersyarat}</span></div>
                          <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-slate-400">Belum Lulus:</span><span className="text-rose-400 font-bold">{totalTidakLulus}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 font-semibold">Total:</span><span className="text-white font-bold">{totalSiswa}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Visualizer card 2: Class level analysis */}
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistik Per Rombel Kelas</h3>
                      <div className="space-y-3 py-2 max-h-48 overflow-y-auto pr-1">
                        {classFilterOptions.map(clsName => {
                          const clsSiswa = adminStudents.filter(s => s.className === clsName);
                          const clsPass = clsSiswa.filter(s => s.status === GraduationStatus.LULUS || s.status === GraduationStatus.LULUS_BERSYARAT).length;
                          const ratio = (clsPass / (clsSiswa.length || 1)) * 100;
                          return (
                            <div key={clsName} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-200">{clsName}</span>
                                <span className="text-slate-400">{clsPass} / {clsSiswa.length} Siswa ({ratio.toFixed(0)}%)</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
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
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-wrap gap-4 justify-between items-center text-xs">
                    <span className="text-slate-400">Status Database: <span className="text-emerald-400 font-bold">Terhubung</span></span>
                    <span className="text-slate-400">Tahun Ajaran Aktif: <span className="text-cyan-400 font-bold">{settings?.academicYear}</span></span>
                    <span className="text-slate-500">Backup terintegrasi dan siap diekspor.</span>
                  </div>
                </div>
              )}

              {/* 2. DATA SISWA CRUD PANEL */}
              {activeAdminTab === "students" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Manajemen Database Siswa</h2>
                      <p className="text-xs text-slate-400 mt-1">Kelola data individual siswa, import, export, dan status kelulusan siber.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleExportStudentsCsv}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold rounded-xl text-slate-300 transition"
                      >
                        <Download size={14} />
                        <span>Export CSV (Excel)</span>
                      </button>
                      <button
                        onClick={() => setShowBulkImport(!showBulkImport)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold rounded-xl text-slate-300 transition"
                      >
                        <Upload size={14} />
                        <span>Import Massal</span>
                      </button>
                      <button
                        onClick={() => { setSelectedStudent(null); setIsStudentModalOpen(true); }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-xs font-semibold rounded-xl text-white transition shadow"
                      >
                        <Plus size={14} />
                        <span>Tambah Siswa</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Import panel wrapper */}
                  {showBulkImport && (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Import Massal Siswa Baru</h3>
                        <p className="text-slate-400 text-[10px] mt-1 leading-normal">
                          Masukkan array data JSON valid berisi struktur siswa OR salinkan baris CSV format: <span className="font-mono text-cyan-400">nisn,nis,nama,jenis_kelamin,kelas,tempat_lahir,tanggal_lahir,status</span> (Baris baru untuk records berikutnya).
                        </p>
                      </div>

                      {importFeedback && (
                        <p className="p-2 border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono roundedLg">{importFeedback}</p>
                      )}

                      <textarea
                        className="w-full bg-slate-950 border border-white/15 focus:border-cyan-500/50 rounded-xl p-3 text-xs text-white font-mono h-32 focus:outline-none transition"
                        placeholder='Contoh CSV:&#10;0081234569,220109,Galih Sugiarto,Laki-laki,XII MIPA 3,Bandung,2008-01-20,Lulus&#10;0081234570,220110,Hesti Wulandari,Perempuan,XII MIPA 3,Surabaya,2008-04-14,Lulus'
                        value={bulkImportText}
                        onChange={e => setBulkImportText(e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setShowBulkImport(false); setBulkImportText(""); setImportFeedback(""); }}
                          className="px-3 py-1.5 rounded-lg text-xs hover:bg-white/5 text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleBulkImport}
                          className="px-4 py-1.5 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-cyan-600 transition"
                        >
                          Proses Data Import
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filters Search controls */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari nama, NISN, atau NIS..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition font-sans"
                        value={siswaSearchFilter}
                        onChange={e => setSiswaSearchFilter(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    </div>

                    <select
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition"
                      value={siswaClassFilter}
                      onChange={e => setSiswaClassFilter(e.target.value)}
                    >
                      <option value="">Semua Kelas Rombe</option>
                      {classFilterOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>

                    <select
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition"
                      value={siswaStatusFilter}
                      onChange={e => setSiswaStatusFilter(e.target.value)}
                    >
                      <option value="">Semua Status Kelulusan</option>
                      <option value="Lulus">Lulus</option>
                      <option value="Lulus Bersyarat">Lulus Bersyarat</option>
                      <option value="Tidak Lulus">Tidak Lulus</option>
                    </select>

                    <div className="text-right flex items-center justify-end">
                      <span className="text-[11px] text-slate-400 font-mono">Ditemukan: <span className="font-bold text-white">{filteredStudentsList.length}</span> / {totalSiswa}</span>
                    </div>
                  </div>

                  {/* Students Table with CRUD links */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-slate-400 border-b border-white/10 font-medium">
                            <th className="py-3 px-4">Foto / Profil</th>
                            <th className="py-3 px-4">NISN / NIS</th>
                            <th className="py-3 px-4">Jenis Kelamin</th>
                            <th className="py-3 px-4">Tempat, Tgl Lahir</th>
                            <th className="py-3 px-4">Kelas Rombel</th>
                            <th className="py-3 px-4 text-center">Status Kelulusan</th>
                            <th className="py-3 px-4 text-right w-24">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredStudentsList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-500 italic font-light">Tidak ada records siswa cocok dengan filter pencarian.</td>
                            </tr>
                          ) : (
                            filteredStudentsList.map(s => (
                              <tr key={s.nisn} className="hover:bg-white/5 group transition">
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0 flex items-center justify-center">
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
                                    <span className="font-bold text-white capitalize text-xs tracking-wide">{s.name}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 font-mono font-medium text-slate-300">
                                  {s.nisn} / <span className="text-slate-500">{s.nis}</span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-400">{s.gender}</td>
                                <td className="py-2.5 px-4 text-slate-400 shrink-0 font-mono text-[11px]">
                                  {s.birthPlace || "Jakarta"}, {s.birthDate}
                                </td>
                                <td className="py-2.5 px-4 text-slate-300 font-semibold">{s.className}</td>
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
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">KKM Mata Pelajaran</h2>
                    <p className="text-xs text-slate-400 mt-1">Atur kriteria kelayakan kompetensi dasar (KKM) untuk memilah status leger dokumen SKL.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add subject form left side */}
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Masukkan Mapel Baru</h3>
                      
                      <form onSubmit={handleSaveSubject} className="space-y-4">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Kode Mapel (Singkatan)</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: MAT, IND, FIS"
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition font-sans uppercase"
                            value={newSubId}
                            onChange={e => setNewSubId(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Nama Lengkap Mata Pelajaran</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Matematika Peminatan"
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition font-sans"
                            value={newSubName}
                            onChange={e => setNewSubName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Batas Minimum KKM (0-100)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition font-mono font-bold"
                            value={newSubKkm}
                            onChange={e => setNewSubKkm(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition"
                        >
                          <Plus size={14} />
                          <span>TAMBAHKAN MAPEL</span>
                        </button>
                      </form>
                    </div>

                    {/* Subjects list column right side */}
                    <div className="md:col-span-2 border border-white/10 rounded-2xl p-5 bg-slate-950/40 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Aktif Mapel ({subjects.length})</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {subjects.map(s => (
                          <div key={s.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                            <div>
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                                {s.id}
                              </span>
                              <h4 className="text-white font-semibold text-xs leading-none">{s.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Target KKM: <span className="font-bold text-white">{s.kkm}</span></p>
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

              {/* 4. LEGER NILAI & DATA MASTER TAB */}
              {activeAdminTab === "grades" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Leger Nilai & Data Master</h2>
                    <p className="text-xs text-slate-400 mt-1">Review ledger transkrip kelulusan siswa, rata-rata kompetensi ujian sekolah.</p>
                  </div>

                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-slate-400 border-b border-white/10 font-medium">
                            <th className="py-3 px-4">Nama Siswa</th>
                            <th className="py-3 px-4">Kelas</th>
                            {subjects.map(s => (
                              <th key={s.id} className="py-3 px-3 text-center" title={`${s.name} (KKM:${s.kkm})`}>
                                {s.id}
                                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">K:{s.kkm}</span>
                              </th>
                            ))}
                            <th className="py-3 px-4 text-center">Rata-Rata</th>
                            <th className="py-3 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {adminStudents.length === 0 ? (
                            <tr>
                              <td colSpan={subjects.length + 4} className="py-12 text-center text-slate-500 italic font-light">Belum ada data siswa terdaftar.</td>
                            </tr>
                          ) : (
                            adminStudents.map(student => {
                              const totalGrade = subjects.reduce((a, s) => a + (student.grades ? student.grades[s.id] || 0 : 0), 0);
                              const average = totalGrade / (subjects.length || 1);
                              return (
                                <tr key={student.nisn} className="hover:bg-white/5 transition">
                                  <td className="py-3 px-4 font-bold text-white capitalize">{student.name}</td>
                                  <td className="py-3 px-4 text-slate-400 font-medium">{student.className}</td>
                                  {subjects.map(s => {
                                    const score = student.grades ? student.grades[s.id] || 0 : 0;
                                    const isBelow = score < s.kkm;
                                    return (
                                      <td 
                                        key={s.id} 
                                        className={`py-3 px-3 text-center font-mono font-bold text-[11px] ${
                                          isBelow ? 'text-rose-400 bg-rose-500/5' : 'text-slate-300'
                                        }`}
                                      >
                                        {score}
                                      </td>
                                    );
                                  })}
                                  <td className="py-3 px-4 text-center font-mono font-extrabold text-cyan-400 bg-cyan-400/5">{average.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      student.status === "Lulus" 
                                        ? "bg-emerald-500/10 text-emerald-400" 
                                        : student.status === "Lulus Bersyarat" 
                                        ? "bg-amber-500/10 text-amber-400" 
                                        : "bg-rose-500/10 text-rose-400"
                                    }`}>
                                      {student.status}
                                    </span>
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

              {/* 5. ANNOUNCEMENTS TAB WITH AI GENERATOR CO-PILOT */}
              {activeAdminTab === "announcements" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Berita & Pengumuman Sekolah</h2>
                    <p className="text-xs text-slate-400 mt-1">Publish pengumuman tata kelola kesiswaan, pengambilan berkas SKL, dibantu naskah AI asisten.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Notice authoring space */}
                    <div className="md:col-span-5 p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                          {annId ? "Revisi/Edit Pengumuman" : "Buat Notice Pengumuman Baru"}
                        </h3>
                        {annId && (
                          <button 
                            type="button" 
                            onClick={() => { setAnnId(""); setAnnTitle(""); setAnnContent(""); }}
                            className="text-[10px] text-cyan-400 hover:underline"
                          >
                            Reset Form
                          </button>
                        )}
                      </div>

                      {/* GEMINI AI ASSIST WRITER (Major Capability) */}
                      <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 border border-indigo-500/20 rounded-xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">
                          <Sparkles size={12} />
                          <span>Gemini AI Penulis Pengumuman</span>
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: Jadwal her-registrasi PPDB"
                            className="bg-slate-950 border border-white/10 focus:border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none flex-grow"
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
                          <label className="block text-[11px] text-slate-400 mb-1.5">Judul Pengumuman</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jadwal Pembagian Berkas SKL"
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition font-sans"
                            value={annTitle}
                            onChange={e => setAnnTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Konten Teks HTML</label>
                          <textarea
                            required
                            placeholder="Isi berita pengumuman..."
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl p-3 text-xs text-white font-sans h-44 focus:outline-none transition leading-relaxed"
                            value={annContent}
                            onChange={e => setAnnContent(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1.5">Status Draft / Publish</label>
                            <select
                              className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
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
                              className="w-full py-2 bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-500 transition cursor-pointer"
                            >
                              SUBMIT POST
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Announcement Lists view right */}
                    <div className="md:col-span-7 border border-white/10 rounded-2xl p-5 bg-slate-950/40 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Arsip Pengumuman Aktif ({adminAnnouncements.length})</h3>
                      
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {adminAnnouncements.map(ann => (
                          <div key={ann.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 group">
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
                                  className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded transition"
                                  title="Edit Post"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAnnouncement(ann.id)}
                                  className="p-1 hover:bg-white/5 text-slate-400 hover:text-rose-400 rounded transition"
                                  title="Delete Post"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-white font-bold text-xs">{ann.title}</h4>
                            <div className="text-[11px] text-slate-400 font-light truncate" dangerouslySetInnerHTML={{ __html: ann.content }} />
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
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Kredensial Operator & Manajemen User</h2>
                    <p className="text-xs text-slate-400 mt-1">Tambah akun login operator sistem sekunder yang membantu update nilai ledger harian.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add User form columns left side */}
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftarkan Admin/Operator</h3>
                      
                      <form onSubmit={handleSaveUser} className="space-y-4">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Username Login</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: rahmat88"
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition lowercase"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Nama Lengkap Pemegang Akun</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Drs. Rahmat Hidayat"
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5">Hak Akses Role</label>
                          <select
                            className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
                            value={newUserRole}
                            onChange={e => setNewUserRole(e.target.value as any)}
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Operator">Operator (Hanya update data kesiswaan)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>DAFTARKAN PENGGUNA</span>
                        </button>
                      </form>
                    </div>

                    {/* Users view lists right side */}
                    <div className="md:col-span-2 border border-white/10 rounded-2xl p-5 bg-slate-950/40 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Akun Petugas e-Kelulusan Aktif ({adminUsersList.length})</h3>
                      
                      <div className="space-y-3">
                        {adminUsersList.map(u => (
                          <div key={u.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs capitalize text-cyan-400 border border-white/10">
                                {u.username.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-white font-bold text-xs">{u.name}</h4>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Username: {u.username} | Role: <span className="text-cyan-400">{u.role}</span></p>
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
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Pengaturan Portal Sekolah & Database</h2>
                    <p className="text-xs text-slate-400 mt-1">Konfigurasikan target tanggal countdown kesiswaan, Kop ijazah, backup dan restore.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* UI configuration left space */}
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Metadata Header KOP & Countdown</h3>
                      
                      <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1.5">Nama Instansi Sekolah *</label>
                            <input
                              type="text"
                              required
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                              value={formSchoolName}
                              onChange={e => setFormSchoolName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1.5">Tautan URL Logo Sekolah</label>
                            <input
                              type="text"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 font-mono"
                              value={formSchoolLogo}
                              onChange={e => setFormSchoolLogo(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1.5">Alamat Surat Sekolah</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                            value={formAddress}
                            onChange={e => setFormAddress(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1.5">Email Hubungan</label>
                            <input
                              type="email"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                              value={formEmail}
                              onChange={e => setFormEmail(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1.5">No Telepon Sekolah</label>
                            <input
                              type="text"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                              value={formPhone}
                              onChange={e => setFormPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1.5">Nama Kepala Sekolah</label>
                            <input
                              type="text"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                              value={formPrincipalName}
                              onChange={e => setFormPrincipalName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1.5">Nomor NIP Kepala Sekolah</label>
                            <input
                              type="text"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 font-mono"
                              value={formPrincipalNip}
                              onChange={e => setFormPrincipalNip(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1.5">Tanggal Countdown Pengumuman</label>
                            <input
                              type="date"
                              required
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                              value={formGradDate}
                              onChange={e => setFormGradDate(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1.5">Jam Pengumuman (HH:MM)</label>
                            <input
                              type="time"
                              required
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                              value={formGradTime}
                              onChange={e => setFormGradTime(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1.5">Teks Pernyataan Kelulusan SKL</label>
                          <textarea
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none h-20"
                            value={formTemplateText}
                            onChange={e => setFormTemplateText(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-95 transition cursor-pointer"
                        >
                          SIMPAN PERUBAHAN CONFIG
                        </button>
                      </form>
                    </div>

                    {/* DB Actions right space (Backup / Restore) */}
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pencadangan Database backup</h3>
                        <p className="text-slate-400 text-xs font-light leading-relaxed">
                          Anda dapat mengunduh seluruh salinan data e-kelulusan dalam format file backup JSON. File ini menyimpan data murid, subjek pelajaran, leger nilai, pengumuman, dan setting sekolah secara utuh.
                        </p>

                        <button
                          onClick={handleDownloadBackup}
                          className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-xs border border-white/10 transition cursor-pointer"
                        >
                          <Database size={14} className="text-cyan-400" />
                          <span>UNDUH BACKUP DATABASE JSON</span>
                        </button>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Pemulihan / Restore Database</h3>
                        <p className="text-slate-400 text-xs font-light leading-relaxed">
                          Kembalikan data backup yang sudah diunduh sebelumnya dengan cara menempel isian JSON ke editor teks pemulihan di bawah ini. Tindakan ini bersifat sensitif dan akan menimpa database aktif saat ini.
                        </p>

                        <textarea
                          placeholder="Faste teks backup JSON Anda disini..."
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono h-24 focus:outline-none focus:border-rose-500/30"
                          value={restoreJsonText}
                          onChange={e => setRestoreJsonText(e.target.value)}
                        />

                        <button
                          onClick={handleRestoreBackupSubmit}
                          className="w-full py-2 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-400 hover:text-white font-bold rounded-xl text-xs transition cursor-pointer"
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
            <footer className="no-print bg-slate-950 border-t border-white/10 p-4 text-center text-[10px] text-slate-500 font-sans tracking-wide">
              <span>Sistem Pengumuman Kelulusan Elektronik (E-Kelulusan) v1.0.0. Terdaftar pada {settings?.schoolName}</span>
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

    </div>
  );
}
