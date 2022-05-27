import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
import {RoomManager} from "./rooms";
const aternos = require('./aternos');

//get the token from the .env file
dotenv.config();

// instantiate variables
var roomManager = new RoomManager();
var rooms: Array<Room> = new Array<Room>();
const helpMessage: string =
  "```\n" +
  "                     🐬Commands🐬                         \n" +
  "                    ---------------                        \n" +
  "                     🐬Lobbies🐬                         \n" +
  "🐬m! help🐬               -   Shows this message          \n" +
  "🐬! rooms🐬               -   Shows all available rooms   \n" +
  "🐬! new [room code]🐬     -   Adds a room to the list     \n" +
  "🐬! remove🐬              -   Removes your room from the list\n" +
  "🐬! remove [room code]🐬  -   Removes a specific room from the list\n" +
  "                    ---------------                        \n" + 
  "                     🐬Minecraft🐬                         \n" +
  "          🐬please wait a bit before retrying🐬             \n" +
  "🐬! status🐬              -   Shows the server status      \n" +
  "🐬! start🐬               -   Starts the server          \n" +
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
    activities: [{ name: "m!help or just ask Mauro idk" }],
    status: "dnd",
  });
});
//fetching the discord messages
client.on("messageCreate", (message) => {
  //if the message is from the bot or doesn't start with ! they are ignored
  if (message.content.includes("@here") || message.content.includes("@everyone"))return;
  
  if (!message.content.toLocaleLowerCase().startsWith("m!") && !message.content.startsWith("!"))return;
    
  if (message.author.bot) return;
  let command: string ="";
  //removes ! or m! from the message
  if(message.content.toLocaleLowerCase().startsWith("m!")){
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
      if(message.content.toLocaleLowerCase().startsWith("m!")){
        message.reply({
          content: helpMessage,
        });
      }
      break;
    case "start":
      message.reply({
        content: "Got it! give it a second, I'll @ you when its done",
      });
      aternos.start(process.env.SERVER_ID)
        .then(()=>{
          message.reply({
            content: "The server is running!",
          });
        })
        .catch(()=>{
          message.reply({
            content: "Something went wrong, try again later or @ Other",
          });
        });
      break;
    case "status":
      aternos.getInfo(process.env.SERVER_ID)
        .then((value: any)=>{
          console.log(value);
          message.reply({
            content: "The server is currently "+value.status.text,
          });
        })
        .catch(()=>{
          message.reply({
            content: "Something went wrong, try again later or @ Other",
          });
        });
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