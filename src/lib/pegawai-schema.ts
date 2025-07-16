
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  file: z.any().optional(),
  fileURL: z.string().optional(),
}).optional();

export const dataIdentitasPegawaiSchema = z.object({
  phaspoto: fileSchema,
  nama: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  nip: z.string().optional(),
  nuptk: z.string().optional(),
  nrg: z.string().optional(),
  statusPerkawinan: z.enum(['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'], { required_error: "Status perkawinan wajib dipilih." }),
  tanggalPerkawinan: z.date().optional(),
  namaPasangan: z.string().optional(),
  jumlahAnak: z.coerce.number().nonnegative("Jumlah anak tidak boleh negatif.").optional(),
  jabatan: z.string().min(1, "Jabatan wajib diisi."),
  bidangStudi: z.string().min(1, "Bidang studi wajib diisi."),
  tugasTambahan: z.enum([
    'Kepala Sekolah',
    'Wakasek Bidang Kesiswaan',
    'Wakasek Bidang Kurikulum',
    'Wakasek Bidang Sarana',
    'Wakasek Bidang Humas',
    'Kepala LAB',
    'Kepala Perpustakaan',
  ]).optional(),
  terhitungMulaiTanggal: z.date({ required_error: "TMT wajib diisi." }),
  alamatKabupaten: z.string().min(1, "Kabupaten wajib dipilih."),
  alamatKecamatan: z.string().min(1, "Kecamatan wajib dipilih."),
  alamatDesa: z.string().min(1, "Desa wajib dipilih."),
  alamatDusun: z.string().min(1, "Dusun wajib diisi."),
  
  pendidikanSD: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pendidikanSMP: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pendidikanSMA: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pendidikanDiploma: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pendidikanS1: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pendidikanS2: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
});

export const pegawaiFormSchema = dataIdentitasPegawaiSchema;

export type PegawaiFormData = z.infer<typeof pegawaiFormSchema>;
