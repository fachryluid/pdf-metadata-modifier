# 📄 PDF Metadata Modifier

Alat sederhana berbasis Node.js untuk mengubah metadata file PDF (Created At dan Updated At) secara interaktif, baik satu per satu maupun massal.

## 🚀 Fitur

- Ubah metadata **Created At** dan **Modified At** file PDF.
- Mode **single file** dan **multiple file**.
- Metadata `title`, `author`, `subject`, dll dikosongkan agar bersih.
- Output disimpan ke folder `outputs/` dengan struktur dan nama yang rapi.

## 🛠️ Cara Instalasi

Clone repo ini:

```bash
git clone <repo-url>
cd pdf-metadata-modifier
```

Install dependensi:

```bash
npm install
```

## 📂 Struktur Folder

```
pdf-metadata-modifier/
├── files/        ← Letakkan file PDF di sini
│   └── .gitignore
├── outputs/      ← Hasil PDF yang sudah dimodifikasi akan disimpan di sini
│   └── .gitignore
├── index.js      ← Program utama
├── package.json
└── README.md
```

> Folder `files/` dan `outputs/` tetap kosong (hanya `.gitignore`) agar tidak ikut diunggah ke Git.

## ▶️ Cara Menjalankan

```bash
node index.js
```

## 📋 Mode Penggunaan

### 1. Edit metadata satu file

- Pilih file PDF yang ada di folder `files/`
- Masukkan tanggal dan waktu **Created At**
- Masukkan tanggal dan waktu **Updated At** (atau tekan Enter untuk menyamakan)

### 2. Edit metadata banyak file sekaligus

Nama file PDF harus diawali dengan tanggal dan waktu dalam format:

```
YYYY-MM-DD HH.mm.ss Nama File.pdf
```

Contoh:

```
2023-07-25 10.26.00 Laporan Tahunan.pdf
```

Program akan:

- Mengambil tanggal dari nama file
- Mengubah metadata **Created At** dan **Updated At**
- Menyimpan hasil ke folder `outputs/` dengan nama `Laporan Tahunan.pdf`

## 🧼 Metadata yang Diatur

| Properti     | Nilai         |
|--------------|---------------|
| Title        | (kosong)      |
| Author       | (kosong)      |
| Subject      | (kosong)      |
| Keywords     | (kosong)      |
| Producer     | (kosong)      |
| Creator      | (kosong)      |
| Created At   | sesuai input/nama file |
| Modified At  | sesuai input/nama file |

## ⚠️ Catatan

- Program akan mengabaikan file yang tidak sesuai format saat mode multiple digunakan.
- Pastikan format nama file **tidak menggunakan titik dua (:)**, karena tidak didukung oleh sistem file Windows.

## ✅ Contoh Output

```
Pilih mode operasi: (Use arrow keys)
❯ Edit metadata satu file
  Edit metadata banyak file sekaligus (nama file diawali tanggal)
  Keluar dari program
```

## 🧩 Lisensi

Bebas digunakan untuk keperluan pribadi atau organisasi. Tidak untuk dijual ulang.