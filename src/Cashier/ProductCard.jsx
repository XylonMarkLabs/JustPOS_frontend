import {Chip,Button} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:shadow-lg relative"
    >
        {product.discount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg text-sm font-medium z-10">
            -{(product.discount * 100)}% OFF
          </div>
        )}
        <img 
            src={product.imageURL} 
            alt={product.productName}
            className="w-full h-32 object-cover"
        />
        <div className="p-4">
            <div className='flex justify-between'>
                <h3 className="font-semibold text-lg">{product.productName}</h3>
                <Chip label={product.category} color='warning' variant="outlined" size="small" sx={{ fontSize: '0.70rem' }}/> 
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {product.discount > 0 ? (
                        <>
                            <span className="text-xl font-bold text-green-600">
                                ${(product.sellingPrice * (1 - product.discount)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                ${product.sellingPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-green-600">
                            ${product.sellingPrice.toFixed(2)}
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    Stock: {product.quantityInStock}
                </span>
            </div>
            <div className='flex justify-center mt-2'>
                <Button 
                    variant="outlined"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    sx={{
                            backgroundColor: '#e0dac5',
                            color:"#292929",
                            border:'ButtonFace',
                            '&:hover': {
                                backgroundColor: '#b0a892',
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