import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('urban-cart') || '[]'))

  const persist = (next) => {
    setItems(next)
    localStorage.setItem('urban-cart', JSON.stringify(next))
  }

  const addToCart = (product) => {
    const existing = items.find((item) => item.id === product.id)
    const next = existing
      ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { ...product, quantity: 1 }]
    persist(next)
  }

  const updateQuantity = (id, quantity) => {
    persist(items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
  }

  const removeFromCart = (id) => persist(items.filter((item) => item.id !== id))

  const clearCart = () => persist([])

  const value = useMemo(() => ({
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
