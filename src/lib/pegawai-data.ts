
import { PegawaiFormData } from "./pegawai-schema";

export type Pegawai = PegawaiFormData & {
  id: string;
  status: 'Lengkap' | 'Belum Lengkap';
};

export const mockPegawaiData: Pegawai[] = [];
