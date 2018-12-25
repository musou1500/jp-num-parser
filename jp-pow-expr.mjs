import { parseJpNum } from './jp-num';

export const parseJpPowExpr = input => {
  const unexpectedTokenError = () =>
    new Error(`unexpected token ${tokens[pos]} (pos: ${pos})`);

  const parseJpNum = () => {
    return {type: 'jpNum', val: tokens[pos++]};
  };

  const parsePowSpec = base => {
    if (tokens[pos] !== 'の') {
      return base;
    }
    pos++;
    const spec = parsePowSpec(parseJpNum());
    if (tokens[pos] !== '乗') {
      throw unexpectedTokenError();
    }
    pos++;

    const pow = {
      type: 'pow',
      base,
      spec,
    };
    if (tokens[pos] === 'の') {
      return parsePowSpec(pow);
    } else {
      return pow;
    }
  };

  const parse = () => {
    const jpNum = parseJpNum();
    if (tokens[pos] !== 'の') {
      return jpNum;
    }

    return parsePowSpec(jpNum);
  };

  const tokens = input.split(/(の|乗)/).filter(s => !!s);
  let pos = 0;
  return parse(input);
};

export const evaluate = node => {
  switch (node.type) {
    case 'pow':
      return Math.pow(evaluate(node.base), evaluate(node.spec));
    default:
      return parseJpNum(node.val);
  }
};
