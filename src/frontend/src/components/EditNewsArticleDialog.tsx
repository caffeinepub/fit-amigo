import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useGetNewsArticle } from '../hooks/useGetNewsArticle';
import { useEditNewsArticle } from '../hooks/useEditNewsArticle';
import { ExternalBlob, NewsCategory, ArticleType, type ArticleId } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditNewsArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: ArticleId;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  articleType: ArticleType;
  content: string;
  externalUrl: string;
  author: string;
  publicationDate: string;
  category: NewsCategory;
  featuredImage?: FileList;
}

export default function EditNewsArticleDialog({ open, onOpenChange, articleId, onSuccess }: EditNewsArticleDialogProps) {
  const { data: article, isLoading: articleLoading } = useGetNewsArticle(articleId);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>();

  const [uploadProgress, setUploadProgress] = useState(0);
  const editArticle = useEditNewsArticle();

  const articleType = watch('articleType');
  const isInternal = articleType === ArticleType.internal;

  useEffect(() => {
    if (article) {
      const publicationDate = new Date(Number(article.publicationDate));
      const formattedDate = publicationDate.toISOString().split('T')[0];

      reset({
        title: article.title,
        articleType: article.articleType,
        content: article.content,
        externalUrl: article.externalUrl || '',
        author: article.author,
        publicationDate: formattedDate,
        category: article.category,
      });
    }
  }, [article, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = article?.featuredImageUrl || '';

      if (data.featuredImage && data.featuredImage.length > 0) {
        const file = data.featuredImage[0];
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        imageUrl = imageBlob.getDirectURL();
      }

      const publicationTimestamp = BigInt(new Date(data.publicationDate).getTime());

      const articleInput = {
        title: data.title,
        content: isInternal ? data.content : '',
        articleType: data.articleType,
        externalUrl: !isInternal ? data.externalUrl : undefined,
        author: data.author,
        publicationDate: publicationTimestamp,
        category: data.category,
        featuredImageUrl: imageUrl,
      };

      await editArticle.mutateAsync({ articleId, articleInput });
      toast.success('Article updated successfully!');
      setUploadProgress(0);
      onSuccess?.();
    } catch (error) {
      console.error('Edit article error:', error);
      toast.error('Failed to update article');
    }
  };

  if (articleLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-energetic-orange" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit News Article</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter article title"
            />
            {errors.title && <p className="text-sm text-bold-red mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label>Article Type *</Label>
            <RadioGroup
              value={articleType}
              onValueChange={(value) => setValue('articleType', value as ArticleType)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ArticleType.internal} id="internal" />
                <Label htmlFor="internal" className="cursor-pointer">Internal Article</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ArticleType.external} id="external" />
                <Label htmlFor="external" className="cursor-pointer">External Link</Label>
              </div>
            </RadioGroup>
          </div>

          {isInternal ? (
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...register('content', { required: isInternal ? 'Content is required for internal articles' : false })}
                placeholder="Enter article content"
                rows={6}
              />
              {errors.content && <p className="text-sm text-bold-red mt-1">{errors.content.message}</p>}
            </div>
          ) : (
            <div>
              <Label htmlFor="externalUrl">External URL *</Label>
              <Input
                id="externalUrl"
                {...register('externalUrl', { required: !isInternal ? 'External URL is required' : false })}
                placeholder="https://example.com/article"
              />
              {errors.externalUrl && <p className="text-sm text-bold-red mt-1">{errors.externalUrl.message}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              {...register('author', { required: 'Author is required' })}
              placeholder="Enter author name"
            />
            {errors.author && <p className="text-sm text-bold-red mt-1">{errors.author.message}</p>}
          </div>

          <div>
            <Label htmlFor="publicationDate">Publication Date *</Label>
            <Input
              id="publicationDate"
              type="date"
              {...register('publicationDate', { required: 'Publication date is required' })}
            />
            {errors.publicationDate && <p className="text-sm text-bold-red mt-1">{errors.publicationDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value as NewsCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NewsCategory.workoutTips}>Workout Tips</SelectItem>
                <SelectItem value={NewsCategory.nutrition}>Nutrition</SelectItem>
                <SelectItem value={NewsCategory.sportsNews}>Sports News</SelectItem>
                <SelectItem value={NewsCategory.trainingAdvice}>Training Advice</SelectItem>
                <SelectItem value={NewsCategory.productReviews}>Product Reviews</SelectItem>
                <SelectItem value={NewsCategory.mentalHealth}>Mental Health</SelectItem>
                <SelectItem value={NewsCategory.fitnessLifestyle}>Fitness Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-bold-red mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image</Label>
            {article?.featuredImageUrl && (
              <div className="mb-2">
                <img
                  src={article.featuredImageUrl}
                  alt="Current featured"
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-sm text-muted-foreground mt-1">Current image (upload new to replace)</p>
              </div>
            )}
            <Input
              id="featuredImage"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              {...register('featuredImage')}
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-sm text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={editArticle.isPending}
              className="bg-vibrant-green hover:bg-vibrant-green/90 font-semibold"
            >
              {editArticle.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Article
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
