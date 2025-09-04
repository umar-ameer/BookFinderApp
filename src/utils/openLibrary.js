// src/utils/openLibrary.js

export const PAGE_SIZE = 24; // how many results per page

const API = "https://openlibrary.org/search.json";

/**
 * Search Open Library by book title.
 * Returns { items, total }
 */
export async function searchBooks(query, page = 1) {
  const q = (query ?? "").trim();
  if (!q) return { items: [], total: 0 };

  // Open Library supports title=, page and limit
  const url = `${API}?title=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open Library request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  const items = docs.map(d => ({
    id: d.key, // e.g. "/works/OL12345W"
    title: d.title ?? "Untitled",
    author: d.author_name ? d.author_name.join(", ") : "Unknown",
    year: d.first_publish_year ?? "—",
    coverId: d.cover_i ?? null,
    coverUrl: d.cover_i ? coverUrl(d.cover_i, "M") : null,
  }));

  return {
    items,
    total: typeof data.numFound === "number" ? data.numFound : items.length,
  };
}

/** Build a cover image URL from a cover id. size can be S, M, or L */
export function coverUrl(coverId, size = "M") {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}