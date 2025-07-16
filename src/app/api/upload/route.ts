
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join, extname } from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define the path for the uploads directory
  const uploadsDir = join(process.cwd(), 'public/uploads');
  
  // Generate a unique filename using timestamp and extension
  const fileExtension = extname(file.name);
  const filename = `${Date.now()}${fileExtension}`;
  const path = join(uploadsDir, filename);

  try {
    // Ensure the uploads directory exists, create it if it doesn't
    await mkdir(uploadsDir, { recursive: true });

    // Check if the file is an image
    const isImage = file.type.startsWith('image/');
    let fileBufferToSave = buffer;

    if (isImage) {
        // Process image to fit within 3x4 aspect ratio without cropping, maintaining aspect ratio
        fileBufferToSave = await sharp(buffer)
            .resize(300, 400, {
                fit: 'inside', // Resize without cropping, maintaining aspect ratio
                withoutEnlargement: true, // Don't enlarge image if it's smaller than 300x400
            })
            .toBuffer();
    }
    
    // Write the file (original or processed) to the specified path
    await writeFile(path, fileBufferToSave);
    console.log(`File uploaded to ${path}`);
    
    // Return the public URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: url });
  } catch (error: any) {
    console.error('Error writing file:', error);
    return NextResponse.json({ success: false, error: `Failed to save file: ${error.message}` }, { status: 500 });
  }
}
