import AuthForm from '~/components/auth/AuthForm';
import authStyles from `~/styles/auth.css`
import { signup, login } from '~/util/auth.server';
import { validateCredentials } from '~/util/validation.server';
import { useSearchParams } from '@remix-run/react';

export function links() {
  return( [{rel:'stylesheet', href:authStyles}] )
}

export default function AuthPage() {
  return <AuthForm />;
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    validateCredentials(credentials)
  } catch(error) {
    return error
  }

  // Validate User Input
  try {
    if(authMode === 'login') {
      return await login(credentials)
    } else {
      return await signup(credentials)
    }
  } catch(error) {
    if(error.status === 422) {
      return {credentials: error.message}
    }
  }
}

export function meta({matches}) {
  const params = useSearchParams();
  const mode = params[0].get('mode') === 'sign-up' ? 'Register' : 'Login';
  return [
    {title: `Remix Expenses | ${mode}`},
    {description: 'Authentication Page'},
  ]
}

export function headers({parentHeaders}) {
  return {
    'Cache-Control': parentHeaders.get('Cache-Control')
  }
}
