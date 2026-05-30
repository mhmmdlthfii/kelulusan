# Panduan Instalasi dan Penyebaran (Deployment Guide)
## Sistem Pengumuman Kelulusan Siswa Online (E-Kelulusan)

E-Kelulusan adalah sistem pengumuman kelulusan siswa sekolah (SMA/SMK/MA) secara online yang dirancang untuk kebutuhan skala produksi. Menggunakan arsitektur full-stack modern, aman dari manipulasi data, dan responsif.

---

## 🛠️ Persiapan & Fitur Utama

Sistem ini didukung oleh:
- **Express + React (Vite)** full-stack routing server.
- **Tailwind CSS v4** + desain kaca (**Glassmorphic UI**).
- **Generator Dokumen SKL Elektronik otomatis** dengan tautan **Siber QR Code Verifikasi**.
- **Asistem AI Terintegrasi (Google Gemini)** untuk penulisan pengumuman otomatis.
- **Fitur Administrator Lengkap**: Manajemen Murid, Input Leger Nilai, Riwayat Audit Log, Backup & Restore Database sekali klik.

---

## 🚀 Panduan Jalankan Lokal

1. **Unduh repositori / ekstrak file ZIP**.
2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```
3. **Konfigurasi Environment Variable (`.env`)**:
   Salin berkas `.env.example` ke `.env` dan masukkan API Key:
   ```env
   GEMINI_API_KEY="AI_Studio_Gemini_Key_Anda"
   ```
4. **Jalankan dalam mode Development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🌐 Panduan Deploy ke VPS Linux (Ubuntu / Debian)

Untuk meluncurkan di VPS (seperti DigitalOcean, Linode, AWS, Alibaba Cloud, dll.):

1. **Instal Node.js (v18+) & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Klon / Transfer Kode ke VPS**:
   Gunakan SFTP atau Git untuk meletakkan file ke direktori `/var/www/e-kelulusan`.

3. **Build Aplikasi**:
   ```bash
   npm install
   ```
   Lakukan build produksi:
   ```bash
   npm run build
   ```
   Ini akan mengompilasi bundel React statis di `dist/` dan melahirkan single server executable `dist/server.cjs` via esbuild.

4. **Jalankan Server Menggunakan PM2**:
   ```bash
   pm2 start dist/server.cjs --name "e-kelulusan"
   pm2 save
   pm2 startup
   ```

5. **Konfigurasikan Nginx sebagai Reverse Proxy**:
   Instal nginx:
   ```bash
   sudo apt install nginx
   ```
   Buat konfigurasi site `/etc/nginx/sites-available/e-kelulusan`:
   ```nginx
   server {
       listen 80;
       server_name domainsekolah.sch.id;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Aktifkan situs dan muat ulang nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/e-kelulusan /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

---

## ☁️ Panduan Deploy ke Hostinger (Node.js Hosting)

Hostinger menyediakan paket VPS atau Shared Hosting Node.js yang mudah digunakan.

### Opsi A: Menggunakan VPS Hostinger (Direkomendasikan)
1. Setup OS VPS Ubuntu di dasbor hPanel Hostinger.
2. Ikuti instruksi migrasi **Panduan VPS Linux** di atas menggunakan terminal SSH.

### Opsi B: Menggunakan Shared Hosting Node.js Hostinger
1. Pasang aplikasi Node.js baru melalui dasbor **hPanel > Website > Node.js**.
2. Unggah seluruh file proyek ini (termasuk folder `dist/` hasil build lokal Anda) ke Hostinger File Manager ke dalam subfolder aplikasi Node.js.
3. Di tab konfigurasi Node.js hPanel:
   - Atur **Entry Point File** ke `dist/server.cjs`.
   - Jalankan perintah **NPM Install** dari antarmuka web.
   - Atur environment variable `NODE_ENV=production`.
4. Klik **Start/Restart** untuk menghidupkan server.

---

## ⚡ Panduan Deploy ke Vercel (Sebagai Serverless SPA)

Jika ingin memisah server backend dan menyebarkan frontend di Vercel:
1. Buat folder terpisah untuk React SPA.
2. Setup file `vercel.json` berisi rewrite route:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
3. Hubungkan repositori GitHub Anda ke akun Vercel dan deploy sebagai proyek **Vite / React**.

---

## 💾 Integrasi Database SQL & Prisma (Bagi Pengembang Lanjutan)

Aplikasi saat ini menggunakan **bespoke File-based JSON Database store** yang andal di sandboxed environment (menghindari crash koneksi database eksternal) dan memuat fitur ekspor/pemulihan database JSON internal.

Jika Anda ingin bermigrasi ke database Relasional SQL (MySQL / MariaDB) menggunakan Prisma ORM pasca deployment, berikut adalah skema representatif yang dapat Anda hubungkan:

```prisma
// schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Student {
  nisn          String   @id @db.VarChar(10)
  nis           String   @db.VarChar(10)
  name          String   @db.VarChar(100)
  gender        String   @db.VarChar(15)
  birthPlace    String   @db.VarChar(50)
  birthDate     String   @db.VarChar(10)
  className     String   @db.VarChar(20)
  photoUrl      String   @db.Text
  status        String   @db.VarChar(20)
}

model Subject {
  id    String @id @db.VarChar(15)
  name  String @db.VarChar(100)
  kkm   Int
}

model Announcement {
  id        String   @id @db.VarChar(20)
  title     String   @db.VarChar(150)
  content   String   @db.Text
  status    String   @db.VarChar(20)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Setting {
  id                   Int    @id @default(1)
  schoolName           String @db.VarChar(150)
  schoolLogo           String @db.Text
  address              String @db.Text
  email                String @db.VarChar(100)
  phone                String @db.VarChar(20)
  footerText           String @db.Text
  graduationDate       String @db.VarChar(10)
  graduationTime       String @db.VarChar(5)
  academicYear         String @db.VarChar(10)
}
```

---

*Selamat menggunakan! Semoga integrasi sistem pengumuman kelulusan sekolah ini berkontribusi tinggi dalam menyambut masa depan cerah siswa Indonesia.*
