export const getCurrentUserRole = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        return user?.role || null
    } catch {
        return null
    }
}

export const isAdmin = () => getCurrentUserRole() === 'Admin'
export const isManager = () => getCurrentUserRole() === 'Manager'
export const isCashier = () => getCurrentUserRole() === 'Cashier'