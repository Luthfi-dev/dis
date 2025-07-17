
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
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMySqlDateTime(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Recursively sanitizes and formats data for database insertion.
 * - Escapes HTML in strings.
 * - Converts empty strings to null.
 * - Stringifies objects/arrays.
 * - Formats Date objects for MySQL.
 * @param data The object or value to process.
 * @returns The processed object or value.
 */
export function sanitizeAndFormatData<T>(data: T): any {
  if (data instanceof Date) {
      return formatMySqlDateTime(data);
  }

  if (typeof data === 'string') {
    return data === '' ? null : escapeHtml(data);
  }

  if (Array.isArray(data)) {
    // Stringify arrays
    return JSON.stringify(data.map(item => sanitizeAndFormatData(item)));
  }

  if (data && typeof data === 'object') {
    const sanitizedObj: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = (data as any)[key];
          // Check for file-like object { fileName, fileURL } and stringify it.
          if (value && typeof value === 'object' && 'fileName' in value && 'fileURL' in value) {
              sanitizedObj[key] = JSON.stringify(value);
          } else {
              sanitizedObj[key] = sanitizeAndFormatData(value);
          }
      }
    }
    return sanitizedObj;
  }
  
  return data === undefined ? null : data;
}
