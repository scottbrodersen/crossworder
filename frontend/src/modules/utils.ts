import { reactive } from 'vue';

export type Clues = Record<number, string>;

export type Identification = {
  name: string;
  street: string;
  city: string;
  email: string;
};
export class Cell {
  public number: number;
  public value: string;

  constructor() {
    this.number = 0;
    this.value = '';
  }

  setNumber(number: number): void {
    this.number = number;
    this.value = String(this.number);
  }

  setValue(value: string): void {
    this.value = value;
  }
}

export class Grid {
  public grid: Array<Array<Cell>> = [];
  public dimension: number;
  public acrossList: Array<Word> = [];
  public downList: Array<Word> = [];
  public acrossClues: Clues = {};
  public downClues: Clues = {};
  public id: Identification = { name: '', street: '', city: '', email: '' };

  constructor(dimension: number) {
    this.dimension = dimension;
    this.initializeGrid();
    this.generateNumbers();
  }

  initializeGrid() {
    for (let i = 0; i < this.dimension; i++) {
      const row = [];
      for (let col = 0; col < this.dimension; col++) {
        row.push(new Cell());
      }
      this.grid.push(row);
    }
  }

  generateNumbers() {
    let count = 0;
    for (let row = 0; row < this.dimension; row++) {
      for (let col = 0; col < this.dimension; col++) {
        // reset the number
        this.grid[row][col].number = Number('');
        if (row == 0 && this.grid[row][col].value != '#') {
          // top row
          count++;
          this.grid[row][col].number = count;
        } else if (row > 0) {
          // subsequent rows
          if (col == 0) {
            // first column
            if (this.grid[row][col].value != '#') {
              // letter cell
              count++;
              this.grid[row][col].number = count;
            }
          } else if (
            this.grid[row][col].value != '#' &&
            (this.grid[row - 1][col].value == '#' ||
              (col > 0 && this.grid[row][col - 1].value == '#'))
          ) {
            // letter cell, above cell is black or previous cell is black
            count++;
            this.grid[row][col].number = count;
          }
        }
      }
    }
  }

  generateAcrossWords() {
    this.acrossList = [];
    for (const row of this.grid) {
      let done = true;
      let newWord: Word = new Word();
      for (let j = 0; j < row.length; j++) {
        if (row[j].number && done) {
          done = false;
          newWord.number = row[j].number;
          newWord.word += row[j].value;
          continue;
        }
        if (row[j].value != '#') {
          newWord.word += row[j].value;
        } else {
          done = true;
          if (newWord.number) {
            this.acrossList.push(newWord);
            newWord = new Word();
          }
        }
        if (j == row.length - 1) {
          if (newWord.word) {
            this.acrossList.push(newWord);
          }
          done = true;
        }
      }
    }
  }

  generateDownWords() {
    this.downList = [];
    for (let j = 0; j < this.grid[0].length; j++) {
      let done = true;
      let newWord: Word = new Word();
      for (let i = 0; i < this.grid[0].length; i++) {
        if (this.grid[i][j].number && done) {
          done = false;
          newWord.number = this.grid[i][j].number;
          newWord.word += this.grid[i][j].value;
          continue;
        }
        if (this.grid[i][j].value != '#') {
          newWord.word += this.grid[i][j].value;
        } else {
          done = true;
          if (newWord.number) {
            this.downList.push(newWord);
            newWord = new Word();
          }
        }
        if (i == this.grid[0].length - 1) {
          if (newWord.word) {
            this.downList.push(newWord);
          }
          done = true;
        }
      }
    }

    this.downList.sort((a, b) => a.number - b.number);
  }

  generateAcrossClues() {
    for (const word of this.acrossList) {
      // do not overwrite existing clues
      if (!this.acrossClues[word.number]) {
        this.acrossClues[word.number] = '';
      }
    }
    // remove clues that have no corresponding word
    const clueKeys = Object.keys(this.acrossClues);
    for (const key of clueKeys) {
      let found = false;
      for (const word of this.acrossList) {
        if (String(word.number) == key) {
          continue;
        } else {
          found = true;
          break;
        }
      }
      if (!found) {
        // remove from clues
        delete this.acrossClues[Number(key)];
      }
    }
  }

  generateDownClues() {
    for (const word of this.downList) {
      // do not overwrite existing clues
      if (!this.downClues[word.number]) {
        this.downClues[word.number] = '';
      }
    }
    // remove clues that have no corresponding word
    const clueKeys = Object.keys(this.downClues);
    for (const key of clueKeys) {
      let found = false;
      for (const word of this.downList) {
        if (String(word.number) == key) {
          continue;
        } else {
          found = true;
          break;
        }
      }
      if (!found) {
        // remove from clues
        delete this.downClues[Number(key)];
      }
    }
  }

  importText(content: string) {
    const parts: Array<string> = content.split('&\n');

    // grid
    const gridRows: Array<string> = parts[0].split('\n');
    if (gridRows[gridRows.length - 1] == '') {
      gridRows.pop();
    }
    this.dimension = gridRows.length;
    this.grid = [];
    this.initializeGrid();
    for (let r = 0; r < gridRows.length; r++) {
      for (let c = 0; c < gridRows[r].length; c++) {
        if (gridRows[r][c] != '-') {
          this.grid[r][c].setValue(gridRows[r][c]);
        } else {
          continue;
        }
      }
    }

    // across words
    const acrossRows: Array<string> = parts[1].split('\n');
    if (acrossRows[acrossRows.length - 1] == '') {
      acrossRows.pop();
    }
    for (const row of acrossRows) {
      const clueParts: Array<string> = row.split(':');
      this.acrossList.push(new Word(Number(clueParts[0]), clueParts[1]));
      this.acrossClues[Number(clueParts[0])] = clueParts[2];
    }
    // down words
    const downRows: Array<string> = parts[2].split('\n');
    if (downRows[downRows.length - 1] == '') {
      downRows.pop();
    }
    for (const row of downRows) {
      const clueParts: Array<string> = row.split(':');
      this.downList.push(new Word(Number(clueParts[0]), clueParts[1]));
      this.downClues[Number(clueParts[0])] = clueParts[2];
    }

    // identification
    const idRows: Array<string> = parts[3].split('\n');
    this.id.name = idRows[0];
    this.id.street = idRows[1];
    this.id.city = idRows[2];
    this.id.email = idRows[3];
  }

  exportText() {
    let content: string = '';

    // grid
    for (const row of this.grid) {
      for (let i = 0; i < row.length; i++) {
        if (row[i].value) {
          content += row[i].value;
        } else {
          content += '-';
        }
        if (i == row.length - 1) {
          content += '\n';
        }
      }
    }

    content += '&\n';
    // across words and clues
    for (const word of this.acrossList) {
      let line = '';
      line += `${word.number}:${word.word}:${this.acrossClues[word.number]}\n`;
      content += line;
    }
    content += '&\n';

    // down words and clues
    for (const word of this.downList) {
      let line = '';
      line += `${word.number}:${word.word}:${this.downClues[word.number]}\n`;
      content += line;
    }

    content += '&\n';
    // identification
    for (const idPart in this.id) {
      content += `${this.id[idPart as keyof Identification]}\n`;
    }

    // remove the final \n
    content = content.slice(0, -1);

    return content;
  }
}

export class Word {
  public number: number;
  public word: string;
  constructor(num?: number, wrd?: string) {
    this.number = num ? num : 0;
    this.word = wrd ? wrd : '';
  }

  addLetter(letter: string) {
    this.word = this.word + letter;
  }
}

export const toggleDirection = () => {
  state.horizontal = !state.horizontal;
};

export const state = reactive({
  row: 0,
  column: 0,
  horizontal: true,
  wordLength: 0,
  dimension: 0,
  fileName: 'crossworder.txt',
});
