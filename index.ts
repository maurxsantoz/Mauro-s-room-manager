import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import {RoomManager} from "./rooms";

//get the token from the .env file
dotenv.config();

// instantiate variables
var roomManager = new RoomManager();
var rooms: Array<Room> = new Array<Room>();
const helpMessage: string =
  "```\n" +
  "                    🐬Commands🐬                         \n" +
  "🐬r! help🐬               -   Shows this message          \n" +
  "🐬! rooms🐬               -   Shows all available rooms   \n" +
  "🐬! new [room code]🐬     -   Adds a room to the list     \n" +
  "🐬! remove🐬              -   Removes your room from the list\n" +
  "🐬! remove [room code]🐬  -   Removes a specific room from the list\n" +
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
  if (message.content.includes("@here") || message.content.includes("@everyone"))return;
  
  if (!message.content.toLocaleLowerCase().startsWith("r!") && !message.content.startsWith("!"))return;
    
  if (message.author.bot) return;
  let command: string ="";
  //removes ! or r! from the message
  if(message.content.toLocaleLowerCase().startsWith("r!")){
    command = message.content.substring(2)
  }else{
    command = message.content.substring(1)
  }
  //removes optional "" from the message
  if (command.startsWith(" ")){
    command = command.substring(1)
  }
  let outputMessage: string = "";
  let roomMakerId: string;
  let roomMakerName: string;
  let roomCode: string;
  switch(command.split(" ")[0].toLocaleLowerCase()){
    case "rooms":
      outputMessage = roomManager.showRooms();
      message.reply({
        content: outputMessage,
      });
      
      break;
    case "new":
      roomMakerId = message.author.id;
      roomMakerName = message.author.username;
      roomCode = message.content.split(" ")[1];
      outputMessage = roomManager.newRoom(roomMakerId, roomMakerName, roomCode);
      message.reply({
        content: outputMessage,
      });
      break;
    case "remove":
      roomMakerId = message.author.id;
      roomMakerName = message.author.username;
      if (message.content.split(" ").length === 1) {
        outputMessage = roomManager.removeRoom(roomMakerId, roomMakerName);
      } else {
        roomCode = message.content.split(" ")[1];
        outputMessage = roomManager.removeRoom(roomMakerId, roomMakerName, roomCode);
      }
      break;
    case "help":
      if(message.content.toLocaleLowerCase().startsWith("r!")){
        message.reply({
          content: helpMessage,
        });
      }
      break;
    default:
      break;
  }
});
// client login
client.login(process.env.TOKEN);
//create a room class
class Room {
  constructor(public roomCode: string, public roomMakerId: string, public roomMakerName: string) {}
}