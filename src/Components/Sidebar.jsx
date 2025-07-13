import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { title: 'Products', icon: <Inventory2Icon />, path: '/products' },
    { title: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
    { title: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { title: 'Users', icon: <ManageAccountsIcon />, path: '/user-management' },
  ]

  const handleNavigation = (path) => {
    setActiveItem(path)
    navigate(path)
  }

  return (
    <section className="space-y-5 lg:w-[15%] p-5 rounded-lg bg-background shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
      {menuItems.map((item) => (
        <div
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            activeItem === item.path
              ? 'bg-primary text-secondary'
              : 'hover:bg-primary/10'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-lg font-medium">{item.title}</span>
        </div>
      ))}
    </section>
  )
}

export default Sidebar