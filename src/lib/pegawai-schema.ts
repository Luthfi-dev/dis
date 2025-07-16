
'use client';

import { z } from 'zod';

// This is the simplest possible schema to avoid validation conflicts.
// Only the most basic fields have minimal checks. Everything else is `any`.
const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

export const pegawaiFormSchema = z.object({
  // --- Required fields with minimal validation ---
  pegawai_nama: z.string().min(1, "Nama lengkap wajib diisi."),
  pegawai_jenisKelamin: z.string().min(1, "Jenis kelamin wajib dipilih."),
  pegawai_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  pegawai_tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi.'),
  pegawai_statusPerkawinan: z.string().min(1, "Status perkawinan wajib dipilih."),
  pegawai_jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  pegawai_terhitungMulaiTanggal: z.string().min(1, 'TMT wajib diisi.'),

  // --- All other fields are optional and accept any type to prevent validation errors ---
  pegawai_phaspoto: z.any().optional(),
  pegawai_nip: z.any().optional(),
  pegawai_nuptk: z.any().optional(),
  pegawai_nrg: z.any().optional(),
  pegawai_tanggalPerkawinan: z.any().optional(),
  pegawai_namaPasangan: z.any().optional(),
  pegawai_jumlahAnak: z.any().optional(),
  pegawai_bidangStudi: z.any().optional(),
  pegawai_tugasTambahan: z.any().optional(),
  
  pegawai_alamatKabupaten: z.any().optional(),
  pegawai_alamatKecamatan: z.any().optional(),
  pegawai_alamatDesa: z.any().optional(),
  pegawai_alamatDusun: z.any().optional(),
  
  pegawai_pendidikanSD: z.any().optional(),
  pegawai_pendidikanSMP: z.any().optional(),
  pegawai_pendidikanSMA: z.any().optional(),
  pegawai_pendidikanDiploma: z.any().optional(),
  pegawai_pendidikanS1: z.any().optional(),
  pegawai_pendidikanS2: z.any().optional(),

  pegawai_skPengangkatan: z.any().optional(),
  pegawai_skNipBaru: z.any().optional(),
  pegawai_skFungsional: z.any().optional(),
  pegawai_beritaAcaraSumpah: z.any().optional(),
  pegawai_sertifikatPendidik: z.any().optional(),
  pegawai_sertifikatPelatihan: z.any().optional(),
  pegawai_skp: z.any().optional(),
  pegawai_karpeg: z.any().optional(),
  pegawai_karisKarsu: z.any().optional(),
  pegawai_bukuNikah: z.any().optional(),
  pegawai_kartuKeluarga: z.any().optional(),
  pegawai_ktp: z.any().optional(),
  pegawai_akteKelahiran: z.any().optional(),
  pegawai_kartuTaspen: z.any().optional(),
  pegawai_npwp: z.any().optional(),
  pegawai_kartuBpjs: z.any().optional(),
  pegawai_bukuRekening: z.any().optional(),
});

export type PegawaiFormData = z.infer<typeof pegawaiFormSchema>;

// This schema is for checking "Lengkap" status. It's not used for blocking saves.
export const completePegawaiFormSchema = pegawaiFormSchema.extend({
    pegawai_nip: z.string().min(1, 'NIP wajib diisi untuk status Lengkap.'),
    pegawai_nuptk: z.string().min(1, 'NUPTK wajib diisi untuk status Lengkap.'),
    pegawai_phaspoto: fileSchema.refine(val => val?.fileURL, { message: "Phaspoto wajib diunggah." }),
    pegawai_ktp: fileSchema.refine(val => val?.fileURL, { message: "KTP wajib diunggah." }),
});
