import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ExternalBlob, type Product } from '../backend';
import { useAddProduct } from '../hooks/useAddProduct';
import { useEditProduct } from '../hooks/useEditProduct';
import { toast } from 'sonner';

interface AdminProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  image?: FileList;
}

export default function AdminProductForm({ product, onSuccess, onCancel }: AdminProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: String(Number(product.price)),
      quantity: String(Number(product.quantity)),
    } : undefined,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const addProduct = useAddProduct();
  const editProduct = useEditProduct();

  const isEditing = !!product;
  const isLoading = addProduct.isPending || editProduct.isPending;

  const onSubmit = async (data: FormData) => {
    try {
      let imageBlob: ExternalBlob | undefined;

      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (isEditing && product.image) {
        imageBlob = product.image;
      }

      const productDetails = {
        name: data.name,
        description: data.description,
        price: BigInt(Math.round(Number(data.price))),
        quantity: BigInt(Math.round(Number(data.quantity))),
        image: imageBlob,
      };

      if (isEditing) {
        await editProduct.mutateAsync({ id: product.id, productDetails });
        toast.success('Product updated successfully!');
      } else {
        await addProduct.mutateAsync(productDetails);
        toast.success('Product added successfully!');
      }

      setUploadProgress(0);
      onSuccess?.();
    } catch (error) {
      console.error('Product form error:', error);
      toast.error(isEditing ? 'Failed to update product' : 'Failed to add product');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Product name is required' })}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-sm text-bold-red mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter product description"
              rows={4}
            />
            {errors.description && <p className="text-sm text-bold-red mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-bold-red mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="quantity">Stock Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
                placeholder="0"
              />
              {errors.quantity && <p className="text-sm text-bold-red mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="image">Product Image {!isEditing && '*'}</Label>
            <Input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              {...register('image', { 
                required: isEditing ? false : 'Product image is required'
              })}
            />
            {errors.image && <p className="text-sm text-bold-red mt-1">{errors.image.message}</p>}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-sm text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
