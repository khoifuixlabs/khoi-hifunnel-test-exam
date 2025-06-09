import { Course } from '@/types/course';
import fs from 'fs';
import path from 'path';

export async function getCourses(): Promise<Course[]> {
  try {
    const coursesPath = path.join(process.cwd(), 'src', 'data', 'courses.json');
    const coursesData = fs.readFileSync(coursesPath, 'utf8');
    const courses: Course[] = JSON.parse(coursesData);
    return courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
}

export async function getCourse(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((course) => course.id === id) || null;
}
