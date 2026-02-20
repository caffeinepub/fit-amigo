import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import type { ExternalProduct } from '../types/ExternalProduct';
import type { ExternalSportsProduct } from '../hooks/useGetExternalSportsProducts';

interface ProductCardProps {
  product: Product | ExternalProduct | ExternalSportsProduct;
  onAddToCart?: () => void;
}

function isExternalProduct(product: Product | ExternalProduct | ExternalSportsProduct): product is ExternalProduct | ExternalSportsProduct {
  return 'isExternal' in product && product.isExternal === true;
}

function isSportsProduct(product: Product | ExternalProduct | ExternalSportsProduct): product is ExternalSportsProduct {
  return 'externalProductUrl' in product;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isExternal = isExternalProduct(product);
  const isSports = isSportsProduct(product);

  const getImageUrl = () => {
    if (isExternal) {
      return product.imageUrl;
    }
    
    if (product.image) {
      return product.image.getDirectURL();
    }
    
    return product.name.toLowerCase().includes('supplement')
      ? '/assets/generated/supplements-placeholder.dim_400x400.png'
      : '/assets/generated/sports-equipment-placeholder.dim_400x400.png';
  };

  const getExternalUrl = () => {
    if (isSports) {
      return product.externalProductUrl;
    }
    if ('externalUrl' in product) {
      return product.externalUrl;
    }
    return 'https://workoutpuppy.com';
  };

  const price = isExternal ? product.price : Number(product.price);
  const productId = isExternal ? product.id : product.id.toString();

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${
      isExternal ? 'hover:border-sunny-yellow' : 'hover:border-energetic-orange'
    }`}>
      {isExternal ? (
        <div className="aspect-square overflow-hidden bg-muted relative">
          <Badge className="absolute top-2 right-2 z-10 bg-sunny-yellow text-black font-semibold">
            External
          </Badge>
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <Link to="/product/$productId" params={{ productId }}>
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={getImageUrl()}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <CardContent className="p-4">
        {isExternal ? (
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
        ) : (
          <Link to="/product/$productId" params={{ productId }}>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-energetic-orange transition-colors">
              {product.name}
            </h3>
          </Link>
        )}
        {!isExternal && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}
        {isExternal && 'description' in product && product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${isExternal ? 'text-sunny-yellow' : 'text-energetic-orange'}`}>
            ${price}
          </span>
          {!isExternal && (
            <span className="text-sm text-muted-foreground">Stock: {Number(product.quantity)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isExternal ? (
          <Button
            asChild
            className="w-full bg-sunny-yellow hover:bg-sunny-yellow/90 text-black font-semibold"
          >
            <a href={getExternalUrl()} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Product
            </a>
          </Button>
        ) : (
          <Button
            onClick={onAddToCart}
            className="w-full bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            disabled={Number(product.quantity) === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {Number(product.quantity) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
