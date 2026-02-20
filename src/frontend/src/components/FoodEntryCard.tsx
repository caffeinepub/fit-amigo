import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Trash2, Calendar } from 'lucide-react';
import type { FoodEntry } from '../backend';
import { useDeleteFoodEntry } from '../hooks/useDeleteFoodEntry';
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

interface FoodEntryCardProps {
  entry: FoodEntry;
}

export default function FoodEntryCard({ entry }: FoodEntryCardProps) {
  const deleteEntry = useDeleteFoodEntry();

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync(entry.id);
      toast.success('Food entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete food entry');
      console.error('Delete food entry error:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <Card className="border-2 hover:border-energetic-orange transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunny-yellow to-energetic-orange flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{entry.foodName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(entry.timestamp)}</span>
                  <span>•</span>
                  <span>{entry.servingSize.toFixed(0)}g</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                <p className="text-xl font-bold text-energetic-orange">{entry.calories.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="text-xl font-bold text-vibrant-green">{entry.protein.toFixed(1)}g</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="text-xl font-bold text-sunny-yellow">{entry.carbs.toFixed(1)}g</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="text-xl font-bold text-bold-red">{entry.fat.toFixed(1)}g</p>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Food Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this food entry? This action cannot be undone.
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
