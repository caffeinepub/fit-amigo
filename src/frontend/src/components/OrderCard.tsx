import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '../backend';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const orderDate = new Date().toLocaleDateString();

  return (
    <Link to="/order/$orderId" params={{ orderId: order.id.toString() }}>
      <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-energetic-orange cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">Order #{Number(order.id)}</h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground">{orderDate}</p>
              <p className="text-sm text-muted-foreground">{order.items.length} items</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-energetic-orange">${Number(order.total).toFixed(2)}</span>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
