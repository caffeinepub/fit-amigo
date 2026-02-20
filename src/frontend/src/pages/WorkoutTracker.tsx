import { Link } from '@tanstack/react-router';
import { useGetWorkouts } from '../hooks/useGetWorkouts';
import WorkoutCard from '../components/WorkoutCard';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function WorkoutTracker() {
  const { identity } = useInternetIdentity();
  const { data: workouts = [], isLoading } = useGetWorkouts();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Dumbbell className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to track your workouts</p>
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
    <div className="relative">
      {/* Hero Section */}
      <div
        className="relative h-[300px] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/workout-bg.dim_1200x800.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Workout <span className="text-vibrant-green">Tracker</span>
            </h1>
            <p className="text-xl text-white/90">Track your progress and crush your fitness goals</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Your Workouts</h2>
          <Link to="/add-workout">
            <Button className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Log Workout
            </Button>
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-20">
            <Dumbbell className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-6">No workouts logged yet</p>
            <Link to="/add-workout">
              <Button className="bg-vibrant-green hover:bg-vibrant-green/90">
                <Plus className="mr-2 h-5 w-5" />
                Log Your First Workout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
