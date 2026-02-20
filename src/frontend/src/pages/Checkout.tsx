import { useNavigate } from '@tanstack/react-router';
import { useGetCart } from '../hooks/useGetCart';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import CheckoutForm, { type CheckoutFormData } from '../components/CheckoutForm';
import CartSummary from '../components/CartSummary';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems = [], isLoading } = useGetCart();
  const placeOrder = usePlaceOrder();

  const handleSubmit = async (data: CheckoutFormData) => {
    const shippingAddress = `${data.street}, ${data.city}, ${data.state} ${data.zipCode}`;

    try {
      const orderId = await placeOrder.mutateAsync(shippingAddress);
      toast.success('Order placed successfully!');
      navigate({ to: `/order-confirmation/${orderId}` });
    } catch (error) {
      toast.error('Failed to place order');
      console.error('Place order error:', error);
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to checkout</p>
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
    navigate({ to: '/cart' });
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.quantity) * 50, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm onSubmit={handleSubmit} isSubmitting={placeOrder.isPending} />
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
