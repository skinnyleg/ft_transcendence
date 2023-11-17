import { Socket } from 'socket.io';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';


export async function validateAndSendError(payload: Record<string, any>, dtoClass: any) {
  const friendRequestDto : any = plainToClass(dtoClass, payload as Object );
  const errors = await validate(friendRequestDto as Object);

  if (errors.length > 0) {
    const errorMessage = Object.values(errors[0].constraints).join(', ');
    // this.friendsService.sendWebSocketError(client, errorMessage, false);
    return {valid: true, error: errorMessage};
  }

  return {valid: false, input: friendRequestDto};
}
