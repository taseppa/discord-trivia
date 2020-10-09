import * as Discord from 'discord.js';
import * as Trivia from './src/trivia/game';
import * as parseArgs from 'minimist';

import * as dotenv from 'dotenv';
dotenv.config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  if (message.content.startsWith('trivia start')) {
    if (Trivia.gameIsRunning()) {
      await message.channel.send('Game already going');
      return;
    }
    const params = message.content.substr('trivia start'.length).split(' ');
    const args = parseArgs(params);
    Trivia.startGame({
      numberOfQuestions: args.numberOfQuestions || 50,
      category: args.category || '19',
      questionType: args.type || 'multiple',
      blacklisted: args.blacklisted || []});

    const {question, choices } = await Trivia.getNextQuestion();
    console.log(question);

    await message.channel.send(`${question.question} (difficulty: ${question.difficulty})
		a) ${choices[0]}
		b) ${choices[1]}
		c) ${choices[2]}
		d) ${choices[3]}`);
  } else {
    const isCorrect = Trivia.answer(message.content);
    if (isCorrect) {
      await message.channel.send('Correct!');
    } else {
      await message.channel.send('Incorrect, fag');
    }
  }
});

client.login(process.env.TOKEN);
