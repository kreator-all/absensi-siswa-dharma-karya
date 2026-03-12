# 📚 Sistem Absensi Siswa - Sekolah Dharma Karya Pondok Cabe

## 🎯 Fitur Lengkap

### Untuk Siswa:
- ✅ Login/Register dengan keamanan tinggi
- ✅ Absensi Masuk (Check-in) dengan verifikasi Wajah/Sidik Jari
- ✅ Absensi Keluar (Check-out) dengan verifikasi Wajah/Sidik Jari
- ✅ Pengajuan Surat Izin/Sakit dengan upload file
- ✅ Melihat Pengumuman dari Sekolah
- ✅ Messenger lokal untuk komunikasi dengan Admin
- ✅ Melihat riwayat kehadiran
- ✅ Registrasi Wajah & Sidik Jari

### Untuk Admin:
- ✅ Dashboard dengan statistik kehadiran
- ✅ Manajemen Data Siswa (Tambah/Edit/Hapus)
- ✅ Melihat semua kehadiran siswa
- ✅ Approval/Reject perizinan siswa
- ✅ Posting pengumuman sekolah

---

## 🔐 Keamanan

- ✅ Password di-hash dengan **bcrypt** (12 rounds)
- ✅ **JWT Token** dengan HTTP-only cookie
- ✅ **Rate Limiting** (5 percobaan login, lockout 15 menit)
- ✅ **CSRF Protection**
- ✅ Input Validation & Sanitization
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ Secure HTTP-only Cookies

---

## 📦 Cara Install

### 1. Extract File ZIP
```bash
unzip absensi-siswa-dharma-karya.zip
cd absensi-siswa-dharma-karya
```

### 2. Install Dependencies
```bash
npm install
# atau
bun install
```

### 3. Setup Environment Variables
```bash
# Copy file .env.example
cp .env.example .env

# Edit file .env dan ganti JWT_SECRET dengan secret yang aman!
nano .env
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Buat admin default
npx prisma db seed
```

### 5. Jalankan Aplikasi

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm run start
```

---

## 🔑 Login Default

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

⚠️ **PENTING:** Ganti password admin setelah login pertama!

---

## 📁 Struktur Folder

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Admin seeder
├── src/
│   ├── app/
│   │   ├── page.tsx       # Aplikasi utama
│   │   ├── layout.tsx     # Layout
│   │   ├── globals.css    # Styling
│   │   └── api/           # Backend API
│   │       ├── auth/      # Autentikasi
│   │       ├── attendance/ # Absensi
│   │       ├── admin/     # Admin
│   │       ├── permission/ # Perizinan
│   │       └── messages/  # Pesan
│   ├── lib/
│   │   ├── auth.ts        # Autentikasi & JWT
│   │   ├── db.ts          # Database
│   │   └── security.ts    # Keamanan
│   └── components/ui/     # UI Components
├── public/
├── package.json
└── .env
```

---

## 🌐 Deploy ke Hosting

### Vercel / Netlify / Hosting Node.js

1. Upload semua file ke hosting
2. Set environment variables di dashboard hosting:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Jalankan command:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run build
   npm run start
   ```

### Untuk Database Production

Ganti SQLite ke PostgreSQL atau MySQL:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/absensi_db"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/absensi_db"
```

---

## ⏰ Jam Absensi

| Kegiatan | Waktu |
|----------|-------|
| Absen Masuk | 06:00 - 12:00 |
| Absen Keluar | 12:00 - 18:00 |
| Batas Terlambat | Setelah 07:30 |

---

## 🛠️ Teknologi

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (development), PostgreSQL/MySQL (production)
- **Security:** bcrypt, jose (JWT), CSRF Protection
- **Language:** TypeScript

---

## 📞 Support

Jika ada pertanyaan atau masalah, hubungi administrator sekolah.

---

© 2024 Sekolah Dharma Karya Pondok Cabe
