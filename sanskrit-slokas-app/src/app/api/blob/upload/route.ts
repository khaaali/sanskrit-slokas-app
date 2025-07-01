import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ['audio/*'],
        addRandomSuffix: true,
      };
    },
    onUploadCompleted: async () => {
      // Optionally handle post-upload logic
    },
  });
  return NextResponse.json(result);
} 