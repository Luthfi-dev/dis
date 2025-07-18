
// src/app/api/uploads/[...path]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

const UPLOADS_DIR = path.join(process.cwd(), '..', 'uploads');

export async function GET(
  req: NextRequest,
  {params}: {params: {path: string[]}}
) {
  const filePath = path.join(UPLOADS_DIR, ...params.path);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch (e) {
    return new NextResponse('Not found', {status: 404});
  }

  const fileContents = await fs.promises.readFile(filePath);
  const mimeType = mime.getType(filePath) || 'application/octet-stream';

  return new NextResponse(fileContents, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': fileContents.length.toString(),
    },
  });
}
