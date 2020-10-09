import axios from 'axios';
import {Question} from "../trivia/game";
let categoryCache;

const getQuestions = async (category: string, difficulty: string, questionType: string) => {
  const url = `https://opentdb.com/api.php?category=${category}&amount=1&encode=url3986`;
  const {data: result} = await axios.get(url);
  return result;
};

const getCategories = async () => {
  if (categoryCache) return categoryCache;
  const url = 'https://opentdb.com/api_category.php'
  const {data: results} = await axios.get(url);
  console.log(results);
  // const categories = results.trivia_categories.map(result => result.id);
  categoryCache = results.trivia_categories;
  return results.trivia_categories;
}

export { getQuestions, getCategories };
