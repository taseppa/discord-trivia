import {formatScores, getCurrentChannel, sendNextQuestion} from "../index";

const handleAnswersEvaluated = async (correctLetter: string, scores: string): Promise<void> => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  currentChannel.send(`Correct answer: ${correctLetter} -- scores: ${formattedScores}`);
  await sendNextQuestion(currentChannel);
};

const handleGameCompleted = async (correctLetter: string, scores: string, winner: string): Promise<void> => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  await currentChannel.send(`Correct answer: ${correctLetter} -- scores: ${formattedScores}\n Winner ${winner}!`);

};

export { handleAnswersEvaluated, handleGameCompleted };
