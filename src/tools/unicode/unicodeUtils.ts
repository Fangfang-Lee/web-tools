import type { UnicodeFormat, UnicodeEncodeOptions, UnicodeDecodeResult, CharInfo } from './types';

/**
 * Unicode编码
 * @param text - 文本
 * @param options - 编码选项
 * @returns 编码后的字符串
 */
export function encodeUnicode(text: string, options: UnicodeEncodeOptions): string {
  if (!text) {
    return '';
  }

  const codes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    if (codePoint !== undefined) {
      codes.push(codePoint);
      // 如果是代理对，跳过下一个字符
      if (codePoint > 0xffff) {
        i++;
      }
    }
  }

  return codes
    .map((code) => {
      switch (options.format) {
        case 'escape':
          return `\\u${code.toString(16).padStart(4, '0').toUpperCase()}`;
        case 'escape-ext':
          return `\\u{${code.toString(16).toUpperCase()}}`;
        case 'plus':
          return `U+${code.toString(16).padStart(4, '0').toUpperCase()}`;
        case 'decimal':
          return code.toString();
        default:
          return '';
      }
    })
    .join(options.format === 'plus' || options.format === 'decimal' ? ' ' : '');
}

/**
 * Unicode解码
 * @param encodedString - 编码字符串
 * @returns 解码结果
 */
export function decodeUnicode(encodedString: string): UnicodeDecodeResult {
  if (!encodedString.trim()) {
    return {
      text: '',
      codes: [],
      format: 'escape',
    };
  }

  // 检测格式
  const format = detectUnicodeFormat(encodedString);
  if (!format) {
    throw new Error('无法识别Unicode编码格式');
  }

  let text = '';
  const codes: number[] = [];

  try {
    switch (format) {
      case 'escape': {
        // \uXXXX格式
        const regex = /\\u([0-9a-fA-F]{4})/g;
        let match;
        while ((match = regex.exec(encodedString)) !== null) {
          const code = parseInt(match[1], 16);
          codes.push(code);
          text += String.fromCodePoint(code);
        }
        break;
      }
      case 'escape-ext': {
        // \u{XXXXXX}格式
        const regex = /\\u\{([0-9a-fA-F]+)\}/g;
        let match;
        while ((match = regex.exec(encodedString)) !== null) {
          const code = parseInt(match[1], 16);
          codes.push(code);
          text += String.fromCodePoint(code);
        }
        break;
      }
      case 'plus': {
        // U+XXXX格式
        const regex = /U\+([0-9a-fA-F]{4,6})/gi;
        let match;
        while ((match = regex.exec(encodedString)) !== null) {
          const code = parseInt(match[1], 16);
          codes.push(code);
          text += String.fromCodePoint(code);
        }
        break;
      }
      case 'decimal': {
        // 十进制格式
        const numbers = encodedString
          .split(/\s+/)
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));
        numbers.forEach((code) => {
          codes.push(code);
          text += String.fromCodePoint(code);
        });
        break;
      }
    }
  } catch (error) {
    throw new Error('Unicode解码失败，请检查编码格式');
  }

  return {
    text,
    codes,
    format,
  };
}

/**
 * 获取字符信息
 * @param char - 字符
 * @returns 字符信息
 */
export function getCharInfo(char: string): CharInfo | null {
  if (!char || char.length === 0) {
    return null;
  }

  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) {
    return null;
  }

  // 获取字符名称（简化版，实际可以使用更完整的Unicode数据库）
  let name = '';
  let category = '';

  // 基本分类判断
  if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
    category = 'CJK统一表意文字';
    name = `CJK UNIFIED IDEOGRAPH-${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
  } else if (codePoint >= 0x3400 && codePoint <= 0x4dbf) {
    category = 'CJK扩展A';
    name = `CJK EXTENSION A-${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
  } else if (codePoint >= 0x20000 && codePoint <= 0x2a6df) {
    category = 'CJK扩展B';
    name = `CJK EXTENSION B-${codePoint.toString(16).toUpperCase().padStart(5, '0')}`;
  } else if (codePoint >= 0x1f300 && codePoint <= 0x1f9ff) {
    category = '表情符号';
    name = 'EMOJI';
  } else if (codePoint >= 0x0000 && codePoint <= 0x007f) {
    category = 'ASCII';
    name = `ASCII-${codePoint.toString(16).toUpperCase().padStart(2, '0')}`;
  } else {
    category = '其他';
    name = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
  }

  return {
    char,
    codePoint,
    name,
    category,
  };
}

/**
 * 检测Unicode格式
 * @param text - 文本
 * @returns 检测到的格式
 */
export function detectUnicodeFormat(text: string): UnicodeFormat | null {
  if (!text.trim()) {
    return null;
  }

  // 检测 \u{XXXXXX} 格式
  if (/\\u\{[0-9a-fA-F]+\}/.test(text)) {
    return 'escape-ext';
  }

  // 检测 \uXXXX 格式
  if (/\\u[0-9a-fA-F]{4}/.test(text)) {
    return 'escape';
  }

  // 检测 U+XXXX 格式
  if (/U\+[0-9a-fA-F]{4,6}/i.test(text)) {
    return 'plus';
  }

  // 检测十进制格式（纯数字，用空格分隔）
  if (/^\d+(\s+\d+)*$/.test(text.trim())) {
    return 'decimal';
  }

  return null;
}
