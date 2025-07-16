
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  file: z.any().optional(),
  fileURL: z.string().optional(),
}).nullable().optional();

const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  file: z.any().optional(),
  fileURL: z.string().optional(),
});


const multiFileSchema = z.array(z.object({
    fileName: z.string(),
    file: z.any().optional(),
    fileURL: z.string().optional(),
})).optional();

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
  tanggalPerkawinan: z.date().optional().nullable(),
  namaPasangan: z.string().optional(),
  jumlahAnak: z.coerce.number().nonnegative("Jumlah anak tidak boleh negatif.").optional(),
  jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  bidangStudi: z.string().min(1, "Bidang studi wajib diisi."),
  tugasTambahan: z.enum([
    'Kepala Sekolah',
    'Wakasek Bidang Kesiswaan',
    'Wakasek Bidang Kurikulum',
    'Wakasek Bidang Sarana',
    'Wakasek Bidang Humas',
    'Kepala LAB',
    'Kepala Perpustakaan',
  ]).optional().nullable(),
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

export const filePegawaiSchema = z.object({
    skPengangkatan: multiFileSchema,
    skNipBaru: fileSchema,
    skFungsional: multiFileSchema,
    beritaAcaraSumpah: fileSchema,
    sertifikatPendidik: fileSchema,
    sertifikatPelatihan: multiFileSchema,
    skp: multiFileSchema,
    karpeg: fileSchema,
    karisKarsu: fileSchema,
    bukuNikah: fileSchema,
    kartuKeluarga: fileSchema,
    ktp: fileSchema,
    akteKelahiran: fileSchema,
    kartuTaspen: fileSchema,
    npwp: fileSchema,
    kartuBpjs: fileSchema,
    bukuRekening: fileSchema,
});


export const pegawaiFormSchema = dataIdentitasPegawaiSchema.merge(filePegawaiSchema);

export type PegawaiFormData = z.infer<typeof pegawaiFormSchema>;


// Schema for checking completion status
export const completePegawaiFormSchema = dataIdentitasPegawaiSchema.merge(
  z.object({
    phaspoto: requiredFileSchema,
    pendidikanSD: z.object({ tamatTahun: z.string().min(1), ijazah: requiredFileSchema }),
    pendidikanSMP: z.object({ tamatTahun: z.string().min(1), ijazah: requiredFileSchema }),
    pendidikanSMA: z.object({ tamatTahun: z.string().min(1), ijazah: requiredFileSchema }),
    pendidikanDiploma: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }),
    pendidikanS1: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }),
    pendidikanS2: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }),
  })
).merge(
  z.object({
    skPengangkatan: z.array(requiredFileSchema).min(1),
    skNipBaru: requiredFileSchema,
    skFungsional: z.array(requiredFileSchema).min(1),
    beritaAcaraSumpah: requiredFileSchema,
    sertifikatPendidik: requiredFileSchema,
    sertifikatPelatihan: z.array(requiredFileSchema).min(1),
    skp: z.array(requiredFileSchema).min(1),
    karpeg: requiredFileSchema,
    karisKarsu: requiredFileSchema,
    bukuNikah: requiredFileSchema,
    kartuKeluarga: requiredFileSchema,
    ktp: requiredFileSchema,
    akteKelahiran: requiredFileSchema,
    kartuTaspen: requiredFileSchema,
    npwp: requiredFileSchema,
    kartuBpjs: requiredFileSchema,
    bukuRekening: requiredFileSchema,
  })
);
