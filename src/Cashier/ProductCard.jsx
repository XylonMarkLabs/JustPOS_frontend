import { Chip, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductCard = ({ product, onAddToCart }) => {
  const isUnlimited = product.quantityAvailable == null;
  const isOutOfStock = !isUnlimited && product.quantityAvailable <= 0;
  const isLowStock =
    !isUnlimited &&
    product.quantityAvailable <= product.minStock &&
    product.quantityAvailable > 0;

  const hasDiscount = product.discount != null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:shadow-lg relative">
      <div className="relative h-28">
        {hasDiscount && (
          <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-green-700 px-2 py-1 text-sm font-medium text-white">
            {product.discount.discountType === "percentage"
              ? `${product.discount.discountValue}% OFF`
              : `Rs. ${product.discount.discountValue} OFF`}
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 rounded-br-lg text-xs font-medium z-10">
            OUT OF STOCK
          </div>
        )}
        {isLowStock && !isOutOfStock && !hasDiscount && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-1 rounded-br-lg text-xs font-medium z-10">
            Low Stock
          </div>
        )}
        {isUnlimited && !hasDiscount && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 rounded-br-lg text-xs font-medium z-10">
            Made to Order
          </div>
        )}
        <div className="absolute bottom-0 left-0 px-2 py-1 rounded-br-lg text-xs font-medium z-10">
          <Chip
            label={product.category}
            color="warning"
            variant="outlined"
            size="small"
            sx={{ fontSize: "0.60rem" }}
          />
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
        <div className="flex justify-between items-end  min-w-0">
          <h5 className="font-semibold truncate">{product.productName}</h5>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-green-600">
              Rs.{Number(product.sellingPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through">
                Rs.{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-right">
            {isUnlimited ? (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Made to order
              </span>
            ) : (
              <>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isOutOfStock
                      ? "text-red-600 font-semibold"
                      : isLowStock
                        ? "text-orange-600 font-semibold"
                        : "text-gray-500"
                  }`}
                >
                  {hasDiscount
                    ? `Left: ${product.quantityAvailable}`
                    : `Stock: ${product.quantityAvailable}`}
                </span>
                {product.minStock > 0 && (
                  <div className="text-xs text-gray-400">
                    Min: {product.minStock}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center  mt-2">
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
              backgroundColor: isOutOfStock ? "#f5f5f5" : "#e0dac5",
              color: isOutOfStock ? "#9ca3af" : "#292929",
              border: "ButtonFace",
              "&:hover": {
                backgroundColor: isOutOfStock ? "#f5f5f5" : "#b0a892",
              },
              "&:disabled": {
                backgroundColor: "#f5f5f5",
                color: "#9ca3af",
              },
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;