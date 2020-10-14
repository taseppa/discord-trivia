import { formatScores, getCurrentChannel, sendNextQuestion } from "../index";

const handleAnswersEvaluated = async (correctLetter: string, scores: string) => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  currentChannel.send(`Correct answer: ${correctLetter}, scores: ${formattedScores}`);
  await sendNextQuestion(currentChannel);
};

const handleGameCompleted = async (correctLetter: string, scores: string, winner: string) => {
  const currentChannel = getCurrentChannel();
  const formattedScores = formatScores(scores);
  await currentChannel.send(`Correct answer: ${correctLetter} -- scores: ${formattedScores}\nWinner -- ${winner}`);
};


export { handleAnswersEvaluated, handleGameCompleted };
