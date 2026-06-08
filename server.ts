/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DbStore } from "./src/server/dbStore";
import { 
  GraduationStatus, 
  UserRole, 
  AnnouncementStatus 
} from "./src/types";
import { GoogleGenAI } from "@google/genai";

async function run() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Mock sessions state in-memory
  const activeSessions = new Map<string, { username: string; role: string; name: string }>();

  // Helper middleware to check authentication
  const checkAuth = (allowedRoles?: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
      
      const session = activeSessions.get(token);
      if (!session) {
        res.status(401).json({ error: "Sesi admin tidak valid. Silakan login kembali." });
        return;
      }

      if (allowedRoles && !allowedRoles.includes(session.role)) {
        res.status(403).json({ error: "Anda tidak memiliki hak akses untuk fungsi ini." });
        return;
      }

      (req as any).user = session;
      next();
    };
  };

  // ----------------------------------------------------
  // API ENDPOINTS
  // ----------------------------------------------------

  // 1. Auth Login
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip || "127.0.0.1";

    if (!username || !password) {
      res.status(400).json({ error: "Username dan password harus diisi." });
      return;
    }

    // Standard checking
    if (username === "Luthfi" && password === "lthf23") {
      const token = "token_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      const session = { username: "Luthfi", role: UserRole.SUPER_ADMIN, name: "Luthfi (Super Admin)" };
      activeSessions.set(token, session);

      DbStore.addLoginLog({
        username,
        ip,
        timestamp: new Date().toISOString(),
        status: "Success"
      });

      res.json({ token, role: session.role, name: session.name });
      return;
    } else if (username === "operator" && password === "operator123") {
      const token = "token_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      const session = { username: "operator", role: UserRole.OPERATOR, name: "Siti Rahma (Operator)" };
      activeSessions.set(token, session);

      DbStore.addLoginLog({
        username,
        ip,
        timestamp: new Date().toISOString(),
        status: "Success"
      });

      res.json({ token, role: session.role, name: session.name });
      return;
    }

    // Failed login log
    DbStore.addLoginLog({
      username,
      ip,
      timestamp: new Date().toISOString(),
      status: "Failed"
    });

    res.status(401).json({ error: "Username atau password salah!" });
  });

  // Auth Logout
  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // Verify Token Active status
  app.get("/api/auth/verify", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const session = activeSessions.get(token);
    if (session) {
      res.json({ verified: true, user: session });
    } else {
      res.json({ verified: false });
    }
  });

  // 2. Application Settings
  app.get("/api/settings", (req, res) => {
    res.json(DbStore.getSettings());
  });

  app.post("/api/settings", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    try {
      const updated = DbStore.updateSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Gagal mengupdate pengaturan." });
    }
  });

  // 3. Public Student Graduation Search Portal
  app.post("/api/grad-search", (req, res) => {
    const { nisn, name, birthDate } = req.body;

    if (!nisn || !name || !birthDate) {
      res.status(400).json({ error: "NISN, Nama Lengkap, dan Tanggal Lahir wajib diisi." });
      return;
    }

    // Check announcement open/close status
    const settings = DbStore.getSettings();
    if (!settings.isAnnouncementOpen) {
      res.status(403).json({ error: "Maaf, akses pencarian pengumuman saat ini ditutup atau belum dibuka oleh pihak sekolah." });
      return;
    }

    const student = DbStore.findStudent(nisn, name, birthDate);
    if (!student) {
      res.status(404).json({ error: "Siswa tidak ditemukan. Periksa kembali NISN, Nama Lengkap, dan Tanggal Lahir Anda." });
      return;
    }

    // If student is found, generate a unique verification code QR entry if not already present
    const verCode = DbStore.createVerification(student.nisn);
    
    // Return student and the associated QR payload
    res.json({
      student,
      verificationCode: verCode.code
    });
  });

  // 4. Students CRUD
  app.get("/api/students", checkAuth(), (req, res) => {
    res.json(DbStore.getStudents());
  });

  app.post("/api/students", checkAuth(), (req, res) => {
    try {
      const student = req.body;
      if (!student.nisn || !student.name || !student.nis) {
        res.status(400).json({ error: "NISN, NIS, dan Nama Lengkap wajib diisi." });
        return;
      }
      const saved = DbStore.saveStudent(student);
      res.json(saved);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Gagal menyimpan data siswa." });
    }
  });

  app.post("/api/students/bulk-verify-codes", checkAuth(), (req, res) => {
    try {
      const { nisns } = req.body;
      if (!Array.isArray(nisns)) {
        res.status(400).json({ error: "Kolom 'nisns' wajib diisi dengan format array." });
        return;
      }
      const results: Record<string, string> = {};
      for (const nisn of nisns) {
        const ver = DbStore.createVerification(nisn);
        results[nisn] = ver.code;
      }
      res.json(results);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Gagal memproses kode verifikasi massal." });
    }
  });

  app.delete("/api/students/:nisn", checkAuth(), (req, res) => {
    try {
      const deleted = DbStore.deleteStudent(req.params.nisn);
      if (deleted) {
        res.json({ success: true, message: "Data siswa berhasil dihapus." });
      } else {
        res.status(404).json({ error: "Siswa tidak ditemukan." });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menghapus data siswa." });
    }
  });

  app.post("/api/students/import", checkAuth(), (req, res) => {
    try {
      const { students } = req.body;
      if (!Array.isArray(students)) {
        res.status(400).json({ error: "Format data import harus bertipe array." });
        return;
      }
      const count = DbStore.importStudents(students);
      res.json({ success: true, count, message: `${count} siswa berhasil diimport.` });
    } catch (e: any) {
      res.status(500).json({ error: "Gagal melakukan import data siswa." });
    }
  });

  // 5. Subjects CRUD
  app.get("/api/subjects", (req, res) => {
    res.json(DbStore.getSubjects());
  });

  app.post("/api/subjects", checkAuth(), (req, res) => {
    try {
      const subject = req.body;
      if (!subject.id || !subject.name || typeof subject.kkm !== "number") {
        res.status(400).json({ error: "Kode Mapel, Nama, dan KKM (angka) wajib diisi." });
        return;
      }
      const saved = DbStore.saveSubject(subject);
      res.json(saved);
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menyimpan mata pelajaran." });
    }
  });

  app.delete("/api/subjects/:id", checkAuth(), (req, res) => {
    try {
      const deleted = DbStore.deleteSubject(req.params.id);
      if (deleted) {
        res.json({ success: true, message: "Mata pelajaran berhasil dihapus." });
      } else {
        res.status(404).json({ error: "Mata pelajaran tidak ditemukan." });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menghapus mata pelajaran." });
    }
  });

  // 6. Announcements CRUD
  app.get("/api/announcements", (req, res) => {
    const all = DbStore.getAnnouncements();
    // Only return published announcements for public interface
    res.json(all.filter(a => a.status === AnnouncementStatus.PUBLISH));
  });

  app.get("/api/admin/announcements", checkAuth(), (req, res) => {
    res.json(DbStore.getAnnouncements());
  });

  app.post("/api/announcements", checkAuth(), (req, res) => {
    try {
      const ann = req.body;
      if (!ann.title || !ann.content) {
        res.status(400).json({ error: "Judul dan isi pengumuman tidak boleh kosong." });
        return;
      }
      if (!ann.id) {
        ann.id = Math.random().toString(36).substring(2, 9);
        ann.createdAt = new Date().toISOString();
      }
      ann.updatedAt = new Date().toISOString();
      const saved = DbStore.saveAnnouncement(ann);
      res.json(saved);
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menyimpan pengumuman." });
    }
  });

  app.delete("/api/announcements/:id", checkAuth(), (req, res) => {
    try {
      const deleted = DbStore.deleteAnnouncement(req.params.id);
      if (deleted) {
        res.json({ success: true, message: "Pengumuman berhasil dihapus." });
      } else {
        res.status(404).json({ error: "Pengumuman tidak ditemukan." });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menghapus pengumuman." });
    }
  });

  // 7. Users Management
  app.get("/api/users", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    res.json(DbStore.getUsers());
  });

  app.post("/api/users", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    try {
      const user = req.body;
      if (!user.username || !user.name || !user.role) {
        res.status(400).json({ error: "Username, Nama Lengkap, dan Peran wajib diisi." });
        return;
      }
      if (!user.id) {
        user.id = Math.random().toString(36).substring(2, 9);
        user.createdAt = new Date().toISOString();
      }
      const saved = DbStore.saveUser(user);
      res.json(saved);
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menyimpan data pengguna." });
    }
  });

  app.delete("/api/users/:id", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    try {
      const deleted = DbStore.deleteUser(req.params.id);
      if (deleted) {
        res.json({ success: true, message: "Pengguna berhasil dihapus." });
      } else {
        res.status(404).json({ error: "Pengguna tidak ditemukan." });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Gagal menghapus pengguna." });
    }
  });

  // 8. Audit logs
  app.get("/api/logs", checkAuth(), (req, res) => {
    res.json(DbStore.getLoginLogs());
  });

  // 9. QR Verification
  app.get("/api/verifikasi/:code", (req, res) => {
    const record = DbStore.getVerification(req.params.code);
    if (!record) {
      res.json({
        isValid: false,
        message: "Dokumen TIDAK VALID atau palsu. QR Code / Serial ini tidak terdaftar di sistem kami."
      });
      return;
    }

    // Retrieve corresponding student metadata
    const student = DbStore.getStudent(record.nisn);
    res.json({
      isValid: true,
      message: "Dokumen VALID dan resmi dikeluarkan oleh SMP Islam Al Hikmah Mayong.",
      verification: record,
      student: student ? {
        nisn: student.nisn,
        nis: student.nis,
        name: student.name,
        className: student.className,
        status: student.status
      } : null
    });
  });

  // 10. Database Backup and Restore
  app.get("/api/database/backup", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    try {
      const data = DbStore.getBackupJSON();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=ekelulusan-backup.json");
      res.send(data);
    } catch (e) {
      res.status(500).json({ error: "Gagal mengekspor backup." });
    }
  });

  app.post("/api/database/restore", checkAuth([UserRole.SUPER_ADMIN]), (req, res) => {
    try {
      const { backup } = req.body;
      if (!backup) {
        res.status(400).json({ error: "Data backup kosong atau tidak lengkap." });
        return;
      }
      const success = DbStore.restoreBackup(JSON.stringify(backup));
      if (success) {
        res.json({ success: true, message: "Database berhasil diperbaiki/direstore." });
      } else {
        res.status(400).json({ error: "Format file backup tidak valid." });
      }
    } catch (e) {
      res.status(500).json({ error: "Gagal memproses restore database." });
    }
  });

  // 11. AI Generator Endpoint
  app.post("/api/generate-announcement", checkAuth(), async (req, res) => {
    const { topic, tone } = req.body;
    if (!topic) {
      res.status(400).json({ error: "Topik pengumuman wajib disertakan." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // High-quality fallback when local credentials are blank
      const generatedFallback = `
        <p>Yth. Wali Siswa dan Seluruh Peserta Didik,</p>
        <p>Sehubungan dengan pelaksanaan agenda <strong>${topic}</strong>, kami sampaikan bahwa kegiatan akan diselenggarakan secara hikmat, tertib, dan formal.</p>
        <p>Diharapkan semua pihak mematuhi instruksi tata tertib sekolah, mengenakan seragam rapi kemeja putih berlengan panjang, serta hadir tepat waktu sesuai jadwal koordinasi. Keberhasilan pengurusan ini demi kemajuan akademik siswa ke arah masa depan gemilang.</p>
        <p>Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
      `.trim();
      res.json({ content: generatedFallback, isFallback: true });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buatkan teks pengumuman resmi sekolah Indonesia bertopik "${topic}" dengan nada bicara "${tone || 'formal-elegan'}". Kembalikan respons murni bertipe HTML bertaraf rapi (hanya gunakan tag p, strong, ul, li, br, no body tags).`,
      });

      res.json({ content: response.text || "" });
    } catch (e: any) {
      console.error("Gemini API error:", e);
      res.status(500).json({ error: "Gagal membuat konten dengan AI: " + e.message });
    }
  });

  // Vite dev server mounting or Production static bundle serving
  // Check if we are running with a compiled dist bundle (common on shared Hosting panels like Hostinger)
  // to avoid starting the heavy Vite compiler dynamically at runtime.
  const distPath = path.join(process.cwd(), "dist");
  const hasCompiledProdFiles = fs.existsSync(path.join(distPath, "index.html"));
  const isProduction = process.env.NODE_ENV === "production" || hasCompiledProdFiles;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`E-Kelulusan Full-Stack server is active on port ${PORT}`);
  });
}

run().catch((e) => {
  console.error("FATAL: Failed to launch fullstack dev system", e);
});
