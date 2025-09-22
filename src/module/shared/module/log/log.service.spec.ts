import { Logger } from '@nestjs/common';
import { LogService } from './log.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'trace-id'),
}));

describe('LogService', () => {
  let service: LogService;
  let mockLogger: jest.Mocked<Partial<Logger>>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(mockLogger.warn);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(mockLogger.debug);
    jest
      .spyOn(Logger.prototype, 'verbose')
      .mockImplementation(mockLogger.verbose);

    service = new LogService();
    service['logger'] = mockLogger as unknown as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get trace id', () => {
    expect(service['traceId']).toBe('trace-id');
  });

  it('should set context', () => {
    service.setContext('FakeModule');
    expect(service['context']).toBe('FakeModule');
  });

  it('should format log message', () => {
    service.setContext('FakeContext');
    service.log('Log message', { id: 1 });
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('[FakeContext] Log message : {"id":1}'),
      'trace-id',
    );
  });

  it('should format error message', () => {
    service.setContext('FakeContext');
    service.error('Error message', { code: 500 });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('[FakeContext] Error message : {"code":500}'),
      'trace-id',
    );
  });

  it('should format warn message', () => {
    service.setContext('FakeContext');
    service.warn('Warn message');
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('[FakeContext] Warn message'),
      'trace-id',
    );
  });

  it('should format debug message', () => {
    service.setContext('FakeContext');
    service.debug('Debug message');
    expect(mockLogger.debug).toHaveBeenCalledWith(
      expect.stringContaining('[FakeContext] Debug message'),
      'trace-id',
    );
  });

  it('should format verbose message', () => {
    service.setContext('FakeContext');
    service.verbose('Verbose message');
    expect(mockLogger.verbose).toHaveBeenCalledWith(
      expect.stringContaining('[FakeContext] Verbose message'),
      'trace-id',
    );
  });
});
