import fs from 'fs';
import path from 'path';
import { Course } from '@/types/course';

// Helper function to read courses from JSON file
export function readCoursesFile(): Course[] {
  const coursesFilePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
  try {
    const coursesFileContent = fs.readFileSync(coursesFilePath, 'utf8');
    return JSON.parse(coursesFileContent) || [];
  } catch (error) {
    console.error('Error reading courses file:', error);
    return [];
  }
}

// Helper function to write courses to JSON file
export function writeCoursesFile(courses: Course[]): boolean {
  const coursesFilePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
  try {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing courses file:', error);
    return false;
  }
}
