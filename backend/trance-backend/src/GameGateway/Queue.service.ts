import { Injectable } from "@nestjs/common";
import { map } from "rxjs";
import { Socket } from "socket.io";

@Injectable()
export class makeQueue {
    private queue: Socket[] = [];

    enQueue(client : Socket){
        console.log("playerd  has enter queue ",  client.id)
        this.queue.push(client);
    }
    
    dequeue(): Socket | undefined {
        return this.queue.shift();
      }
    
    getQueue(): Socket[] {
      return this.queue;
    }
}

@Injectable()
export class room{
  private room = new Map();

  room_maker(challenger: Socket, opponent: Socket){
    this.room.set(challenger, opponent);
  }
  getRoom(challenger, opponent){
    return this.room.has(challenger);
  }

}