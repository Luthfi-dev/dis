
import { PegawaiFormData } from "./pegawai-schema";

export type Pegawai = PegawaiFormData & {
  id: string;
  nama: string;
  nip?: string;
  jabatan: string;
  status: 'Lengkap' | 'Belum Lengkap';
};

// To make this work on the server, we need a global variable to simulate a database.
// In a real app, this would be a database connection.
declare global {
  var pegawai: Pegawai[];
}

export const mockPegawaiData: Pegawai[] = global.pegawai || [];

if (process.env.NODE_ENV !== 'production') {
  global.pegawai = global.pegawai || [];
}
