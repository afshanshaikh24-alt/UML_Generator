import { JAVA_KEYWORDS } from './helpers';

export interface ValidationError {
  field: string;
  message: string;
}

export function isValidJavaIdentifier(name: string): boolean {
  if (!name || name.trim() === '') return false;
  if (JAVA_KEYWORDS.has(name)) return false;
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

export function isValidClassName(name: string): boolean {
  if (!isValidJavaIdentifier(name)) return false;
  return /^[A-Z]/.test(name);
}

export function validateClassName(name: string, existingNames: string[], currentId?: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Class name is required.' });
    return errors;
  }
  if (!isValidJavaIdentifier(name)) {
    if (JAVA_KEYWORDS.has(name)) {
      errors.push({ field: 'name', message: `"${name}" is a reserved Java keyword.` });
    } else {
      errors.push({ field: 'name', message: 'Class name must be a valid Java identifier (start with letter, no spaces).' });
    }
  }
  if (!/^[A-Z]/.test(name)) {
    errors.push({ field: 'name', message: 'Class name should start with an uppercase letter.' });
  }
  const duplicates = existingNames.filter((n, i) => {
    // We exclude checking against currentId's own name
    return n === name;
  });
  if (duplicates.length > (currentId ? 1 : 0)) {
    errors.push({ field: 'name', message: `A class named "${name}" already exists.` });
  }
  return errors;
}

export function validateAttributeName(name: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Attribute name is required.' });
    return errors;
  }
  if (!isValidJavaIdentifier(name)) {
    if (JAVA_KEYWORDS.has(name)) {
      errors.push({ field: 'name', message: `"${name}" is a reserved Java keyword.` });
    } else {
      errors.push({ field: 'name', message: 'Attribute name must be a valid Java identifier.' });
    }
  }
  return errors;
}

export function validateMethodName(name: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Method name is required.' });
    return errors;
  }
  if (!isValidJavaIdentifier(name)) {
    if (JAVA_KEYWORDS.has(name)) {
      errors.push({ field: 'name', message: `"${name}" is a reserved Java keyword.` });
    } else {
      errors.push({ field: 'name', message: 'Method name must be a valid Java identifier.' });
    }
  }
  return errors;
}

export function validateDiagramJson(json: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof json !== 'object' || json === null) {
    return { valid: false, errors: ['JSON must be an object.'] };
  }
  const obj = json as Record<string, unknown>;
  if (typeof obj.name !== 'string') errors.push('Missing or invalid "name" field.');
  if (!Array.isArray(obj.classes)) errors.push('Missing or invalid "classes" array.');
  if (!Array.isArray(obj.relationships)) errors.push('Missing or invalid "relationships" array.');
  return { valid: errors.length === 0, errors };
}
