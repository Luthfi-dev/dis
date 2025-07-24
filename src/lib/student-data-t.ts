
// This file defines the shape of the student form data.
// It is used for TypeScript type safety and Zod for validation.
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional().nullable();

export const studentFormDataSchema = z.object({
  // Step 1: Data Siswa (Required Fields)
  siswa_namaLengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  siswa_nis: z.string().min(1, "NIS wajib diisi."),
  siswa_nisn: z.string().min(1, "NISN wajib diisi."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  siswa_agama: z.string().min(1, "Agama wajib dipilih."),
  siswa_kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib dipilih."),
  
  // Optional Fields
  siswa_fotoProfil: fileSchema,
  siswa_jumlahSaudara: z.number().optional().nullable(),
  siswa_bahasa: z.string().optional(),
  siswa_golonganDarah: z.string().optional(),
  siswa_telepon: z.string().optional(),
  
  // Alamat KK
  siswa_alamatKkProvinsi: z.string().optional(),
  siswa_alamatKkKabupaten: z.string().optional(),
  siswa_alamatKkKecamatan: z.string().optional(),
  siswa_alamatKkDesa: z.string().optional(),
  
  // Domisili
  siswa_domisiliProvinsi: z.string().optional(),
  siswa_domisiliKabupaten: z.string().optional(),
  siswa_domisiliKecamatan: z.string().optional(),
  siswa_domisiliDesa: z.string().optional(),

  // Kesehatan
  siswa_tinggiBadan: z.number().optional().nullable(),
  siswa_beratBadan: z.number().optional().nullable(),
  siswa_penyakit: z.string().optional(),
  siswa_kelainanJasmani: z.string().optional(),

  // Step 2: Dokumen
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
  }).optional(),

  // Step 3: Orang Tua
  siswa_namaAyah: z.string().optional(),
  siswa_namaIbu: z.string().optional(),
  siswa_pendidikanAyah: z.string().optional(),
  siswa_pendidikanIbu: z.string().optional(),
  siswa_pekerjaanAyah: z.string().optional(),
  siswa_pekerjaanIbu: z.string().optional(),
  siswa_namaWali: z.string().optional(),
  siswa_hubunganWali: z.string().optional(),
  siswa_pendidikanWali: z.string().optional(),
  siswa_pekerjaanWali: z.string().optional(),
  siswa_alamatOrangTua: z.string().optional(),
  siswa_teleponOrangTua: z.string().optional(),
  
  // Step 4: Perkembangan
  siswa_asalSekolah: z.string().optional(),
  siswa_nomorSttb: z.string().optional(),
  siswa_tanggalSttb: z.date().optional().nullable(),
  siswa_pindahanAsalSekolah: z.string().optional(),
  siswa_pindahanDariTingkat: z.string().optional(),
  siswa_pindahanDiterimaTanggal: z.date().optional().nullable(),

  // Step 5: Meninggalkan Sekolah
  siswa_lulusTahun: z.string().optional(),
  siswa_lulusNomorIjazah: z.string().optional(),
  siswa_lulusMelanjutkanKe: z.string().optional(),
  siswa_pindahKeSekolah: z.string().optional(),
  siswa_pindahTingkatKelas: z.string().optional(),
  siswa_pindahKeTingkat: z.string().optional(),
  siswa_keluarAlasan: z.string().optional(),
  siswa_keluarTanggal: z.date().optional().nullable(),
});

export type StudentFormData = z.infer<typeof studentFormDataSchema>;
