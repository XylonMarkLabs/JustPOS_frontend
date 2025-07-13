import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import AddUserModal from './AddUserModal'
import EditUserModal from './EditUserModal'
import ConfirmationDialog from '../Components/ConfirmationDialog'
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  InputAdornment,
  TablePagination
} from '@mui/material'
import {
  GroupAdd as AddIcon,
  Search as SearchIcon,
  EditNote as EditIcon,
  Delete as DeleteIcon,
  PersonOff as DeactivateIcon,
  PersonAdd as ActivateIcon
} from '@mui/icons-material'

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [userToToggle, setUserToToggle] = useState(null)

  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'cashier@justpos.com',
      username: 'cashier1',
      role: 'Cashier',
      status: 'Active',
      created: '1/1/2024',
      initials: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'manager@justpos.com',
      username: 'manager1',
      role: 'Manager',
      status: 'Active',
      created: '1/1/2024',
      initials: 'JS'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@justpos.com',
      username: 'admin1',
      role: 'Admin',
      status: 'Active',
      created: '1/1/2024',
      initials: 'AU'
    },
    {
      id: 4,
      name: 'Mike Johnson',
      email: 'cashier2@justpos.com',
      username: 'cashier2',
      role: 'Cashier',
      status: 'Inactive',
      created: '2/1/2024',
      initials: 'MJ'
    },
    {
      id: 5,
      name: 'Sarah Wilson',
      email: 'manager2@justpos.com',
      username: 'manager2',
      role: 'Manager',
      status: 'Active',
      created: '2/15/2024',
      initials: 'SW'
    }
  ])

  // Handle adding new user
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser])
  }

  // Handle editing user
  const handleEditUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ))
  }

  // Handle opening edit modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    setUsers(users.filter(user => user.id !== userToDelete.id))
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  // Handle toggle user status
  const handleToggleStatus = (user) => {
    setUserToToggle(user)
    setStatusDialogOpen(true)
  }

  const confirmToggleStatus = () => {
    const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active'
    setUsers(users.map(user => 
      user.id === userToToggle.id 
        ? { ...user, status: newStatus }
        : user
    ))
    setStatusDialogOpen(false)
    setUserToToggle(null)
  }

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Get current page users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Reset pagination when filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value)
    setPage(0)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'error'
      case 'Manager': return 'primary'
      case 'Cashier': return 'success'
      default: return 'default'
    }
  }

  return (
    <div className="lg:flex gap-5  p-5 ">
        <Sidebar/>

        <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                User Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  backgroundColor: '#b0a892',
                  '&:hover': { backgroundColor: '#e0dac5' },
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1
                }}
              >
                Add User
              </Button>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ flex: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="All Roles">All Roles</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Cashier">Cashier</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Users Table */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f3f4f6' } }}>
                  <TableHead>
                    <TableRow sx={{ height: 48 }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        USER
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        USERNAME
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        ROLE
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        STATUS
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        CREATED
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} sx={{ 
                        '&:hover': { backgroundColor: '#f9fafb' },
                        height: 60
                      }}>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              backgroundColor: '#3b82f6', 
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>
                              {user.initials}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            variant="outlined"
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={user.status}
                            color={user.status === 'Active' ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {user.created}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#2563eb', padding: '4px' }}
                              onClick={() => handleOpenEditModal(user)}
                              title="Edit User"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: user.status === 'Active' ? '#f59e0b' : '#10b981', padding: '4px' }}
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.status === 'Active' ? (
                                <DeactivateIcon fontSize="small" />
                              ) : (
                                <ActivateIcon fontSize="small" />
                              )}
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#ef4444', padding: '4px' }}
                              onClick={() => handleDeleteUser(user)}
                              title="Delete User"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box component={Paper} sx={{ 
                borderTop: '1px solid #e5e7eb', 
                borderRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4
              }}>
                <TablePagination
                  component="div"
                  count={filteredUsers.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      paddingLeft: 2,
                      paddingRight: 2,
                      minHeight: 56,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '0.875rem',
                      color: '#6b7280',
                    },
                    '& .MuiTablePagination-select': {
                      fontSize: '0.875rem',
                    },
                    '& .MuiTablePagination-actions': {
                      color: '#6b7280',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </section>

        {/* Add User Modal */}
        <AddUserModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddUser={handleAddUser}
        />

        {/* Edit User Modal */}
        <EditUserModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditUser={handleEditUser}
          user={selectedUser}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {/* Status Toggle Confirmation Dialog */}
        <ConfirmationDialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          onConfirm={confirmToggleStatus}
          title={`${userToToggle?.status === 'Active' ? 'Deactivate' : 'Activate'} User`}
          message={`Are you sure you want to ${userToToggle?.status === 'Active' ? 'deactivate' : 'activate'} "${userToToggle?.name}"?`}
          confirmText={userToToggle?.status === 'Active' ? 'Deactivate' : 'Activate'}
          cancelText="Cancel"
          type="warning"
        />
    </div>
  )
}

export default UserManagement