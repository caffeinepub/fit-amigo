import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import type { FoodEntry } from '../backend';

interface MacroSummaryCardProps {
  foodEntries: FoodEntry[];
}

export default function MacroSummaryCard({ foodEntries }: MacroSummaryCardProps) {
  const totals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Card className="border-2 border-energetic-orange">
      <CardHeader>
        <CardTitle className="text-2xl">Today's Nutrition Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-energetic-orange to-bold-red flex items-center justify-center">
              <Flame className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-energetic-orange">{totals.calories.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-vibrant-green to-sunny-yellow flex items-center justify-center">
              <Beef className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-vibrant-green">{totals.protein.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Protein (g)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sunny-yellow to-energetic-orange flex items-center justify-center">
              <Wheat className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-sunny-yellow">{totals.carbs.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Carbs (g)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bold-red to-energetic-orange flex items-center justify-center">
              <Droplet className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-bold-red">{totals.fat.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Fat (g)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
