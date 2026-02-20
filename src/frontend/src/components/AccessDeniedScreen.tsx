import { Link } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({ message = 'You do not have permission to access this page.' }: AccessDeniedScreenProps) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-bold-red">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-16 w-16 text-bold-red" />
            </div>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{message}</p>
            <Link to="/store">
              <Button className="bg-energetic-orange hover:bg-energetic-orange/90">
                Return to Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
