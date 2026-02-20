import { Outlet } from '@tanstack/react-router';
import Navigation from './Navigation';
import ProfileSetupModal from './ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <ProfileSetupModal />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <footer className="bg-card border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} FIT AMIGO. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-energetic-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
