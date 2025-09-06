import {Chip,Button} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart }) => {
  const isLowStock = product.quantityInStock <= product.minStock && product.quantityInStock > 0;
  const isOutOfStock = product.quantityInStock <= 0;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:shadow-lg relative"
    >
        <div className="relative h-28">
          {product.discount > 0 && (
          <div className="absolute top-0 right-0 bg-green-700 text-white px-2 py-1 rounded-bl-lg text-sm font-medium z-10">
            {product.discount}% OFF
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 rounded-br-lg text-xs font-medium z-10">
            OUT OF STOCK
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-1 rounded-br-lg text-xs font-medium z-10">
            Low Stock
          </div>
         )}

          <div className="absolute bottom-0 left-0 px-2 py-1 rounded-br-lg text-xs font-medium z-10">
           <Chip label={product.category} color='warning' variant="outlined" size="small" sx={{ fontSize: '0.60rem'}}/>
          </div>
        <div className="flex justify-center items-center">
          <img
            src={product.imageURL}
            alt={product.productName}
            className="w-30 h-28 object-cover"
        />
        </div>
        </div>
        <div className="px-4 pb-2 ">
            <div className='flex justify-between items-end  min-w-0'>
                <h5 className="font-semibold truncate">{product.productName}</h5>
                 
            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    {product.discount > 0 ? (
                        <>
                            <span className="text-lg font-bold text-green-600">
                                Rs.{(product.sellingPrice * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 line-through ">
                                Rs.{product.sellingPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-green-600">
                            Rs.{product.sellingPrice.toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="text-right">
                  <span className={`text-xs whitespace-nowrap ${
                    isOutOfStock ? 'text-red-600 font-semibold' : 
                    isLowStock ? 'text-orange-600 font-semibold' : 
                    'text-gray-500'
                  }`}>
                    Stock: {product.quantityInStock}
                  </span>
                  {product.minStock > 0 && (
                    <div className="text-xs text-gray-400">
                      Min: {product.minStock}
                    </div>
                  )}
                </div>
            </div>
            <div className='flex justify-center  mt-2'>
                <Button 
                    variant="outlined"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) {
                          onAddToCart(product);
                        }
                    }}
                    disabled={isOutOfStock}
                    sx={{
                            backgroundColor: isOutOfStock ? '#f5f5f5' : '#e0dac5',
                            color: isOutOfStock ? '#9ca3af' : "#292929",
                            border:'ButtonFace',
                            '&:hover': {
                                backgroundColor: isOutOfStock ? '#f5f5f5' : '#b0a892',
                            },
                            '&:disabled': {
                              backgroundColor: '#f5f5f5',
                              color: '#9ca3af',
                            }
                        }}
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    </div>
  )
}

export default ProductCard