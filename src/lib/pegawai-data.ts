
import { z } from "zod";

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).optional();

// Create a non-optional version for use in arrays
const requiredFileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
});

// This is the shape of the data from the form
export const pegawaiFormDataSchema = z.object({}).passthrough();


export type PegawaiFormData = {
  pegawai_nama: string;
  pegawai_jenisKelamin?: 'Laki-laki' | 'Perempuan';
  pegawai_tempatLahir?: string;
  pegawai_tanggalLahir?: Date;
  pegawai_statusPerkawinan?: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pegawai_jabatan?: string;
  pegawai_terhitungMulaiTanggal?: Date;
  pegawai_phaspoto?: { fileName: string; fileURL: string; };
  pegawai_nip: string;
  pegawai_nuptk?: string;
  pegawai_nrg?: string;
  pegawai_tanggalPerkawinan?: Date | null;
  pegawai_namaPasangan?: string;
  pegawai_jumlahAnak?: number | null;
  pegawai_bidangStudi?: string;
  pegawai_tugasTambahan?: string;
  pegawai_alamatKabupaten?: string;
  pegawai_alamatKecamatan?: string;
  pegawai_alamatDesa?: string;
  pegawai_alamatDusun?: string;
  pegawai_pendidikanSD?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_pendidikanSMP?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_pendidikanSMA?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_pendidikanDiploma?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_pendidikanS1?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_pendidikanS2?: { tamatTahun?: string; ijazah?: { fileName: string; fileURL: string; } };
  pegawai_skPengangkatan?: { fileName: string; fileURL: string; }[];
  pegawai_skNipBaru?: { fileName: string; fileURL: string; };
  pegawai_skFungsional?: { fileName: string; fileURL: string; }[];
  pegawai_beritaAcaraSumpah?: { fileName: string; fileURL: string; };
  pegawai_sertifikatPendidik?: { fileName: string; fileURL: string; };
  pegawai_sertifikatPelatihan?: { fileName: string; fileURL: string; }[];
  pegawai_skp?: { fileName: string; fileURL: string; }[];
  pegawai_karpeg?: { fileName: string; fileURL: string; };
  pegawai_karisKarsu?: { fileName: string; fileURL: string; };
  pegawai_bukuNikah?: { fileName: string; fileURL: string; };
  pegawai_kartuKeluarga?: { fileName: string; fileURL: string; };
  pegawai_ktp?: { fileName: string; fileURL: string; };
  pegawai_akteKelahiran?: { fileName: string; fileURL: string; };
  pegawai_kartuTaspen?: { fileName: string; fileURL: string; };
  pegawai_npwp?: { fileName: string; fileURL: string; };
  pegawai_kartuBpjs?: { fileName: string; fileURL: string; };
  pegawai_bukuRekening?: { fileName: string; fileURL: string; };
  [key: string]: any;
}


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
