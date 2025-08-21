import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from 'dotenv';
import CryptoJS from 'crypto-js';

// Ensure env vars are loaded
config();

// It's better to read the env var once and store it.
// This function should only be called in server-side code.
const getSecretKey = () => {
  const key = process.env.ENCRYPTION_SECRET_KEY;
  if (!key) {
    console.error("ENCRYPTION_SECRET_KEY is not set in the environment variables.");
    // Provide a default key for development to prevent crashes, but log a warning.
    if (process.env.NODE_ENV === 'development') {
        console.warn("Using a default, insecure encryption key for development.");
        return 'default-dev-secret-key-123456';
    }
    throw new Error("ENCRYPTION_SECRET_KEY is not defined.");
  }
  return key;
};


export function encryptId(id: string): string {
    const SECRET_KEY = getSecretKey();
    const encrypted = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
    // Use a URL-safe version of Base64 encoding
    return CryptoJS.enc.Base64.parse(CryptoJS.enc.Utf8.parse(encrypted)).toString(CryptoJS.enc.UrlSafe);
}

export function decryptId(encryptedId: string): string {
  try {
    const SECRET_KEY = getSecretKey();
    // Decode the URL-safe Base64 string first
    const decodedFromUrlSafe = CryptoJS.enc.Base64.parse(encryptedId, CryptoJS.enc.UrlSafe).toString(CryptoJS.enc.Utf8);
    const bytes = CryptoJS.AES.decrypt(decodedFromUrlSafe, SECRET_KEY);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    // If the decrypted string is empty, it means decryption failed
    if (!originalId) {
        return 'invalid_id';
    }
    return originalId;
  } catch (error) {
    console.error("Decryption failed:", error);
    return 'invalid_id';
  }
}


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

function formatMySqlDate(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }
    const pad = (num: number) => num.toString().padStart(2, '0');
    // Use UTC methods to prevent timezone shifts
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
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
export function sanitizeAndFormatData(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  const sanitizedData: { [key: string]: any } = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];

      if (value instanceof Date) {
        sanitizedData[key] = formatMySqlDate(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // This handles objects like 'documents', 'siswa_fotoProfil', etc.
        sanitizedData[key] = JSON.stringify(value);
      } else if (Array.isArray(value)) {
        // This handles arrays like 'pegawai_skPengangkatan'
        sanitizedData[key] = JSON.stringify(value);
      } else if (typeof value === 'string') {
        sanitizedData[key] = value === '' ? null : escapeHtml(value);
      } else if (value === undefined) {
        sanitizedData[key] = null;
      } else {
        sanitizedData[key] = value;
      }
    }
  }

  return sanitizedData;
}
