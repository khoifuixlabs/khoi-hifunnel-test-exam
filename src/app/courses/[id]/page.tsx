import { getCourse } from '@/utils/courses';
import Header from '@/components/Header';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PlayIcon, DocumentTextIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface CoursePageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.id);

  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }

  return {
    title: `${course.title} - Learn Programming and Development`,
    description: course.description,
    keywords: `${course.title}, programming courses, online learning, ${course.videos?.length || 0} videos`,
    openGraph: {
      title: course.title,
      description: course.description,
      type: 'website',
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/courses" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.description}</p>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <VideoCameraIcon className="w-5 h-5 mr-2" />
                {course.videos?.length || 0} Videos
              </div>
              {course.document && (
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  {course.document.type.toUpperCase()} Document
                </div>
              )}
              {course.registeredUsers && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  {course.registeredUsers.length} Students
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Intro Video */}
            {course.videoIntroUrl && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <PlayIcon className="w-6 h-6 mr-2 text-indigo-600" />
                    Course Introduction
                  </h2>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <a
                      href={course.videoIntroUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-full group"
                    >
                      <div className="bg-indigo-600 rounded-full p-4 group-hover:bg-indigo-700 transition-colors">
                        <PlayIcon className="w-12 h-12 text-white" />
                      </div>
                    </a>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click to watch the introduction video</p>
                </div>
              </div>
            )}

            {/* Course Videos */}
            {course.videos && course.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <VideoCameraIcon className="w-6 h-6 mr-2 text-indigo-600" />
                    Course Videos ({course.videos.length})
                  </h2>

                  <div className="space-y-4">
                    {course.videos.map((video, index) => (
                      <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{video.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              <PlayIcon className="w-4 h-4 mr-2" />
                              Watch Video
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Course Document */}
            {course.document && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="w-6 h-6 mr-2 text-indigo-600" />
                    Course Material ({course.document.type.toUpperCase()})
                  </h2>

                  <div className="bg-gray-50 rounded-lg p-6">
                    {course.document.type === 'html' ? (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.document.content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{course.document.content}</pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Videos:</span>
                  <span className="font-medium">{course.videos?.length || 0}</span>
                </div>
                {course.document && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document:</span>
                    <span className="font-medium">{course.document.type.toUpperCase()}</span>
                  </div>
                )}
                {course.registeredUsers && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{course.registeredUsers.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/courses/${course.id}/checkout`}
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Register for Course
                </Link>

                {course.videoIntroUrl && (
                  <a
                    href={course.videoIntroUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Watch Introduction
                  </a>
                )}

                <Link
                  href="/courses"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Browse More Courses
                </Link>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Course</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
            </div>
          </div>
        </div>
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
