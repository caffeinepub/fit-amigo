import { Link } from '@tanstack/react-router';
import { useGetUserRunningSessions } from '../hooks/useGetUserRunningSessions';
import RunningSessionCard from '../components/RunningSessionCard';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Loader2, Activity } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function RunningMonitor() {
  const { identity } = useInternetIdentity();
  const { data: sessions = [], isLoading } = useGetUserRunningSessions();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <MapPin className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to track your runs</p>
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

  const totalRuns = sessions.length;
  const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
  const totalDuration = sessions.reduce((sum, session) => sum + Number(session.duration), 0);

  const formatTotalDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-r from-vibrant-green via-energetic-orange to-sunny-yellow">
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Running <span className="text-sunny-yellow">Monitor</span>
            </h1>
            <p className="text-xl text-white/90">Track your runs and achieve your goals</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border-2 border-energetic-orange rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-energetic-orange to-bold-red flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-energetic-orange">{totalRuns}</p>
                <p className="text-sm text-muted-foreground">Total Runs</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-2 border-vibrant-green rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vibrant-green to-sunny-yellow flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-vibrant-green">{totalDistance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Distance (km)</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-2 border-sunny-yellow rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sunny-yellow to-energetic-orange flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-sunny-yellow">{formatTotalDuration(totalDuration)}</p>
                <p className="text-sm text-muted-foreground">Total Duration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Your Runs</h2>
          <Link to="/running/add">
            <Button className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Log New Run
            </Button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-6">No runs logged yet</p>
            <Link to="/running/add">
              <Button className="bg-vibrant-green hover:bg-vibrant-green/90">
                <Plus className="mr-2 h-5 w-5" />
                Log Your First Run
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <RunningSessionCard key={session.runId.toString()} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
