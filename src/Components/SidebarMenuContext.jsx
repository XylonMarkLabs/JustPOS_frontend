import React, { createContext, useContext, useState } from 'react'

const SidebarMenuContext = createContext(null)

// Holds which top-level sidebar item is currently active, so the
// SubMenuBar rendered in the page content (not inside the sidebar) knows
// which submenu list to show.
export const SidebarMenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
    <SidebarMenuContext.Provider value={{ activeMenu, setActiveMenu }}>
      {children}
    </SidebarMenuContext.Provider>
  )
}

export const useSidebarMenu = () => {
  const ctx = useContext(SidebarMenuContext)
  if (!ctx) {
    throw new Error('useSidebarMenu must be used within a SidebarMenuProvider')
  }
  return ctx
}