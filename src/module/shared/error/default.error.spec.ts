import { DefaultErrorResponse } from './default.error';
import { HttpException } from '@nestjs/common';

describe('DefaultErrorResponse', () => {
  it('should throw an HttpException', () => {
    const props = {
      statusCode: 400,
      message: 'Fake Error',
      error: 'Bad Request',
    };

    try {
      DefaultErrorResponse.getMessage(props);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);

      const response = err.getResponse();
      expect(response.statusCode).toBe(props.statusCode);
      expect(response.message).toBe(props.message);
      expect(response.error).toBe(props.error);
    }
  });
});
