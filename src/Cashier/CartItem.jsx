import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, itemTotal, onUpdateQuantity, onRemove }) => {
  const hasDiscount = Boolean(item.product.discountId);
  const originalTotal = item.product.originalPrice * item.product.quantity;

  return (
    <div className="flex items-center bg-white p-1.5 sm:p-2 rounded-lg shadow h-20 sm:h-24">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0 h-full flex flex-col justify-between pl-2 sm:pl-3">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-semibold truncate text-sm sm:text-base pr-1 sm:pr-2">
            {item.product.name}
          </h3>
          <IconButton
            onClick={onRemove}
            size="small"
            color="error"
            sx={{ padding: { xs: "2px", sm: "4px" }, flexShrink: 0 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="flex justify-between items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 sm:p-1 flex-shrink-0">
            <button
              onClick={() => onUpdateQuantity(item.product.quantity - 1)}
              className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-sm sm:text-base font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              -
            </button>
            <span className="px-1.5 sm:px-2 text-sm sm:text-base font-semibold">
              {item.product.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.product.quantity + 1)}
              className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-sm sm:text-base font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              +
            </button>
          </div>
          <div className="text-right min-w-0">
            {hasDiscount && (
              <p className="text-[0.65rem] sm:text-xs text-gray-500 line-through truncate">
                Rs.{originalTotal.toFixed(2)}
              </p>
            )}
            <p className="text-sm sm:text-base font-semibold text-green-600 truncate">
              Rs.{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;