
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url('URL tidak valid'),
}).nullable().optional();

const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});

const multiFileSchema = z.array(z.object({
    fileName: z.string(),
    fileURL: z.string().url('URL tidak valid'),
})).optional();

export const pegawai_IdentitasSchema = z.object({
  pegawai_phaspoto: z.any().optional(),
  pegawai_nama: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  pegawai_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  pegawai_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  pegawai_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  pegawai_nip: z.string().optional(),
  pegawai_nuptk: z.string().optional(),
  pegawai_nrg: z.string().optional(),
  pegawai_statusPerkawinan: z.enum(['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'], { required_error: "Status perkawinan wajib dipilih." }),
  pegawai_tanggalPerkawinan: z.date().optional().nullable(),
  pegawai_namaPasangan: z.string().optional(),
  pegawai_jumlahAnak: z.coerce.number().nonnegative("Jumlah anak tidak boleh negatif.").optional(),
  pegawai_jabatan: z.string().min(1, "Jabatan wajib dipilih."),
  pegawai_bidangStudi: z.string().min(1, "Bidang studi wajib diisi."),
  pegawai_tugasTambahan: z.enum([
    'Kepala Sekolah',
    'Wakasek Bidang Kesiswaan',
    'Wakasek Bidang Kurikulum',
    'Wakasek Bidang Sarana',
    'Wakasek Bidang Humas',
    'Kepala LAB',
    'Kepala Perpustakaan',
  ]).optional().nullable(),
  pegawai_terhitungMulaiTanggal: z.date({ required_error: "TMT wajib diisi." }),
  pegawai_alamatKabupaten: z.string().min(1, "Kabupaten wajib dipilih."),
  pegawai_alamatKecamatan: z.string().min(1, "Kecamatan wajib dipilih."),
  pegawai_alamatDesa: z.string().min(1, "Desa wajib dipilih."),
  pegawai_alamatDusun: z.string().min(1, "Dusun wajib diisi."),
  
  pegawai_pendidikanSD: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanSMP: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanSMA: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanDiploma: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanS1: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
  pegawai_pendidikanS2: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema }).optional(),
});

export const pegawai_FileSchema = z.object({
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


export const pegawaiFormSchema = pegawai_IdentitasSchema.merge(pegawai_FileSchema);

export type PegawaiFormData = z.infer<typeof pegawaiFormSchema>;


// Schema for checking completion status
export const completePegawaiFormSchema = pegawai_IdentitasSchema.extend({
    // All education levels now require tamatTahun and ijazah for completion.
    // Making them stricter.
    pegawai_pendidikanSD: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SD wajib diisi'), ijazah: requiredFileSchema }),
    pegawai_pendidikanSMP: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SMP wajib diisi'), ijazah: requiredFileSchema }),
    pegawai_pendidikanSMA: z.object({ tamatTahun: z.string().min(1, 'Tahun tamat SMA wajib diisi'), ijazah: requiredFileSchema }),
    // Diploma, S1, S2 remain optional for completion.
    pegawai_pendidikanDiploma: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }).optional(),
    pegawai_pendidikanS1: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }).optional(),
    pegawai_pendidikanS2: z.object({ tamatTahun: z.string().optional(), ijazah: fileSchema.optional() }).optional(),
  }).merge(
  z.object({
    // All files are required for completion.
    pegawai_skPengangkatan: z.array(requiredFileSchema).min(1, "SK Pengangkatan wajib diunggah"),
    pegawai_skNipBaru: requiredFileSchema,
    pegawai_skFungsional: z.array(requiredFileSchema).min(1, "SK Fungsional wajib diunggah"),
    pegawai_beritaAcaraSumpah: requiredFileSchema,
    pegawai_sertifikatPendidik: requiredFileSchema,
    pegawai_sertifikatPelatihan: z.array(requiredFileSchema).min(1, "Sertifikat Pelatihan wajib diunggah"),
    pegawai_skp: z.array(requiredFileSchema).min(1, "SKP wajib diunggah"),
    pegawai_karpeg: requiredFileSchema,
    pegawai_karisKarsu: requiredFileSchema,
    pegawai_bukuNikah: requiredFileSchema,
    pegawai_kartuKeluarga: requiredFileSchema,
    pegawai_ktp: requiredFileSchema,
    pegawai_akteKelahiran: requiredFileSchema,
    pegawai_kartuTaspen: requiredFileSchema,
    pegawai_npwp: requiredFileSchema,
    pegawai_kartuBpjs: requiredFileSchema,
    pegawai_bukuRekening: requiredFileSchema,
  })
);
