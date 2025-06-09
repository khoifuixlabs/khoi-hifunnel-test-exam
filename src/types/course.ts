import * as yup from 'yup';

// User interface for registered course users
export interface RegisteredUser {
  id: string;
  email: string;
  role: string;
  registeredAt: string;
  status: 'active' | 'blocked';
}

// Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  createdBy: string; // User ID of the creator
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
  registeredUsers?: RegisteredUser[];
}

// Video schema for validation
export const videoSchema = yup.object({
  id: yup.string().required('Video ID is required'),
  title: yup.string().required('Video title is required'),
  url: yup.string().url('Must be a valid URL').required('Video URL is required'),
  description: yup.string().required('Video description is required'),
});

// Document schema for validation
export const documentSchema = yup.object({
  type: yup.string().oneOf(['text', 'pdf', 'html'], 'Document type must be text, pdf, or html').required('Document type is required'),
  content: yup.string().required('Document content is required'),
});

// Course creation schema (without ID)
export const createCourseSchema = yup.object({
  title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  videoIntroUrl: yup.string().url('Must be a valid URL').optional(),
  document: documentSchema.optional(),
  videos: yup.array().of(videoSchema).optional().default([]),
});

// Course update schema (without ID)
export const updateCourseSchema = yup.object({
  title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  videoIntroUrl: yup.string().url('Must be a valid URL').optional(),
  document: documentSchema.optional(),
  videos: yup.array().of(videoSchema).optional().default([]),
});
