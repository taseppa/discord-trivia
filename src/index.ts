import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import { gameStateEventEmitter } from "./trivia/game";
import { handleMessage } from './discord/events/message';
import { handleReady } from './discord/events/ready';
import { handleAnswersEvaluated, handleGameCompleted } from "./discord/events/answersEvaluated";
import { handleGameAlreadyGoing } from './discord/events/gameAlreadyGoing';
dotenv.config();

const client = new Discord.Client();
let currentChannel: Discord.Channel;

gameStateEventEmitter.on('gameAlreadyGoing', handleGameAlreadyGoing);
gameStateEventEmitter.on('answersEvaluated', handleAnswersEvaluated);
gameStateEventEmitter.on('gameCompleted', handleGameCompleted);

client.once('ready', handleReady);
client.on('message', handleMessage);

client.login(process.env.TOKEN);
