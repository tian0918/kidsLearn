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