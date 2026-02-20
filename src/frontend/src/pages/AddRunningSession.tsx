import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useLogRunningSession } from '../hooks/useLogRunningSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RunningFormData {
  distance: number;
  duration: number;
  notes: string;
}

export default function AddRunningSession() {
  const navigate = useNavigate();
  const logSession = useLogRunningSession();
  const { register, handleSubmit, formState: { errors } } = useForm<RunningFormData>();

  const onSubmit = async (data: RunningFormData) => {
    try {
      await logSession.mutateAsync({
        distance: data.distance,
        duration: BigInt(data.duration),
        notes: data.notes.trim() || null,
      });
      toast.success('Run logged successfully!');
      navigate({ to: '/running' });
    } catch (error) {
      toast.error('Failed to log run');
      console.error('Log run error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/running' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Running Monitor
      </Button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border-2 border-vibrant-green rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Log New Run</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                step="0.01"
                {...register('distance', {
                  required: 'Distance is required',
                  min: { value: 0.01, message: 'Distance must be greater than 0' },
                })}
                placeholder="5.0"
              />
              {errors.distance && (
                <p className="text-sm text-destructive">{errors.distance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', {
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 minute' },
                })}
                placeholder="30"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="How did the run feel? Any observations?"
                className="min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              disabled={logSession.isPending}
              className="w-full bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            >
              {logSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging...
                </>
              ) : (
                'Log Run'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
