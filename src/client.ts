import ALL_WORDS_RAW from './words_alpha.txt';
export function ASSERT(condition: any, errorMessage: string = 'Assertion Failed'): asserts condition {
  if (!condition) {
    Error(errorMessage);
    throw Error(errorMessage);
  }
}

const ALL_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const LENGTH = 6;
const ALL_WORDS: string[] = ALL_WORDS_RAW.split('\r\n');

let remainingWords = ALL_WORDS.slice().filter((x) => x.length === LENGTH);
let remainingLetters = ALL_LETTERS.slice();
let wrongGuesses = 0;

function init() {
  const guessElement = document.getElementById('word');
  ASSERT(guessElement !== null);

  guessElement.innerText = '_'.repeat(6);

  for (const letter of ALL_LETTERS) {
    const letterElement = document.getElementById('letter-' + letter);
    ASSERT(letterElement);

    letterElement.addEventListener('click', () => {
      if (!letterElement.classList.contains('chosen')) {
        const isGoodLetter = makeGuess(letter);
        letterElement.classList.add(isGoodLetter ? 'good' : 'bad');
        letterElement.classList.add('chosen');
        if (!isGoodLetter) {
          drawNextLine();
          ++wrongGuesses;
        }
        if (wrongGuesses === 10) {
          handleLoss();
          return;
        }
      }
    });
  }
}

let mysteryWord: string | undefined;
let guessedLetters: string[] = [];

function handleLoss() {
  for (const letter of ALL_LETTERS) {
    const letterElement = document.getElementById('letter-' + letter);
    ASSERT(letterElement);

    letterElement.classList.add('chosen');
  }

  const instructionsElement = document.getElementById('instructions');
  ASSERT(instructionsElement);

  if (mysteryWord === undefined) {
    mysteryWord = remainingWords[Math.floor(remainingWords.length * Math.random())];
  }
  instructionsElement.innerText = `You lost, the word was '${mysteryWord}'`;
}

function handleWin() {
  for (const letter of ALL_LETTERS) {
    const letterElement = document.getElementById('letter-' + letter);
    ASSERT(letterElement);

    letterElement.classList.add('chosen');
  }

  const instructionsElement = document.getElementById('instructions');
  ASSERT(instructionsElement);

  instructionsElement.innerText = 'You won!';
}

function makeGuess(letter: string): boolean {
  const letterIndex = remainingLetters.findIndex((x) => x === letter);
  remainingLetters.splice(letterIndex, 1);
  guessedLetters.push(letter);

  // console.log('make guess', letter);
  if (mysteryWord !== undefined) {
    let hintWord = '';
    let isFound = true;
    for (let i = 0; i < mysteryWord.length; ++i) {
      if (guessedLetters.includes(mysteryWord[i])) {
        hintWord += mysteryWord[i].toUpperCase();
      } else {
        isFound = false;
        hintWord += '_';
      }

      const guessElement = document.getElementById('word');
      ASSERT(guessElement !== null);
      guessElement.innerText = hintWord;
    }

    if (isFound) {
      handleWin();
      return true;
    }

    return mysteryWord.includes(letter);
  } else {
    remainingWords = remainingWords.filter((x) => {
      return !x.includes(letter);
    });
    // console.log('now', remainingWords.length, 'words left');
    // console.log(remainingWords);
    // console.log(remainingLetters.length, 'letters left');

    /*
        const shouldPin = remainingLetters.some((letter) => {
            return !remainingWords.some((word) => {
                return !word.includes(letter);
            });
        });
        */
    let shouldPin = false;
    for (const letter of remainingLetters) {
      const temp = remainingWords.filter((x) => {
        return !x.includes(letter);
      });
      if (temp.length == 0) {
        shouldPin = true;
        break;
      }
    }

    if (shouldPin) {
      mysteryWord = remainingWords[Math.floor(remainingWords.length * Math.random())];
      // console.log('pinning word as', mysteryWord);

      return mysteryWord.includes(letter);
    } else {
      return false;
    }
  }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext('2d');
ASSERT(ctx !== null);
ctx.lineCap = 'round';
ctx.lineWidth = 3;
ctx.strokeStyle = 'white';
ctx.translate(canvas.width / 2, canvas.height / 2);

let drawIndex = 0;
function drawNextLine() {
  ASSERT(ctx !== null);
  switch (drawIndex) {
    case 0: {
      ctx.beginPath();
      ctx.moveTo(-100, 180);
      ctx.lineTo(100, 180);
      ctx.stroke();
      break;
    }
    case 1: {
      ctx.beginPath();
      ctx.moveTo(-100, 180);
      ctx.lineTo(-100, -180);
      ctx.stroke();
      break;
    }
    case 2: {
      ctx.beginPath();
      ctx.moveTo(-100, -180);
      ctx.lineTo(100, -180);
      ctx.stroke();
      break;
    }
    case 3: {
      ctx.beginPath();
      ctx.moveTo(0, -180);
      ctx.lineTo(0, -100);
      ctx.stroke();
      break;
    }
    case 4: {
      ctx.beginPath();
      ctx.arc(0, -80, 20, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }
    case 5: {
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, 40);
      ctx.stroke();
      break;
    }
    case 6: {
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(40, -10);
      ctx.stroke();
      break;
    }
    case 7: {
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(-40, -10);
      ctx.stroke();
      break;
    }
    case 8: {
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(-40, 90);
      ctx.stroke();
      break;
    }
    case 9: {
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(40, 90);
      ctx.stroke();
      break;
    }
  }
  ++drawIndex;
}

function reset() {
  const instructionsElement = document.getElementById('instructions');
  ASSERT(instructionsElement);
  instructionsElement.innerText = 'Choose a letter:';

  wrongGuesses = 0;
  remainingWords = ALL_WORDS.slice().filter((x) => x.length == LENGTH);
  remainingLetters = ALL_LETTERS.slice();
  drawIndex = 0;
  ctx?.resetTransform();
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx?.translate(canvas.width / 2, canvas.height / 2);

  mysteryWord = undefined;
  guessedLetters = [];

  for (const letter of ALL_LETTERS) {
    const letterElement = document.getElementById('letter-' + letter);
    ASSERT(letterElement);

    letterElement.classList.remove('chosen');
    letterElement.classList.remove('good');
    letterElement.classList.remove('bad');
  }

  const guessElement = document.getElementById('word');
  ASSERT(guessElement !== null);

  guessElement.innerText = '_'.repeat(6);
}

document.getElementById('reset')?.addEventListener('click', () => {
  reset();
});

init();
