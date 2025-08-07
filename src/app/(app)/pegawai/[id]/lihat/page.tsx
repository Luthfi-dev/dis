
'use server';

import { LihatPegawaiClient } from './lihat-pegawai-client';

export default async function LihatPegawaiPage({ params }: { params: { id: string } }) {
  const id = params.id;
  return <LihatPegawaiClient id={id} />;
}
