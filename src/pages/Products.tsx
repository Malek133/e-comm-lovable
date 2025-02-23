
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with real API calls later
const products = [
  {
    id: 1,
    name: "Minimal Desk Lamp",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Modern desk lamp with adjustable brightness"
  },
  {
    id: 2,
    name: "Ceramic Coffee Cup",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Handcrafted ceramic cup in natural tones"
  },
  {
    id: 3,
    name: "Wooden Notebook Stand",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Ergonomic wooden stand for laptops"
  },
  // Add more products as needed
];

const Products = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState("featured");

  const addToCart = (productId: number) => {
    toast({
      title: "Added to cart",
      description: "This item has been added to your cart.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Products</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium">{product.name}</h3>
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

export default Products;
