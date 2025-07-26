
'use server';

import { PreviewSiswaClient } from './preview-client';
import { decryptId } from '@/lib/utils';

export default async function PreviewSiswaPage({ params }: { params: { id: string } }) {
  const id = decryptId(params.id);
  return <PreviewSiswaClient id={id} />;
}
