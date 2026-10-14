import { DiagramModel } from '../models';
import { generateId } from './helpers';

export function createLibraryManagementExample(): DiagramModel {
  const userId = generateId();
  const bookId = generateId();
  const authorId = generateId();
  const libraryId = generateId();
  const loanId = generateId();

  return {
    id: generateId(),
    name: 'Library Management System',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    classes: [
      {
        id: userId,
        name: 'User',
        packageName: 'com.library.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 50, y: 50 },
        attributes: [
          { id: generateId(), name: 'userId', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'name', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'email', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'membershipDate', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
        ],
        methods: [
          { id: generateId(), name: 'getUserId', returnType: 'int', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getName', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'borrowBook', returnType: 'boolean', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'book', type: 'Book' }] },
        ],
      },
      {
        id: bookId,
        name: 'Book',
        packageName: 'com.library.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 350, y: 50 },
        attributes: [
          { id: generateId(), name: 'isbn', type: 'String', visibility: 'private', isStatic: false, isFinal: true, defaultValue: '' },
          { id: generateId(), name: 'title', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'isAvailable', type: 'boolean', visibility: 'private', isStatic: false, isFinal: false, defaultValue: 'true' },
          { id: generateId(), name: 'totalCopies', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '1' },
        ],
        methods: [
          { id: generateId(), name: 'getIsbn', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getTitle', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'isAvailable', returnType: 'boolean', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
        ],
      },
      {
        id: authorId,
        name: 'Author',
        packageName: 'com.library.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 650, y: 50 },
        attributes: [
          { id: generateId(), name: 'authorId', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'firstName', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'lastName', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'nationality', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
        ],
        methods: [
          { id: generateId(), name: 'getFullName', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getAuthorId', returnType: 'int', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
        ],
      },
      {
        id: libraryId,
        name: 'Library',
        packageName: 'com.library.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 200, y: 320 },
        attributes: [
          { id: generateId(), name: 'libraryId', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'name', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'address', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'totalBooks', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '0' },
        ],
        methods: [
          { id: generateId(), name: 'addBook', returnType: 'void', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'book', type: 'Book' }] },
          { id: generateId(), name: 'removeBook', returnType: 'boolean', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'isbn', type: 'String' }] },
          { id: generateId(), name: 'searchBook', returnType: 'Book', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'title', type: 'String' }] },
        ],
      },
      {
        id: loanId,
        name: 'Loan',
        packageName: 'com.library.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 500, y: 320 },
        attributes: [
          { id: generateId(), name: 'loanId', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'loanDate', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'dueDate', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'returnDate', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'isReturned', type: 'boolean', visibility: 'private', isStatic: false, isFinal: false, defaultValue: 'false' },
        ],
        methods: [
          { id: generateId(), name: 'getLoanId', returnType: 'int', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'returnBook', returnType: 'void', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'calculateFine', returnType: 'double', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
        ],
      },
    ],
    relationships: [
      { id: generateId(), sourceId: userId, targetId: loanId, type: 'association', label: 'places', sourceMultiplicity: '1', targetMultiplicity: '*' },
      { id: generateId(), sourceId: bookId, targetId: loanId, type: 'association', label: 'associated', sourceMultiplicity: '1', targetMultiplicity: '*' },
      { id: generateId(), sourceId: authorId, targetId: bookId, type: 'directed-association', label: 'writes', sourceMultiplicity: '1', targetMultiplicity: '*' },
      { id: generateId(), sourceId: libraryId, targetId: bookId, type: 'composition', label: 'contains', sourceMultiplicity: '1', targetMultiplicity: '*' },
    ],
  };
}

export function createStudentManagementExample(): DiagramModel {
  const personId = generateId();
  const studentId = generateId();
  const teacherId = generateId();
  const courseId = generateId();

  return {
    id: generateId(),
    name: 'Student Management System',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    classes: [
      {
        id: personId,
        name: 'Person',
        packageName: 'com.school.model',
        isAbstract: true,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 300, y: 40 },
        attributes: [
          { id: generateId(), name: 'id', type: 'int', visibility: 'protected', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'name', type: 'String', visibility: 'protected', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'email', type: 'String', visibility: 'protected', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'phone', type: 'String', visibility: 'protected', isStatic: false, isFinal: false, defaultValue: '' },
        ],
        methods: [
          { id: generateId(), name: 'getId', returnType: 'int', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getName', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getDetails', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: true, isFinal: false, parameters: [] },
        ],
      },
      {
        id: studentId,
        name: 'Student',
        packageName: 'com.school.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: 'Person',
        implementsInterfaces: [],
        position: { x: 80, y: 300 },
        attributes: [
          { id: generateId(), name: 'rollNo', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'gpa', type: 'double', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '0.0' },
          { id: generateId(), name: 'year', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '1' },
        ],
        methods: [
          { id: generateId(), name: 'getRollNo', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getGpa', returnType: 'double', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getDetails', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'enrollCourse', returnType: 'boolean', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'course', type: 'Course' }] },
        ],
      },
      {
        id: teacherId,
        name: 'Teacher',
        packageName: 'com.school.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: 'Person',
        implementsInterfaces: [],
        position: { x: 520, y: 300 },
        attributes: [
          { id: generateId(), name: 'employeeId', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'department', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'salary', type: 'double', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '0.0' },
        ],
        methods: [
          { id: generateId(), name: 'getEmployeeId', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getDepartment', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getDetails', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'teachCourse', returnType: 'void', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [{ id: generateId(), name: 'course', type: 'Course' }] },
        ],
      },
      {
        id: courseId,
        name: 'Course',
        packageName: 'com.school.model',
        isAbstract: false,
        isFinal: false,
        isInterface: false,
        extendsClass: '',
        implementsInterfaces: [],
        position: { x: 300, y: 560 },
        attributes: [
          { id: generateId(), name: 'courseId', type: 'String', visibility: 'private', isStatic: false, isFinal: true, defaultValue: '' },
          { id: generateId(), name: 'courseName', type: 'String', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '' },
          { id: generateId(), name: 'credits', type: 'int', visibility: 'private', isStatic: false, isFinal: false, defaultValue: '3' },
          { id: generateId(), name: 'maxStudents', type: 'int', visibility: 'private', isStatic: true, isFinal: true, defaultValue: '50' },
        ],
        methods: [
          { id: generateId(), name: 'getCourseId', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getCourseName', returnType: 'String', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
          { id: generateId(), name: 'getCredits', returnType: 'int', visibility: 'public', isStatic: false, isAbstract: false, isFinal: false, parameters: [] },
        ],
      },
    ],
    relationships: [
      { id: generateId(), sourceId: studentId, targetId: personId, type: 'inheritance', label: '', sourceMultiplicity: '', targetMultiplicity: '' },
      { id: generateId(), sourceId: teacherId, targetId: personId, type: 'inheritance', label: '', sourceMultiplicity: '', targetMultiplicity: '' },
      { id: generateId(), sourceId: studentId, targetId: courseId, type: 'association', label: 'enrolls', sourceMultiplicity: '*', targetMultiplicity: '*' },
      { id: generateId(), sourceId: teacherId, targetId: courseId, type: 'directed-association', label: 'teaches', sourceMultiplicity: '1', targetMultiplicity: '*' },
    ],
  };
}
