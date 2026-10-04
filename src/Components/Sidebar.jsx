import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Avatar, Menu, MenuItem, Drawer, IconButton } from '@mui/material'
import logo from '../assets/JUSTPOS_transparent.png'
import { AuthContext } from '../Services/AuthContext'
import { useSidebarMenu } from './SidebarMenuContext'
import ChangePasswordModal from './ChangePasswordModal'

const getMenuStructure = (role) => [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: role === 'Admin' ? '/admin/dashboard' : '/manager/dashboard',
    roles: ['Admin', 'Manager'],
  },
  {
    title: 'Products',
    icon: <Inventory2Icon />,
    roles: ['Admin', 'Manager'],
    submenus: [
      { title: 'All Products', path: '/products' },
      { title: 'Categories', path: '/categories' },
      { title: 'Stock', path: '/stock' },
      { title: 'Discounts', path: '/discounts'},
    ],
  },
  {
    title: 'Suppliers',
    icon: <LocalShippingIcon />,
    path: '/suppliers',
    roles: ['Admin', 'Manager'],
  },
  {
    title: 'Orders',
    icon: <ShoppingCartIcon />,
    path: '/orders',
    roles: ['Admin', 'Manager'],
  },
  {
    title: 'Reports',
    icon: <AssessmentIcon />,
    path: '/reports',
    roles: ['Admin', 'Manager'],
  },
  {
    title: 'Users',
    icon: <ManageAccountsIcon />,
    path: '/user-management',
    roles: ['Admin'],
  },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeMenu, setActiveMenu } = useSidebarMenu()

  const { user, logout } = useContext(AuthContext)
  const role = user?.role

  // Cashiers use the top Navbar instead of this sidebar.
  if (role === 'Cashier') return null

  const menuItems = getMenuStructure(role).filter((item) =>
    item.roles.includes(role)
  )

  useEffect(() => {
    const matched = menuItems.find((item) =>
      item.submenus
        ? item.submenus.some((sub) => location.pathname.startsWith(sub.path))
        : location.pathname.startsWith(item.path)
    )
    setActiveMenu(matched || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMenuClick = (item) => {
    setActiveMenu(item)
    setMobileMenuOpen(false)
    if (item.submenus) {
      const firstAvailable = item.submenus.find((sub) => !sub.disabled)
      if (firstAvailable) navigate(firstAvailable.path)
    } else {
      navigate(item.path)
    }
  }

  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget)
  }

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null)
  }

  const handlePasswordModalOpen = () => {
    handleAccountMenuClose()
    setMobileMenuOpen(false)
    setOpenPasswordModal(true)
  }

  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false)
  }

  const handleLogout = async () => {
    handleAccountMenuClose()
    setMobileMenuOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  const accountMenu = (
    <>
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={handleAccountMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={handlePasswordModalOpen}>Change Password</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
          <LogoutIcon sx={{ mr: 1 }} fontSize="small" />Logout
        </MenuItem>
      </Menu>

      <ChangePasswordModal
        open={openPasswordModal}
        onClose={handlePasswordModalClose}
        logo={logo}
      />
    </>
  )

  // The vertical menu list, shared between the desktop sidebar and the
  // mobile drawer so the two never drift out of sync.
  const menuList = (onItemClick) => (
    <div className="flex-1 space-y-2 overflow-auto">
      {menuItems.map((item) => {
        const isActive = activeMenu?.title === item.title
        return (
          <div
            key={item.title}
            onClick={() => onItemClick(item)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              isActive ? 'bg-primary text-secondary' : 'hover:bg-primary/10'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg font-medium">{item.title}</span>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {/* ===== Mobile / tablet top bar (< lg) ===== */}
      <div className="flex lg:hidden items-center justify-between gap-2 rounded-lg bg-background shadow-slate-400 shadow-lg p-3 mb-3">
        <IconButton
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          size="small"
        >
          <MenuIcon />
        </IconButton>

        <img src={logo} alt="JUSTPOS Logo" style={{ height: 30 }} />

        <div
          onClick={handleAccountMenuOpen}
          className="flex items-center gap-2 min-w-0 p-1 rounded-lg cursor-pointer hover:bg-primary/10"
        >
          <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
          </Avatar>
        </div>
      </div>

      {/* Mobile drawer — the full vertical menu + account section,
          identical in content to the desktop sidebar below. */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            maxWidth: '85vw',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200">
          <img src={logo} alt="JUSTPOS Logo" style={{ height: 36 }} />
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {menuList(handleMenuClick)}

        <div className="pt-4 mt-4 border-t border-gray-200">
          <div
            onClick={handleAccountMenuOpen}
            className="flex items-center gap-2 min-w-0 p-2 rounded-lg cursor-pointer hover:bg-primary/10"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <span className="text-sm font-medium truncate">{user?.username}</span>
          </div>
        </div>
      </Drawer>

      {/* ===== Desktop permanent sidebar (lg+) ===== */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 rounded-lg bg-background shadow-slate-400 shadow-lg h-full p-5">
        {/* Logo */}
        <div className="flex justify-center pb-5 mb-5 border-b border-gray-200">
          <img src={logo} alt="JUSTPOS Logo" style={{ height: 40 }} />
        </div>

        {menuList(handleMenuClick)}

        {/* Logged-in user, change password, logout */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div
            onClick={handleAccountMenuOpen}
            className="flex items-center gap-2 min-w-0 p-2 rounded-lg cursor-pointer hover:bg-primary/10"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <span className="text-sm font-medium truncate">{user?.username}</span>
          </div>
        </div>
      </aside>

      {accountMenu}
    </>
  )
}

export default Sidebar