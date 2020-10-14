import { getQuestions, getCategories, Category } from "./api";
import { Question } from "../trivia/game";

const filterBlacklistedCategories = (categories: Category[], blacklisted: string[]): Category[] =>
  categories.filter(category => !blacklisted.some(banned => category.name.toLowerCase().includes(banned.toLowerCase())));

async function getCategory(category: string, blacklisted: string[]): Promise<string> {
  if (category) {
    return category;
  }
  const categories = await getCategories();
  const filteredCategories = filterBlacklistedCategories(categories, blacklisted);
  console.log(filteredCategories);
  return filteredCategories[Math.floor(Math.random() * filteredCategories.length)].id;
}

async function getQuestion(category: string, difficulty: string, questionType: string, blacklisted: string[]): Promise<Question> {
  const randomCategory = await getCategory(category, blacklisted);
  console.log(randomCategory);
  const { results } = await getQuestions(randomCategory, difficulty, questionType);
  return results[0];
}

export { getQuestion, getCategory, filterBlacklistedCategories };
