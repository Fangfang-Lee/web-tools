import { format } from 'sql-formatter';
import type { SqlFormatterOptions } from './types';

/**
 * 格式化SQL
 * @param sqlString - SQL字符串
 * @param options - 格式化选项
 * @returns 格式化后的SQL字符串
 */
export function formatSql(sqlString: string, options: SqlFormatterOptions): string {
  if (!sqlString.trim()) {
    return '';
  }

  try {
    const formatted = format(sqlString, {
      language: options.dialect === 'sql' ? undefined : options.dialect,
      keywordCase: options.keywordCase === 'upper' ? 'upper' : 'lower',
      indentStyle: 'standard',
      tabWidth: options.indent,
    });

    return formatted;
  } catch (error) {
    // 如果格式化失败，返回原字符串
    throw new Error('SQL格式化失败，请检查SQL语法');
  }
}

/**
 * 压缩SQL
 * @param sqlString - SQL字符串
 * @returns 压缩后的SQL字符串
 */
export function compactSql(sqlString: string): string {
  if (!sqlString.trim()) {
    return '';
  }

  try {
    // 移除多余的空格和换行，但保留必要的空格
    return sqlString
      .replace(/\s+/g, ' ') // 多个空格替换为单个空格
      .replace(/\s*\(\s*/g, '(') // 括号前后空格
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*,\s*/g, ', ') // 逗号后保留一个空格
      .replace(/\s*;\s*/g, ';') // 分号前后空格
      .trim();
  } catch (error) {
    throw new Error('SQL压缩失败');
  }
}
