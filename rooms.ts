export class RoomManager{
  rooms: Array<Room> ;
  constructor(){
    this.rooms = new Array<Room>()
  }
  public showRooms() : string {
    let outputMessage = "";
    if (this.rooms.length > 0) {
      this.rooms.reverse().forEach((lobby) => {
        outputMessage +=
          lobby.roomMakerName + "'s room code is " + lobby.roomCode + "\n";
      });
      return outputMessage;
    } else {
      return "No rooms available";
    }
  }
  public newRoom (roomMakerId: string, roomMakerName: string, roomCode: string) : string{
    this.rooms.push(new Room(roomCode, roomMakerId, roomMakerName));
    return roomMakerName + " has added the room: " + roomCode + " !";
  }
  public removeRoom(roomMakerId: string, roomMakerName: string, roomCode?: string):string{
    if(typeof roomCode==='undefined'){
      let index = this.rooms.findIndex((lobby) => lobby.roomMakerId === roomMakerId);
      if (index !== -1) {
        let roomCode = this.rooms[index].roomCode;
        this.rooms.splice(index, 1);
        return roomMakerName + " has removed their room (" + roomCode + ")";
      } else {
        return "You don't have a room to remove";
      }
    } else {
      let index = this.rooms.findIndex((lobby) => lobby.roomCode === roomCode);
      if (index !== -1) {
        this.rooms.splice(index, 1);
        return "The room " + roomCode + " has been removed";
      } else {
        return "That room doesn't exist";
      };
    }
  }
}
//create a room class
class Room {
  constructor(public roomCode: string, public roomMakerId: string, public roomMakerName: string) {}
}

