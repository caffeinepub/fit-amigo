import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useGetProduct';
import { useAddToCart } from '../hooks/useAddToCart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product) return;

    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/store' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={product.name.toLowerCase().includes('supplement')
              ? '/assets/generated/supplements-placeholder.dim_400x400.png'
              : '/assets/generated/sports-equipment-placeholder.dim_400x400.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-energetic-orange mb-6">${Number(product.price)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="font-semibold">Availability:</span>
              {Number(product.quantity) > 0 ? (
                <span className="text-vibrant-green font-semibold">
                  In Stock ({Number(product.quantity)} available)
                </span>
              ) : (
                <span className="text-destructive font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={Number(product.quantity) === 0 || addToCart.isPending}
            className="w-full bg-vibrant-green hover:bg-vibrant-green/90 font-semibold text-lg py-6"
          >
            {addToCart.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {Number(product.quantity) === 0 ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
