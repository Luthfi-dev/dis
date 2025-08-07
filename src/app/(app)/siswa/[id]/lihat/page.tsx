
'use server';

import { LihatSiswaClient } from './lihat-siswa-client';

export default async function LihatSiswaPage({ params }: { params: { id: string } }) {
  const id = params.id;
  return <LihatSiswaClient id={id} />;
}
