import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

import { JoiRequestValidationError } from '@global/helpers/error-handler';

type IJoiDecorator<T> = (target: T, key: string, descriptor: PropertyDescriptor) => void;

export function JoiValidation<T>(validationSchema: ObjectSchema): IJoiDecorator<T> {
  return (_target: T, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [Request, Response, NextFunction]) {
      const req: Request = args[0];
      const next: NextFunction = args[2];

      const { error } = await Promise.resolve(validationSchema.validate(req.body));

      if (error?.details) {
        return next(new JoiRequestValidationError(error.details[0].message));
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
