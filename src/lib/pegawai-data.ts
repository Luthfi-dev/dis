
import { z } from "zod";

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
});

// This is the shape of the data from the form
export const pegawaiFormDataSchema = z.object({
  pegawai_nama: z.any().optional(),
  pegawai_jenisKelamin: z.any().optional(),
  pegawai_tempatLahir: z.any().optional(),
  pegawai_tanggalLahir: z.any().optional(),
  pegawai_statusPerkawinan: z.any().optional(),
  pegawai_jabatan: z.any().optional(),
  pegawai_terhitungMulaiTanggal: z.any().optional(),

  pegawai_phaspoto: fileSchema.optional(),
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

  pegawai_skPengangkatan: z.array(fileSchema).optional(),
  pegawai_skNipBaru: fileSchema.optional(),
  pegawai_skFungsional: z.array(fileSchema).optional(),
  pegawai_beritaAcaraSumpah: fileSchema.optional(),
  pegawai_sertifikatPendidik: fileSchema.optional(),
  pegawai_sertifikatPelatihan: z.array(fileSchema).optional(),
  pegawai_skp: z.array(fileSchema).optional(),
  pegawai_karpeg: fileSchema.optional(),
  pegawai_karisKarsu: fileSchema.optional(),
  pegawai_bukuNikah: fileSchema.optional(),
  pegawai_kartuKeluarga: fileSchema.optional(),
  pegawai_ktp: fileSchema.optional(),
  pegawai_akteKelahiran: fileSchema.optional(),
  pegawai_kartuTaspen: fileSchema.optional(),
  pegawai_npwp: fileSchema.optional(),
  pegawai_kartuBpjs: fileSchema.optional(),
  pegawai_bukuRekening: fileSchema.optional(),
});


export type PegawaiFormData = z.infer<typeof pegawaiFormDataSchema>;

// This is the final shape of the data in the "database"
export type Pegawai = PegawaiFormData & {
  id: string;
  status: 'Lengkap' | 'Belum Lengkap';
};

// To make this work on the server, we need a global variable to simulate a database.
// In a real app, this would be a database connection.
declare global {
  var pegawai: Pegawai[];
}

// Initialize the global variable only if it's not already defined.
if (!(global as any).pegawai) {
  (global as any).pegawai = [];
}
