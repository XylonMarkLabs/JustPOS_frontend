import axios from "axios";

const baseURL = 'http://localhost:4000/api'

axios.defaults.withCredentials = true

const ApiCall = {
    user: {
        getUserData: async () => {
            try {
                const response = await axios.get(`${baseURL}/user/me`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.user;
            } catch (error) {
                console.error('Error fetching user data:', error);
                throw error;
            }
        },

        getUsers: async () => {
            try {
                const response = await axios.get(`${baseURL}/user/get`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.users;
            } catch (error) {
                console.error('Error fetching users:', error);
                throw error;
            }
        },

        editUser: async (user) => {
            try {
                const payload = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };

                if (user.password) {
                    payload.password = user.password;
                }

                const response = await axios.put(`${baseURL}/user/edit`, payload);
                if (!response.data.success) {
                    throw new Error('Edit failed: ' + (response.data.message || 'Unknown error'));
                }
                return true;
            } catch (error) {
                console.error('Error editing user:', error);
                throw error;
            }
        },

        updateStatus: async (username, status) => {
            try {
                const response = await axios.post(`${baseURL}/user/update-status`, { username, status });
                if (!response.data.success) {
                    throw new Error('Network reponse was not ok')
                }
                return true;
            } catch (error) {
                console.error('Error updating product status: ', error);
                throw error;
            }
        },

        deleteUser: async (username) => {
            try {
                const response = await axios.post(`${baseURL}/user/delete`, { username });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error deleting product:', error);
                throw error;
            }
        },

        addUser: async (user) => {
            try {
                const response = await axios.post(`${baseURL}/user/register`, {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: user.role
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding product:', error);
                throw error;
            }
        },

        changePassword: async (oldPassword, newPassword, confirmPassword) => {
            try {
                const response = await axios.post(`${baseURL}/user/change-password`, {
                    oldPassword,
                    newPassword,
                    confirmPassword
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error changing password:', error);
                throw error;
            }
        },

        logout: async () => {
            try {
                const response = await axios.post(`${baseURL}/user/logout`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error logging out:', error);
                throw error;
            }
        }

    },

    product: {
        getAll: async () => {
            try {
                const response = await axios.get(`${baseURL}/product/get-all`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.products;
            } catch (error) {
                console.error('Error fetching products:', error);
                throw error;
            }
        },

        getAllCashier: async () => {
            try {
                const response = await axios.get(`${baseURL}/product/get-all-cashier`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.products;
            } catch (error) {
                console.error('Error fetching products:', error);
                throw error;
            }
        },

        addProduct: async (product) => {
            try {
                const response = await axios.post(`${baseURL}/product/add`, {
                    productCode: product.productCode,
                    productName: product.productName,
                    category: product.category,
                    productType: product.productType,
                    taxRate: product.taxRate,
                    minStock: product.minStock,
                    sellingPrice: product.sellingPrice,
                    costPrice: product.costPrice,
                    imageURL: product.imageURL,
                    imagePublicId: product.imagePublicId,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding product:', error);
                throw error;
            }
        },

        updateStatus: async (productCode, status) => {
            try {
                const response = await axios.post(`${baseURL}/product/update-status`, { productCode, status });
                if (!response.data.success) {
                    throw new Error('Network reponse was not ok')
                }
                return true;
            } catch (error) {
                console.error('Error updating product status: ', error);
                throw error;
            }
        },

        deleteProduct: async (productCode) => {
            try {
                const response = await axios.post(`${baseURL}/product/delete`, { productCode });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error deleting product:', error);
                throw error;
            }
        },

        deleteImage: async (publicId) => {
            try {
                const response = await axios.post(`${baseURL}/product/deleteImage`, { publicId });
                if (!response.data.success) {  
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error deleting product image:', error);
                throw error;
            }
        },

        editProduct: async (product) => {
            try {
                const response = await axios.put(`${baseURL}/product/edit`, {
                    productCode: product.productCode,
                    productName: product.productName,
                    category: product.category,
                    minStock: product.minStock,
                    sellingPrice: product.sellingPrice,
                    costPrice: product.costPrice,
                    imageURL: product.imageURL,
                    imagePublicId: product.imagePublicId,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error editing product:', error);
                throw error;
            }
        }
    },

    cart: {
        getCart: async (username) => {
            try {
                const response = await axios.get(`${baseURL}/cart/get/${username}`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.items;
            } catch (error) {
                console.error('Error fetching cart:', error);
                throw error;
            }
        },

        clearCart: async (username) => {
            try {
                const response = await axios.put(`${baseURL}/cart/clear/${username}`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error clearing cart:', error);
                throw error;
            }
        },

        addToCart: async (username, product) => {
            try {
                const response = await axios.post(`${baseURL}/cart/add`, { username, product });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.cart;
            } catch (error) {
                console.error('Error adding to cart:', error);
                throw error;
            }
        },

        removeFromCart: async (username, productId, stockItemId) => {
            try {
                const response = await axios.post(`${baseURL}/cart/remove`, { username, productId, stockItemId });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error removing from cart:', error);
                throw error;
            }
        },

        updateCartQuantity: async (username, productId, stockItemId, quantity) => {
            try {
                const response = await axios.put(`${baseURL}/cart/update-quantity`, { username, productId, stockItemId, quantity });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.cart;
            } catch (error) {
                console.error('Error updating cart quantity:', error);
                throw error;
            }
        }
    },

    order: {
        getorders: async () => {
            try {
                const response = await axios.get(`${baseURL}/order/getAll`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.orders;
            } catch (error) {
                console.error('Error fetching orders:', error);
                throw error;
            }
        },

        checkout: async (order) => {
            try {
                const response = await axios.post(`${baseURL}/order/checkout`, {
                    username: order.username,
                    paymentMethod: order.paymentMethod,
                    cashReceived: order.cashReceived,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }   
                return response.data.order;
            } catch (error) {
                console.error('Error during checkout:', error);
                throw error;
            }
        }
    },

    category: {
        getAll: async () => {
            try {
                const response = await axios.get(`${baseURL}/category/getAll`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.categories;
            } catch (error) {
                console.error('Error fetching categories:', error);
                throw error;
            }
        },

        addCategory: async (category) => {
            try {
                const response = await axios.post(`${baseURL}/category/add`, {
                    categoryName: category.categoryName,
                    description: category.description
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding category:', error);
                throw error;
            }
        },

        updateStatus: async (categoryName, status) => {
            try {
                const response = await axios.post(`${baseURL}/category/update-status`, { categoryName, status });
                if (!response.data.success) {
                    throw new Error('Network reponse was not ok')
                }
                return true;
            } catch (error) {
                console.error('Error updating category status: ', error);
                throw error;
            }
        },

        deleteCategory: async (categoryName) => {
            try {
                const response = await axios.post(`${baseURL}/category/delete`, { categoryName });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error deleting product:', error);
                throw error;
            }
        },
    },

    supplier: {
        getAll: async () => {
            try {
                const response = await axios.get(`${baseURL}/supplier/get-all`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.suppliers;
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                throw error;
            }
        },

        addSupplier: async (supplier) => {
            try {
                const response = await axios.post(`${baseURL}/supplier/add`, {
                    supplierId: supplier.supplierId,
                    supplierName: supplier.supplierName,
                    contactPerson: supplier.contactPerson,
                    contactNo: supplier.contactNo,
                    email: supplier.email
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding supplier:', error);
                throw error;
            }
        },

        updateStatus: async (productCode, status) => {
            try {
                const response = await axios.post(`${baseURL}/product/update-status`, { productCode, status });
                if (!response.data.success) {
                    throw new Error('Network reponse was not ok')
                }
                return true;
            } catch (error) {
                console.error('Error updating product status: ', error);
                throw error;
            }
        },

        editSupplier: async (supplier) => {
            try {
                const response = await axios.put(`${baseURL}/supplier/edit`, {
                    supplierId: supplier.supplierId,
                    supplierName: supplier.supplierName,
                    contactPerson: supplier.contactPerson,
                    contactNo: supplier.contactNo,
                    email: supplier.email
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error editing product:', error);
                throw error;
            }
        }
    },

    stock: {
        getAll: async () => {
            try {
                const response = await axios.get(`${baseURL}/stock/get-all`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.stocks;
            } catch (error) {
                console.error('Error fetching stocks:', error);
                throw error;
            }
        },

        addStock: async (stock) => {
            try {
                const response = await axios.post(`${baseURL}/stock/add`, {
                    stockId: stock.stockId,
                    items: stock.items,
                    supplierId: stock.supplierId,
                    supplierName: stock.supplierName,
                    totalPrice: stock.totalPrice,
                    receivedDate: stock.receivedDate,
                    invoiceNo: stock.invoiceNo,
                    addedBy: stock.addedBy,
                    notes: stock.notes,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding stock:', error);
                throw error;
            }
        },

        editStock: async (stock) => {
            try {
                const response = await axios.put(`${baseURL}/stock/edit`, {
                    stockId: stock.stockId,
                    items: stock.items,
                    supplierId: stock.supplierId,
                    supplierName: stock.supplierName,
                    totalPrice: stock.totalPrice,
                    receivedDate: stock.receivedDate,
                    invoiceNo: stock.invoiceNo,
                    notes: stock.notes,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error editing stock:', error);
                throw error;
            }
        },

        getByProduct: async (productId) => {
            try {
                const response = await axios.post(`${baseURL}/stock/get-by-product`, { productId });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.items;
            } catch (error) {
                console.error('Error fetching stocks by product:', error);
                throw error;
            }
        }
    },

    discount: {
        getAll: async () => {
            try {
                const response = await axios.get(`${baseURL}/discount/get-all`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.discounts;
            } catch (error) {
                console.error('Error fetching discounts:', error);
                throw error;
            }
        },

        getById: async (discountId) => {
            try {
                const response = await axios.post(`${baseURL}/discount/get`, { discountId });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.discount;
            } catch (error) {
                console.error('Error fetching discount:', error);
                throw error;
            }
        },

        addDiscount: async (discount) => {
            try {
                const response = await axios.post(`${baseURL}/discount/add`, {
                    productId: discount.productId,
                    stockItemId: discount.stockItemId,
                    discountType: discount.discountType,
                    discountValue: discount.discountValue,
                    quantity: discount.quantity,
                    startDate: discount.startDate,
                    endDate: discount.endDate,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error adding discount:', error);
                throw error;
            }
        },

        editDiscount: async (discount) => {
            try {
                const response = await axios.put(`${baseURL}/discount/edit`, {
                    discountId: discount.discountId,
                    discountType: discount.discountType,
                    discountValue: discount.discountValue,
                    quantity: discount.quantity,
                    startDate: discount.startDate,
                    endDate: discount.endDate,
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error editing discount:', error);
                throw error;
            }
        },

        updateStatus: async (discountId, status) => {
            try {
                const response = await axios.post(`${baseURL}/discount/update-status`, { discountId, status });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error updating discount status:', error);
                throw error;
            }
        },

        deleteDiscount: async (discountId) => {
            try {
                const response = await axios.post(`${baseURL}/discount/delete`, { discountId });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error deleting discount:', error);
                throw error;
            }
        },
    },

    report: {
        getSalesReport: async (startDate, endDate) => {
            try {
                const response = await axios.get(`${baseURL}/report/sales`, {
                    params: { startDate, endDate },
                });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.report;
            } catch (error) {
                console.error('Error fetching sales report:', error);
                throw error;
            }
        },

        getInventoryReport: async () => {
            try {
                const response = await axios.get(`${baseURL}/report/inventory`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.report;
            } catch (error) {
                console.error('Error fetching inventory report:', error);
                throw error;
            }
        },
    },

    dashboard: {
        getOverview: async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/overview`);
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.overview;
            } catch (error) {
                console.error('Error fetching dashboard overview:', error);
                throw error;
            }
        },
    },
}

export default ApiCall;