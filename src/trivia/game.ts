import * as OpendTDB from '../opentdb';
import {shuffle} from 'lodash';

interface GameSettings {
    numberOfQuestions: number;
    category: string;
    difficulty?: string;
    questionType: string;
    blacklisted: string[]
}

interface Question {
    difficulty: string;
    question: string;
    category: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface GameState {
    settings?: GameSettings;
    currentQuestion?: Question;
    correctLetter?: string;
    isGameRunning?: boolean;
}

const gameState: GameState = {};
const gameIsRunning = () => gameState.isGameRunning;

function startGame(settings: GameSettings) {
  gameState.isGameRunning = true;
  gameState.settings = settings;
}

const getCorrectLetter = (choices: string[], correctAnswer: string): string => {
  const index = choices.findIndex((choice, index) => {
    return choice === correctAnswer;
  });
  return String.fromCharCode('a'.charCodeAt(0) + index);
};

async function getNextQuestion(): Promise<{question: Question, choices: string[]}> {
  const question = await OpendTDB.getQuestion(gameState.settings.category, gameState.settings.difficulty, gameState.settings.questionType, [] );
  const choices = shuffle([...question.incorrect_answers, question.correct_answer]);
  gameState.currentQuestion = question;
  gameState.correctLetter = getCorrectLetter(choices, question.correct_answer);
  return { question, choices };
}

function answer(choice): boolean {
  return gameState.correctLetter === choice;
}

export { startGame, gameIsRunning, getNextQuestion, Question, getCorrectLetter, answer }
