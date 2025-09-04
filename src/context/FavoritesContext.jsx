import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
const STORAGE_KEY = 'bookfinder_favorites'

export function FavoritesProvider({children}){
  const [favorites, setFavorites] = useState([])

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw) setFavorites(JSON.parse(raw))
    }catch{}
  }, [])

  useEffect(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }catch{}
  }, [favorites])

  const toggle = (doc)=>{
    setFavorites(prev => {
      const exists = prev.some(f => f.key === doc.key)
      if(exists) return prev.filter(f => f.key !== doc.key)
      const minimal = {
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year || null,
        edition_count: doc.edition_count || 0,
        cover_i: doc.cover_i || null
      }
      return [minimal, ...prev]
    })
  }

  return <Ctx.Provider value={{favorites, setFavorites, toggle}}>{children}</Ctx.Provider>
}

export function useFavorites(){
  const ctx = useContext(Ctx)
  if(!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}