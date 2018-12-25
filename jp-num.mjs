const jpNumChars = [
  {kanji: '〇', num: 0},
  {kanji: '一', num: 1},
  {kanji: '二', num: 2},
  {kanji: '三', num: 3},
  {kanji: '四', num: 4},
  {kanji: '五', num: 5},
  {kanji: '六', num: 6},
  {kanji: '七', num: 7},
  {kanji: '八', num: 8},
  {kanji: '九', num: 9},
];

const jpNumUnitChars = [
  {kanji: '十', num: 10},
  {kanji: '百', num: 100},
  {kanji: '千', num: 1000},
  {kanji: '万', num: 10000},
  {kanji: '億', num: 100000000},
];

const isJpNumChar = char =>
  jpNumChars.findIndex(jpNumChar => char === jpNumChar.kanji) > -1;

const isJpNumUnitChar = char =>
  jpNumUnitChars.findIndex(unit => unit.kanji === char) > -1;

export const parseJpNum = input => {
  let pos = 0;
  const tokens = input.split('').reverse();

  const unexpectedTokenError = () =>
    new Error(`unexpected token ${tokens[pos]} (pos: ${pos})`);

  const parseJpNumUnitChar = () => {
    const unit = jpNumUnitChars.find(unit => unit.kanji === tokens[pos]);
    if (unit === undefined) {
      throw unexpectedTokenError();
    }

    pos++;
    return {
      ...unit,
      type: 'jpNumUnitChar',
    };
  };

  const parseJpNumChar = () => {
    const jpNumChar = jpNumChars.find(
      jpNumChar => jpNumChar.kanji === tokens[pos],
    );
    if (jpNumChar === undefined) {
      throw unexpectedTokenError();
    }

    pos++;
    return {
      ...jpNumChar,
      type: 'jpNumChar',
    };
  };

  const parse = () => {
    if (isJpNumChar(tokens[pos])) {
      const { num } = parseJpNumChar();
      return pos >= tokens.length ? num : num + parse();
    } else if (isJpNumUnitChar(tokens[pos])) {
      const unit = parseJpNumUnitChar();
      const tokenBuf = [];
      while (pos < tokens.length) {
        if (isJpNumChar(tokens[pos])) {
          tokenBuf.push(parseJpNumChar());
        } else if (isJpNumUnitChar(tokens[pos])) {
          const nextUnit = parseJpNumUnitChar();
          if (nextUnit.num > unit.num) {
            pos--;
            break;
          }

          tokenBuf.push(nextUnit);
        }
      }
      
      const jpNum = tokenBuf.map(tok => tok.kanji).reverse().join('');
      if (pos >= tokens.length) {
        return tokenBuf.length > 0 ? parseJpNum(jpNum) * unit.num : unit.num;
      } else {
        return tokenBuf.length > 0
          ? parseJpNum(jpNum) * unit.num + parse()
          : unit.num + parse();
      }
    }

    throw unexpectedTokenError();
  };

  return parse();
};
