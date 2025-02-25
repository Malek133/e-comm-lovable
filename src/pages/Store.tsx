
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Store = () => {
  const { toast } = useToast();

  const { data: products } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "This item has been added to your cart.",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium">Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">${product.price}</span>
                <Button onClick={() => addToCart(product.id)} size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Store;

