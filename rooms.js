var rooms = [];

function showRooms() {
  let outputMessage = "";
  if (rooms.length > 0) {
    rooms.reverse().forEach((lobby) => {
      outputMessage +=
        lobby.roomMakerName + "'s room code is " + lobby.roomCode + "\n";
    });
    return outputMessage;
  } else {
    return "No rooms available";
  }
}
function newRoom(roomMakerId, roomMakerName, roomCode) {
  rooms.push(new Room(roomCode, roomMakerId, roomMakerName));
  return roomMakerName + " has added the room: " + roomCode + " !";
}
function removeRoom(roomMakerId, roomMakerName, roomCode = null) {
  if (roomCode === null) {
    let index = rooms.findIndex(
      (lobby) => lobby.roomMakerId === roomMakerId
    );
    if (index !== -1) {
      let roomCode = rooms[index].roomCode;
      return "" + roomMakerName + " has removed their room (" + roomCode + ")";
    } else {
      return "You don't have a room to remove";
    }
  } else {
    let index = rooms.findIndex((lobby) => lobby.roomCode === roomCode);
    if (index !== -1) {
      rooms.splice(index, 1);
      return "The room " + roomCode + " has been removed";
    } else {
      return "That room doesn't exist";
    }
  }
}
//create a room class
class Room {
  constructor(roomCode, roomMakerId, roomMakerName) {
    this.roomCode = roomCode;
    this.roomMakerId = roomMakerId;
    this.roomMakerName = roomMakerName;
  }
}
module.exports = {
  showRooms,
  newRoom,
  removeRoom,
};
