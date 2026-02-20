import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Card className="border-2 border-energetic-orange">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold text-energetic-orange">${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
