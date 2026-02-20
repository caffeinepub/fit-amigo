import { useState } from 'react';
import { useGetNewsArticles } from '../hooks/useGetNewsArticles';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import AddNewsArticleDialog from '../components/AddNewsArticleDialog';
import EditNewsArticleDialog from '../components/EditNewsArticleDialog';
import DeleteNewsArticleDialog from '../components/DeleteNewsArticleDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { NewsArticle, ArticleType } from '../backend';

export default function AdminNewsManagement() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: articles = [], isLoading: articlesLoading } = useGetNewsArticles(null);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);

  if (!identity) {
    return <AccessDeniedScreen message="Please login to access news management." />;
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
    return <AccessDeniedScreen message="Admin access required to manage news articles." />;
  }

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      workoutTips: 'Workout Tips',
      nutrition: 'Nutrition',
      sportsNews: 'Sports News',
      trainingAdvice: 'Training Advice',
      productReviews: 'Product Reviews',
      mentalHealth: 'Mental Health',
      fitnessLifestyle: 'Fitness Lifestyle',
    };
    return labels[category] || category;
  };

  const getArticleTypeBadge = (articleType: ArticleType) => {
    if (articleType === 'internal') {
      return <Badge className="bg-vibrant-green text-white">Internal</Badge>;
    }
    return <Badge className="bg-sunny-yellow text-black">External</Badge>;
  };

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            News <span className="text-energetic-orange">Management</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage fitness and sports news articles
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add News Article
        </Button>
      </div>

      {articlesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-xl text-muted-foreground mb-4">No articles yet</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>News Articles ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Publication Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={Number(article.id)}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{getCategoryLabel(article.category)}</TableCell>
                    <TableCell>{formatDate(article.publicationDate)}</TableCell>
                    <TableCell>{getArticleTypeBadge(article.articleType)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingArticle(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-bold-red hover:text-bold-red"
                          onClick={() => setDeletingArticle(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Article Dialog */}
      <AddNewsArticleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => setShowAddDialog(false)}
      />

      {/* Edit Article Dialog */}
      {editingArticle && (
        <EditNewsArticleDialog
          open={!!editingArticle}
          onOpenChange={(open) => !open && setEditingArticle(null)}
          articleId={editingArticle.id}
          onSuccess={() => setEditingArticle(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingArticle && (
        <DeleteNewsArticleDialog
          open={!!deletingArticle}
          onOpenChange={(open) => !open && setDeletingArticle(null)}
          articleId={deletingArticle.id}
          articleTitle={deletingArticle.title}
          onSuccess={() => setDeletingArticle(null)}
        />
      )}
    </div>
  );
}
