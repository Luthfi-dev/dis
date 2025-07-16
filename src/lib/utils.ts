
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A simple deep merge function.
 * It's not as robust as lodash.merge, but it's enough for our use case and has no dependencies.
 */
export function mergeDeep(target: any, source: any): any {
  const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  for (const key in source) {
    if (isObject(source[key])) {
      if (!(key in output)) {
        Object.assign(output, { [key]: source[key] });
      } else {
        output[key] = mergeDeep(output[key], source[key]);
      }
    } else {
      Object.assign(output, { [key]: source[key] });
    }
  }

  return output;
}

/**
 * Sanitizes a string by replacing HTML special characters with their entities.
 * @param str The string to sanitize.
 * @returns The sanitized string.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Recursively sanitizes all string properties of an object.
 * @param data The object or value to sanitize.
 * @returns The sanitized object or value.
 */
export function sanitizeData<T>(data: T): T {
  if (typeof data === 'string') {
    return escapeHtml(data) as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)) as T;
  }

  if (data && typeof data === 'object') {
    const sanitizedObj: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeData((data as any)[key]);
      }
    }
    return sanitizedObj as T;
  }
  
  return data;
}
