import * as Trivia from '../../trivia/game';
import { formatScores, sendNextQuestion, setCurrentChannel } from "../index";
import * as parseArgs from 'minimist';
import * as Discord from 'discord.js';

async function handleStart(message: Discord.Message) {
  setCurrentChannel(message.channel);
  const params = message.content.substr('trivia start'.length).split(' ');
  const args = parseArgs(params);
  console.log(args);
  Trivia.startGame({
    numberOfQuestions: args.numberOfQuestions || 50,
    category: args.category,
    questionType: args.type || 'multiple',
    blacklisted: args.ban ? args.ban.split(',') : [],
    scoreLimit: args.limit || 1000
  });

  await sendNextQuestion(message.channel);
}

async function handleStop(message: Discord.Message) {
  const scores = Trivia.stopGame();
  await message.channel.send(formatScores(scores));
}

async function handleMessage(message: Discord.Message) {
  if (message.content.startsWith('trivia start')) {
    await handleStart(message);
  } else if(message.content.startsWith('trivia stop')) {
    await handleStop(message);
  } else if (!message.author.bot) {
    Trivia.collectAnswer(message.content, message.author.username);
  }
}

export { handleMessage };
