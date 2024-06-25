import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
    validate(date: Date) {
        return Date.now() < date.getTime();
    }

    defaultMessage(args: ValidationArguments) {
        return `Date ${args.property} can not before now.`;
    }
}

export function IsAfterNow(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsAfterNowConstraint,
        });
    };
}