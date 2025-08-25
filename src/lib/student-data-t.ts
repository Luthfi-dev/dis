// This file defines the shape of the student form data.
// It is used for TypeScript type safety and Zod for validation.
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional().nullable();

export const studentFormDataSchema = z.object({}).passthrough();

export type StudentFormData = {
  siswa_namaLengkap: string;
  siswa_nis: string;
  siswa_nisn: string;
  siswa_jenisKelamin?: 'Laki-laki' | 'Perempuan';
  siswa_tempatLahir?: string;
  siswa_tanggalLahir?: string;
  siswa_agama?: string;
  siswa_kewarganegaraan?: string;
  siswa_fotoProfil?: { fileName: string; fileURL: string; } | null;
  siswa_jumlahSaudara?: number | null;
  siswa_bahasa?: string;
  siswa_golonganDarah?: string;
  siswa_telepon?: string;
  siswa_alamatKkProvinsi?: string;
  siswa_alamatKkKabupaten?: string;
  siswa_alamatKkKecamatan?: string;
  siswa_alamatKkDesa?: string;
  siswa_domisiliProvinsi?: string;
  siswa_domisiliKabupaten?: string;
  siswa_domisiliKecamatan?: string;
  siswa_domisiliDesa?: string;
  siswa_tinggiBadan?: number | null;
  siswa_beratBadan?: number | null;
  siswa_penyakit?: string;
  siswa_kelainanJasmani?: string;
  documents?: {
    kartuKeluarga?: { fileName: string; fileURL: string; } | null;
    ktpAyah?: { fileName: string; fileURL: string; } | null;
    ktpIbu?: { fileName: string; fileURL: string; } | null;
    kartuIndonesiaPintar?: { fileName: string; fileURL: string; } | null;
    ijazah?: { fileName: string; fileURL: string; } | null;
    aktaKelahiran?: { fileName: string; fileURL: string; } | null;
    akteKematianAyah?: { fileName: string; fileURL: string; } | null;
    akteKematianIbu?: { fileName: string; fileURL: string; } | null;
    raporSmt1?: { fileName: string; fileURL: string; } | null;
    raporSmt2?: { fileName: string; fileURL: string; } | null;
    raporSmt3?: { fileName: string; fileURL: string; } | null;
    raporSmt4?: { fileName: string; fileURL: string; } | null;
    raporSmt5?: { fileName: string; fileURL: string; } | null;
    raporSmt6?: { fileName: string; fileURL: string; } | null;
    ijazahSmp?: { fileName: string; fileURL: string; } | null;
    transkripSmp?: { fileName: string; fileURL: string; } | null;
  };
  siswa_namaAyah?: string;
  siswa_namaIbu?: string;
  siswa_pendidikanAyah?: string;
  siswa_pendidikanIbu?: string;
  siswa_pekerjaanAyah?: string;
  siswa_pekerjaanIbu?: string;
  siswa_namaWali?: string;
  siswa_hubunganWali?: string;
  siswa_pendidikanWali?: string;
  siswa_pekerjaanWali?: string;
  siswa_alamatOrangTua?: string;
  siswa_teleponOrangTua?: string;
  siswa_asalSekolah?: string;
  siswa_nomorSttb?: string;
  siswa_tanggalSttb?: string | null;
  siswa_pindahanAsalSekolah?: string;
  siswa_pindahanDariTingkat?: string;
  siswa_pindahanDiterimaTanggal?: string | null;
  siswa_lulusTahun?: string;
  siswa_lulusNomorIjazah?: string;
  siswa_lulusMelanjutkanKe?: string;
  siswa_pindahKeSekolah?: string;
  siswa_pindahTingkatKelas?: string;
  siswa_pindahKeTingkat?: string;
  siswa_keluarAlasan?: string;
  siswa_keluarTanggal?: string | null;
  [key: string]: any;
};
