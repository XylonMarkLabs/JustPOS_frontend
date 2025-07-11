import {Chip,Button} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform  hover:shadow-lg"
      onClick={() => onAddToCart(product)}
    >
        <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-32 object-cover"
        />
        <div className="p-4">
            <div className='flex justify-between'>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Chip label={product.category} color='warning' variant="outlined" size="small" sx={{ fontSize: '0.70rem' }}/> 
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                </span>
            </div>
            <div className='flex justify-center mt-2'>
                <Button 
                    variant="outlined"
                    startIcon={<AddShoppingCartIcon />}
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