const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
const RoomManager = require("./rooms.js");
const aternos = require("./aternos");

//get the token from the .env file
dotenv.config();
const helpMessage =
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
  "🐬! ip🐬                  -   Shows the server ip address      \n" +
  "🐬! status🐬              -   Shows the server status      \n" +
  "🐬! start🐬               -   Starts the server          \n" +
  "🐬! players🐬             -   Shows current amount of players on the server\n" +
  "```";
const serverIp = "DLUminecraft.aternos.me";
//instantiate the discord client
const client = new Client({
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
  if (
    message.content.includes("@here") ||
    message.content.includes("@everyone")
  )
    return;

  if (
    !message.content.toLocaleLowerCase().startsWith("m!") &&
    !message.content.startsWith("!")
  )
    return;

  if (message.author.bot) return;
  let command = "";
  //removes ! or m! from the message
  if (message.content.toLocaleLowerCase().startsWith("m!")) {
    command = message.content.substring(2);
  } else {
    command = message.content.substring(1);
  }
  //removes optional "" from the message
  if (command.startsWith(" ")) {
    command = command.substring(1);
  }
  let outputMessage = "";
  let roomMakerId = "";
  let roomMakerName = "";
  let roomCode = "";
  switch (command.split(" ")[0].toLocaleLowerCase()) {
    case "rooms":
      outputMessage = RoomManager.showRooms();
      message.reply({
        content: outputMessage,
      });

      break;
    case "new":
      roomMakerId = message.author.id;
      roomMakerName = message.author.username;
      roomCode = message.content.split(" ")[1];
      outputMessage = RoomManager.newRoom(roomMakerId, roomMakerName, roomCode);
      message.reply({
        content: outputMessage,
      });
      break;
    case "remove":
      roomMakerId = message.author.id;
      roomMakerName = message.author.username;
      if (message.content.split(" ").length === 1) {
        outputMessage = RoomManager.removeRoom(roomMakerId, roomMakerName);
      } else {
        roomCode = message.content.split(" ")[1];
        outputMessage = RoomManager.removeRoom(
          roomMakerId,
          roomMakerName,
          roomCode
        );
      }
      message.reply({
        content: outputMessage,
      });
      break;
    case "help":
      if (message.content.toLocaleLowerCase().startsWith("m!")) {
        message.reply({
          content: helpMessage,
        });
      }
      break;
    case "ip":
        message.reply({
          content: serverIp,
        });
        break;
    case "start":
      message.reply({
        content: "Got it! give it a second, I'll @ you when its done",
      });
      aternos
        .start(process.env.SERVER_ID)
        .then(() => {
          message.reply({
            content: "The server is running!",
          });
        })        
        .catch((error) => {
          console.log(error);
          message.reply({
            content: "Something went wrong, please try again later or @ Other",
          });
        });
        
      break;
    case "status":  
      aternos
        .getInfo(process.env.SERVER_ID)
        .then((value) => {
          console.log(value);
          message.reply({
            content: "The server is currently " + value.status.text,
          });
        })
        .catch((error) => {
          console.log(error);
          message.reply({
            content: "Something went wrong, please try again later or @ Other",
          });
        });
      break;
    case "players":
      aternos
        .getInfo(process.env.SERVER_ID)
        .then((value) => {
          console.log(value);
          if (value.status.text === "Online") {
            message.reply({
              content: "The server is currently running with " + value.players.current + "/"+ value.players.max +" players online ",
            });
          }else{
            message.reply({
              content: "Cant get player amount because the server isn't currently Online",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          message.reply({
            content: "Something went wrong, please try again later or @ Other",
          });
        });
        break;
    default:
      break;
  }
});
// client login
client.login(process.env.TOKEN);