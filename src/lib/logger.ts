import pino from 'pino';
import { NextRequest } from 'next/server';

// Create logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'hostname,pid',
      },
    },
  }),
});

// Request logger middleware
export function createRequestLogger(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  const requestLogger = logger.child({
    requestId,
    method: request.method,
    url
  });

  return requestLogger;
} 