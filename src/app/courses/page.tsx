import { getCourses } from '@/utils/courses';
import CourseCard from '@/components/CourseCard';
import Header from '@/components/Header';
import { Metadata } from 'next';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'All Courses - Learn Programming and Development',
  description:
    'Explore our comprehensive collection of programming courses. Learn JavaScript, web development, and more with our expert-led video tutorials.',
  keywords: 'programming courses, JavaScript, web development, online learning, tutorials',
  openGraph: {
    title: 'All Courses - Learn Programming and Development',
    description:
      'Explore our comprehensive collection of programming courses. Learn JavaScript, web development, and more with our expert-led video tutorials.',
    type: 'website',
  },
};

export default async function CoursesPage() {
  // Server-side data fetching for SEO optimization
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Courses</h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Learn new skills with our comprehensive collection of programming and development courses
          </p>
          <div className="text-lg text-indigo-100">{courses.length} courses available</div>
        </div>
      </section>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500">Check back later for new courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
