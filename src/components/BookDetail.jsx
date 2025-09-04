import React, { useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'

const coverURL = (doc, size='L') => doc?.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-${size}.jpg` : ''

export default function BookDetail({doc, onClose}){
  const ref = React.useRef(null)
  const { favorites, toggle } = useFavorites()

  useEffect(()=>{
    const dialog = ref.current
    if(!dialog) return
    if(doc && !dialog.open){ dialog.showModal() }
    if(!doc && dialog.open){ dialog.close() }
  }, [doc])

  if(!doc) return null
  const isFav = favorites.some(f => f.key === doc.key)

  return (
    <dialog ref={ref} onCancel={onClose} onClick={(e)=>{ if(e.target===ref.current) onClose() }}>
      <article className="dialog-card">
        <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        <div className="dialog-content">
          <img src={coverURL(doc,'L')} alt="Book cover"/>
          <div>
            <h2>{doc.title || 'Untitled'}</h2>
            <p className="muted">{(doc.author_name||[]).join(', ') || 'Unknown author'}</p>
            <div className="chips">{(doc.subject||[]).slice(0,8).map(s => <span className="chip" key={s}>{s}</span>)}</div>
            <ul className="kv">
              <li><span>First published</span><strong>{doc.first_publish_year || '—'}</strong></li>
              <li><span>Editions</span><strong>{doc.edition_count || 0}</strong></li>
              <li><span>Publishers</span><strong>{(doc.publisher||[]).slice(0,4).join(', ') || '—'}</strong></li>
              <li><span>ISBNs</span><strong>{(doc.isbn||[]).slice(0,6).join(', ') || '—'}</strong></li>
            </ul>
            <div className="detail-actions">
              <a className="btn primary" href={`https://openlibrary.org${doc.key}`} target="_blank" rel="noreferrer">Open on Open Library</a>
              <button className="btn" onClick={()=>toggle(doc)}>{isFav ? '★ Remove Favorite' : '☆ Save to Favorites'}</button>
            </div>
          </div>
        </div>
      </article>
    </dialog>
  )
}