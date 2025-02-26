
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(roleData?.role === "admin");
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(roleData?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="text-xl font-bold">
              Store
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/store">
                    <Button variant="outline">Manage Products</Button>
                  </Link>
                )}
                <Link to="/cart" className="relative">
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
