import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, itemTotal, onUpdateQuantity, onRemove }) => {
  const hasDiscount = item.product.discount > 0;
  const originalTotal = item.product.price * item.product.quantity;

  return (
    <div className="flex items-center bg-white p-3 rounded-lg shadow h-24">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0 pl-3 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate pr-2">{item.product.name}</h3>
          <IconButton
            onClick={() => onRemove(item.product.productCode)}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(item.product.productCode, item.product.quantity - 1)}
              className="h-7 w-7 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              -
            </button>
            <span className="px-4 font-semibold">{item.product.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product.productCode, item.product.quantity + 1)}
              className="h-7 w-7 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              +
            </button>
          </div>
          <div className="text-right">
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">${originalTotal.toFixed(2)}</p>
            )}
            <p className="text-base font-semibold text-green-600">${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
