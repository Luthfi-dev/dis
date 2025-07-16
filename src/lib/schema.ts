
'use client';

import { z } from 'zod';

// Skema yang paling sederhana untuk memastikan tidak ada lagi konflik tipe data.
const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

// Skema untuk status "Lengkap", tidak memblokir simpan
const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});


export const studentFormSchema = z.object({
  // --- Kolom Wajib dengan Validasi Minimal ---
  siswa_namaLengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  siswa_nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  siswa_nisn: z.string().length(10, "NISN harus 10 digit."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi."),
  siswa_agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  siswa_kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),

  // --- Semua kolom lain dibuat `z.any().optional()` untuk menghindari error validasi tipe ---
  siswa_fotoProfil: z.any().optional(),
  siswa_jumlahSaudara: z.any().optional(),
  siswa_bahasa: z.any().optional(),
  siswa_golonganDarah: z.any().optional(),
  
  siswa_alamatKkProvinsi: z.any().optional(),
  siswa_alamatKkKabupaten: z.any().optional(),
  siswa_alamatKkKecamatan: z.any().optional(),
  siswa_alamatKkDesa: z.any().optional(),
  siswa_telepon: z.any().optional(),
  siswa_domisiliProvinsi: z.any().optional(),
  siswa_domisiliKabupaten: z.any().optional(),
  siswa_domisiliKecamatan: z.any().optional(),
  siswa_domisiliDesa: z.any().optional(),

  siswa_namaAyah: z.any().optional(),
  siswa_namaIbu: z.any().optional(),
  siswa_pendidikanAyah: z.any().optional(),
  siswa_pendidikanIbu: z.any().optional(),
  siswa_pekerjaanAyah: z.any().optional(),
  siswa_pekerjaanIbu: z.any().optional(),
  siswa_namaWali: z.any().optional(),
  siswa_hubunganWali: z.any().optional(),
  siswa_pendidikanWali: z.any().optional(),
  siswa_pekerjaanWali: z.any().optional(),
  siswa_alamatOrangTua: z.any().optional(),
  siswa_teleponOrangTua: z.any().optional(),

  siswa_tinggiBadan: z.any().optional(),
  siswa_beratBadan: z.any().optional(),
  siswa_penyakit: z.any().optional(),
  siswa_kelainanJasmani: z.any().optional(),

  siswa_asalSekolah: z.any().optional(),
  siswa_nomorSttb: z.any().optional(),
  siswa_tanggalSttb: z.any().optional(),
  siswa_pindahanAsalSekolah: z.any().optional(),
  siswa_pindahanDariTingkat: z.any().optional(),
  siswa_pindahanDiterimaTanggal: z.any().optional(),

  siswa_lulusTahun: z.any().optional(),
  siswa_lulusNomorIjazah: z.any().optional(),
  siswa_lulusMelanjutkanKe: z.any().optional(),
  siswa_pindahKeSekolah: z.any().optional(),
  siswa_pindahTingkatKelas: z.any().optional(),
  siswa_pindahKeTingkat: z.any().optional(),
  siswa_keluarAlasan: z.any().optional(),
  siswa_keluarTanggal: z.any().optional(),

  documents: z.any().optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;

export const completeStudentFormSchema = studentFormSchema.extend({
    siswa_bahasa: z.string().min(1, "Bahasa sehari-hari wajib diisi."),
    siswa_golonganDarah: z.enum(['A', 'B', 'AB', 'O'], { required_error: "Golongan darah wajib dipilih." }),
    siswa_alamatKkProvinsi: z.string().min(1, "Provinsi (KK) wajib dipilih."),
    siswa_alamatKkKabupaten: z.string().min(1, "Kabupaten (KK) wajib dipilih."),
    siswa_alamatKkKecamatan: z.string().min(1, "Kecamatan (KK) wajib dipilih."),
    siswa_alamatKkDesa: z.string().min(1, "Desa (KK) wajib diisi."),
    siswa_telepon: z.string().min(1, "Nomor HP/WA wajib diisi."),
    siswa_fotoProfil: fileSchema.refine(val => val?.fileURL, { message: "Foto profil wajib diunggah." }),
    documents: z.object({
        kartuKeluarga: requiredFileSchema,
        ktpAyah: requiredFileSchema,
        ktpIbu: requiredFileSchema,
        kartuIndonesiaPintar: requiredFileSchema,
        ijazah: requiredFileSchema,
        aktaKelahiran: requiredFileSchema,
        akteKematianAyah: fileSchema,
        akteKematianIbu: fileSchema,
        raporSmt1: requiredFileSchema,
        raporSmt2: requiredFileSchema,
        raporSmt3: requiredFileSchema,
        raporSmt4: requiredFileSchema,
        raporSmt5: requiredFileSchema,
        raporSmt6: requiredFileSchema,
        ijazahSmp: requiredFileSchema,
        transkripSmp: requiredFileSchema,
    }),

    siswa_namaAyah: z.string().min(1, "Nama Ayah wajib diisi."),
    siswa_namaIbu: z.string().min(1, "Nama Ibu wajib diisi."),
    siswa_pendidikanAyah: z.string().min(1, "Pendidikan Ayah wajib diisi."),
    siswa_pendidikanIbu: z.string().min(1, "Pendidikan Ibu wajib diisi."),
    siswa_pekerjaanAyah: z.string().min(1, "Pekerjaan Ayah wajib diisi."),
    siswa_pekerjaanIbu: z.string().min(1, "Pekerjaan Ibu wajib diisi."),
    siswa_alamatOrangTua: z.string().min(1, "Alamat Orang Tua wajib diisi."),
    
    siswa_tinggiBadan: z.coerce.number().positive("Tinggi badan harus diisi."),
    siswa_beratBadan: z.coerce.number().positive("Berat badan harus diisi."),
    
    siswa_asalSekolah: z.string().min(1, "Asal sekolah wajib diisi."),
});
