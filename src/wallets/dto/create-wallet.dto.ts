export class CreateWalletDto {
  readonly userId: string;
  readonly balance?: number = 0;
}
