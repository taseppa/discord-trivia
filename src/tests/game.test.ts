import {getCategory, getQuestion} from '../opentdb';
import * as Trivia from '../trivia/game';
import {getCorrectLetter, Question} from "../trivia/game";
import {getCategories} from "../opentdb/api";
import {formatQuestion} from "../discord";

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

test('Get category', async () => {
  const category = await getCategory(undefined, ['anime', 'cartoon']);
  console.log(category);
})

test('Get question', async () =>  {
  const question = await getQuestion(undefined, 'medium', 'multiple', ['anime']);
  console.log(question);
}
);

test('Format question', () => {
  const question = {
    difficulty: 'medium',
    question: 'foo'
  };

  const formatted = formatQuestion(question, ['bar', 'baz', 'q']);
  expect(formatted).toBe('foo (difficulty: medium)')
})
