const CHUNK_SIZE_WORDS = 500;
const OVERLAP_WORDS = 50;

export function chunkPages(pages: string[]): { content: string; page: number }[] {
  const chunks: { content: string; page: number }[] = [];

  pages.forEach((pageText, idx) => {
    const words = pageText.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    let start = 0;
    while (start < words.length) {
      const end = Math.min(start + CHUNK_SIZE_WORDS, words.length);
      const content = words.slice(start, end).join(" ");
      if (content.trim().length > 0) {
        chunks.push({ content, page: idx + 1 });
      }
      if (end === words.length) break;
      start += CHUNK_SIZE_WORDS - OVERLAP_WORDS;
    }
  });

  return chunks;
}