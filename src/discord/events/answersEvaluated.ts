import * as Trivia from "../../trivia/game";
import {getCurrentChannel, sendNextQuestion} from "../index";

const handleAnswersEvaluated = async (correctLetter, scores) => {
  const currentChannel = getCurrentChannel();
  currentChannel.send(`Correct answer: ${correctLetter}`);
  for (const [user, score] of Object.entries(scores)) {
    currentChannel.send(`${user}: ${score}`);
  }
  console.log(scores);
  const {question, choices } = await Trivia.getNextQuestion();
  await sendNextQuestion(currentChannel);
};

export { handleAnswersEvaluated };
