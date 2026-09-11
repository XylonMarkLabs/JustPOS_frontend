import React from 'react'
import Sidebar from './Sidebar'
import SubMenuBar from './SubMenuBar'
import { SidebarMenuProvider } from './SidebarMenuContext'

// Wraps Admin/Manager pages with the sidebar and its submenu bar.
// Cashier pages should NOT use this — they keep the existing top Navbar
// instead, with no sidebar at all.
//
// Usage (replaces the old per-page `<div className="lg:flex..."><Sidebar/><section>...</section></div>` boilerplate):
//   return (
//     <AdminPageShell>
//       ...page content (header, filters, table, modals)...
//     </AdminPageShell>
//   )
const AdminPageShell = ({ children }) => {
  return (
    <SidebarMenuProvider>
      <div className="min-h-screen lg:h-screen w-full box-border flex flex-col lg:flex-row gap-5 p-5 lg:overflow-hidden">
        <Sidebar />
        <section className="space-y-5 border-primary flex-1 min-w-0 h-auto lg:h-full p-3 bg-background rounded-lg shadow-slate-400 shadow-lg flex flex-col overflow-hidden">
          <SubMenuBar />
          {children}
        </section>
      </div>
    </SidebarMenuProvider>
  )
}

export default AdminPageShell