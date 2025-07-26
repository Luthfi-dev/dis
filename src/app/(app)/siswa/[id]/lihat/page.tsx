
'use server';

import { LihatSiswaClient } from './lihat-siswa-client';
import { decryptId } from '@/lib/utils';

export default async function LihatSiswaPage({ params }: { params: { id: string } }) {
  const id = decryptId(params.id);
  return <LihatSiswaClient id={id} />;
}
