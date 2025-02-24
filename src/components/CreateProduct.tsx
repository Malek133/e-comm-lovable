
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateProduct = ({ onProductCreated }: { onProductCreated: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) {
        throw new Error("Please select an image");
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create a product");
      }

      // Upload image first
      const imageUrl = await uploadImage(imageFile);

      // Create product with image URL and user_id
      const { error } = await supabase.from("products").insert([
        {
          title,
          price: parseFloat(price),
          image_url: imageUrl,
          description,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Reset form
      setTitle("");
      setPrice("");
      setImageFile(null);
      setDescription("");
      
      // Trigger refetch of products
      onProductCreated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        required
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default CreateProduct;
