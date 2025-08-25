'use server';

import htmlToDocx from 'html-to-docx';

export async function generateWordDocument(htmlContent: string): Promise<string> {
  if (!htmlContent) {
    throw new Error('HTML content is missing.');
  }

  const fileBuffer = await htmlToDocx(htmlContent, undefined, {
    table: { row: { cantSplit: true } },
    footer: false,
    header: false,
  });

  return (fileBuffer as Buffer).toString('base64');
}
