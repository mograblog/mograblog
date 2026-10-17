export const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || '';
export const CLERK_PUBLISHABLE_KEY = 
  import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || '';

export interface BlogUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

let clerkInstance: any = null;
let clerkInitPromise: Promise<any> | null = null;
const authListeners: Array<(user: BlogUser | null) => void> = [];

export function getClerkUser(clerk: any): BlogUser | null {
  if (!clerk || !clerk.user) return null;
  const email = clerk.user.primaryEmailAddress?.emailAddress || '';
  const name = clerk.user.fullName || clerk.user.firstName || clerk.user.username || email.split('@')[0] || 'User';
  return {
    id: clerk.user.id,
    name,
    email,
    avatar: clerk.user.imageUrl,
    isAdmin: Boolean(
      (ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
      clerk.user?.publicMetadata?.isAdmin
    ),
  };
}

async function waitForWindowClerk(timeoutMs = 2500): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).Clerk) return (window as any).Clerk;

  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if ((window as any).Clerk) {
        resolve((window as any).Clerk);
      } else if (Date.now() - start > timeoutMs) {
        resolve(null);
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

export async function initClerk(): Promise<any> {
  if (clerkInstance) return clerkInstance;
  if (clerkInitPromise) return clerkInitPromise;

  clerkInitPromise = (async () => {
    try {
      let clerk = await waitForWindowClerk();

      if (!clerk) {
        const { Clerk } = await import('@clerk/clerk-js');
        clerk = new Clerk(CLERK_PUBLISHABLE_KEY);
      }

      if (!clerk.loaded) {
        await clerk.load();
      }

      clerkInstance = clerk;
      if (typeof window !== 'undefined') {
        (window as any).Clerk = clerk;
      }

      if (typeof clerk.addListener === 'function') {
        clerk.addListener(() => {
          const user = getClerkUser(clerk);
          authListeners.forEach((cb) => {
            try { cb(user); } catch (e) { console.error(e); }
          });
        });
      }

      return clerk;
    } catch (err) {
      console.warn('[Clerk] Failed to initialize Clerk JS:', err);
      throw err;
    }
  })();

  return clerkInitPromise;
}

export function onAuthChange(callback: (user: BlogUser | null) => void) {
  authListeners.push(callback);
}

export function getClerkFrontendApi(): string {
  try {
    const key = CLERK_PUBLISHABLE_KEY;
    const base64 = key.replace(/^pk_(test|live)_/, '');
    const decoded = typeof atob !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString();
    return decoded.replace(/\$$/, '');
  } catch (e) {
    return 'clerk.mograblog.com';
  }
}

export function getClerkAccountsUrl(): string {
  const fapi = getClerkFrontendApi();
  if (fapi.startsWith('clerk.')) {
    return fapi.replace(/^clerk\./, 'accounts.');
  }
  return fapi;
}

export async function openSignInModal(): Promise<void> {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mograblog.com/admin/comments';
  try {
    const clerk = await initClerk();
    if (clerk && typeof clerk.openSignIn === 'function') {
      clerk.openSignIn({
        fallbackRedirectUrl: currentUrl,
        signUpFallbackRedirectUrl: currentUrl,
        afterSignInUrl: currentUrl,
        afterSignUpUrl: currentUrl,
      });
      return;
    }
    if (clerk && typeof clerk.redirectToSignIn === 'function') {
      clerk.redirectToSignIn({
        fallbackRedirectUrl: currentUrl,
        signUpFallbackRedirectUrl: currentUrl,
        afterSignInUrl: currentUrl,
        afterSignUpUrl: currentUrl,
      });
      return;
    }
  } catch (err) {
    console.warn('openSignIn failed, redirecting to Clerk sign-in URL:', err);
  }

  // Fallback: redirect to Clerk accounts portal with explicit redirect parameters
  if (typeof window !== 'undefined') {
    const portal = getClerkAccountsUrl();
    window.location.href = `https://${portal}/sign-in?redirect_url=${encodeURIComponent(currentUrl)}&after_sign_in_url=${encodeURIComponent(currentUrl)}`;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    const clerk = await initClerk();
    if (clerk && typeof clerk.signOut === 'function') {
      await clerk.signOut();
    }
  } catch (e) {
    console.warn('Sign out error:', e);
  }
}

export async function getClerkToken(): Promise<string | null> {
  try {
    const clerk = await initClerk();
    if (!clerk || !clerk.session) return null;
    return await clerk.session.getToken();
  } catch (e) {
    return null;
  }
}

export async function openUserProfileModal(): Promise<void> {
  try {
    const clerk = await initClerk();
    if (clerk && typeof clerk.openUserProfile === 'function') {
      clerk.openUserProfile();
    }
  } catch (e) {
    console.warn('openUserProfile error:', e);
  }
}

