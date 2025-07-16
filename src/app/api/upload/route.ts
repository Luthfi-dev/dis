
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const path = join(process.cwd(), 'public/uploads', filename);

  try {
    await writeFile(path, buffer);
    console.log(`File uploaded to ${path}`);
    
    // Return the public URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: url });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}
