export class LoginDto {
    readonly email: string;
    readonly password: string;
    readonly rememberMe?: boolean;
}