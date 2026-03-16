/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by sanitizing user-generated content
 * NOTE: These functions should only be called client-side
 */

import DOMPurify from 'dompurify';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Client-side only - do not use server-side
 */
export function sanitizeHtml(content: string): string {
  if (!isBrowser) {
    // Server-side: strip all HTML
    return content.replace(/<[^>]*>/g, '');
  }
  
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href'],
  });
}

/**
 * Sanitize text content (strip all HTML)
 * Safe for both client and server
 */
export function sanitizeText(content: string): string {
  if (!isBrowser) {
    return content.replace(/<[^>]*>/g, '');
  }
  
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Escape special characters for safe display
 * Safe for both client and server
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
