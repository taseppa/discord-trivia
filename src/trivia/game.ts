import OpendTDB from '../opentdb';
import { shuffle, maxBy } from 'lodash';
import * as EventEmitter from 'events';

const gameStateEventEmitter = new EventEmitter.EventEmitter();
const gameState: GameState = {};

interface GameSettings {
    category?: string;
    difficulty?: string;
    blacklisted?: string[];
    scoreLimit?: number;
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
    currentAnswers?: Answer[];
    scores?: Record<string, number>;
}

interface Answer {
    letter: string;
    username: string;
}

function startGame(settings: GameSettings) {
  if (gameState.isGameRunning) {
    gameStateEventEmitter.emit('gameAlreadyGoing');
    return;
  }

  gameState.isGameRunning = true;
  gameState.settings = settings;
  gameState.currentAnswers = [];
  gameState.scores = {};
}

function stopGame() {
  gameState.isGameRunning = false;
  return gameState.scores;
}

const getCorrectLetter = (choices: string[], correctAnswer: string): string => {
  const index = choices.findIndex((choice, index) => {
    return choice === correctAnswer;
  });
  return String.fromCharCode('a'.charCodeAt(0) + index);
};

async function getNextQuestion(): Promise<{question: Question, choices: string[]}> {
  gameState.currentAnswers = [];
  const question = await OpendTDB.getQuestion(gameState.settings);
  const choices = shuffle([...question.incorrect_answers, question.correct_answer]);
  gameState.currentQuestion = question;
  gameState.correctLetter = getCorrectLetter(choices, question.correct_answer);
  setTimeout(evaluateAnswers, 18000);
  return { question, choices };
}

function updateAnswers(currentAnswers: Answer[], answer: Answer) {
  if (!['a', 'b', 'c', 'd'].includes(answer.letter)) {
    return currentAnswers;
  }
  return [...currentAnswers, answer];
}

function collectAnswer(answer: Answer) {
  gameState.currentAnswers = updateAnswers(gameState.currentAnswers, answer);
}

function getNewScores(gameState: GameState): Record<string, number> {
  const updates = gameState.currentAnswers.filter(answer => answer.letter === gameState.correctLetter).
    reduce((acc, curr, index) => {
      const newScore = (gameState.scores[curr.username] || 0) + (index === 0 ? 100 : 50);
      return { ...acc, [curr.username]: newScore };
    }, {});
  console.log(updates, gameState.scores);
  return { ...gameState.scores, ...updates };
}

function evaluateAnswers() {
  if (!gameState.isGameRunning) {
    return;
  }
  console.log('Evaluating answers');

  gameState.scores = getNewScores(gameState);
  const winner = getWinner(gameState);

  if (winner) {
    gameStateEventEmitter.emit('gameCompleted', gameState.correctLetter, gameState.scores, winner);
  } else {
    gameStateEventEmitter.emit('answersEvaluated', gameState.correctLetter, gameState.scores);
  }
}

// Determining winner is a little bit tricky because scores can be drawn
function getWinner(gameState: GameState): string {
  const usersExceedingScore = Object.entries(gameState.scores).filter(([key, value]) => value >= gameState.settings.scoreLimit);
  if (usersExceedingScore.length === 0) {
    return undefined;
  }

  const [potentialWinner, maxScore] = maxBy(usersExceedingScore, ([, score]) => score);
  const otherMaxScores = usersExceedingScore.filter(([, score]) => score === maxScore);
  if (otherMaxScores.length > 1) {
    return undefined;
  }

  return potentialWinner;
}

export {
  startGame,
  stopGame,
  getNextQuestion,
  Question,
  GameSettings,
  getCorrectLetter,
  collectAnswer,
  gameStateEventEmitter,
  getWinner,
  getNewScores,
  updateAnswers
}
