import React, { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import BookGrid from './components/BookGrid.jsx'
import Pagination from './components/Pagination.jsx'
import Favorites from './components/Favorites.jsx'
import BookSidePanel from './components/BookSidePanel.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

const LIMIT = 20

function AppShell() {
  const [activeTab, setActiveTab] = useState('search')

  // search params & paging
  const [params, setParams] = useState(null) // { query, type, language, sort, minYear, maxYear }
  const [page, setPage] = useState(1)

  // data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [numFound, setNumFound] = useState(0)
  const [docs, setDocs] = useState([])

  // selection for side panel
  const [selected, setSelected] = useState(null)

  // close side panel when switching tabs
  useEffect(() => {
    if (activeTab !== 'search') setSelected(null)
  }, [activeTab])

  // ---- build Open Library URL (uses the assignment endpoint) ----
  const buildURL = () => {
    if (!params || !params.query?.trim()) return null
    const q = params.query.trim()
    const type = params.type || 'title'
    const u = new URL('https://openlibrary.org/search.json')

    // pagination + fields
    u.searchParams.set('page', page)
    u.searchParams.set('limit', LIMIT)
    u.searchParams.set(
  'fields',
  [
    'key','title','author_name','first_publish_year','edition_count',
    'cover_i','subject','publisher','isbn','language','ebook_count_i',
    'cover_edition_key','edition_key'
  ].join(',')
)

    // primary query (assignment requires title endpoint, but we also support others)
    if (type === 'title') u.searchParams.set('title', q)
    else if (type === 'author') u.searchParams.set('author', q)
    else if (type === 'isbn') u.searchParams.set('isbn', q)
    else if (type === 'subject') u.searchParams.set('subject', q)
    else u.searchParams.set('q', q)

    return u.toString()
  }

  const url = buildURL()

  // ---- fetch search results ----
  useEffect(() => {
    if (!url) {
      setDocs([])
      setNumFound(0)
      return
    }
    let cancelled = false
    const ctrl = new AbortController()

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setNumFound(data.numFound || 0)
        setDocs(data.docs || [])
      } catch (e) {
        if (!cancelled && e.name !== 'AbortError') setError('Failed to fetch. Try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [url])

  // ---- client-side filters/sort ----
  const applyClient = (arr) => {
    if (!params) return arr
    const { minYear, maxYear, language, sort } = params
    let filtered = arr.filter((d) => {
      let ok = true
      const y = d.first_publish_year ?? null
      if (minYear && y && y < Number(minYear)) ok = false
      if (maxYear && y && y > Number(maxYear)) ok = false
      if (language) {
        const langs = Array.isArray(d.language) ? d.language : []
        if (langs.length && !langs.includes(language)) ok = false
      }
      return ok
    })

    if (sort === 'year_desc') {
      filtered.sort(
        (a, b) => (b.first_publish_year ?? -Infinity) - (a.first_publish_year ?? -Infinity)
      )
    } else if (sort === 'year_asc') {
      filtered.sort(
        (a, b) => (a.first_publish_year ?? Infinity) - (b.first_publish_year ?? Infinity)
      )
    } else if (sort === 'editions_desc') {
      filtered.sort((a, b) => (b.edition_count ?? 0) - (a.edition_count ?? 0))
    }
    return filtered
  }

  const filtered = useMemo(() => applyClient(docs), [docs, params])
  const totalPages = Math.max(1, Math.ceil((numFound || 0) / LIMIT))

  // ---- UI ----
  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'search' && (
        <div className="container app-main">
          {/* LEFT: catalog column */}
          <div className="catalog-col">
            <SearchBar
              initial={params}
              onSubmit={(p) => {
                setParams(p)
                setPage(1)
              }}
              onClear={() => {
                setParams(null)
                setDocs([])
                setNumFound(0)
                setPage(1)
                setSelected(null)
              }}
            />

            <div className="meta-row">
              <div>{numFound ? numFound.toLocaleString() + ' results' : ''}</div>
              <div role="status" aria-live="polite" className="muted">
                {loading ? 'Searching…' : error || ''}
              </div>
            </div>

            <BookGrid docs={filtered} onOpen={setSelected} />

            <Pagination
              page={page}
              totalPages={totalPages}
              hasResults={Boolean(numFound)}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          </div>

          {/* RIGHT: docked detail panel */}
          <BookSidePanel doc={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="container" style={{ marginTop: 16 }}>
          <Favorites onOpen={setSelected} />
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppShell />
    </FavoritesProvider>
  )
}