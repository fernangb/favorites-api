import { DefaultErrorResponse } from './default.error';

describe('DefaultErrorResponse', () => {
  it('should create a default error response', () => {
    const errorProps = { statusCode: 400, message: 'Some error happened' };
    const error = new DefaultErrorResponse(errorProps);

    expect(error).toBeInstanceOf(DefaultErrorResponse);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Some error happened');
  });
});
