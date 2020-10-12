import * as OpendTDB from '../opentdb';
import {shuffle, maxBy } from 'lodash';
import * as EventEmitter from 'events';

interface GameSettings {
    category?: string;
    difficulty?: string;
    questionType?: string;
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
    currentAnswers?: Record<string, string>;
    scores?: Record<string, number>;
}

const gameStateEventEmitter = new EventEmitter.EventEmitter();

const gameState: GameState = {};
const gameIsRunning = () => gameState.isGameRunning;

function startGame(settings: GameSettings) {
  if (gameState.isGameRunning) {
    gameStateEventEmitter.emit('gameAlreadyGoing');
    return;
  }

  gameState.isGameRunning = true;
  gameState.settings = settings;
  gameState.currentAnswers = {};
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
  gameState.currentAnswers = {};
  const question = await OpendTDB.getQuestion(gameState.settings.category, gameState.settings.difficulty, gameState.settings.questionType, gameState.settings.blacklisted);
  const choices = shuffle([...question.incorrect_answers, question.correct_answer]);
  gameState.currentQuestion = question;
  gameState.correctLetter = getCorrectLetter(choices, question.correct_answer);
  setTimeout(evaluateAnswers, 18000);
  return { question, choices };
}

function collectAnswer(answer: string, userName: string) {
  if (!['a', 'b', 'c', 'd'].includes(answer)) {
    return
  }
  gameState.currentAnswers[userName] = answer;
}

function evaluateAnswers() {
  if (!gameState.isGameRunning) {
    return;
  }
  console.log('Evaluating answers');
  for (const [username, answer] of Object.entries(gameState.currentAnswers)) {
    if (answer === gameState.correctLetter) {
      gameState.scores[username] = (gameState.scores[username] || 0) + 100;
    }
  }

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

  const [potentialWinner, maxScore] = maxBy(usersExceedingScore, ([username, score]) => score);
  const otherMaxScores = usersExceedingScore.filter(([username, score]) => score === maxScore);
  if (otherMaxScores.length > 1) {
    return undefined;
  }

  return potentialWinner;
}


export { startGame, stopGame, gameIsRunning, getNextQuestion, Question, getCorrectLetter, collectAnswer, gameStateEventEmitter, getWinner }
