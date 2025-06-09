'use client';

import { Course } from '@/types/course';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseDetailsModal({ course, isOpen, onClose }: CourseDetailsModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Details</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">{course.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
            </div>

            {course.videoIntroUrl && (
              <div>
                <h5 className="font-medium text-gray-700">Video Intro</h5>
                <a href={course.videoIntroUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm">
                  {course.videoIntroUrl}
                </a>
              </div>
            )}

            {course.document && (
              <div>
                <h5 className="font-medium text-gray-700">Document ({course.document.type})</h5>
                <p className="text-sm text-gray-600 mt-1">{course.document.content}</p>
              </div>
            )}

            {course.videos && course.videos.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-700">Videos ({course.videos.length})</h5>
                <ul className="mt-2 space-y-2">
                  {course.videos.map((video) => (
                    <li key={video.id} className="border rounded p-2">
                      <h6 className="font-medium text-sm">{video.title}</h6>
                      <p className="text-xs text-gray-600">{video.description}</p>
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-xs">
                        {video.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
