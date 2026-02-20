import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useGetOrder';
import { useGetProduct } from '../hooks/useGetProduct';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function OrderDetail() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const navigate = useNavigate();
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
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/orders' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h1 className="text-3xl font-bold">Order #{Number(order.id)}</h1>
              <p className="text-muted-foreground mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <OrderItemRow key={Number(item.productId)} item={item} />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span className="text-energetic-orange">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderItemRow({ item }: { item: { productId: bigint; quantity: bigint } }) {
  const { data: product } = useGetProduct(item.productId);

  if (!product) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <img
        src={product.name.toLowerCase().includes('supplement')
          ? '/assets/generated/supplements-placeholder.dim_400x400.png'
          : '/assets/generated/sports-equipment-placeholder.dim_400x400.png'}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{product.name}</h4>
        <p className="text-sm text-muted-foreground">Quantity: {Number(item.quantity)}</p>
      </div>
      <span className="font-bold text-energetic-orange">
        ${(Number(product.price) * Number(item.quantity)).toFixed(2)}
      </span>
    </div>
  );
}
