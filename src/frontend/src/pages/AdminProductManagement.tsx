import { useState } from 'react';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import AdminProductForm from '../components/AdminProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../backend';

export default function AdminProductManagement() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products = [], isLoading: productsLoading } = useSearchProducts('');
  const deleteProduct = useDeleteProduct();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  if (!identity) {
    return <AccessDeniedScreen message="Please login to access product management." />;
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen message="Admin access required to manage products." />;
  }

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success('Product deleted successfully!');
      setDeletingProduct(null);
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('Failed to delete product');
    }
  };

  const internalProducts = products.filter(p => p.isInternal);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Product <span className="text-energetic-orange">Management</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your internal product inventory
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {productsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
        </div>
      ) : internalProducts.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-xl text-muted-foreground mb-4">No products yet</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Internal Products ({internalProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internalProducts.map((product) => {
                  const imageUrl = product.image
                    ? product.image.getDirectURL()
                    : product.name.toLowerCase().includes('supplement')
                    ? '/assets/generated/supplements-placeholder.dim_400x400.png'
                    : '/assets/generated/sports-equipment-placeholder.dim_400x400.png';

                  return (
                    <TableRow key={Number(product.id)}>
                      <TableCell>
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${Number(product.price)}</TableCell>
                      <TableCell>{Number(product.quantity)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-bold-red hover:text-bold-red"
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AdminProductForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <AdminProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-bold-red hover:bg-bold-red/90"
            >
              {deleteProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
