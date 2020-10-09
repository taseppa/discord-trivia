import * as Trivia from '../trivia/game';
import {getCorrectLetter, Question} from "../trivia/game";

test('Get next question', async () => {

  Trivia.startGame({
    numberOfQuestions:  50,
    category:  '19',
    difficulty:  'medium',
    questionType:  'multiple',
    blacklisted:  []});

  const question = await Trivia.getNextQuestion();
  console.log(question);
  // expect(question is Question).toBe(true);
});

test('Get correct letter',  () => {
  const letter = getCorrectLetter(['foo', 'bar', 'baz'], 'baz');
  expect(letter).toBe('c');
});
