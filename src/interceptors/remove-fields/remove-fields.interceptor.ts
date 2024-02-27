import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveFieldsInterceptor<DataType extends object>
  implements NestInterceptor
{
  public constructor(private readonly fields: (keyof DataType)[]) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Omit<DataType, keyof DataType>> {
    return next.handle().pipe(
      map((data: DataType) => {
        // ! necessary `JSON.parse(JSON.stringify(...))`, because the `data` provided by Mongoose return fields as "getters" and "setters"
        const newObject = JSON.parse(JSON.stringify(data || {}));

        for (const field of this.fields) {
          delete newObject[field];
        }

        return newObject;
      }),
    );
  }
}
