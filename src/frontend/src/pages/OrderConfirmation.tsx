import { useParams, Link } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useGetOrder';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vibrant-green mb-6">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Order #{Number(order.id)}</h2>
            <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
          <p className="text-muted-foreground">{order.shippingAddress}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
          <p className="text-muted-foreground">{order.items.length} items</p>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-energetic-orange">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link to="/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              View Order History
            </Button>
          </Link>
          <Link to="/store" className="flex-1">
            <Button className="w-full bg-energetic-orange hover:bg-energetic-orange/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
