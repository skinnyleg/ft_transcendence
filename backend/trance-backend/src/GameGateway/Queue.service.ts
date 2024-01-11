import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class makeQueue {
    private queue: Socket[] = [];

    enQueue(client : Socket){
      console.log("playerd  has enter queue ",  client.id)
      if (this.queue.indexOf(client)){
        this.queue.push(client);
        client.emit("InQueue", true);
        return true;
      }
      else{
        client.emit("error", "You're already In Queue");
        return false;
      }
    }
    
    dequeue(): Socket | undefined {
      return this.queue.shift();
    }
    deleteUserQueue(client : Socket){
      const index = this.queue.indexOf(client);
      console.log("iiiindeee", index);
      this.queue.splice(index, 1);
      console.log("wdfewfewfewqfeW", this.queue);
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