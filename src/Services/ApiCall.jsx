import axios from "axios";
import AuthService from "./AuthService";

const ApiCall = {
    user: {
        getUserData: async () => {
            const id = AuthService.getConfirm().id
            try {
                const response = await axios.post('http://localhost:4000/api/user/getUserById', { id });
                console.log("Resonse: ", response)
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.user;
            } catch (error) {
                console.error('Error fetching user data:', error);
                throw error;
            }
        }
    },

    product: {
        getAll: async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/product/get-all');
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return await response.data.products;
            } catch (error) {
                console.error('Error fetching products:', error);
                throw error;
            }
        }
    },

    cart: {
        getCart: async (username) => {
            try {
                const response = await axios.get(`http://localhost:4000/api/cart/get/${username}`);
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
                const response = await axios.put(`http://localhost:4000/api/cart/clear/${username}`);
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
                const response = await axios.post('http://localhost:4000/api/cart/add', { username, productCode });
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
                const response = await axios.post("http://localhost:4000/api/cart/remove", { username, productCode });
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
                const response = await axios.put("http://localhost:4000/api/cart/update-quantity", { username, productCode, quantity });
                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                return response.data.cart;
            } catch (error) {
                console.error('Error updating cart quantity:', error);
                throw error;
            }
        }
    }

}

export default ApiCall;