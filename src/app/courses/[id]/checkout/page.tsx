'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import Loading from '@/components/Loading';

// Public course interface (without sensitive data)
interface PublicCourse {
  id: string;
  title: string;
  description: string;
  videoIntroUrl?: string;
  document?: {
    type: 'text' | 'pdf' | 'html';
    content: string;
  };
  videos?: Array<{
    id: string;
    title: string;
    url: string;
    description: string;
  }>;
  registeredUsersCount: number;
}

// Validation schema
const checkoutSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  address: yup.string().min(10, 'Address must be at least 10 characters').required('Address is required'),
  checkoutMethod: yup
    .string()
    .oneOf(['credit_card', 'debit_card', 'paypal', 'bank_transfer'], 'Please select a valid payment method')
    .required('Payment method is required'),
});

type CheckoutFormData = yup.InferType<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      checkoutMethod: 'credit_card',
    },
    mode: 'onChange',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}/checkout`);
    }
  }, [isAuthenticated, isLoading, router, courseId]);

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      setIsLoadingCourse(true);
      try {
        const response = await fetch(`/api/courses/${courseId}/public`);
        const result = await response.json();

        if (response.ok && result.success) {
          setCourse(result.data);
        } else {
          console.error('Error loading course:', result.error);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/courses/${courseId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkoutInfo: data,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        // Redirect to course page after 3 seconds
        setTimeout(() => {
          router.push(`/courses/${courseId}`);
        }, 3000);
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setSubmitError('An error occurred during registration. Please try again.');
    }
  };

  // Show loading state for auth
  if (isLoading) {
    return <Loading />;
  }

  // Show loading state for course
  if (isLoadingCourse) {
    return <Loading />;
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">
              You have been successfully registered for {course?.title}. You will be redirected to the course page shortly.
            </p>
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              View Course
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/courses/${courseId}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Register for Course</h1>
          <h2 className="text-xl text-indigo-600 font-semibold mb-2">{course.title}</h2>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Registration Information</h3>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormInput
              id="name"
              type="text"
              label="Full Name *"
              showLabel={true}
              placeholder="Enter your full name"
              register={register('name')}
              error={errors.name?.message}
            />

            {/* Phone */}
            <FormInput
              id="phone"
              type="text"
              label="Phone Number *"
              showLabel={true}
              placeholder="Enter your phone number"
              register={register('phone')}
              error={errors.phone?.message}
            />

            {/* Address */}
            <FormInput
              id="address"
              type="textarea"
              label="Address *"
              showLabel={true}
              placeholder="Enter your full address"
              rows={3}
              register={register('address')}
              error={errors.address?.message}
            />

            {/* Checkout Method */}
            <FormInput
              id="checkoutMethod"
              type="select"
              label="Payment Method *"
              showLabel={true}
              register={register('checkoutMethod')}
              error={errors.checkoutMethod?.message}
              options={[
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'debit_card', label: 'Debit Card' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
              ]}
            />

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your information is secure and will be used only for course registration.</p>
        </div>
      </main>
    </div>
  );
}
