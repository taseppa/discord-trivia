import * as Trivia from "../trivia/game";
import * as Discord from 'discord.js';

let currentChannel: Discord.Channel;

const setCurrentChannel = (channel: Discord.Channel) => currentChannel = channel;
const getCurrentChannel = (): Discord.Channel => currentChannel;

const formatScores = (scores) => Object.keys(scores).reduce((acc, current) => `${acc} ${current}: ${scores[current]}`, '');


function formatQuestion(question, choices) {
  const formattedChoices = choices.reduce((acc, current, index) => {return `${acc} ${String.fromCharCode('a'.charCodeAt(0) + index) }: ${current}\n`}, '');
  return `${question.question} (difficulty: ${question.difficulty})\n${formattedChoices}`;
}

async function sendNextQuestion(channel: Discord.TextChannel) {
  const {question, choices } = await Trivia.getNextQuestion();
  console.log(question);

  const message = formatQuestion(question, choices);
  const encodedMessage = decodeURIComponent(message);

  await channel.send(encodedMessage);
}

export { setCurrentChannel, getCurrentChannel, sendNextQuestion, formatQuestion, formatScores };
