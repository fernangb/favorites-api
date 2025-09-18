import { ApiProperty } from '@nestjs/swagger';

interface ErrorProps {
  statusCode: number;
  message: string;
}

export class DefaultErrorResponse {
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

  constructor(props: ErrorProps) {
    this.statusCode = props.statusCode;
    this.message = props.message;
  }
}
