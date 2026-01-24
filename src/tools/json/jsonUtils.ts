import type { JsonFormatterOptions, JsonParseResult } from './types';

/**
 * 格式化JSON字符串
 * @param jsonString - JSON字符串
 * @param options - 格式化选项
 * @returns 格式化后的JSON字符串
 */
export function formatJson(jsonString: string, options: JsonFormatterOptions): string {
  if (!jsonString.trim()) {
    return '';
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (options.compact) {
      return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, options.indent);
  } catch (error) {
    throw error;
  }
}

/**
 * 解析JSON字符串
 * @param jsonString - JSON字符串
 * @returns 解析结果
 */
export function parseJson(jsonString: string): JsonParseResult {
  if (!jsonString.trim()) {
    return {
      success: true,
      data: null,
    };
  }

  try {
    const data = JSON.parse(jsonString);
    return {
      success: true,
      data,
    };
  } catch (error) {
    const err = error as Error;
    const message = err.message || 'JSON解析失败';
    
    // 尝试提取错误位置信息
    const positionMatch = message.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : undefined;
    
    // 计算行号和列号
    let line = 1;
    let column = 1;
    if (position !== undefined) {
      const beforeError = jsonString.substring(0, position);
      const lines = beforeError.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      success: false,
      error: {
        message,
        position,
        line,
        column,
      },
    };
  }
}

/**
 * 验证JSON格式
 * @param jsonString - JSON字符串
 * @returns 是否有效
 */
export function validateJson(jsonString: string): boolean {
  if (!jsonString.trim()) {
    return true; // 空字符串视为有效
  }

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * 压缩JSON
 * @param jsonString - JSON字符串
 * @returns 压缩后的JSON字符串
 */
export function compactJson(jsonString: string): string {
  if (!jsonString.trim()) {
    return '';
  }

  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw error;
  }
}
