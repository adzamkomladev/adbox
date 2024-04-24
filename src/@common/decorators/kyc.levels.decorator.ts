import { Reflector } from '@nestjs/core';

import { KycLevel } from '../enums/kyc.level.enum';

export const KycLevels = Reflector.createDecorator<KycLevel[]>();