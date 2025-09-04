import React from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'

const coverURL = (doc, size='L') =>
  doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-${size}.jpg`
              : `https://covers.openlibrary.org/b/olid/OL1M-${size}.jpg` // harmless fallback

export default function BookCard({doc, onOpen}){
  const { favorites, toggle } = useFavorites()
  const isFav = favorites.some(f => f.key === doc.key)
  const authors = (doc.author_name || []).slice(0,2).join(', ') || 'Unknown'
  const y = doc.first_publish_year ? String(doc.first_publish_year) : '—'
  const badge = (doc.ebook_count_i || doc.ia) ? 'EBOOK' : null

  return (
    <article className="poster" onClick={()=>onOpen(doc)} role="button" tabIndex={0}
             onKeyDown={(e)=>e.key==='Enter' && onOpen(doc)}>
      <img className="poster-img" src={coverURL(doc,'L')} alt={`Cover: ${doc.title}`} />
      {badge && <span className="poster-badge">• {badge}</span>}

      <button className="fav-dot" title="Toggle favorite"
              onClick={(e)=>{e.stopPropagation(); toggle(doc)}}>
        {isFav ? '★' : '☆'}
      </button>

      <div className="poster-meta">
        <h3 className="poster-title" title={doc.title}>{doc.title || 'Untitled'}</h3>
        <p className="poster-sub">{authors} • {y}</p>
      </div>
    </article>
  )
}