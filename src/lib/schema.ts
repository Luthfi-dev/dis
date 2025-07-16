
'use client';

import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});

// Skema dasar dengan semua kolom didefinisikan
const baseStudentFormSchema = z.object({
  siswa_fotoProfil: fileSchema,
  siswa_namaLengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  siswa_nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  siswa_nisn: z.string().length(10, "NISN harus 10 digit."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  siswa_agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  siswa_kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),
  siswa_jumlahSaudara: z.coerce.number(),
  siswa_bahasa: z.string(),
  siswa_golonganDarah: z.enum(['A', 'B', 'AB', 'O']),
  
  siswa_alamatKkProvinsi: z.string(),
  siswa_alamatKkKabupaten: z.string(),
  siswa_alamatKkKecamatan: z.string(),
  siswa_alamatKkDesa: z.string(),
  siswa_telepon: z.string(),
  siswa_domisiliProvinsi: z.string(),
  siswa_domisiliKabupaten: z.string(),
  siswa_domisiliKecamatan: z.string(),
  siswa_domisiliDesa: z.string(),

  siswa_namaAyah: z.string(),
  siswa_namaIbu: z.string(),
  siswa_pendidikanAyah: z.string(),
  siswa_pendidikanIbu: z.string(),
  siswa_pekerjaanAyah: z.string(),
  siswa_pekerjaanIbu: z.string(),
  siswa_namaWali: z.string(),
  siswa_hubunganWali: z.string(),
  siswa_pendidikanWali: z.string(),
  siswa_pekerjaanWali: z.string(),
  siswa_alamatOrangTua: z.string(),
  siswa_teleponOrangTua: z.string(),

  siswa_tinggiBadan: z.coerce.number(),
  siswa_beratBadan: z.coerce.number(),
  siswa_penyakit: z.string(),
  siswa_kelainanJasmani: z.string(),

  siswa_asalSekolah: z.string(),
  siswa_nomorSttb: z.string(),
  siswa_tanggalSttb: z.date().optional(),
  siswa_pindahanAsalSekolah: z.string(),
  siswa_pindahanDariTingkat: z.string(),
  siswa_pindahanDiterimaTanggal: z.date().optional(),

  siswa_lulusTahun: z.string(),
  siswa_lulusNomorIjazah: z.string(),
  siswa_lulusMelanjutkanKe: z.string(),
  siswa_pindahKeSekolah: z.string(),
  siswa_pindahTingkatKelas: z.string(),
  siswa_pindahKeTingkat: z.string(),
  siswa_keluarAlasan: z.string(),
  siswa_keluarTanggal: z.date().optional(),

  documents: z.object({
    kartuKeluarga: fileSchema,
    ktpAyah: fileSchema,
    ktpIbu: fileSchema,
    kartuIndonesiaPintar: fileSchema,
    ijazah: fileSchema,
    aktaKelahiran: fileSchema,
    akteKematianAyah: fileSchema,
    akteKematianIbu: fileSchema,
    raporSmt1: fileSchema,
    raporSmt2: fileSchema,
    raporSmt3: fileSchema,
    raporSmt4: fileSchema,
    raporSmt5: fileSchema,
    raporSmt6: fileSchema,
    ijazahSmp: fileSchema,
    transkripSmp: fileSchema,
  }),
});

// Skema utama yang digunakan oleh form resolver.
// .deepPartial() membuat semua field, termasuk di nested objects, menjadi optional.
export const studentFormSchema = baseStudentFormSchema.deepPartial().extend({
  // Tetapkan field yang benar-benar wajib di sini
  siswa_namaLengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  siswa_nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  siswa_nisn: z.string().length(10, "NISN harus 10 digit."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  siswa_agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  siswa_kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;

// Skema ketat ini HANYA digunakan di server untuk menentukan status 'Lengkap'
export const completeStudentFormSchema = baseStudentFormSchema.extend({
    siswa_bahasa: z.string().min(1, "Bahasa sehari-hari wajib diisi."),
    siswa_golonganDarah: z.enum(['A', 'B', 'AB', 'O'], { required_error: "Golongan darah wajib dipilih." }),
    siswa_alamatKkProvinsi: z.string().min(1, "Provinsi (KK) wajib dipilih."),
    siswa_alamatKkKabupaten: z.string().min(1, "Kabupaten (KK) wajib dipilih."),
    siswa_alamatKkKecamatan: z.string().min(1, "Kecamatan (KK) wajib dipilih."),
    siswa_alamatKkDesa: z.string().min(1, "Desa (KK) wajib diisi."),
    siswa_telepon: z.string().min(1, "Nomor HP/WA wajib diisi."),

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
