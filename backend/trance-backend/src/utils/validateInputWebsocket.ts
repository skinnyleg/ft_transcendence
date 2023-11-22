import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';


export async function validateAndSendError(payload: Record<string, any>, dtoClass: any) {
  const Dto : any = plainToClass(dtoClass, payload as Object );
  const errors = await validate(Dto as Object);

  if (errors.length > 0) {
    const errorMessage = Object.values(errors[0].constraints).join(', ');
    return {valid: true, error: errorMessage};
  }

  return {valid: false, input: Dto};
}
