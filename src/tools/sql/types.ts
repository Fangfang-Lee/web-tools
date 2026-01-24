// SQL工具类型定义

import type { SqlDialect } from '@/utils/constants';

export interface SqlFormatterOptions {
  dialect: SqlDialect;
  keywordCase: 'upper' | 'lower';
  indent: number;
  compact: boolean;
}
