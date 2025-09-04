import React from 'react'
export default function Pagination({page, totalPages, onPrev, onNext, hasResults}){
  if(!hasResults) return null
  return (
    <div className="pager">
      <button className="btn" onClick={onPrev} disabled={page<=1}>← Prev</button>
      <span id="page-indicator" aria-live="polite">Page {page} / {totalPages}</span>
      <button className="btn" onClick={onNext} disabled={page>=totalPages}>Next →</button>
    </div>
  )
}