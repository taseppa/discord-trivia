import * as Trivia from '../../trivia/game';
import {sendNextQuestion, setCurrentChannel} from "../index";
import * as parseArgs from 'minimist';
import * as Discord from 'discord.js';

async function handleMessage(message: Discord.Message) {
  if (message.content.startsWith('trivia start')) {
    setCurrentChannel(message.channel);
    const params = message.content.substr('trivia start'.length).split(' ');
    const args = parseArgs(params);
    Trivia.startGame({
      numberOfQuestions: args.numberOfQuestions || 50,
      category: args.category || '19',
      questionType: args.type || 'multiple',
      blacklisted: args.blacklisted || []
    });

    await sendNextQuestion(message.channel);
  } else {
    if (message.author.bot) {
      return;
    }
    Trivia.collectAnswer(message.content, message.author.username);
  }
}

export { handleMessage };
