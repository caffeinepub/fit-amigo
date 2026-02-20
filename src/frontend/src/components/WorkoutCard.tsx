import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import type { Workout } from '../backend';

interface WorkoutCardProps {
  workout: Workout;
  index: number;
}

export default function WorkoutCard({ workout, index }: WorkoutCardProps) {
  return (
    <Card className="border-2 hover:border-vibrant-green transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-energetic-orange to-vibrant-green flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{workout.exerciseName}</h3>
              <span className="text-sm text-muted-foreground">Workout #{index + 1}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-energetic-orange">{Number(workout.sets)}</p>
                <p className="text-sm text-muted-foreground">Sets</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-vibrant-green">{Number(workout.reps)}</p>
                <p className="text-sm text-muted-foreground">Reps</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-sunny-yellow">{Number(workout.weight)}</p>
                <p className="text-sm text-muted-foreground">lbs</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
