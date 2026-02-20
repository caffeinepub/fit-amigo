import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { useGetVideoComments } from '../hooks/useGetVideoComments';
import { useAddComment } from '../hooks/useAddComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface VideoCommentsSectionProps {
  videoId: bigint;
}

function CommentItem({ comment, videoId }: { comment: any; videoId: bigint }) {
  const { data: commenterProfile } = useGetUserProfile(comment.userId);
  const { identity } = useInternetIdentity();
  const deleteComment = useDeleteComment();

  const isOwner = identity?.getPrincipal().toString() === comment.userId.toString();

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync({ commentId: comment.id, videoId });
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error('Delete comment error:', error);
    }
  };

  const timeAgo = (timestamp: bigint) => {
    const now = Date.now();
    const diff = now - Number(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{commenterProfile?.name || 'Anonymous'}</span>
              <span className="text-sm text-muted-foreground">{timeAgo(comment.timestamp)}</span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this comment? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VideoCommentsSection({ videoId }: VideoCommentsSectionProps) {
  const [commentText, setCommentText] = useState('');
  const { identity } = useInternetIdentity();
  const { data: comments = [], isLoading } = useGetVideoComments(videoId);
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment.mutateAsync({ videoId, text: commentText });
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Add comment error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-vibrant-green" />
        Comments ({comments.length})
      </h2>

      {identity && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            type="submit"
            disabled={!commentText.trim() || addComment.isPending}
            className="bg-vibrant-green hover:bg-vibrant-green/90"
          >
            {addComment.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-energetic-orange" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id.toString()} comment={comment} videoId={videoId} />
          ))}
        </div>
      )}
    </div>
  );
}
