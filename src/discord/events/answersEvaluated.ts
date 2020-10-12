import {formatScores, getCurrentChannel, sendNextQuestion} from "../index";

const handleAnswersEvaluated = async (correctLetter, scores) => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  currentChannel.send(`Correct answer: ${correctLetter} scores: ${formattedScores}`);
  await sendNextQuestion(currentChannel);
};

const handleGameCompleted = async (correctLetter, scores, winner) => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  currentChannel.send(`Correct answer: ${correctLetter} scores: ${formattedScores}\n Winner ${winner}`);

};


export { handleAnswersEvaluated, handleGameCompleted };
