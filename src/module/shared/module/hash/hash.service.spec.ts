import { hash, compare } from 'bcryptjs';
import HashService from './hash.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('HashService', () => {
  let service: HashService;

  beforeEach(() => {
    service = new HashService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a hash from password', async () => {
      (hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.create('password');

      expect(hash).toHaveBeenCalledWith('password', 8);
      expect(result).toBe('hashed-password');
    });
  });

  describe('compare', () => {
    it('should return true when passwords match', async () => {
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.compare('password', 'hashed-password');

      expect(compare).toHaveBeenCalledWith('password', 'hashed-password');
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.compare('password', 'wrong-hash');

      expect(compare).toHaveBeenCalledWith('password', 'wrong-hash');
      expect(result).toBe(false);
    });
  });
});
