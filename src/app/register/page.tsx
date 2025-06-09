'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '@/components/FormInput';
import LoadingButton from '@/components/LoadingButton';
import { useState } from 'react';

// Validation schema
const schema = yup.object({
  email: yup.string().min(6, 'Email must be at least 6 characters long').email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  role: yup.string().oneOf(['learner', 'creator'], 'Role must be either learner or creator').required('Role is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful! Welcome to the platform.');
        console.log('User registered:', result.user);
        // You could redirect to login page or dashboard here
        // window.location.href = '/login';
      } else {
        alert(`Registration failed: ${result.error}${result.details ? ` - ${result.details}` : ''}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'Select a role' },
    { value: 'learner', label: 'Learner' },
    { value: 'creator', label: 'Creator' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
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
              className="rounded-t-md mb-2"
              disabled={isLoading}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              autoComplete="new-password"
              register={register('password')}
              error={errors.password?.message}
              className="rounded-b-md"
              disabled={isLoading}
            />

            <div className="mt-4">
              <FormInput
                id="role"
                type="select"
                label="Role"
                showLabel={true}
                register={register('role')}
                error={errors.role?.message}
                options={roleOptions}
                defaultValue=""
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <LoadingButton type="submit" isLoading={isLoading} loadingText="Creating account...">
              Create account
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
