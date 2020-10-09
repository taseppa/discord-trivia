import {getQuestions} from "./api";
import {Question} from "../trivia/game";

async function getQuestion(category: string, difficulty: string, questionType: string, blacklisted: string[]): Promise<Question> {
  const result = await getQuestions(category, difficulty, questionType, blacklisted);
  const questions = result.results.filter(question => !blacklisted.includes(question.category));
  return questions[0];
}

export { getQuestion };
