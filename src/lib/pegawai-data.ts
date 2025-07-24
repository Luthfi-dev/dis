
import { z } from "zod";

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

// This is the shape of the data from the form
export const pegawaiFormDataSchema = z.object({
  pegawai_nama: z.string().min(1, "Nama wajib diisi."),
  pegawai_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  pegawai_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  pegawai_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  pegawai_statusPerkawinan: z.enum(['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'], { required_error: "Status perkawinan wajib dipilih." }),
  pegawai_jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  pegawai_terhitungMulaiTanggal: z.date({ required_error: "TMT wajib diisi." }),

  pegawai_phaspoto: fileSchema,
  pegawai_nip: z.string().optional(),
  pegawai_nuptk: z.string().optional(),
  pegawai_nrg: z.string().optional(),
  pegawai_tanggalPerkawinan: z.date().optional().nullable(),
  pegawai_namaPasangan: z.string().optional(),
  pegawai_jumlahAnak: z.number().optional().nullable(),
  pegawai_bidangStudi: z.string().optional(),
  pegawai_tugasTambahan: z.string().optional(),
  
  pegawai_alamatKabupaten: z.string().optional(),
  pegawai_alamatKecamatan: z.string().optional(),
  pegawai_alamatDesa: z.string().optional(),
  pegawai_alamatDusun: z.string().optional(),
  
  pegawai_pendidikanSD: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanSMP: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanSMA: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanDiploma: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanS1: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanS2: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),

  pegawai_skPengangkatan: z.array(fileSchema.required()).optional(),
  pegawai_skNipBaru: fileSchema,
  pegawai_skFungsional: z.array(fileSchema.required()).optional(),
  pegawai_beritaAcaraSumpah: fileSchema,
  pegawai_sertifikatPendidik: fileSchema,
  pegawai_sertifikatPelatihan: z.array(fileSchema.required()).optional(),
  pegawai_skp: z.array(fileSchema.required()).optional(),
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
