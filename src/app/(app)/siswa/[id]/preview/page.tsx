
'use server';

import { PreviewSiswaClient } from './preview-client';

export default async function PreviewSiswaPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PreviewSiswaClient id={id} />;
}
