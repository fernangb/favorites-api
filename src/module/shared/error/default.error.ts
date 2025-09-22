import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

interface ErrorProps {
  statusCode: number;
  message: string;
  error: string;
}

export class DefaultErrorResponse extends HttpException {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Some error happened',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  static getMessage({ message, statusCode, error }: ErrorProps) {
    throw new HttpException(
      {
        statusCode,
        error,
        message,
      },
      statusCode,
      {
        cause: message,
      },
    );
  }
}
