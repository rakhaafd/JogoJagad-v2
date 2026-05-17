# 🌍 PROJECT.md — JogoJagad (Tanggap Bencana Pintar)

## 📌 Deskripsi Proyek

**JogoJagad** adalah platform berbasis web untuk manajemen bencana yang menyediakan informasi kondisi wilayah secara **real-time**, pelaporan masyarakat, sistem poin aksi preventif, donasi, serta fitur edukasi berbasis AI.

Proyek ini menggunakan:

* **Laravel** → Backend API
* **React Typescript** → Frontend
* **Leaflet.js** → Pemetaan wilayah
* **Xendit** → Payment gateway
* **OpenWeather API** → Data cuaca

---

## 🎯 Latar Belakang

Indonesia merupakan negara yang rawan bencana, namun:

* Informasi sering **terlambat**
* Data tersebar di berbagai platform
* Minim partisipasi masyarakat dalam mitigasi

**Solusi:**
Membangun platform terpusat untuk:

* Monitoring wilayah
* Notifikasi cepat
* Pelaporan masyarakat
* Edukasi dan partisipasi aktif

---

## 👥 Role Pengguna

### 1. Admin

* Mengelola kondisi wilayah (Leaflet)
* Verifikasi aksi user
* Mengelola berita
* Mengelola donasi
* Monitoring sistem

### 2. User

* Menerima notifikasi bencana
* Melakukan aksi preventif
* Berdonasi
* Mengakses berita & cuaca
* Interaksi dengan AI

---

## 📍 Data Domisili User

Saat registrasi, user wajib mengisi:

* Kecamatan
* Kota
* Provinsi

Digunakan untuk:

* Mapping wilayah
* Target notifikasi
* Data cuaca

---

## 🧩 Fitur Utama

---

### 🗺️ 1. Pemetaan & Monitoring Wilayah (Leaflet)

#### Deskripsi:

Admin dapat menandai kondisi wilayah berdasarkan tingkat bahaya.

#### Status:

* 🟢 Aman
* 🟡 Waspada
* 🔴 Bahaya

#### Input Admin:

* Wilayah (polygon di map)
* Status
* Tipe bencana:

  * Banjir
  * Hujan badai
  * Gunung meletus
  * dll
* Deskripsi (opsional)
* Himbauan (opsional)

#### Flow:

1. Admin memilih wilayah di Leaflet
2. Admin mengatur status & tipe bencana
3. Data disimpan ke database
4. Sistem mencari user berdasarkan domisili
5. Sistem mengirim **email notifikasi otomatis**

---

### 📧 2. Notifikasi Otomatis

* Trigger: perubahan status wilayah
* Target: user sesuai domisili
* Media: Email
* Isi:

  * Status wilayah
  * Jenis bencana
  * Himbauan

---

### 🏆 3. Sistem Poin (Aksi Preventif)

#### Deskripsi:

User melakukan aksi nyata untuk mencegah bencana.

#### Contoh:

* Membuang sampah pada tempatnya
* Membersihkan selokan
* Menanam pohon

#### Flow:

1. User upload foto aksi
2. Data masuk ke admin
3. Admin verifikasi
4. Admin memberi kategori:

   * Minor → poin kecil
   * Moderate → poin sedang
   * Major → poin besar
5. Poin masuk ke akun user

#### Reward:

* Merchandise
* Saldo

---

### 💰 4. Donasi (Payment Gateway)

#### Deskripsi:

User dapat berdonasi untuk korban bencana.

#### Teknologi:

* Xendit

#### Flow:

1. User memilih nominal
2. Redirect ke payment gateway
3. Transaksi berhasil
4. Dana masuk ke sistem admin

---

### 📰 5. News (Berita)

#### Admin:

* CRUD berita

#### User:

* Melihat berita
* Memberi komentar
* Memberi like

---

### 🌦️ 6. Informasi Cuaca

#### Sumber:

* OpenWeather API

#### Flow:

1. Ambil domisili user
2. Fetch API cuaca
3. Tampilkan di dashboard

---

### 🤖 7. Ask & Quiz AI

#### Deskripsi:

Fitur edukasi interaktif berbasis AI.

#### Fitur:

* Tanya jawab seputar bencana
* Generate quiz otomatis berdasarkan topik

#### Flow:

1. User input topik
2. AI memberikan:

   * Penjelasan
   * Quiz
3. User menyelesaikan quiz
4. Sistem memberi poin

---

## 🏗️ Arsitektur Sistem

### Backend (Laravel API)

* Authentication (Sanctum/JWT)
* CRUD:

  * User
  * Wilayah
  * News
  * Aksi
  * Donasi
* Email Notification System
* Integrasi:

  * Xendit
  * OpenWeather

---

### Frontend (React Typescript)

* Dashboard user & admin
* Leaflet Map integration
* Form upload aksi
* News & comment system
* AI interaction UI

---

## 📁 Struktur Folder Frontend

```
src/
│
├── Components/
│   └── (Komponen kecil reusable)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── Card.tsx
│       └── dll
│
├── Fragments/
│   └── (Gabungan beberapa components)
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── Layouts/
│   └── (Struktur layout halaman)
│       ├── DashboardLayout.tsx
│       ├── AuthLayout.tsx
│       └── MainLayout.tsx
│
├── Pages/
│   └── (Halaman utama aplikasi)
│       ├── Dashboard.tsx
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── News.tsx
│       ├── MapMonitoring.tsx
│       ├── Actions.tsx
│       ├── Donation.tsx
│       └── AIQuiz.tsx
│
├── Services/
│   └── (API calls)
│       ├── api.ts
│       ├── authService.ts
│       └── disasterService.ts
│
├── Utils/
│   └── (Helper functions)
│
└── App.tsx
```

---

## 🗃️ Struktur Database (Gambaran)

### Tables:

* users
* regions
* disaster_reports
* actions (user aksi)
* action_verifications
* points
* donations
* news
* comments
* likes
* notifications

---

## 🔄 Flow Utama Sistem

### Notifikasi Bencana

```
Admin update wilayah → Simpan DB → Filter user → Kirim email
```

### Sistem Poin

```
User upload aksi → Admin verifikasi → Assign kategori → Tambah poin
```

### Donasi

```
User bayar → Xendit → Callback → Update status
```

---

## 🧠 Nilai Utama

* Respons cepat terhadap bencana
* Partisipasi masyarakat
* Edukasi berkelanjutan
* Transparansi informasi