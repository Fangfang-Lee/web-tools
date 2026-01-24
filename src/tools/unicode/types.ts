// Unicode工具类型定义

export type UnicodeFormat = 'escape' | 'escape-ext' | 'plus' | 'decimal';

export interface UnicodeEncodeOptions {
  format: UnicodeFormat;
  prefix: boolean; // 是否包含前缀
}

export interface UnicodeDecodeResult {
  text: string;
  codes: number[];
  format: UnicodeFormat;
}

export interface CharInfo {
  char: string;
  codePoint: number;
  name: string;
  category: string;
}
