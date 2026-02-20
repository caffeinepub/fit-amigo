import { useNavigate } from '@tanstack/react-router';
import { useGetCart } from '../hooks/useGetCart';
import { useGetProduct } from '../hooks/useGetProduct';
import { useAddToCart } from '../hooks/useAddToCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Cart() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems = [], isLoading } = useGetCart();
  const addToCart = useAddToCart();

  const handleQuantityChange = async (productId: bigint, newQuantity: number) => {
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(newQuantity) });
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Update quantity error:', error);
    }
  };

  const handleRemove = async (productId: bigint) => {
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(0) });
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Remove item error:', error);
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
        <Button
          onClick={() => navigate({ to: '/store' })}
          className="bg-energetic-orange hover:bg-energetic-orange/90"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItemWrapper
              key={Number(item.productId)}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal * 50} />
          <Button
            onClick={() => navigate({ to: '/checkout' })}
            className="w-full mt-4 bg-energetic-orange hover:bg-energetic-orange/90 font-semibold text-lg py-6"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

function CartItemWrapper({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: { productId: bigint; quantity: bigint };
  onQuantityChange: (productId: bigint, quantity: number) => void;
  onRemove: (productId: bigint) => void;
}) {
  const { data: product } = useGetProduct(item.productId);

  if (!product) return null;

  return (
    <CartItem
      product={product}
      quantity={Number(item.quantity)}
      onQuantityChange={(newQty) => onQuantityChange(item.productId, newQty)}
      onRemove={() => onRemove(item.productId)}
    />
  );
}
