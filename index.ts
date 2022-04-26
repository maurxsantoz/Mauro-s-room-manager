import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";

//get the token from the .env file
dotenv.config();

// instantiate variables
var rooms: Array<Room> = new Array<Room>();
const helpMessage: string =
  "```\n" +
  "                    🐬Commands🐬                         \n" +
  "🐬r!help🐬               -   Shows this message          \n" +
  "🐬!rooms🐬               -   Shows all available rooms   \n" +
  "🐬!new [room code]🐬     -   Adds a room to the list     \n" +
  "🐬!remove🐬              -   Removes your room from the list\n" +
  "🐬!remove [room code]🐬  -   Removes a specific room from the list\n" +
  "```";

//instantiate the discord client
const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});
client.on("ready", () => {
  console.log("I am ready!");
  client.user?.setPresence({
    activities: [{ name: "r!help or just ask Mauro idk" }],
    status: "dnd",
  });
});

//fetching the discord messages
client.on("messageCreate", (message) => {
  //if the message is from the bot or doesn't start with ! they are ignored
  if (!message.content.startsWith("r!") && !message.content.startsWith("!"))
    return;
    
  if (message.author.bot) return;

  //different commands
  if (message.content === "r!help") {
    message.reply({
      content: helpMessage,
    });
  }

  if (message.content === "!rooms") {
    let outputMessage = "";
    if (rooms.length > 0) {
      rooms.reverse().forEach((lobby) => {
        outputMessage +=
          lobby.roomMakerName + "'s room code is " + lobby.roomCode + "\n";
      });
    } else {
      outputMessage = "No rooms available";
    }
    message.reply({
      content: outputMessage,
    });
  }

  if (message.content.startsWith("!new")) {
    let roomCode = message.content.split(" ")[1];
    let roomMakerId = message.author.id;
    let roomMakerName = message.author.username;
    rooms.push(new Room(roomCode, roomMakerId, roomMakerName));
    message.reply({
      content: roomMakerName + " has added the room: " + roomCode + " !",
    });
  }

  if (message.content.startsWith("!remove")) {
    if (message.content.split(" ").length === 1) {
      let roomMakerId = message.author.id;
      let roomMakerName = message.author.username;
      let index = rooms.findIndex((lobby) => lobby.roomMakerId === roomMakerId);
      if (index !== -1) {
        let roomCode = rooms[index].roomCode;
        rooms.splice(index, 1);
        message.reply({
          content: roomMakerName + " has removed their room (" + roomCode + ")",
        });
      } else {
        message.reply({ content: "You don't have a room to remove" });
      }
    } else {
      let roomCode = message.content.split(" ")[1];
      let index = rooms.findIndex((lobby) => lobby.roomCode === roomCode);
      if (index !== -1) {
        rooms.splice(index, 1);
        message.reply({
          content: "The room " + roomCode + " has been removed",
        });
      } else {
        message.reply({ content: "That room doesn't exist" });
      }
    }
  }
});
// client login
client.login(process.env.TOKEN);
console.log(client.user?.username);
//create a room class
class Room {
  roomCode: string;
  roomMakerId: string;
  roomMakerName: string;
  constructor(roomCode: string, roomMakerId: string, roomMakerName: string) {
    this.roomCode = roomCode;
    this.roomMakerId = roomMakerId;
    this.roomMakerName = roomMakerName;
  }
}
