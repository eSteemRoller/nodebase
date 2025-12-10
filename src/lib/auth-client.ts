
import { createAuthClient } from "better-auth/react";

type SignInOptions = {
  email: string;
  password: string;
  callbackURL?: string;
};

type SignUpOptions = {
  name?: string;
  email: string;
  password: string;
  callbackURL?: string;
};

type CallbackCtx = { error?: { message?: string } | null };

interface AuthClient {
  signIn: {
    email: (
      opts: SignInOptions,
      callbacks?: { onSuccess?: () => void; onError?: (ctx: CallbackCtx) => void },
    ) => Promise<any>;
  };
  signUp: {
    email: (
      opts: SignUpOptions,
      callbacks?: { onSuccess?: () => void; onError?: (ctx: CallbackCtx) => void },
    ) => Promise<any>;
  };
  signOut: (opts?: any) => Promise<any>;
  checkout: (opts: { slug: string }) => Promise<{ url?: string } | any>;
  customer: {
    portal: () => Promise<{ url?: string } | any>;
    state: () => Promise<any>;
  };
}

// create the base client from better-auth for client-side hooks and actions
const baseAuthClient = createAuthClient({});

// Export a tightly-typed wrapper that delegates server-backed operations to
// the `better-auth` Next.js handler mounted at `/api/auth/*`.
export const authClient = baseAuthClient as unknown as AuthClient;

authClient.checkout = async (opts: { slug: string }) => {
  const res = await fetch('/api/auth/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(opts),
  });
  return res.json();
};

authClient.customer = {
  portal: async () => {
    // better-auth mounts customer/portal under the auth handler
    const res = await fetch('/api/auth/customer/portal', { method: 'GET' });
    return res.json();
  },
  state: async () => {
    const res = await fetch('/api/auth/customer/state');
    return res.json();
  },
};
