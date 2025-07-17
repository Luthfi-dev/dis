
-- Pastikan Anda memiliki database bernama `maudigic_buku_induk_siswa`
-- Jalankan perintah ini di klien MySQL Anda

CREATE TABLE IF NOT EXISTS `siswa` (
  `id` varchar(36) NOT NULL,
  `siswa_namaLengkap` varchar(255) DEFAULT NULL,
  `siswa_nis` varchar(50) DEFAULT NULL,
  `siswa_nisn` varchar(50) DEFAULT NULL,
  `siswa_jenisKelamin` varchar(20) DEFAULT NULL,
  `siswa_tempatLahir` varchar(100) DEFAULT NULL,
  `siswa_tanggalLahir` date DEFAULT NULL,
  `siswa_agama` varchar(50) DEFAULT NULL,
  `siswa_kewarganegaraan` varchar(50) DEFAULT NULL,
  `siswa_fotoProfil` json DEFAULT NULL,
  `siswa_jumlahSaudara` int(11) DEFAULT NULL,
  `siswa_bahasa` varchar(100) DEFAULT NULL,
  `siswa_golonganDarah` varchar(5) DEFAULT NULL,
  `siswa_alamatKkProvinsi` varchar(10) DEFAULT NULL,
  `siswa_alamatKkKabupaten` varchar(10) DEFAULT NULL,
  `siswa_alamatKkKecamatan` varchar(10) DEFAULT NULL,
  `siswa_alamatKkDesa` varchar(20) DEFAULT NULL,
  `siswa_telepon` varchar(20) DEFAULT NULL,
  `siswa_domisiliProvinsi` varchar(10) DEFAULT NULL,
  `siswa_domisiliKabupaten` varchar(10) DEFAULT NULL,
  `siswa_domisiliKecamatan` varchar(10) DEFAULT NULL,
  `siswa_domisiliDesa` varchar(20) DEFAULT NULL,
  `siswa_namaAyah` varchar(255) DEFAULT NULL,
  `siswa_namaIbu` varchar(255) DEFAULT NULL,
  `siswa_pendidikanAyah` varchar(50) DEFAULT NULL,
  `siswa_pendidikanIbu` varchar(50) DEFAULT NULL,
  `siswa_pekerjaanAyah` varchar(100) DEFAULT NULL,
  `siswa_pekerjaanIbu` varchar(100) DEFAULT NULL,
  `siswa_namaWali` varchar(255) DEFAULT NULL,
  `siswa_hubunganWali` varchar(100) DEFAULT NULL,
  `siswa_pendidikanWali` varchar(50) DEFAULT NULL,
  `siswa_pekerjaanWali` varchar(100) DEFAULT NULL,
  `siswa_alamatOrangTua` text DEFAULT NULL,
  `siswa_teleponOrangTua` varchar(20) DEFAULT NULL,
  `siswa_tinggiBadan` int(11) DEFAULT NULL,
  `siswa_beratBadan` int(11) DEFAULT NULL,
  `siswa_penyakit` text DEFAULT NULL,
  `siswa_kelainanJasmani` text DEFAULT NULL,
  `siswa_asalSekolah` varchar(255) DEFAULT NULL,
  `siswa_nomorSttb` varchar(100) DEFAULT NULL,
  `siswa_tanggalSttb` date DEFAULT NULL,
  `siswa_pindahanAsalSekolah` varchar(255) DEFAULT NULL,
  `siswa_pindahanDariTingkat` varchar(50) DEFAULT NULL,
  `siswa_pindahanDiterimaTanggal` date DEFAULT NULL,
  `siswa_lulusTahun` varchar(10) DEFAULT NULL,
  `siswa_lulusNomorIjazah` varchar(100) DEFAULT NULL,
  `siswa_lulusMelanjutkanKe` varchar(255) DEFAULT NULL,
  `siswa_pindahKeSekolah` varchar(255) DEFAULT NULL,
  `siswa_pindahTingkatKelas` varchar(50) DEFAULT NULL,
  `siswa_pindahKeTingkat` varchar(50) DEFAULT NULL,
  `siswa_keluarAlasan` text DEFAULT NULL,
  `siswa_keluarTanggal` date DEFAULT NULL,
  `documents` json DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `pegawai` (
  `id` varchar(36) NOT NULL,
  `pegawai_nama` varchar(255) DEFAULT NULL,
  `pegawai_jenisKelamin` varchar(20) DEFAULT NULL,
  `pegawai_tempatLahir` varchar(100) DEFAULT NULL,
  `pegawai_tanggalLahir` date DEFAULT NULL,
  `pegawai_statusPerkawinan` varchar(50) DEFAULT NULL,
  `pegawai_jabatan` varchar(100) DEFAULT NULL,
  `pegawai_terhitungMulaiTanggal` date DEFAULT NULL,
  `pegawai_phaspoto` json DEFAULT NULL,
  `pegawai_nip` varchar(50) DEFAULT NULL,
  `pegawai_nuptk` varchar(50) DEFAULT NULL,
  `pegawai_nrg` varchar(50) DEFAULT NULL,
  `pegawai_tanggalPerkawinan` date DEFAULT NULL,
  `pegawai_namaPasangan` varchar(255) DEFAULT NULL,
  `pegawai_jumlahAnak` int(11) DEFAULT NULL,
  `pegawai_bidangStudi` varchar(100) DEFAULT NULL,
  `pegawai_tugasTambahan` varchar(100) DEFAULT NULL,
  `pegawai_alamatKabupaten` varchar(10) DEFAULT NULL,
  `pegawai_alamatKecamatan` varchar(10) DEFAULT NULL,
  `pegawai_alamatDesa` varchar(20) DEFAULT NULL,
  `pegawai_alamatDusun` varchar(255) DEFAULT NULL,
  `pegawai_pendidikanSD` json DEFAULT NULL,
  `pegawai_pendidikanSMP` json DEFAULT NULL,
  `pegawai_pendidikanSMA` json DEFAULT NULL,
  `pegawai_pendidikanDiploma` json DEFAULT NULL,
  `pegawai_pendidikanS1` json DEFAULT NULL,
  `pegawai_pendidikanS2` json DEFAULT NULL,
  `pegawai_skPengangkatan` json DEFAULT NULL,
  `pegawai_skNipBaru` json DEFAULT NULL,
  `pegawai_skFungsional` json DEFAULT NULL,
  `pegawai_beritaAcaraSumpah` json DEFAULT NULL,
  `pegawai_sertifikatPendidik` json DEFAULT NULL,
  `pegawai_sertifikatPelatihan` json DEFAULT NULL,
  `pegawai_skp` json DEFAULT NULL,
  `pegawai_karpeg` json DEFAULT NULL,
  `pegawai_karisKarsu` json DEFAULT NULL,
  `pegawai_bukuNikah` json DEFAULT NULL,
  `pegawai_kartuKeluarga` json DEFAULT NULL,
  `pegawai_ktp` json DEFAULT NULL,
  `pegawai_akteKelahiran` json DEFAULT NULL,
  `pegawai_kartuTaspen` json DEFAULT NULL,
  `pegawai_npwp` json DEFAULT NULL,
  `pegawai_kartuBpjs` json DEFAULT NULL,
  `pegawai_bukuRekening` json DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` enum('superadmin','admin','user') NOT NULL DEFAULT 'user',
  `status` enum('active','blocked') NOT NULL DEFAULT 'active',
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hapus user lama jika ada dan masukkan superadmin dengan password ter-hash
DELETE FROM `users` WHERE `email` = 'superadmin@app.com';
INSERT INTO `users` (`id`, `email`, `name`, `password`, `role`, `status`) VALUES
(UUID(), 'superadmin@app.com', 'Super Admin', '$2b$10$vDqYlYqgG/V3x..R/.pQ4.u.07j6sTEkdUMECpLp6qcr1S5tXSx.K', 'superadmin', 'active');


CREATE TABLE IF NOT EXISTS `provinsi` (
  `id` char(2) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `provinsi` (`id`, `name`) VALUES
('11', 'ACEH'),
('12', 'SUMATERA UTARA'),
('13', 'SUMATERA BARAT'),
('14', 'RIAU'),
('15', 'JAMBI'),
('16', 'SUMATERA SELATAN'),
('17', 'BENGKULU'),
('18', 'LAMPUNG'),
('19', 'KEPULAUAN BANGKA BELITUNG'),
('21', 'KEPULAUAN RIAU'),
('31', 'DKI JAKARTA'),
('32', 'JAWA BARAT'),
('33', 'JAWA TENGAH'),
('34', 'DI YOGYAKARTA'),
('35', 'JAWA TIMUR'),
('36', 'BANTEN'),
('51', 'BALI'),
('52', 'NUSA TENGGARA BARAT'),
('53', 'NUSA TENGGARA TIMUR'),
('61', 'KALIMANTAN BARAT'),
('62', 'KALIMANTAN TENGAH'),
('63', 'KALIMANTAN SELATAN'),
('64', 'KALIMANTAN TIMUR'),
('65', 'KALIMANTAN UTARA'),
('71', 'SULAWESI UTARA'),
('72', 'SULAWESI TENGAH'),
('73', 'SULAWESI SELATAN'),
('74', 'SULAWESI TENGGARA'),
('75', 'GORONTALO'),
('76', 'SULAWESI BARAT'),
('81', 'MALUKU'),
('82', 'MALUKU UTARA'),
('91', 'PAPUA BARAT'),
('94', 'PAPUA');

CREATE TABLE IF NOT EXISTS `kabupaten` (
  `id` char(4) NOT NULL,
  `province_id` char(2) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `province_id` (`province_id`),
  CONSTRAINT `kabupaten_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `provinsi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `kabupaten` (`id`, `province_id`, `name`) VALUES
('3201', '32', 'KABUPATEN BOGOR'),
('3273', '32', 'KOTA BANDUNG');


CREATE TABLE IF NOT EXISTS `kecamatan` (
  `id` char(7) NOT NULL,
  `regency_id` char(4) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `regency_id` (`regency_id`),
  CONSTRAINT `kecamatan_ibfk_1` FOREIGN KEY (`regency_id`) REFERENCES `kabupaten` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `kecamatan` (`id`, `regency_id`, `name`) VALUES
('320113', '3201', 'CILEUNGSI'),
('327301', '3273', 'SUKASARI'),
('327302', '3273', 'COBLONG');


CREATE TABLE IF NOT EXISTS `desa` (
  `id` char(11) NOT NULL,
  `district_id` char(7) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `district_id` (`district_id`),
  CONSTRAINT `desa_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `kecamatan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `desa` (`id`, `district_id`, `name`) VALUES
('3201132001', '320113', 'CILEUNGSI KIDUL'),
('3273011001', '327301', 'GEGERKALONG'),
('3273011002', '327301', 'SARIJADI'),
('3273021003', '327302', 'DAGO');
