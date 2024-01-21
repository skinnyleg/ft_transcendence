import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';


export async function validateAndSendError(payload: Record<string, any>, dtoClass: any) {
  const Dto : any = plainToClass(dtoClass, payload as Object );
  const errors = await validate(Dto as Object);

  if (errors.length > 0) {
    // // console.log('error === ', errors);
    let errorMessage;
    if (errors[0].constraints !== undefined)
      errorMessage = Object.values(errors[0].constraints).join(', ');
    else
      errorMessage = 'Something Is Wrong With The Data Sent'
    return {valid: true, error: errorMessage};
  }

  return {valid: false, input: Dto};
}
