import { getQuestions, getCategories, Category } from "./api";
import { GameSettings, Question } from "../trivia/game";

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

async function getQuestion(gameSettings: GameSettings): Promise<Question> {
  const randomCategory = await getCategory(gameSettings.category, gameSettings.blacklisted);
  console.log(randomCategory);
  const questions = await getQuestions(randomCategory, gameSettings.difficulty, gameSettings.questionType);
  return questions[0];
}

export default { getQuestion, getCategory, filterBlacklistedCategories };
