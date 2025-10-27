import React, { useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonConfig {
  theme: string;
  size: string;
  text: string;
  shape: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [initError, setInitError] = React.useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = React.useState(0);
  // guard so initialize 
  const initializedRef = useRef(false);
  
  const handleRetry = () => {
    // clear error and allow effect to re-run
    setInitError(null);
    initializedRef.current = false;
    setRetryAttempt((s) => s + 1);
  };
  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      // Send the JWT token to backend
      const result = await authService.googleSignIn(response.credential);

      // Store the auth token and update auth state
      login(result.user, result.token);

      // Handle successful authentication
      onLoginSuccess(result.user);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }, [onLoginSuccess, login]);

  useEffect(() => {
    // Initialize Google Sign-In 
    if (!window.google) {
      console.warn('Google Identity Services not loaded. Make sure <script src="https://accounts.google.com/gsi/client" async defer></script> is in index.html');
      return;
    }

    if (initializedRef.current) return; 
    if (!googleButtonRef.current) return;

      try {
        // Resolve client id in a browser- and test-friendly way.
        // Prefer import.meta.env in the browser, then globalThis.importMetaEnv (test shim), then process.env.
        const clientId = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID)
          ? (import.meta as any).env.VITE_GOOGLE_CLIENT_ID
          : (typeof globalThis !== 'undefined' && (globalThis as any).importMetaEnv?.VITE_GOOGLE_CLIENT_ID)
            ? (globalThis as any).importMetaEnv.VITE_GOOGLE_CLIENT_ID
            : (process.env.VITE_GOOGLE_CLIENT_ID as string) || '';
      // Debug info to help diagnose origin
      console.debug('[GSI] init attempt', { clientId, origin: window.location.origin });
      if (!clientId) {
        setInitError('No Google Client ID configured. Add VITE_GOOGLE_CLIENT_ID to .env and restart the dev server');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      try {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
        });
      } catch (renderErr) {
        console.error('renderButton error:', renderErr);
        setInitError('Failed to render Google sign-in button. This may be an origin/client-id configuration issue.');
      }


      initializedRef.current = true;
    } catch (err) {
      console.error('Failed to initialize Google Identity Services:', err);
      setInitError(String(err || 'Unknown initialization error'));
    }
  }, [handleCredentialResponse, retryAttempt]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Use your Google account to continue
          </p>
        </div>

        {initError && (
          <div className="p-4 mb-4 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md">
            <div className="mb-2 font-semibold">Sign-in issue</div>
            <div className="mb-3 text-sm">{initError}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm bg-white border rounded"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                Open Google Cloud Credentials
              </button>
              <button className="px-3 py-1 text-sm bg-white border rounded" onClick={handleRetry}>
                Retry
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-700">If you see "no registered origin" in the OAuth popup, add <code>http://localhost:5173</code> to Authorized JavaScript origins.</div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-center">
            <div ref={googleButtonRef} id="google-signin-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;