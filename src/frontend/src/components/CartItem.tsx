import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '../backend';

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({ product, quantity, onQuantityChange, onRemove }: CartItemProps) {
  const itemTotal = Number(product.price) * quantity;

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
      <img
        src={product.name.toLowerCase().includes('supplement')
          ? '/assets/generated/supplements-placeholder.dim_400x400.png'
          : '/assets/generated/sports-equipment-placeholder.dim_400x400.png'}
        alt={product.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">${Number(product.price)} each</p>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-semibold w-12 text-center">{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-8 w-8"
            disabled={quantity >= Number(product.quantity)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <Button size="icon" variant="ghost" onClick={onRemove} className="text-destructive hover:text-destructive">
          <Trash2 className="h-5 w-5" />
        </Button>
        <span className="text-xl font-bold text-energetic-orange">${itemTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
