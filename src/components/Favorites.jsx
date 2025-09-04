import React from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import BookCard from './BookCard.jsx'

export default function Favorites({ onOpen }) {
  const { favorites, setFavorites } = useFavorites()

  const clearAll = () => {
    if (confirm('Remove all favorites?')) setFavorites([])
  }

  return (
    <section>
      <div className="favorites-meta">
        <p>Books you star will appear here. Stored locally in your browser.</p>
        <div className="row">
          <button className="btn danger" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="muted">No favorites yet.</p>
      ) : (
        <div className="grid">
          {favorites.map(doc => (
            <BookCard key={doc.key} doc={doc} onOpen={() => onOpen(doc)} />
          ))}
        </div>
      )}
    </section>
  )
}