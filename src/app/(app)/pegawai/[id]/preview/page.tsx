
'use server';
import { PreviewPegawaiClient } from './preview-client';
import { decryptId } from '@/lib/utils';

export default async function PreviewPegawaiPage({ params }: { params: { id: string } }) {
  const id = decryptId(params.id);
  return <PreviewPegawaiClient id={id} />;
}
