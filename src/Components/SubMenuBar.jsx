import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Chip } from '@mui/material'
import { useSidebarMenu } from './SidebarMenuContext'

const SubMenuBar = () => {
  const { activeMenu } = useSidebarMenu()
  const navigate = useNavigate()
  const location = useLocation()

  if (!activeMenu?.submenus) return null

  return (
    <div className="flex items-center gap-2 pb-4 mb-[-1rem] border-b border-gray-200 flex-wrap">
      {activeMenu.submenus.map((sub) => {
        const isActive = location.pathname.startsWith(sub.path)
        return (
          <Chip
            key={sub.path}
            label={sub.disabled ? `${sub.title} (Soon)` : sub.title}
            clickable={!sub.disabled}
            disabled={sub.disabled}
            onClick={() => !sub.disabled && navigate(sub.path)}
            sx={{
              backgroundColor: isActive ? '#b0a892' : '#f3f4f6',
              color: isActive ? '#fff' : '#374151',
              fontWeight: isActive ? 'bold' : 'medium',
              '&:hover': {
                backgroundColor: sub.disabled ? '#f3f4f6' : '#e0dac5',
              },
            }}
          />
        )
      })}
    </div>
  )
}

export default SubMenuBar