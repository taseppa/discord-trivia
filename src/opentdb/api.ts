import axios from 'axios';
import { Question } from "../trivia/game";
let categoryCache: Category[] =[];

interface Category {
  name: string;
  id: string;
}

const getQuestions = async (category: string, difficulty: string, questionType: string): Promise<Question[]> => {
  const url = `https://opentdb.com/api.php?category=${category}&amount=1&encode=url3986`;
  const { data: result } = await axios.get<{results: Question[]}>(url);
  return result.results;
};

const getCategories = async (): Promise<Category[]> => {
  if (categoryCache) return categoryCache;
  const url = 'https://opentdb.com/api_category.php'
  const { data: results } = await axios.get<{trivia_categories: Category[]}>(url);

  categoryCache = results.trivia_categories;
  return results.trivia_categories;
}

export { getQuestions, getCategories, Category };
