import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Trash2, Calendar } from 'lucide-react';
import type { RunningSession } from '../backend';
import { useDeleteRunningSession } from '../hooks/useDeleteRunningSession';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RunningSessionCardProps {
  session: RunningSession;
}

export default function RunningSessionCard({ session }: RunningSessionCardProps) {
  const deleteSession = useDeleteRunningSession();

  const handleDelete = async () => {
    try {
      await deleteSession.mutateAsync(session.runId);
      toast.success('Run deleted successfully');
    } catch (error) {
      toast.error('Failed to delete run');
      console.error('Delete run error:', error);
    }
  };

  const formatDuration = (minutes: bigint) => {
    const mins = Number(minutes);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="border-2 hover:border-energetic-orange transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(session.timestamp)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-energetic-orange to-bold-red flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-energetic-orange">{session.distance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">km</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-vibrant-green to-sunny-yellow flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-vibrant-green">{formatDuration(session.duration)}</p>
                  <p className="text-sm text-muted-foreground">duration</p>
                </div>
              </div>
            </div>
            {session.notes && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Notes:</p>
                <p className="text-sm mt-1">{session.notes}</p>
              </div>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Running Session</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this running session? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
