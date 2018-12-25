import {parseJpNum} from './jp-num';
import {strictEqual} from 'assert';

const testParseJpNum = () =>
  [
    {input: '一億二千三百四十五万六千七百八十九', expected: 123456789},
    {input: '四千九十六', expected: 4096},
    {input: '十億十', expected: 1000000010},
    {input: '二十六万二千百四十四', expected: 262144},
  ].forEach(({input, expected}) => strictEqual(parseJpNum(input), expected));

testParseJpNum();
console.log('OK');
