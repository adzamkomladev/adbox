import { Test, TestingModule } from '@nestjs/testing';
import { JunipayService } from './junipay.service';

describe('JunipayService', () => {
  let service: JunipayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JunipayService],
    }).compile();

    service = module.get<JunipayService>(JunipayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
