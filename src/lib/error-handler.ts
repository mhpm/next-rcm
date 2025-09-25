import { logger } from './logger';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
  requestId?: string;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Clase personalizada para errores de la aplicación
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Mantener el stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos de la aplicación
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

// Función para manejar errores de manera consistente
export function handleError(error: unknown, context?: Record<string, unknown>): ErrorResponse {
  const timestamp = new Date().toISOString();
  const showDetailedErrors = process.env.SHOW_DETAILED_ERRORS === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log del error
  logger.error('Error handled by error handler', error as Error, context);

  // Si es un error de aplicación conocido
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: (isDevelopment || showDetailedErrors) ? error.details : undefined,
      },
      timestamp,
    };
  }

  // Si es un error estándar de JavaScript
  if (error instanceof Error) {
    // En desarrollo o si se configuró para mostrar errores detallados
    if (isDevelopment || showDetailedErrors) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'INTERNAL_ERROR',
          details: {
            stack: error.stack,
            name: error.name,
          },
        },
        timestamp,
      };
    }

    // En producción, mensaje genérico pero log detallado
    return {
      success: false,
      error: {
        message: 'Ha ocurrido un error interno. Por favor, intenta de nuevo más tarde.',
        code: 'INTERNAL_ERROR',
      },
      timestamp,
    };
  }

  // Error desconocido
  logger.error('Unknown error type', new Error('Unknown error'), {
    errorValue: error,
    errorType: typeof error,
    ...context,
  });

  return {
    success: false,
    error: {
      message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.',
      code: 'UNKNOWN_ERROR',
    },
    timestamp,
  };
}

// Función para crear respuestas de éxito consistentes
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

// Wrapper para funciones async que maneja errores automáticamente
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Re-lanzar el error para que sea manejado por el caller
      // pero asegurándonos de que esté loggeado
      logger.error('Error in wrapped function', error as Error, {
        functionName: fn.name,
        arguments: args,
      });
      throw error;
    }
  };
}

// Función para convertir errores de Prisma a errores de aplicación
export function handlePrismaError(error: unknown): AppError {
  // Importar Prisma dinámicamente para evitar problemas de dependencias
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Prisma } = require('@prisma/client');

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as typeof Prisma.PrismaClientKnownRequestError.prototype;
    switch (prismaError.code) {
      case 'P2002':
        const target = prismaError.meta?.target as string[];
        if (target?.includes('email')) {
          return new ConflictError('Ya existe un registro con este email');
        }
        return new ConflictError('Ya existe un registro con estos datos');
      
      case 'P2003':
        return new ValidationError('Error de referencia: El registro relacionado no existe');
      
      case 'P2025':
        return new NotFoundError('El registro solicitado no fue encontrado');
      
      default:
        return new DatabaseError(`Error de base de datos: ${prismaError.message}`);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Los datos proporcionados no son válidos');
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError('Error de conexión con la base de datos');
  }

  // Si no es un error de Prisma conocido, devolver error genérico
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  return new AppError(errorMessage, 500);
}