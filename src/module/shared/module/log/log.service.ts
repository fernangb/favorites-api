import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LogService implements LoggerService {
  private traceId = '';
  private context?: string;
  private readonly logger = new Logger(LogService.name, { timestamp: true });

  constructor() {
    this.traceId = uuid();
    this.logger = new Logger(this.context, { timestamp: true });
  }

  log(message: any, data?: any, traceId?: string) {
    this.logger.log(this.format(message, data), traceId || this.traceId);
  }

  error(message: any, data?: any, traceId?: string) {
    this.logger.error(this.format(message, data), traceId || this.traceId);
  }

  warn(message: any, data?: any, traceId?: string) {
    this.logger.warn(this.format(message, data), traceId || this.traceId);
  }

  debug(message: any, data?: any, traceId?: string) {
    this.logger.debug(this.format(message, data), traceId || this.traceId);
  }

  verbose(message: any, data?: any, traceId?: string) {
    this.logger.verbose(this.format(message, data), traceId || this.traceId);
  }

  private format(message: any, data?: any) {
    const timestamp = new Date().toISOString();
    const formattedData = data ? `: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${this.context}] ${message} ${formattedData}`;
  }

  setContext(context: string) {
    this.context = context;
  }
}
