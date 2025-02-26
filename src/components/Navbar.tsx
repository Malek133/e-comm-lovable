
import { Link } from "react-router-dom";
import { ShoppingBag, LogOut, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculate total quantity of items in cart
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (!session) {
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("username, full_name")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setUserName(profile.full_name || profile.username);
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold hover:text-primary transition-colors">
            Store
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-products"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Package className="h-4 w-4" />
                  My Products
                </Link>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{userName}</span>
                </div>
              </>
            ) : (
              <Link to="/auth" className="text-sm hover:text-primary transition-colors">
                Sign In
              </Link>
            )}
            <Link
              to="/cart"
              className="p-2 hover:bg-secondary/10 rounded-full transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
