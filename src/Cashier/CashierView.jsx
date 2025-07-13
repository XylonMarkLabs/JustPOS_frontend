import { useState } from 'react';
import ProductCard from './ProductCard';
import CartItem from './CartItem';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Badge, IconButton, Tooltip, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAlert } from '../Components/AlertProvider';

// Sample product data
const sampleProducts = [
  { id: 1, name: 'Espresso', price: 2.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e76?w=200&h=200&fit=crop', stock: 50, minStock: 20, discount: 0.2 },
  { id: 2, name: 'Cappuccino', price: 3.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop', stock: 30, minStock: 15, discount: 0 },
  { id: 3, name: 'Croissant', price: 2.25, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=200&h=200&fit=crop', stock: 25, minStock: 10, discount: 0.15 },
  { id: 4, name: 'Latte', price: 4.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 40, minStock: 20, discount: 0 },
  { id: 5, name: 'Muffin', price: 3.50, category: 'Bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&h=200&fit=crop', stock: 5, minStock: 15, discount: 0.1 },
  { id: 6, name: 'Americano', price: 2.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=200&h=200&fit=crop', stock: 35, minStock: 25, discount: 0 },
  { id: 7, name: 'Bagel', price: 2.00, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', stock: 15, minStock: 12, discount: 0.25 },
  { id: 8, name: 'Green Tea', price: 2.25, category: 'Tea', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', stock: 45, minStock: 20, discount: 0 },
  { id: 9, name: 'Black Coffee', price: 2.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e76?w=200&h=200&fit=crop', stock: 8, minStock: 15, discount: 0.2 },
  { id: 10, name: 'Flat White', price: 3.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop', stock: 30, minStock: 20, discount: 0 },
  { id: 11, name: 'Danish', price: 2.25, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=200&h=200&fit=crop', stock: 0, minStock: 10, discount: 0.15 },
  { id: 12, name: 'Mocha', price: 4.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 40, minStock: 25, discount: 0 },
  { id: 13, name: 'Scone', price: 3.50, category: 'Bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&h=200&fit=crop', stock: 20, minStock: 15, discount: 0.1 },
  { id: 14, name: 'Cold Brew', price: 2.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=200&h=200&fit=crop', stock: 35, minStock: 20, discount: 0 },
  { id: 15, name: 'Pretzel', price: 2.00, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', stock: 3, minStock: 10, discount: 0.25 },
  { id: 16, name: 'Chai Tea', price: 2.25, category: 'Tea', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', stock: 45, minStock: 25, discount: 0 }
];

const CashierView = () => {
  const { showSuccess, showInfo, showWarning } = useAlert()
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 2x5 grid
  const categories = ['All', ...new Set(sampleProducts.map(p => p.category))];

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showWarning(`${product.name} is out of stock!`, 'Out of Stock')
      return
    }
    
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showInfo(`Added another ${product.name} to cart`, 'Item Added')
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      showSuccess(`${product.name} added to cart!`, 'Item Added')
    }
  };

  const removeFromCart = (productId) => {
    const removedItem = cart.find(item => item.product.id === productId);
    setCart(cart.filter(item => item.product.id !== productId));
    if (removedItem) {
      showInfo(`${removedItem.product.name} removed from cart`, 'Item Removed')
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      showInfo('Cart cleared', 'Cart Empty')
    }
  };

  const calculateItemPrice = (item) => {
    const originalPrice = item.product.price * item.quantity;
    return item.product.discount > 0 
      ? originalPrice * (1 - item.product.discount)
      : originalPrice;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showWarning('Your cart is empty!', 'Cannot Checkout')
      return
    }
    
    const total = calculateTotal().toFixed(2)
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    
    // Here you would normally integrate with a payment system
    showSuccess(`Order completed successfully! Total: $${total} for ${itemCount} items`, 'Order Completed')
    setCart([])
  };
  
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
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
    <div className="lg:flex gap-5  p-5 ">

      <section className="space-y-5 border-primary lg:w-[75%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
        {/*search bar and filters  */}
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
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

        {/* product catalog */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
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
              <Badge badgeContent={cart.reduce((total, item) => total + item.quantity, 0)} color="error">
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
              <ShoppingCartIcon sx={{ fontSize: 60 }} className="text-gray-300" />
              <p className="text-xl font-medium text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 text-center">Add some items from the catalog to start your order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  itemTotal={calculateItemPrice(item)}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-none border-t pt-4">
          {cart.length > 0 && (
            <>
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
        
      </section>
    </div>
  )
}

export default CashierView