type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  private showDetailedErrors = process.env.SHOW_DETAILED_ERRORS === 'true';
  private enableVerboseLogging = process.env.ENABLE_VERBOSE_LOGGING === 'true';
  private enableErrorMonitoring = process.env.ENABLE_ERROR_MONITORING === 'true';
  private logLevel = process.env.LOG_LEVEL || 'info';

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (this.enableVerboseLogging && context && Object.keys(context).length > 0) {
      logMessage += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      logMessage += `\nError: ${error.message}`;
      if ((this.isDevelopment || this.showDetailedErrors) && error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  info(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, context);
      console.log(this.formatMessage(entry));
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, context);
      console.warn(this.formatMessage(entry));
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, context, error);
      console.error(this.formatMessage(entry));
      
      // En producción o si está habilitado el monitoreo, enviar a servicio de monitoreo
      if (this.isProduction || this.enableErrorMonitoring) {
        this.sendToMonitoringService(entry);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, context);
      console.debug(this.formatMessage(entry));
    }
  }

  // Método para enviar errores a servicios de monitoreo en producción
  private sendToMonitoringService(entry: LogEntry) {
    // Implementar integración con servicios como Sentry, LogRocket, etc.
    // Por ahora, solo guardamos en console.error para que aparezca en los logs de Vercel
    console.error('PRODUCTION_ERROR:', JSON.stringify(entry, null, 2));
  }

  // Método específico para errores de base de datos
  databaseError(operation: string, error: Error, context?: Record<string, unknown>) {
    this.error(`Database operation failed: ${operation}`, error, {
      ...context,
      operation,
      errorType: 'database',
    });
  }

  // Método específico para errores de validación
  validationError(field: string, value: unknown, error: Error, context?: Record<string, unknown>) {
    this.error(`Validation failed for field: ${field}`, error, {
      ...context,
      field,
      value,
      errorType: 'validation',
    });
  }

  // Método específico para errores de autenticación
  authError(message: string, error?: Error, context?: Record<string, unknown>) {
    this.error(`Authentication error: ${message}`, error, {
      ...context,
      errorType: 'authentication',
    });
  }
}

// Exportar una instancia singleton
export const logger = new Logger();

// Exportar tipos para uso en otros archivos
export type { LogLevel, LogEntry };