
'use client';

import { z } from 'zod';

// Skema untuk file, dibuat sepenuhnya opsional
const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

// Skema untuk file yang wajib ada (hanya untuk status 'Lengkap')
const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});

// Skema untuk array file, sepenuhnya opsional
const multiFileSchema = z.array(z.object({
    fileName: z.string(),
    fileURL: z.string().url(),
})).optional();

// Skema untuk riwayat pendidikan, dibuat sepenuhnya opsional
const pendidikanSchema = z.object({
  tamatTahun: z.string().optional(),
  ijazah: fileSchema,
}).optional();


// --- SKEMA UTAMA UNTUK FORMULIR ---
// Dibuat sangat longgar sesuai permintaan. Hanya kolom identitas yang divalidasi.
export const pegawaiFormSchema = z.object({
  // --- Identitas Pegawai (Wajib) ---
  pegawai_nama: z.string().min(1, "Nama lengkap wajib diisi."),
  pegawai_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  pegawai_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  pegawai_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  pegawai_statusPerkawinan: z.enum(['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'], { required_error: "Status perkawinan wajib dipilih." }),
  pegawai_jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  pegawai_terhitungMulaiTanggal: z.date({ required_error: "TMT wajib diisi." }),

  // --- Semua kolom lainnya adalah OPSIONAL ---
  pegawai_phaspoto: fileSchema,
  pegawai_nip: z.string().optional(),
  pegawai_nuptk: z.string().optional(),
  pegawai_nrg: z.string().optional(),
  pegawai_tanggalPerkawinan: z.date().optional().nullable(),
  pegawai_namaPasangan: z.string().optional(),
  pegawai_jumlahAnak: z.coerce.number().optional(),
  pegawai_bidangStudi: z.string().optional(),
  pegawai_tugasTambahan: z.enum([
    'Kepala Sekolah',
    'Wakasek Bidang Kesiswaan',
    'Wakasek Bidang Kurikulum',
    'Wakasek Bidang Sarana',
    'Wakasek Bidang Humas',
    'Kepala LAB',
    'Kepala Perpustakaan',
  ]).optional().nullable(),
  
  pegawai_alamatKabupaten: z.string().optional(),
  pegawai_alamatKecamatan: z.string().optional(),
  pegawai_alamatDesa: z.string().optional(),
  pegawai_alamatDusun: z.string().optional(),
  
  pegawai_pendidikanSD: pendidikanSchema,
  pegawai_pendidikanSMP: pendidikanSchema,
  pegawai_pendidikanSMA: pendidikanSchema,
  pegawai_pendidikanDiploma: pendidikanSchema,
  pegawai_pendidikanS1: pendidikanSchema,
  pegawai_pendidikanS2: pendidikanSchema,

  pegawai_skPengangkatan: multiFileSchema,
  pegawai_skNipBaru: fileSchema,
  pegawai_skFungsional: multiFileSchema,
  pegawai_beritaAcaraSumpah: fileSchema,
  pegawai_sertifikatPendidik: fileSchema,
  pegawai_sertifikatPelatihan: multiFileSchema,
  pegawai_skp: multiFileSchema,
  pegawai_karpeg: fileSchema,
  pegawai_karisKarsu: fileSchema,
  pegawai_bukuNikah: fileSchema,
  pegawai_kartuKeluarga: fileSchema,
  pegawai_ktp: fileSchema,
  pegawai_akteKelahiran: fileSchema,
  pegawai_kartuTaspen: fileSchema,
  pegawai_npwp: fileSchema,
  pegawai_kartuBpjs: fileSchema,
  pegawai_bukuRekening: fileSchema,
});

export type PegawaiFormData = z.infer<typeof pegawaiFormSchema>;

// Skema ketat ini HANYA digunakan di server untuk menentukan status 'Lengkap'
// dan tidak akan pernah memblokir proses simpan data.
export const completePegawaiFormSchema = pegawaiFormSchema.extend({
    pegawai_nip: z.string().min(1, 'NIP wajib diisi untuk status Lengkap.'),
    pegawai_nuptk: z.string().min(1, 'NUPTK wajib diisi untuk status Lengkap.'),

    pegawai_pendidikanSD: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SD wajib diisi'), ijazah: requiredFileSchema }),
    pegawai_pendidikanSMP: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SMP wajib diisi'), ijazah: requiredFileSchema }),
    pegawai_pendidikanSMA: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SMA wajib diisi'), ijazah: requiredFileSchema }),

    pegawai_skPengangkatan: z.array(requiredFileSchema).min(1, "SK Pengangkatan wajib diunggah"),
    pegawai_skNipBaru: requiredFileSchema,
    pegawai_skFungsional: z.array(requiredFileSchema).min(1, "SK Fungsional wajib diunggah"),
    pegawai_beritaAcaraSumpah: requiredFileSchema,
    pegawai_sertifikatPendidik: requiredFileSchema,
    pegawai_sertifikatPelatihan: z.array(requiredFileSchema).min(1, "Sertifikat Pelatihan wajib diunggah"),
    pegawai_skp: z.array(requiredFileSchema).min(1, "SKP wajib diunggah"),
    pegawai_karpeg: requiredFileSchema,
    pegawai_karisKarsu: requiredFileSchema,
    pegawai_bukuNikah: requiredFileSchema,
    pegawai_kartuKeluarga: requiredFileSchema,
    pegawai_ktp: requiredFileSchema,
    pegawai_akteKelahiran: requiredFileSchema,
    pegawai_kartuTaspen: requiredFileSchema,
    pegawai_npwp: requiredFileSchema,
    pegawai_kartuBpjs: requiredFileSchema,
    pegawai_bukuRekening: requiredFileSchema,
});
