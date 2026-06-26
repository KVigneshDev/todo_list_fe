import { AuthScreen } from '@/components/auth/AuthScreen';
import { TodoApp } from '@/components/TodoApp';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';

/**
 * Top-level gate: show a loader while the stored session is validated, then
 * either the login screen or the authenticated todo app.
 */
export default function App() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="h-6 w-6 text-content-muted" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <AuthScreen />;
  }

  return <TodoApp />;
}
