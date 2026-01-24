// 时间戳工具类型定义

export type TimestampUnit = 'seconds' | 'milliseconds';

export interface TimestampFormatOptions {
  format: 'iso' | 'local';
  timezone: string; // 'UTC', 'Asia/Shanghai'
}

export interface TimestampResult {
  timestamp: number;
  formatted: string;
  timezone: string;
  unit: TimestampUnit;
}
