
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Cart = () => {
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
};

export default Cart;
