import { useState } from 'react';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useGetExternalProducts } from '../hooks/useGetExternalProducts';
import { useGetExternalSportsProducts } from '../hooks/useGetExternalSportsProducts';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useAddToCart } from '../hooks/useAddToCart';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Product } from '../backend';
import type { ExternalProduct } from '../types/ExternalProduct';
import type { ExternalSportsProduct } from '../hooks/useGetExternalSportsProducts';

export default function Store() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const { identity } = useInternetIdentity();
  
  const { data: internalProducts = [], isLoading: internalLoading } = useSearchProducts(searchTerm);
  const { data: externalProducts = [], isLoading: externalLoading } = useGetExternalProducts();
  
  // Map category filter for sports products API
  const sportsCategory = category !== 'all' ? category : undefined;
  const { data: sportsProducts = [], isLoading: sportsLoading } = useGetExternalSportsProducts(
    sportsCategory,
    searchTerm || undefined
  );
  
  const addToCart = useAddToCart();

  const isLoading = internalLoading || externalLoading || sportsLoading;

  // Merge all product sources
  const allProducts: (Product | ExternalProduct | ExternalSportsProduct)[] = [
    ...internalProducts,
    ...externalProducts,
    ...sportsProducts,
  ];

  const filteredProducts = allProducts.filter((product) => {
    const isExternal = 'isExternal' in product && product.isExternal;
    const productName = product.name.toLowerCase();
    const productCategory = 'category' in product ? product.category : '';
    
    // Category filtering
    let categoryMatch = category === 'all';
    if (!categoryMatch) {
      if (category === 'gym-equipment') {
        categoryMatch = productCategory === 'gym-equipment' || productName.includes('gym') || productName.includes('equipment');
      } else if (category === 'running-gear') {
        categoryMatch = productCategory === 'running-gear' || productName.includes('running') || productName.includes('run');
      } else if (category === 'sports-apparel') {
        categoryMatch = productCategory === 'sports-apparel' || productName.includes('apparel') || productName.includes('clothing');
      } else if (category === 'supplements') {
        categoryMatch = productCategory === 'supplements' || productName.includes('supplement') || productName.includes('protein');
      } else if (category === 'equipment') {
        categoryMatch = productCategory === 'equipment' || (!productName.includes('supplement'));
      }
    }

    // Price filtering
    const price = isExternal ? product.price : Number(product.price);
    const priceMatch = !maxPrice || price <= Number(maxPrice);

    return categoryMatch && priceMatch;
  });

  const handleAddToCart = async (productId: bigint) => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="FIT AMIGO Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Gear Up for <span className="text-energetic-orange">Greatness</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Premium sports equipment and supplements to fuel your fitness journey
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              category={category}
              onCategoryChange={setCategory}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isExternal = 'isExternal' in product && product.isExternal;
                  const key = isExternal ? `ext-${product.id}` : `int-${product.id}`;
                  
                  return (
                    <ProductCard
                      key={key}
                      product={product}
                      onAddToCart={isExternal ? undefined : () => handleAddToCart(product.id as bigint)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
