import { Test, TestingModule } from '@nestjs/testing';
import { ZeepayService } from './zeepay.service';

describe('ZeepayService', () => {
  let service: ZeepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZeepayService],
    }).compile();

    service = module.get<ZeepayService>(ZeepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
