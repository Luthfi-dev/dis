
'use server';

import { LihatPegawaiClient } from './lihat-pegawai-client';
import { decryptId } from '@/lib/utils';

export default async function LihatPegawaiPage({ params }: { params: { id: string } }) {
  const id = decryptId(params.id);
  return <LihatPegawaiClient id={id} />;
}
