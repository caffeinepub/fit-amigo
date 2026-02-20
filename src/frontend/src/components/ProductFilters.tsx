import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProductFiltersProps {
  category: string;
  onCategoryChange: (category: string) => void;
  maxPrice: string;
  onMaxPriceChange: (price: string) => void;
}

export default function ProductFilters({
  category,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="gym-equipment">Gym Equipment</SelectItem>
            <SelectItem value="running-gear">Running Gear</SelectItem>
            <SelectItem value="sports-apparel">Sports Apparel</SelectItem>
            <SelectItem value="supplements">Supplements</SelectItem>
            <SelectItem value="equipment">Sports Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPrice">Max Price ($)</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="Any price"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          min="0"
        />
      </div>
    </div>
  );
}
