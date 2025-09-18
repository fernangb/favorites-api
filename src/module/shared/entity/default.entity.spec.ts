import { DefaultEntity } from './default.entity';

describe('Default Entity', () => {
  it('should create a default entity if not exists', () => {
    const createdAt = undefined;
    const updatedAt = undefined;
    const id = undefined;

    const entity = new DefaultEntity({ id, createdAt, updatedAt });

    expect(entity.id).toBeDefined();
    expect(entity.createdAt).toBeDefined();
    expect(entity.updatedAt).toEqual(entity.createdAt);
  });

  it('should create a default entity if exists', () => {
    const createdAt = new Date('2023-01-01');
    const updatedAt = new Date('2023-02-02');
    const id = '845906fe-44f5-4575-ab8d-1f579d0544be';

    const entity = new DefaultEntity({ id, createdAt, updatedAt });

    expect(entity).toEqual({
      id,
      createdAt,
      updatedAt,
    });
  });
});
