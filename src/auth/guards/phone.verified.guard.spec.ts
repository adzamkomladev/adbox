import { PhoneVerifiedGuard } from './phone.verified.guard';

describe('PhoneVerifiedGuard', () => {
  it('should be defined', () => {
    expect(new PhoneVerifiedGuard()).toBeDefined();
  });
});
