import { useDeleteNewsArticle } from '../hooks/useDeleteNewsArticle';
import type { ArticleId } from '../backend';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteNewsArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: ArticleId;
  articleTitle: string;
  onSuccess?: () => void;
}

export default function DeleteNewsArticleDialog({
  open,
  onOpenChange,
  articleId,
  articleTitle,
  onSuccess,
}: DeleteNewsArticleDialogProps) {
  const deleteArticle = useDeleteNewsArticle();

  const handleDelete = async () => {
    try {
      await deleteArticle.mutateAsync(articleId);
      toast.success('Article deleted successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Delete article error:', error);
      toast.error('Failed to delete article');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Article</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{articleTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-bold-red hover:bg-bold-red/90"
          >
            {deleteArticle.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
