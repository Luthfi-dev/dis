
'use server';
import { PreviewPegawaiClient } from './preview-client';

export default async function PreviewPegawaiPage({ params }: { params: { id: string } }) {
  const id = params.id;
  return <PreviewPegawaiClient id={id} />;
}
