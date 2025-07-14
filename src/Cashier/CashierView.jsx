import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import CartItem from './CartItem';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Badge, IconButton, Tooltip, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ApiCall from "../Services/ApiCall";
import Sidebar from '../Components/Sidebar';
import AuthService from '../Services/AuthService';

const CashierView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 2x5 grid

  const username = localStorage.getItem('username');

  useEffect(() => {
    AuthService.getConfirm();
    getProducts();
    getCart();
  }, []);

  // Fetch all products from the API
  const getProducts = async () => {
    await ApiCall.product
      .getAll()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  // Fetch cart items for the current user
  const getCart = async () => {
    await ApiCall.cart
      .getCart(username)
      .then((cartItems) => {
        setCart(cartItems);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  };

  // Add a product to the cart
  const addToCart = async (product) => {
    if (!username) {
      alert("Please log in to add items to the cart.");
      return;
    }

    await ApiCall.cart.addToCart(username, product.productCode);
    getCart();

    // const existingItem = cart.find(item => item.product.id === product.id);
    // if (existingItem) {
    //   setCart(cart.map(item =>
    //     item.product.id === product.id
    //       ? { ...item, quantity: item.quantity + 1 }
    //       : item
    //   ));
    // } else {
    //   setCart([...cart, { product, quantity: 1 }]);
    // }

  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    let productCode = productId;
    await ApiCall.cart.removeFromCart(username, productCode);
    setCart(cart.filter((item) => item.product.productCode !== productCode));
    // getCart();
  };

  // Update the quantity of a product in the cart
  const updateQuantity = async (productId, newQuantity) => {
    const productCode = productId;
    if (newQuantity < 1) return;
    await ApiCall.cart.updateCartQuantity(username, productCode, newQuantity);

    getCart();

    // setCart(
    //   cart.map((item) => {
    //     console.log("Updating item: ", item);
    //     return item.product.productCode === productId
    //       ? { ...item, quantity: newQuantity }
    //       : item;
    //   })
    // );
  };

  // Clear the cart
  const clearCart = async () => {
    await ApiCall.cart.clearCart(username);
    setCart([]);
  };

  const calculateItemPrice = (item) => {
    const originalPrice = item.product.price * item.product.quantity;
    return item.product.discount > 0
      ? originalPrice * (1 - item.product.discount)
      : originalPrice;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  return (
    <div className="lg:flex gap-5 h-screen p-5 ">
      <Sidebar/>
      <section className="space-y-5 border-primary  lg:w-[75%] p-5 bg-background rounded-lg shadow-slate-400 shadow-lg">
        {/*search bar and fltters  */}
        <div className="flex-none mb-6">
          <div className="flex gap-4 items-center">
          {/* search bar */}
          <div className="relative flex-grow">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <ManageSearchIcon color="primary" fontSize='large' />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          {/* filters */}
          <div className="w-64">
              <FormControl fullWidth variant="filled" size="small">
                <InputLabel 
                  id="category-select-label"
                  sx={{
                    color: 'black',
                    '&.Mui-focused': {
                      color: 'black',
                    }
                  }}
                >
                  Filter by Category
                </InputLabel>
                <Select
                  label="category-select-label"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg bg-gray-50"
                  sx={{
                    color: 'black',
                    '& .MuiFilledInput-input': {
                      paddingTop: '16px',
                      color: 'black',
                    },
                    '&:hover': {
                      backgroundColor: 'rgb(243 244 246)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgb(243 244 246)',
                    },
                    '&:before': {
                      borderColor: 'black',
                    },
                    '&:after': {
                      borderColor: 'black',
                    },
                  }}
                >
                  {categories.map(category => (
                    <MenuItem 
                      key={category} 
                      value={category}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgb(243 244 246)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgb(229 231 235)',
                        }
                      }}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>


        {/* product catelog */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
          {pageCount > 1 && (
            <div className="flex-none pt-2 flex justify-end border-t mt-4">
              <Pagination 
                count={pageCount} 
                page={currentPage} 
                onChange={handlePageChange}
                // color="primary"
                size="small"
              />
            </div>
          )}
        </div>
      </section>

      {/* cart */}
      <section className="space-y-5 lg:w-[25%] p-5 rounded-lg bg-background shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
        <div className="flex-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge
                badgeContent={cart.reduce(
                  (total, item) => total + item.product.quantity,
                  0
                )}
                color="error"
              >
                <ShoppingCartIcon fontSize="large" />
              </Badge>
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
            </div>
            {cart.length > 0 && (
              <Tooltip title="Clear Cart">
                <IconButton
                  onClick={clearCart}
                  color="error"
                  size="small"
                  className="hover:bg-red-100"
                >
                  <DeleteSweepIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 h-full">
              <ShoppingCartIcon
                sx={{ fontSize: 60 }}
                className="text-gray-300"
              />
              <p className="text-xl font-medium text-gray-500">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-400 text-center">
                Add some items from the catalog to start your order
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(
                (item) => (
                  (
                    <CartItem
                      key={item.product.productCode}
                      item={item}
                      itemTotal={calculateItemPrice(item)}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  )
                )
              )}
            </div>
          )}
        </div>

        <div className="flex-none border-t pt-4">
          {cart.length > 0 && (
            <>
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CashierView;
