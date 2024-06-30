import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
@Injectable()
export class IsAfterStartConstraint implements ValidatorConstraintInterface {
    validate(date: Date, args: ValidationArguments) {
        const start = args.object?.['start'];

        if (!start) return false;

        return (new Date(start))?.getTime() < (new Date(date))?.getTime();
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} date cannot be before start date.`;
    }
}

export function IsAfterStart(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsAfterStartConstraint,
        });
    };
}