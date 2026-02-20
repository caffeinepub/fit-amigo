import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export interface WorkoutFormData {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => void;
  isSubmitting: boolean;
}

export default function WorkoutForm({ onSubmit, isSubmitting }: WorkoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkoutFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="exerciseName">Exercise Name</Label>
        <Input
          id="exerciseName"
          {...register('exerciseName', { required: 'Exercise name is required' })}
          placeholder="e.g., Bench Press, Squats, Deadlift"
        />
        {errors.exerciseName && <p className="text-sm text-destructive">{errors.exerciseName.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sets">Sets</Label>
          <Input
            id="sets"
            type="number"
            {...register('sets', { 
              required: 'Sets is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            placeholder="3"
            min="1"
          />
          {errors.sets && <p className="text-sm text-destructive">{errors.sets.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            {...register('reps', { 
              required: 'Reps is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            placeholder="10"
            min="1"
          />
          {errors.reps && <p className="text-sm text-destructive">{errors.reps.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input
            id="weight"
            type="number"
            {...register('weight', { 
              required: 'Weight is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            placeholder="135"
            min="0"
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-vibrant-green hover:bg-vibrant-green/90 font-semibold text-lg py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Logging Workout...
          </>
        ) : (
          'Log Workout'
        )}
      </Button>
    </form>
  );
}
