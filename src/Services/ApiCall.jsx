import axios from "axios";
import AuthService from "./AuthService";

const baseURL = 'http://localhost:4000/api'

const ApiCall = {
    user: {
        getUserData: async () => {
            const id = AuthService.getConfirm().id
            try {
                const response = await axios.post(`${baseURL}/user/getUserById`, { id });
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

        addProduct: async (product) => {
            try {
                const response = await axios.post(`${baseURL}/product/add`, {
                    productCode: product.productCode,
                    productName: product.productName,
                    sellingPrice: product.sellingPrice,
                    category: product.category,
                    quantityInStock: product.quantityInStock,
                    minStock: product.minStock
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

        editProduct: async (product) => {
            try {
                const response = await axios.put(`${baseURL}/product/edit`, {
                    productCode: product.productCode,
                    productName: product.productName,
                    sellingPrice: product.sellingPrice,
                    category: product.category,
                    quantityInStock: product.quantityInStock,
                    minStock: product.minStock
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
        addToCart: async (username, productCode) => {
            try {
                const response = await axios.post(`${baseURL}/cart/add`, { username, productCode });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.cart;
            } catch (error) {
                console.error('Error adding to cart:', error);
                throw error;
            }
        },
        removeFromCart: async (username, productCode) => {
            try {
                const response = await axios.post(`${baseURL}/cart/remove`, { username, productCode });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return true;
            } catch (error) {
                console.error('Error removing from cart:', error);
                throw error;
            }
        },
        updateCartQuantity: async (username, productCode, quantity) => {
            try {
                const response = await axios.put(`${baseURL}/cart/update-quantity`, { username, productCode, quantity });
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
        }
    }

}

export default ApiCall;