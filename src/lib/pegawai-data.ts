
import { PegawaiFormData } from "./pegawai-schema";

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
