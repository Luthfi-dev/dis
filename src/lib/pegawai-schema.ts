
'use client';

import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

const multiFileSchema = z.array(z.object({
    fileName: z.string(),
    fileURL: z.string().url(),
})).optional();

const pendidikanSchema = z.object({
  tamatTahun: z.string().optional(),
  ijazah: fileSchema,
}).optional();

export const pegawaiFormSchema = z.object({
  pegawai_nama: z.string().min(1, "Nama lengkap wajib diisi."),
  pegawai_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  pegawai_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  pegawai_tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi.'),
  pegawai_statusPerkawinan: z.enum(['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'], { required_error: "Status perkawinan wajib dipilih." }),
  pegawai_jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  pegawai_terhitungMulaiTanggal: z.string().min(1, 'TMT wajib diisi.'),

  pegawai_phaspoto: fileSchema,
  pegawai_nip: z.string().optional(),
  pegawai_nuptk: z.string().optional(),
  pegawai_nrg: z.string().optional(),
  pegawai_tanggalPerkawinan: z.string().optional().nullable(),
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
  ]).optional(),
  
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

// This schema is used to determine the "status" of the record.
// It is NOT used for blocking form submission.
export const completePegawaiFormSchema = pegawaiFormSchema.extend({
    pegawai_nip: z.string().min(1, 'NIP wajib diisi untuk status Lengkap.'),
    pegawai_nuptk: z.string().min(1, 'NUPTK wajib diisi untuk status Lengkap.'),
    pegawai_phaspoto: fileSchema.refine(val => val?.fileURL, { message: "Phaspoto wajib diunggah." }),
});
