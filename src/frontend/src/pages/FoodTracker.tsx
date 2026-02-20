import { Link } from '@tanstack/react-router';
import { useGetUserFoodEntries } from '../hooks/useGetUserFoodEntries';
import FoodEntryCard from '../components/FoodEntryCard';
import MacroSummaryCard from '../components/MacroSummaryCard';
import { Button } from '@/components/ui/button';
import { Plus, Utensils, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function FoodTracker() {
  const { identity } = useInternetIdentity();
  const { data: foodEntries = [], isLoading } = useGetUserFoodEntries();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Utensils className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to track your nutrition</p>
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
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-r from-sunny-yellow via-vibrant-green to-energetic-orange">
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Food <span className="text-sunny-yellow">Tracker</span>
            </h1>
            <p className="text-xl text-white/90">Track your nutrition and reach your goals</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Daily Macro Summary */}
        <MacroSummaryCard foodEntries={foodEntries} />

        <div className="flex items-center justify-between mb-8 mt-12">
          <h2 className="text-3xl font-bold">Today's Food Diary</h2>
          <Link to="/food/add">
            <Button className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Log Food
            </Button>
          </Link>
        </div>

        {foodEntries.length === 0 ? (
          <div className="text-center py-20">
            <Utensils className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-6">No food logged yet</p>
            <Link to="/food/add">
              <Button className="bg-vibrant-green hover:bg-vibrant-green/90">
                <Plus className="mr-2 h-5 w-5" />
                Log Your First Meal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {foodEntries.map((entry) => (
              <FoodEntryCard key={entry.id.toString()} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
