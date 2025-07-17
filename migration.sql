-- Gunakan database Anda
-- USE nama_database_anda;

-- Tabel untuk menyimpan data siswa
CREATE TABLE IF NOT EXISTS siswa (
    id VARCHAR(36) PRIMARY KEY,
    status VARCHAR(20),
    siswa_namaLengkap VARCHAR(255),
    siswa_nis VARCHAR(50),
    siswa_nisn VARCHAR(50),
    siswa_jenisKelamin VARCHAR(20),
    siswa_tempatLahir VARCHAR(100),
    siswa_tanggalLahir DATE,
    siswa_agama VARCHAR(50),
    siswa_kewarganegaraan VARCHAR(50),
    siswa_fotoProfil JSON,
    siswa_jumlahSaudara INT,
    siswa_bahasa VARCHAR(100),
    siswa_golonganDarah VARCHAR(5),
    siswa_alamatKkProvinsi VARCHAR(100),
    siswa_alamatKkKabupaten VARCHAR(100),
    siswa_alamatKkKecamatan VARCHAR(100),
    siswa_alamatKkDesa VARCHAR(100),
    siswa_telepon VARCHAR(20),
    siswa_domisiliProvinsi VARCHAR(100),
    siswa_domisiliKabupaten VARCHAR(100),
    siswa_domisiliKecamatan VARCHAR(100),
    siswa_domisiliDesa VARCHAR(100),
    siswa_namaAyah VARCHAR(255),
    siswa_namaIbu VARCHAR(255),
    siswa_pendidikanAyah VARCHAR(100),
    siswa_pendidikanIbu VARCHAR(100),
    siswa_pekerjaanAyah VARCHAR(100),
    siswa_pekerjaanIbu VARCHAR(100),
    siswa_namaWali VARCHAR(255),
    siswa_hubunganWali VARCHAR(100),
    siswa_pendidikanWali VARCHAR(100),
    siswa_pekerjaanWali VARCHAR(100),
    siswa_alamatOrangTua TEXT,
    siswa_teleponOrangTua VARCHAR(20),
    siswa_tinggiBadan INT,
    siswa_beratBadan INT,
    siswa_penyakit TEXT,
    siswa_kelainanJasmani TEXT,
    siswa_asalSekolah VARCHAR(255),
    siswa_nomorSttb VARCHAR(100),
    siswa_tanggalSttb DATE,
    siswa_pindahanAsalSekolah VARCHAR(255),
    siswa_pindahanDariTingkat VARCHAR(50),
    siswa_pindahanDiterimaTanggal DATE,
    siswa_lulusTahun VARCHAR(10),
    siswa_lulusNomorIjazah VARCHAR(100),
    siswa_lulusMelanjutkanKe VARCHAR(255),
    siswa_pindahKeSekolah VARCHAR(255),
    siswa_pindahTingkatKelas VARCHAR(50),
    siswa_pindahKeTingkat VARCHAR(50),
    siswa_keluarAlasan TEXT,
    siswa_keluarTanggal DATE,
    documents JSON
);

-- Tabel untuk menyimpan data pegawai
CREATE TABLE IF NOT EXISTS pegawai (
    id VARCHAR(36) PRIMARY KEY,
    status VARCHAR(20),
    pegawai_nama VARCHAR(255),
    pegawai_jenisKelamin VARCHAR(20),
    pegawai_tempatLahir VARCHAR(100),
    pegawai_tanggalLahir DATE,
    pegawai_statusPerkawinan VARCHAR(50),
    pegawai_jabatan VARCHAR(100),
    pegawai_terhitungMulaiTanggal DATE,
    pegawai_phaspoto JSON,
    pegawai_nip VARCHAR(50),
    pegawai_nuptk VARCHAR(50),
    pegawai_nrg VARCHAR(50),
    pegawai_tanggalPerkawinan DATE,
    pegawai_namaPasangan VARCHAR(255),
    pegawai_jumlahAnak INT,
    pegawai_bidangStudi VARCHAR(100),
    pegawai_tugasTambahan VARCHAR(100),
    pegawai_alamatKabupaten VARCHAR(100),
    pegawai_alamatKecamatan VARCHAR(100),
    pegawai_alamatDesa VARCHAR(100),
    pegawai_alamatDusun VARCHAR(100),
    pegawai_pendidikanSD JSON,
    pegawai_pendidikanSMP JSON,
    pegawai_pendidikanSMA JSON,
    pegawai_pendidikanDiploma JSON,
    pegawai_pendidikanS1 JSON,
    pegawai_pendidikanS2 JSON,
    pegawai_skPengangkatan JSON,
    pegawai_skNipBaru JSON,
    pegawai_skFungsional JSON,
    pegawai_beritaAcaraSumpah JSON,
    pegawai_sertifikatPendidik JSON,
    pegawai_sertifikatPelatihan JSON,
    pegawai_skp JSON,
    pegawai_karpeg JSON,
    pegawai_karisKarsu JSON,
    pegawai_bukuNikah JSON,
    pegawai_kartuKeluarga JSON,
    pegawai_ktp JSON,
    pegawai_akteKelahiran JSON,
    pegawai_kartuTaspen JSON,
    pegawai_npwp JSON,
    pegawai_kartuBpjs JSON,
    pegawai_bukuRekening JSON
);

-- Tabel untuk menyimpan data pengguna (users)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL, -- Diperpanjang untuk hash bcrypt
    role ENUM('superadmin', 'admin', 'user') NOT NULL,
    status ENUM('active', 'blocked') NOT NULL,
    avatar VARCHAR(255)
);

-- Menambahkan pengguna superadmin default (jika belum ada)
-- Password default adalah 'superadmin'
INSERT INTO users (id, email, name, password, role, status)
SELECT 
    '1', 
    'superadmin@app.com', 
    'Super Admin', 
    '$2b$10$wE.50hEX/hlV.s/4Q5iLpeWUa4wTOfMdBgXhN4.b.LhYpS19D76/m', -- Hash dari 'superadmin'
    'superadmin', 
    'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '1');
