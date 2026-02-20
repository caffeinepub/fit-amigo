import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ExternalSportsProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  externalProductUrl: string;
  isExternal: true;
}

/**
 * Hook that returns mock sports products data for demonstration purposes.
 * No external API configuration required.
 */
export function useGetExternalSportsProducts(categoryFilter?: string, searchTerm?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalSportsProduct[]>({
    queryKey: ['externalSportsProducts', categoryFilter, searchTerm],
    queryFn: async () => {
      if (!actor) return [];

      // Mock sports products data
      const mockProducts: ExternalSportsProduct[] = [
        // Gym Equipment
        {
          id: 'gym-1',
          name: 'Adjustable Dumbbell Set',
          description: 'Professional grade adjustable dumbbells with quick-change weight system. Perfect for home workouts.',
          price: 299.99,
          imageUrl: '/assets/generated/product-gym-equipment.dim_400x400.png',
          category: 'gym-equipment',
          externalProductUrl: 'https://workoutpuppy.com/products/adjustable-dumbbells',
          isExternal: true as const,
        },
        {
          id: 'gym-2',
          name: 'Olympic Barbell Set',
          description: 'Heavy-duty Olympic barbell with weight plates. Built to last for serious strength training.',
          price: 449.99,
          imageUrl: '/assets/generated/product-gym-equipment.dim_400x400.png',
          category: 'gym-equipment',
          externalProductUrl: 'https://workoutpuppy.com/products/olympic-barbell',
          isExternal: true as const,
        },
        {
          id: 'gym-3',
          name: 'Power Rack Station',
          description: 'Complete power rack with pull-up bar and safety catches. Essential for home gym setup.',
          price: 799.99,
          imageUrl: '/assets/generated/product-gym-equipment.dim_400x400.png',
          category: 'gym-equipment',
          externalProductUrl: 'https://workoutpuppy.com/products/power-rack',
          isExternal: true as const,
        },
        {
          id: 'gym-4',
          name: 'Resistance Band Set',
          description: 'Premium resistance bands with multiple resistance levels. Great for mobility and strength work.',
          price: 49.99,
          imageUrl: '/assets/generated/product-gym-equipment.dim_400x400.png',
          category: 'gym-equipment',
          externalProductUrl: 'https://workoutpuppy.com/products/resistance-bands',
          isExternal: true as const,
        },
        // Running Gear
        {
          id: 'run-1',
          name: 'Performance Running Shoes',
          description: 'Lightweight running shoes with responsive cushioning. Engineered for speed and comfort.',
          price: 159.99,
          imageUrl: '/assets/generated/product-running-shoes.dim_400x400.png',
          category: 'running-gear',
          externalProductUrl: 'https://workoutpuppy.com/products/running-shoes',
          isExternal: true as const,
        },
        {
          id: 'run-2',
          name: 'GPS Running Watch',
          description: 'Advanced GPS watch with heart rate monitoring and training metrics. Track every run.',
          price: 349.99,
          imageUrl: '/assets/generated/product-running-shoes.dim_400x400.png',
          category: 'running-gear',
          externalProductUrl: 'https://workoutpuppy.com/products/gps-watch',
          isExternal: true as const,
        },
        {
          id: 'run-3',
          name: 'Hydration Running Belt',
          description: 'Comfortable running belt with water bottle holders. Stay hydrated on long runs.',
          price: 39.99,
          imageUrl: '/assets/generated/product-running-shoes.dim_400x400.png',
          category: 'running-gear',
          externalProductUrl: 'https://workoutpuppy.com/products/hydration-belt',
          isExternal: true as const,
        },
        {
          id: 'run-4',
          name: 'Reflective Running Vest',
          description: 'High-visibility vest for safe night running. Lightweight and breathable design.',
          price: 29.99,
          imageUrl: '/assets/generated/product-running-shoes.dim_400x400.png',
          category: 'running-gear',
          externalProductUrl: 'https://workoutpuppy.com/products/reflective-vest',
          isExternal: true as const,
        },
        // Sports Apparel
        {
          id: 'apparel-1',
          name: 'Performance Training Shirt',
          description: 'Moisture-wicking training shirt with anti-odor technology. Keeps you cool and dry.',
          price: 44.99,
          imageUrl: '/assets/generated/product-apparel.dim_400x400.png',
          category: 'sports-apparel',
          externalProductUrl: 'https://workoutpuppy.com/products/training-shirt',
          isExternal: true as const,
        },
        {
          id: 'apparel-2',
          name: 'Compression Leggings',
          description: 'High-performance compression leggings for enhanced muscle support and recovery.',
          price: 69.99,
          imageUrl: '/assets/generated/product-apparel.dim_400x400.png',
          category: 'sports-apparel',
          externalProductUrl: 'https://workoutpuppy.com/products/compression-leggings',
          isExternal: true as const,
        },
        {
          id: 'apparel-3',
          name: 'Training Shorts',
          description: 'Lightweight training shorts with built-in liner. Perfect for any workout.',
          price: 39.99,
          imageUrl: '/assets/generated/product-apparel.dim_400x400.png',
          category: 'sports-apparel',
          externalProductUrl: 'https://workoutpuppy.com/products/training-shorts',
          isExternal: true as const,
        },
        {
          id: 'apparel-4',
          name: 'Sports Hoodie',
          description: 'Comfortable sports hoodie for warm-ups and cool-downs. Soft fleece interior.',
          price: 79.99,
          imageUrl: '/assets/generated/product-apparel.dim_400x400.png',
          category: 'sports-apparel',
          externalProductUrl: 'https://workoutpuppy.com/products/sports-hoodie',
          isExternal: true as const,
        },
        // Supplements
        {
          id: 'supp-1',
          name: 'Whey Protein Powder',
          description: 'Premium whey protein isolate with 25g protein per serving. Supports muscle growth.',
          price: 59.99,
          imageUrl: '/assets/generated/product-supplements.dim_400x400.png',
          category: 'supplements',
          externalProductUrl: 'https://workoutpuppy.com/products/whey-protein',
          isExternal: true as const,
        },
        {
          id: 'supp-2',
          name: 'Pre-Workout Energy',
          description: 'Advanced pre-workout formula for explosive energy and focus. Zero sugar.',
          price: 44.99,
          imageUrl: '/assets/generated/product-supplements.dim_400x400.png',
          category: 'supplements',
          externalProductUrl: 'https://workoutpuppy.com/products/pre-workout',
          isExternal: true as const,
        },
        {
          id: 'supp-3',
          name: 'BCAA Recovery',
          description: 'Branch chain amino acids for faster recovery and reduced muscle soreness.',
          price: 39.99,
          imageUrl: '/assets/generated/product-supplements.dim_400x400.png',
          category: 'supplements',
          externalProductUrl: 'https://workoutpuppy.com/products/bcaa',
          isExternal: true as const,
        },
        {
          id: 'supp-4',
          name: 'Creatine Monohydrate',
          description: 'Pure creatine monohydrate for increased strength and power output.',
          price: 29.99,
          imageUrl: '/assets/generated/product-supplements.dim_400x400.png',
          category: 'supplements',
          externalProductUrl: 'https://workoutpuppy.com/products/creatine',
          isExternal: true as const,
        },
      ];

      // Filter by category
      let filtered = mockProducts;
      if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      // Filter by search term
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term)
        );
      }

      return filtered;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
