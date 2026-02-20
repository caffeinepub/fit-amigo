import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Loader2, Utensils } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLogFood } from '../hooks/useLogFood';
import { toast } from 'sonner';

interface FoodSearchResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
}

export default function AddFood() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const logFood = useLogFood();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);
  const [servingSize, setServingSize] = useState('1');

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Utensils className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to log food</p>
      </div>
    );
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a food name to search');
      return;
    }

    setIsSearching(true);
    try {
      // Simulated search results - in production this would call the backend
      // which would then call the Nutritionix API
      const mockResults: FoodSearchResult[] = [
        {
          foodName: searchTerm,
          calories: 200,
          protein: 20,
          carbs: 30,
          fat: 5,
          servingSize: 100,
          servingUnit: 'g',
        },
      ];
      setSearchResults(mockResults);
    } catch (error) {
      toast.error('Failed to search for food');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (food: FoodSearchResult) => {
    setSelectedFood(food);
    setServingSize('1');
  };

  const handleLogFood = async () => {
    if (!selectedFood) return;

    const multiplier = parseFloat(servingSize) || 1;

    try {
      await logFood.mutateAsync({
        foodName: selectedFood.foodName,
        calories: selectedFood.calories * multiplier,
        protein: selectedFood.protein * multiplier,
        carbs: selectedFood.carbs * multiplier,
        fat: selectedFood.fat * multiplier,
        servingSize: selectedFood.servingSize * multiplier,
      });
      toast.success('Food logged successfully!');
      navigate({ to: '/food' });
    } catch (error) {
      toast.error('Failed to log food');
      console.error('Log food error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link to="/food">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Food Tracker
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          Log <span className="text-energetic-orange">Food</span>
        </h1>
        <p className="text-muted-foreground">Search for foods and log your meals</p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search for Food</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter food name (e.g., chicken breast, apple, rice)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="bg-energetic-orange hover:bg-energetic-orange/90"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && !selectedFood && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((food, index) => (
                <div
                  key={index}
                  className="p-4 border-2 rounded-lg hover:border-energetic-orange cursor-pointer transition-all"
                  onClick={() => handleSelectFood(food)}
                >
                  <h3 className="font-semibold text-lg mb-2">{food.foodName}</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Calories</p>
                      <p className="font-semibold">{food.calories}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Protein</p>
                      <p className="font-semibold">{food.protein}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{food.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fat</p>
                      <p className="font-semibold">{food.fat}g</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Per {food.servingSize} {food.servingUnit}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Food - Serving Size Form */}
      {selectedFood && (
        <Card>
          <CardHeader>
            <CardTitle>Log Food Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">{selectedFood.foodName}</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="servingSize">Number of Servings</Label>
                    <Input
                      id="servingSize"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      1 serving = {selectedFood.servingSize} {selectedFood.servingUnit}
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Nutritional Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="text-xl font-bold text-energetic-orange">
                        {(selectedFood.calories * (parseFloat(servingSize) || 1)).toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-xl font-bold text-vibrant-green">
                        {(selectedFood.protein * (parseFloat(servingSize) || 1)).toFixed(1)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-xl font-bold text-sunny-yellow">
                        {(selectedFood.carbs * (parseFloat(servingSize) || 1)).toFixed(1)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-xl font-bold text-bold-red">
                        {(selectedFood.fat * (parseFloat(servingSize) || 1)).toFixed(1)}g
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFood(null);
                    setSearchResults([]);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogFood}
                  disabled={logFood.isPending}
                  className="flex-1 bg-vibrant-green hover:bg-vibrant-green/90"
                >
                  {logFood.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    'Log Food'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
