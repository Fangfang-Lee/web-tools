import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { TimestampUnit, TimestampFormatOptions, TimestampResult } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 时间戳转日期
 * @param timestamp - 时间戳
 * @param unit - 时间戳单位
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export function timestampToDate(
  timestamp: number,
  unit: TimestampUnit,
  options: TimestampFormatOptions
): TimestampResult {
  const timestampMs = unit === 'seconds' ? timestamp * 1000 : timestamp;
  const date = dayjs(timestampMs).tz(options.timezone);

  let formatted: string;
  if (options.format === 'iso') {
    formatted = date.toISOString();
  } else {
    formatted = date.format('YYYY-MM-DD HH:mm:ss');
  }

  return {
    timestamp,
    formatted,
    timezone: options.timezone,
    unit,
  };
}

/**
 * 日期转时间戳
 * @param dateString - 日期字符串
 * @param unit - 输出时间戳单位
 * @returns 时间戳
 */
export function dateToTimestamp(dateString: string, unit: TimestampUnit): number {
  const date = dayjs(dateString);
  if (!date.isValid()) {
    throw new Error('无效的日期格式');
  }

  const timestampMs = date.valueOf();
  return unit === 'seconds' ? Math.floor(timestampMs / 1000) : timestampMs;
}

/**
 * 获取当前时间戳
 * @param unit - 时间戳单位
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(unit: TimestampUnit): number {
  const now = Date.now();
  return unit === 'seconds' ? Math.floor(now / 1000) : now;
}

/**
 * 检测时间戳格式（秒级/毫秒级）
 * @param timestamp - 时间戳
 * @returns 时间戳单位
 */
export function detectTimestampUnit(timestamp: number): TimestampUnit {
  // 如果时间戳小于等于10位数字，认为是秒级
  // 如果时间戳大于10位数字，认为是毫秒级
  const timestampStr = timestamp.toString();
  if (timestampStr.length <= 10) {
    return 'seconds';
  }
  return 'milliseconds';
}

/**
 * 格式化日期时间字符串（用于输入）
 * @param date - dayjs对象
 * @returns 格式化的日期时间字符串
 */
export function formatDateTimeInput(date: dayjs.Dayjs): string {
  return date.format('YYYY-MM-DDTHH:mm');
}
