import { useGetUserOrders } from '../hooks/useGetUserOrders';
import OrderCard from '../components/OrderCard';
import { Package, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function OrderHistory() {
  const { identity } = useInternetIdentity();
  const { data: orders = [], isLoading } = useGetUserOrders();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to view your orders</p>
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={Number(order.id)} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
