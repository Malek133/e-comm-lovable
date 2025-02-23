
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold hover:text-primary transition-colors">
            Store
          </Link>
          <Link
            to="/cart"
            className="p-2 hover:bg-secondary/10 rounded-full transition-colors relative"
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
