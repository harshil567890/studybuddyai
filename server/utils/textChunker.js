/**
 * Split text into semantic chunks for AI processing
 */
exports.chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text) return [];

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  const paragraphs = cleanedText.split("\n").filter((p) => p.trim().length > 0);
  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }

    if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
      const prevChunkText = currentChunk.join(" ");
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex,
      pageNumber: 0,
    });
  }

  if (chunks.length === 0 && cleanedText.length > 0) {
    chunks.push({
      content: cleanedText,
      chunkIndex: 0,
      pageNumber: 0,
    });
  }

  return chunks;
};

/**
 * Rank relevant chunks against a search query or question
 */
exports.findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) return [];

  const stopWords = new Set([
    "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
    "in", "with", "to", "for", "of", "as", "by", "this", "that", "it",
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber || 0,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = (chunk.content || "").toLowerCase();
    const contentWords = content.split(/\s+/).length || 1;
    let score = 0;

    for (const word of queryWords) {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = (content.match(regex) || []).length;
      score += matches * 3;
    }

    const uniqueWordsFound = queryWords.filter((w) => content.includes(w)).length;
    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    const normalizedScore = score / Math.sqrt(contentWords);
    const positionBonus = 1 - (index / (chunks.length || 1)) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber || 0,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
    };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};
