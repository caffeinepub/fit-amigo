import { Link } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Loader2, Newspaper } from 'lucide-react';

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return <AccessDeniedScreen message="Please login to access the admin dashboard." />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen message="Admin access required to view this page." />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Admin <span className="text-energetic-orange">Dashboard</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your FIT AMIGO store products, news, and content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-2 hover:border-energetic-orange">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-vibrant-green/10 rounded-lg">
                <Package className="h-6 w-6 text-vibrant-green" />
              </div>
              <CardTitle>Product Management</CardTitle>
            </div>
            <CardDescription>
              Add, edit, and manage your internal product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/products">
              <Button className="w-full bg-vibrant-green hover:bg-vibrant-green/90 font-semibold">
                Manage Products
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-2 hover:border-energetic-orange">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sunny-yellow/10 rounded-lg">
                <Newspaper className="h-6 w-6 text-sunny-yellow" />
              </div>
              <CardTitle>News Management</CardTitle>
            </div>
            <CardDescription>
              Create and manage fitness and sports news articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/news">
              <Button className="w-full bg-sunny-yellow hover:bg-sunny-yellow/90 text-black font-semibold">
                Manage News
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
