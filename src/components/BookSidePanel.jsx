import React, { useEffect, useMemo } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'

/** Resolve a usable cover URL with sensible fallbacks. */
function getCoverURL(doc, size = 'L') {
  if (!doc) return ''
  if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-${size}.jpg`

  const isbn = Array.isArray(doc.isbn) ? doc.isbn.find(Boolean) : null
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`

  const olid =
    doc.cover_edition_key ||
    (Array.isArray(doc.edition_key) ? doc.edition_key[0] : null)
  if (olid) return `https://covers.openlibrary.org/b/olid/${olid}-${size}.jpg`

  return ''
}

export default function BookSidePanel({ doc, onClose }) {
  const { favorites, toggle } = useFavorites()
  const open = Boolean(doc)

  // Recompute cover only when the doc changes
  const cover = useMemo(() => (open ? getCoverURL(doc, 'L') : ''), [open, doc])

  const isFav = open && favorites.some(f => f.key === doc.key)

  // Allow closing with ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) {
    return <aside className="sidepanel" aria-hidden="true" />
  }

  return (
    <aside
      className="sidepanel open"
      aria-labelledby="sidepanel-title"
      aria-live="polite"
    >
      <button className="side-close" onClick={onClose} aria-label="Close">✕</button>

      {/* Hero image */}
      <div className="side-hero">
        {cover && (
          <img
            src={cover}
            alt={`${doc.title || 'Book'} cover`}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <div className="side-hero-fade" />
      </div>

      {/* Poster + info */}
      <div className="side-body side-body-grid">
        {cover && (
          <img
            className="side-cover"
            src={cover}
            alt={`${doc.title || 'Book'} cover`}
            loading="eager"
            onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
          />
        )}

        <div className="side-info">
          <h2 id="sidepanel-title" className="side-title">
            {doc.title || 'Untitled'}
          </h2>
          <p className="muted">
            {(doc.author_name || []).join(', ') || 'Unknown author'}
          </p>

          <div className="side-stats">
            <span>
              {doc.first_publish_year || '—'}
              <small>Year</small>
            </span>
            <span>
              {doc.edition_count || 0}
              <small>Editions</small>
            </span>
            <span>
              {(doc.language || []).length || 0}
              <small>Lang</small>
            </span>
          </div>

          <div className="chips">
            {(doc.subject || []).slice(0, 10).map(s => (
              <span className="chip" key={s}>{s}</span>
            ))}
          </div>

          <div className="detail-actions">
            <a
              className="btn primary"
              href={`https://openlibrary.org${doc.key}`}
              target="_blank"
              rel="noreferrer"
            >
              Open Library
            </a>
            <button className="btn" onClick={() => toggle(doc)}>
              {isFav ? '★ Favorite' : '☆ Favorite'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}