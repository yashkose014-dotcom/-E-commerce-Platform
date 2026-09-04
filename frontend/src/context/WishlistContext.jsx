import { createContext, useContext, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('urban-wishlist') || '[]'))

  const toggleWishlist = (product) => {
    const exists = items.some((item) => item.id === product.id)
    const next = exists ? items.filter((item) => item.id !== product.id) : [...items, product]
    setItems(next)
    localStorage.setItem('urban-wishlist', JSON.stringify(next))
  }

  return <WishlistContext.Provider value={{ items, toggleWishlist }}>
    {children}
  </WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)
