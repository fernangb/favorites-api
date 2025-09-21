import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { FindProductByIdResponse } from '../../../application/dto/find-product-by-id.dto';
import { ChallengeAPIService } from './challenge.api.service';

describe('ChallengeAPIService', () => {
  let service: ChallengeAPIService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeAPIService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChallengeAPIService>(ChallengeAPIService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    it('should call the API and return product data', async () => {
      const mockResponse: FindProductByIdResponse = {
        id: '123',
        title: 'Product 123',
        price: 100,
        brand: 'Fake brand',
        image: 'Fake image',
      };

      (httpService.get as jest.Mock).mockReturnValue(
        of({ data: mockResponse }),
      );

      const result = await service.findOneById('123');

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.CHALLENGE_API}/product/123`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('find', () => {
    it('should call the API and return a list of products', async () => {
      const mockResponse: FindProductByIdResponse[] = [
        {
          id: '1',
          title: 'Product 1',
          price: 50,
          brand: 'Fake brand',
          image: 'Fake image',
        },
        {
          id: '2',
          title: 'Product 2',
          price: 150,
          brand: 'Fake brand',
          image: 'Fake image',
        },
      ];

      (httpService.get as jest.Mock).mockReturnValue(
        of({ data: mockResponse }),
      );

      const result = await service.find(2);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.CHALLENGE_API}/product/page=2`,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use page 1 by default if not provided', async () => {
      const mockResponse: FindProductByIdResponse[] = [
        {
          id: '1',
          title: 'Product 1',
          price: 50,
          brand: 'Fake brand',
          image: 'Fake image',
        },
      ];

      (httpService.get as jest.Mock).mockReturnValue(
        of({ data: mockResponse }),
      );

      const result = await service.find();

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.CHALLENGE_API}/product/page=1`,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
