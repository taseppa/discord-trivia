import axios from 'axios';
import {Question} from "../trivia/game";

const getQuestions = async (category: string, difficulty: string, questionType: string, blacklisted: string[]) => {
  const url = `https://opentdb.com/api.php?category=${category}&amount=50`;
  const {data: result} = await axios.get(url);
  return result;
};

export { getQuestions };
