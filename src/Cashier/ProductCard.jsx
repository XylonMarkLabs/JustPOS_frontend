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
      <div className="relative h-20 xs:h-24 sm:h-28 md:h-24 lg:h-28">
        {hasDiscount && (
          <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[0.6rem] sm:text-xs md:text-sm font-medium text-white whitespace-nowrap">
            {product.discount.discountType === "percentage"
              ? `${product.discount.discountValue}% OFF`
              : `Rs. ${product.discount.discountValue} OFF`}
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-0 left-0 bg-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg text-[0.6rem] sm:text-xs font-medium z-10 whitespace-nowrap">
            OUT OF STOCK
          </div>
        )}
        {isLowStock && !isOutOfStock && !hasDiscount && (
          <div className="absolute top-0 left-0 bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg text-[0.6rem] sm:text-xs font-medium z-10 whitespace-nowrap">
            Low Stock
          </div>
        )}
        {isUnlimited && !hasDiscount && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg text-[0.6rem] sm:text-xs font-medium z-10 whitespace-nowrap">
            Made to Order
          </div>
        )}
        <div className="absolute bottom-0 left-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg text-xs font-medium z-10">
          <Chip
            label={product.category}
            color="warning"
            variant="outlined"
            size="small"
            sx={{ fontSize: { xs: "0.5rem", sm: "0.60rem" }, height: { xs: 18, sm: 24 } }}
          />
        </div>
        <div className="flex justify-center items-center h-full">
          <img
            src={product.imageURL}
            alt={product.productName}
            className="w-full h-full max-w-[7.5rem] object-cover"
          />
        </div>
      </div>
      <div className="px-2 sm:px-3 md:px-4 pb-2 pt-1">
        <div className="flex justify-between items-end min-w-0">
          <h5 className="font-semibold truncate text-xs sm:text-sm md:text-base">
            {product.productName}
          </h5>
        </div>
        <div className="flex justify-between items-center gap-1 flex-wrap sm:flex-nowrap">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-bold text-green-600 whitespace-nowrap">
              Rs.{Number(product.sellingPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[0.65rem] sm:text-xs text-gray-500 line-through whitespace-nowrap">
                Rs.{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-right">
            {isUnlimited ? (
              <span className="text-[0.65rem] sm:text-xs text-gray-500 whitespace-nowrap">
                Made to order
              </span>
            ) : (
              <>
                <span
                  className={`text-[0.65rem] sm:text-xs whitespace-nowrap ${
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
                  <div className="text-[0.6rem] sm:text-xs text-gray-400">
                    Min: {product.minStock}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-1.5 sm:mt-2">
          <Button
            variant="outlined"
            startIcon={<AddShoppingCartIcon fontSize="small" />}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) {
                onAddToCart(product);
              }
            }}
            disabled={isOutOfStock}
            size="small"
            fullWidth
            sx={{
              backgroundColor: isOutOfStock ? "#f5f5f5" : "#e0dac5",
              color: isOutOfStock ? "#9ca3af" : "#292929",
              border: "ButtonFace",
              fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.8125rem" },
              padding: { xs: "4px 8px", sm: "6px 10px" },
              minWidth: 0,
              "& .MuiButton-startIcon": {
                marginRight: { xs: "4px", sm: "8px" },
              },
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