// 常量定义

export const MAX_TEXT_LENGTH = 10 * 1024 * 1024; // 10MB

export const DEFAULT_INDENT = 2;

export const SUPPORTED_TIMEZONES = ['UTC', 'Asia/Shanghai', 'America/New_York', 'Europe/London'];

export const SQL_DIALECTS = ['mysql', 'postgresql', 'sql', 'mssql', 'oracle', 'sqlite'] as const;

export type SqlDialect = typeof SQL_DIALECTS[number];
