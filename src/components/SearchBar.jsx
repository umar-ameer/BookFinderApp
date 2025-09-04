import React, { useState } from "react";

const LANGS = [
  ["","Any"],["eng","English"],["hin","Hindi"],["urd","Urdu"],
  ["fra","French"],["deu","German"],["spa","Spanish"],
  ["ita","Italian"],["jpn","Japanese"],["zho","Chinese"]
];

export default function SearchBar({onSubmit, onClear, initial}){
  const [query, setQuery] = useState(initial?.query || "");
  const [type, setType]   = useState(initial?.type || "title");
  const [language, setLanguage] = useState(initial?.language || "");
  const [sort, setSort]   = useState(initial?.sort || "relevance");
  const [minYear, setMinYear] = useState(initial?.minYear || "");
  const [maxYear, setMaxYear] = useState(initial?.maxYear || "");

  const submit = (e)=>{ e.preventDefault(); if(!query.trim()) return;
    onSubmit({query, type, language, sort, minYear, maxYear});
  };

  return (
    <form className="topbar" onSubmit={submit} role="search" aria-label="Book search">
      <div className="topbar-search with-icon">
        <span className="leading-icon" aria-hidden="true">🔍</span>
        <input
          className="topbar-input"
          type="search"
          placeholder="Search books or paste title…"
          value={query} onChange={e=>setQuery(e.target.value)} required
        />
      </div>

      <div className="topbar-filters">
        <label className="pill">
          <span>Field</span>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
            <option value="subject">Subject</option>
            <option value="all">All</option>
          </select>
        </label>

        <label className="pill">
          <span>Language</span>
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            {LANGS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>

        <label className="pill">
          <span>Sort</span>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="relevance">Popular</option>
            <option value="year_desc">Year ↓</option>
            <option value="year_asc">Year ↑</option>
            <option value="editions_desc">Editions ↓</option>
          </select>
        </label>

        <label className="pill year">
          <span>From</span>
          <input type="number" placeholder="Year" value={minYear} onChange={e=>setMinYear(e.target.value)} />
        </label>

        <label className="pill year">
          <span>To</span>
          <input type="number" placeholder="Year" value={maxYear} onChange={e=>setMaxYear(e.target.value)} />
        </label>

        <div className="topbar-actions">
          <button className="btn primary" type="submit">Search</button>
          <button className="btn" type="button" onClick={onClear}>Clear</button>
        </div>
      </div>
    </form>
  );
}