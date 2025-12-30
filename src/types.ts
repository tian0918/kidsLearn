export enum AppMode {
  LANDING = 'LANDING',
  HOME = 'HOME',
  PINYIN = 'PINYIN',
  ALPHABET = 'ALPHABET',
  MATH = 'MATH',
  SETTINGS = 'SETTINGS'
}

export type Language = 'en-US' | 'zh-CN';

export enum PinyinCategory {
  SHENGMU = '声母',
  YUNMU = '韵母',
  ZHENGTI = '整体认读'
}
export enum GuWenCategory {
  QZW = '千字文',
  BJX = '百家姓',
  SZJ = '三字经'
}

export interface CardData {
  char: string;
  category?: string;
}

export interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export interface ExplanationResponse {
  text: string;
  emoji: string;
}