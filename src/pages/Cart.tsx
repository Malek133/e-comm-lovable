
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log("Cart items from Redux store:", cartItems);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-medium">Shopping Cart</h1>
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-medium">Shopping Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center p-4 border rounded-lg">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1 space-y-2">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-lg font-medium">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-xl font-medium">Total: ${total.toFixed(2)}</span>
          <Link to="/checkout">
            <Button>Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
