
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js';
import { config } from 'dotenv';

// Load environment variables at the start.
config();

// This function now safely retrieves the secret key on the server.
const getSecretKey = () => {
  const secret = process.env.ENCRYPTION_SECRET_KEY;
  if (!secret) {
    console.warn('Warning: ENCRYPTION_SECRET_KEY is not set. Using a default key. THIS IS NOT SECURE FOR PRODUCTION.');
    return 'default-secret-key-that-is-long-enough-and-should-be-replaced';
  }
  return secret;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptId(id: string): string {
  const secretKey = getSecretKey();
  const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  // URL-safe encoding
  return encodeURIComponent(encrypted);
}

export function decryptId(encryptedId: string): string {
    const secretKey = getSecretKey();
    try {
        // URL-safe decoding
        const decodedId = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decodedId, secretKey);
        const originalId = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalId) {
           throw new Error("Decryption failed to produce a valid string.");
        }
        return originalId;
    } catch (error) {
        console.error("Decryption failed for ID:", encryptedId, error);
        // Returning a value that is unlikely to exist in the DB
        return 'invalid_id'; 
    }
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
export function sanitizeAndFormatData(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  const sanitizedData: { [key: string]: any } = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];

      if (value instanceof Date) {
        sanitizedData[key] = formatMySqlDateTime(value);
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
