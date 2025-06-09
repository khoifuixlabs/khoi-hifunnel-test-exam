'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Course } from '@/types/course';
import FormInput from '@/components/FormInput';

type CourseFormData = Omit<Course, 'id'>;

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
  editingCourse: Course | null;
}

export default function CourseModal({ isOpen, onClose, onSubmit, editingCourse }: CourseModalProps) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CourseFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      videoIntroUrl: '',
      document: {
        type: 'text',
        content: '',
      },
      videos: [],
    },
  });

  useEffect(() => {
    if (editingCourse) {
      setValue('title', editingCourse.title);
      setValue('description', editingCourse.description);
      setValue('videoIntroUrl', editingCourse.videoIntroUrl || '');
      setValue('document', editingCourse.document || { type: 'text', content: '' });
      setValue('videos', editingCourse.videos || []);
    } else {
      reset();
    }
  }, [editingCourse, setValue, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>

          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
            <FormInput
              id="title"
              type="text"
              label="Course Title"
              showLabel={true}
              placeholder="Enter course title"
              register={register('title')}
              error={errors.title?.message}
            />

            <FormInput
              id="description"
              type="textarea"
              label="Description"
              showLabel={true}
              placeholder="Enter course description"
              register={register('description')}
              error={errors.description?.message as string}
              rows={3}
            />

            <FormInput
              id="videoIntroUrl"
              type="text"
              label="Video Intro URL (Optional)"
              showLabel={true}
              placeholder="https://youtube.com/..."
              register={register('videoIntroUrl')}
              error={errors.videoIntroUrl?.message}
            />

            <FormInput
              id="documentType"
              type="select"
              label="Document Type"
              showLabel={true}
              register={register('document.type')}
              options={[
                { value: 'text', label: 'Text' },
                { value: 'pdf', label: 'PDF' },
                { value: 'html', label: 'HTML' },
              ]}
              error={errors.document?.type ? (errors.document.type as { message?: string }).message : undefined}
            />

            <FormInput
              id="documentContent"
              type="textarea"
              label="Document Content"
              showLabel={true}
              placeholder="Enter document content"
              register={register('document.content')}
              error={errors.document?.content?.message as string}
              rows={4}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
