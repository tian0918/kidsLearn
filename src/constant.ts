import { PinyinCategory } from "./types";
export const PINYIN_DATA: Record<PinyinCategory, string[]> = {
  [PinyinCategory.SHENGMU]: [
    'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 
    'g', 'k', 'h', 'j', 'q', 'x', 
    'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
  ],
  [PinyinCategory.YUNMU]: [
    'a', 'o', 'e', 'i', 'u', 'ü', 
    'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 
    'ie', 'üe', 'er', 'an', 'en', 'in', 
    'un', 'ün', 'ang', 'eng', 'ing', 'ong'
  ],
  [PinyinCategory.ZHENGTI]: [
    'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 
    'yi', 'wu', 'yu', 'ye', 'yue', 'yuan', 
    'yin', 'yun', 'ying'
  ]
};

export const ALPHABET_DATA: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
type LanguageStrings = {
  en: string;
  zh: string;
  story?: string
};

export const MONTH_DATA: LanguageStrings[] = [
  {en:'January',zh:'一月'},
  {en:'February',zh:'二月'},
  {en:'March',zh:'三月'},
  {en:'April',zh:'四月'},
  {en:'May',zh:'五月'},
  {en:'June',zh:'六月'},
  {en:'July',zh:'七月'},
  {en:'August',zh:'八月'},
  {en:'September',zh:'九月'},
  {en:'October',zh:'十月'},
  {en:'November',zh:'十一月'},
  {en:'December',zh:'十二月'},
];
export const WEEK_DATA: LanguageStrings[] = [
  {en:'Monday',zh:'星期一'},
  {en:'Tuesday',zh:'星期二'},
  {en:'Wednesday',zh:'星期三'},
  {en:'Thursday',zh:'星期四'},
  {en:'Friday',zh:'星期五'},
  {en:'Saturday',zh:'星期六'},
  {en:'Sunday',zh:'星期天'},
]