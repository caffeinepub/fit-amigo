import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '../backend';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'delivered':
        return 'bg-vibrant-green text-white';
      case 'shipped':
        return 'bg-sunny-yellow text-black';
      case 'processing':
        return 'bg-energetic-orange text-white';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge className={`${getStatusColor()} font-semibold`}>
      {getStatusLabel()}
    </Badge>
  );
}
