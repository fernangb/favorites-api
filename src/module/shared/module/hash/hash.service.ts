import { hash, compare } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class HashService {
  create(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
