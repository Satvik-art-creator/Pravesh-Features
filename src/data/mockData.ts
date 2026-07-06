import type { ClassSummary, MarkRecord, StoredFile, Student } from '../types'

export const classSummaries: ClassSummary[] = [
  {
    code: 'CSE-A',
    title: 'Data Structures',
    semester: 'Semester 3',
    students: 64,
    present: 58,
    submissions: 41,
  },
  {
    code: 'CSE-B',
    title: 'Database Systems',
    semester: 'Semester 3',
    students: 61,
    present: 54,
    submissions: 38,
  },
  {
    code: 'AIML',
    title: 'Machine Learning Basics',
    semester: 'Semester 5',
    students: 48,
    present: 44,
    submissions: 33,
  },
]

export const students: Student[] = [
  {
    id: 'BT23CSE041',
    name: 'Aarav Sharma',
    className: 'CSE-A',
    status: 'Verified',
    attendance: '91%',
    lastLogin: '09:12 AM',
  },
  {
    id: 'BT23CSE057',
    name: 'Nisha Verma',
    className: 'CSE-A',
    status: 'Verified',
    attendance: '88%',
    lastLogin: '09:18 AM',
  },
  {
    id: 'BT23CSE069',
    name: 'Kabir Khan',
    className: 'CSE-B',
    status: 'Pending review',
    attendance: '76%',
    lastLogin: 'Yesterday',
  },
  {
    id: 'BT22AIML018',
    name: 'Meera Iyer',
    className: 'AIML',
    status: 'Verified',
    attendance: '94%',
    lastLogin: '08:58 AM',
  },
]

export const storedFiles: StoredFile[] = [
  { name: 'Unit 1 Notes.pdf', type: 'Notes', size: '2.4 MB', className: 'CSE-A' },
  { name: 'DBMS Lab Manual.docx', type: 'Lab', size: '840 KB', className: 'CSE-B' },
  {
    name: 'ML Assignment 02',
    type: 'Assignment upload',
    size: 'Open',
    className: 'AIML',
  },
]

export const markRecords: MarkRecord[] = [
  { id: 'BT23CSE041', name: 'Aarav Sharma', mid: 27, assignment: 18, final: 42 },
  { id: 'BT23CSE057', name: 'Nisha Verma', mid: 25, assignment: 19, final: 44 },
  { id: 'BT23CSE069', name: 'Kabir Khan', mid: 20, assignment: 15, final: 36 },
  { id: 'BT22AIML018', name: 'Meera Iyer', mid: 29, assignment: 20, final: 46 },
]
