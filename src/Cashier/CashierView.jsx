import { useState } from 'react';
import ProductCard from './ProductCard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// Sample product data
const sampleProducts = [
  { id: 1, name: 'Espresso', price: 2.50, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e76?w=200&h=200&fit=crop', stock: 50 },
  { id: 2, name: 'Cappuccino', price: 3.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop', stock: 30 },
  { id: 3, name: 'Croissant', price: 2.25, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=200&h=200&fit=crop', stock: 25 },
  { id: 4, name: 'Latte', price: 4.00, category: 'Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 40 },
  { id: 5, name: 'Muffin', price: 3.50, category: 'Bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&h=200&fit=crop', stock: 20 },
  { id: 6, name: 'Americano', price: 2.75, category: 'Coffee', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=200&h=200&fit=crop', stock: 35 },
  { id: 7, name: 'Bagel', price: 2.00, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', stock: 15 },
  { id: 8, name: 'Green Tea', price: 2.25, category: 'Tea', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', stock: 45 }
];

const CashierView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(sampleProducts.map(p => p.category))];
  
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="lg:flex gap-5 h-screen p-5 ">

      <section className="space-y-5 border-primary  lg:w-[75%] p-5 bg-background rounded-lg shadow-slate-400 shadow-lg">
        {/*search bar and fltters  */}
        <div className="mb-6">
          {/* search bar */}
          <div className="relative mb-4">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <ManageSearchIcon color="secondary" fontSize='large' />
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
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-surface text-primary shadow-md'
                    : 'bg-gray-100 text-gray-700 border border-gray-500 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>


        {/* product catelog */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 ">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>


      <section className="space-y-5  lg:w-[25%] p-5  rounded-lg bg-background  shadow-slate-400 shadow-lg">

      </section>
    </div>
  )
}

export default CashierView