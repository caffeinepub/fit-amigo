import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export interface CheckoutFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Shipping Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            {...register('street', { required: 'Street address is required' })}
            placeholder="123 Main St"
          />
          {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city', { required: 'City is required' })}
              placeholder="New York"
            />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register('state', { required: 'State is required' })}
              placeholder="NY"
            />
            {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            {...register('zipCode', { required: 'ZIP code is required' })}
            placeholder="10001"
          />
          {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Contact Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: { value: /^[0-9\-\+\(\)\s]+$/, message: 'Invalid phone number' }
            })}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
            })}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-energetic-orange hover:bg-energetic-orange/90 font-semibold text-lg py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
