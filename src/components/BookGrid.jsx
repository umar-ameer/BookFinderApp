import React from 'react'
import BookCard from './BookCard.jsx'
export default function BookGrid({docs, onOpen}){
  if(!docs || docs.length===0) return <p className="muted">No results on this page with current filters.</p>
  return <div className="grid">{docs.map(d => <BookCard key={d.key} doc={d} onOpen={()=>onOpen(d)} />)}</div>
}