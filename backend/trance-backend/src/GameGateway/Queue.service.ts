import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameUser } from "src/classes/classes";

@Injectable()
export class makeQueue {
    private queue: GameUser[] = [];

    enQueue(player : GameUser){
      if (this.queue.indexOf(player) === -1){
        this.queue.push(player);
        player.socket.emit("InQueue", true);
        return true;
      }
      else{
        player.socket.emit("error", "You're already In Queue");
        return false;
      }
    }
    
    dequeue(client): GameUser | undefined {
      const index = this.queue.indexOf(client)
      if (index >= 0){
        return this.queue.splice(index, 1)[0];
      }
      else if (client == null)
        return this.queue.shift();
    }
    deleteUserQueue(client : GameUser){
      const index = this.queue.indexOf(client);
      if (index > -1){
        this.queue.splice(index, 1);
      }
    }
    getQueue(): GameUser[] {
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