import * as Trivia from '../../trivia/game';
import { formatScores, sendNextQuestion, setCurrentChannel } from "../index";
import * as parseArgs from 'minimist';
import * as Discord from 'discord.js';
import { TextChannel } from "discord.js";

interface ParsedArguments {
  ban: string;
  limit: number;
  category: string;
}

async function handleStart(message: Discord.Message) {
  setCurrentChannel(message.channel as TextChannel);
  const params = message.content.substr('trivia start'.length).split(' ');
  const args = parseArgs(params) as ParsedArguments;
  console.log(args);
  Trivia.startGame({
    category: args.category,
    blacklisted: args.ban ? args.ban.split(',') : [],
    scoreLimit: args.limit || 1000
  });

  await sendNextQuestion(message.channel as TextChannel);
}

async function handleStop(message: Discord.Message) {
  const scores = Trivia.stopGame();
  await message.channel.send(`Game stopped.\n${formatScores(scores)}`);
}

async function handleMessage(message: Discord.Message) {
  if (message.content.startsWith('trivia start')) {
    await handleStart(message);
  } else if(message.content.startsWith('trivia stop')) {
    await handleStop(message);
  } else if (!message.author.bot) {
    Trivia.collectAnswer({ letter: message.content, username:message.author.username });
  }
}

export { handleMessage };
