import OpenTDB from '../opentdb';
import { getCorrectLetter, getNewScores, getWinner, Question } from "../trivia/game";
import { formatQuestion } from "../discord";

test('Get correct letter',  () => {
  const letter = getCorrectLetter(['foo', 'bar', 'baz'], 'baz');
  expect(letter).toBe('c');
});

test('Filter blacklisted categories',  () => {
  const categories = [
    { name: 'foo', id: '22' },
    { name: 'Super anime', id:'33' },
    { name: 'some cartoon stuff', id: '45' }
  ];
  const filteredCategories = OpenTDB.filterBlacklistedCategories(categories,['anime', 'cartoon']);
  expect(filteredCategories).toEqual(    [{ name: 'foo', id: '22' }]);
});

// TODO: need mock OpendTDB api to test these
// test('Get question', async () =>  {
//   const question = await OpenTDB.getQuestion({});
//   console.log(question);
// }
// );

test('Format question', () => {
  const question = {
    difficulty: 'medium',
    question: 'foo',
    category: 'something',
    correct_answer: '',
    incorrect_answers: []
  };

  const formatted = formatQuestion(question, ['bar', 'baz', 'q']);
  expect(formatted).toBe('======\nCategory: something\nfoo (difficulty: medium)\na) bar\nb) baz\nc) q\n')
})

describe('Get winner', () => {
  const gameState = {
    isGameRunning : true,
    settings : {
      scoreLimit: 300 },
    currentAnswers : [],
    scores : {
      bar: 200,
      foo: 100
    }
  }

  test('No winner', () => {
    expect(getWinner(gameState)).toBe(undefined);
  });

  test('One user exceeds score', () => {
    gameState.scores.foo = 400;
    expect(getWinner(gameState)).toBe('foo');
  });
  test('Two user exceeds score', () => {
    gameState.scores.bar = 500;
    expect(getWinner(gameState)).toBe('bar');
  });
  test('Two user exceeds score but scores are drawn', () => {
    gameState.scores.foo = 500;
    expect(getWinner(gameState)).toBe(undefined);
  });
});

test('Evaluate scores', () => {
  const gameState = {
    isGameRunning : true,
    correctLetter: 'a',
    settings : {
      scoreLimit: 300 },
    currentAnswers : [
      { username: 'a', letter: 'a' },
      { username: 'b', letter: 'a' },
      { username: 'c', letter: 'a' },
      { username: 'd', letter: 'b' },
    ],
    scores : {
      a: 100,
      b: 100,
      c: 100,
      d: 100
    }
  };

  const newScores = getNewScores(gameState);
  expect(newScores).toEqual({
    a: 200,
    b: 150,
    c: 150,
    d: 100
  });
});
