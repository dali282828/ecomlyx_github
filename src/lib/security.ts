import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { logger } from './logger';

class SecurityService {
  private csrfTokens: Map<string, { token: string; expires: number }> = new Map();

  // Generate CSRF token
  generateCSRFToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30 minutes

    this.csrfTokens.set(sessionId, { token, expires });

    // Cleanup expired tokens periodically
    this.cleanupExpiredTokens();

    return token;
  }

  // Validate CSRF token
  validateCSRFToken(sessionId: string, token: string): boolean {
    const storedData = this.csrfTokens.get(sessionId);
    
    if (!storedData || storedData.expires < Date.now()) {
      this.csrfTokens.delete(sessionId);
      return false;
    }

    return storedData.token === token;
  }

  // Validate request origin
  validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const allowedOrigins = [
      process.env.APP_URL,
      process.env.CORS_ORIGIN,
      'http://localhost:3000', // Dev mode
      'https://localhost:3000', // Dev mode with SSL
    ].filter(Boolean);

    if (!origin && !referer) {
      // Allow requests without origin/referer for API calls
      return true;
    }

    const requestOrigin = origin || (referer ? new URL(referer).origin : null);
    
    if (!requestOrigin) {
      return false;
    }

    return allowedOrigins.includes(requestOrigin);
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // SQL injection detection
  detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /('|\"|;|--|\||\/\*|\*\/)/,
      /(\bEXEC\s*\()/i,
      /(\bSCRIPT\b)/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // XSS detection
  detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<[^>]*\s+on\w+\s*=/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting by IP
  private rateLimits: Map<string, { requests: number[]; lastReset: number }> = new Map();

  isRateLimited(ip: string, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.rateLimits.has(ip)) {
      this.rateLimits.set(ip, { requests: [], lastReset: now });
    }

    const clientData = this.rateLimits.get(ip)!;
    
    // Remove old requests outside the window
    clientData.requests = clientData.requests.filter(time => time > windowStart);
    
    if (clientData.requests.length >= maxRequests) {
      return true;
    }

    clientData.requests.push(now);
    return false;
  }

  // Password strength validation
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (password.length >= 12) score += 1;
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password must contain numbers');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('Password must contain special characters');

    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Password should not contain repeated characters');

    return {
      isValid: score >= 4,
      score,
      feedback,
    };
  }

  // File upload security
  validateFileUpload(file: File): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx').split(',');

    // Size check
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Type check
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // MIME type check
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      errors.push('Invalid file MIME type');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.csrfTokens.entries()) {
      if (data.expires < now) {
        this.csrfTokens.delete(sessionId);
      }
    }
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-DNS-Prefetch-Control': 'on',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  }
}

export const securityService = new SecurityService(); 