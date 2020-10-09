import * as Trivia from "../trivia/game";
import * as Discord from 'discord.js';

let currentChannel: Discord.Channel;

const setCurrentChannel = (channel: Discord.Channel) => currentChannel = channel;
const getCurrentChannel = (): Discord.Channel => currentChannel;

async function sendNextQuestion(channel: Discord.Channel) {
  const {question, choices } = await Trivia.getNextQuestion();
  console.log(question);

  await channel.send(`${question.question} (difficulty: ${question.difficulty})
		a) ${choices[0]}
		b) ${choices[1]}
		c) ${choices[2]}
		d) ${choices[3]}`);
}

export { setCurrentChannel, getCurrentChannel, sendNextQuestion };
