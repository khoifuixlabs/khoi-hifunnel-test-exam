'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '@/components/FormInput';

// Validation schema
const schema = yup.object({
  email: yup.string().min(6, 'Email must be at least 6 characters long').email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Login successful! Welcome back.');
        console.log('User logged in:', result.user);
        console.log('Access token received:', result.accessToken);

        // Store user info and token in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('tokenType', result.tokenType);

        // Redirect based on user role
        if (result.user.role === 'creator') {
          window.location.href = '/admin';
        } else {
          // Redirect to a default dashboard or home page for other roles
          window.location.href = '/';
        }
      } else {
        alert(`Login failed: ${result.error}${result.details ? ` - ${result.details}` : ''}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px">
            <FormInput
              id="email"
              type="email"
              label="Email address"
              placeholder="Email address"
              autoComplete="email"
              register={register('email')}
              error={errors.email?.message}
              className="rounded-t-md"
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              autoComplete="current-password"
              register={register('password')}
              error={errors.password?.message}
              className="rounded-b-md"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
