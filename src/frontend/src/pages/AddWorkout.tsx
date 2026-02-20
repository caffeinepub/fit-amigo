import { useNavigate } from '@tanstack/react-router';
import { useLogWorkout } from '../hooks/useLogWorkout';
import WorkoutForm, { type WorkoutFormData } from '../components/WorkoutForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AddWorkout() {
  const navigate = useNavigate();
  const logWorkout = useLogWorkout();

  const handleSubmit = async (data: WorkoutFormData) => {
    try {
      await logWorkout.mutateAsync({
        exerciseName: data.exerciseName,
        sets: BigInt(data.sets),
        reps: BigInt(data.reps),
        weight: BigInt(data.weight),
      });
      toast.success('Workout logged successfully!');
      navigate({ to: '/workout-tracker' });
    } catch (error) {
      toast.error('Failed to log workout');
      console.error('Log workout error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/workout-tracker' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workouts
      </Button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border-2 border-vibrant-green rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Log Workout</h1>
          <WorkoutForm onSubmit={handleSubmit} isSubmitting={logWorkout.isPending} />
        </div>
      </div>
    </div>
  );
}
