import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  detectTimestampUnit,
  formatDateTimeInput,
} from './timestampUtils';
import type { TimestampUnit, TimestampFormatOptions } from './types';
import { SUPPORTED_TIMEZONES } from '@/utils/constants';

export const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState(formatDateTimeInput(dayjs()));
  const [currentTimestamp, setCurrentTimestamp] = useState(getCurrentTimestamp('seconds'));
  const [options, setOptions] = useState<TimestampFormatOptions>({
    format: 'local',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai',
  });
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>('seconds');
  const [outputDate, setOutputDate] = useState('');
  const [outputTimestamp, setOutputTimestamp] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 实时更新当前时间戳
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(getCurrentTimestamp('seconds'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 时间戳转日期
  const handleTimestampToDate = useCallback(() => {
    setError(null);
    try {
      const ts = parseFloat(timestamp);
      if (isNaN(ts)) {
        setError('请输入有效的时间戳');
        return;
      }

      const detectedUnit = detectTimestampUnit(ts);
      const result = timestampToDate(ts, detectedUnit, options);
      setOutputDate(result.formatted);
      setTimestampUnit(detectedUnit);
    } catch (err) {
      const message = err instanceof Error ? err.message : '转换失败';
      setError(message);
      setOutputDate('');
    }
  }, [timestamp, options]);

  // 日期转时间戳
  const handleDateToTimestamp = useCallback(() => {
    setError(null);
    try {
      const ts = dateToTimestamp(date, timestampUnit);
      setOutputTimestamp(ts.toString());
    } catch (err) {
      const message = err instanceof Error ? err.message : '转换失败';
      setError(message);
      setOutputTimestamp('');
    }
  }, [date, timestampUnit]);

  // 使用当前时间
  const handleUseCurrentTime = useCallback(() => {
    const now = dayjs();
    setDate(formatDateTimeInput(now));
    setTimestamp(getCurrentTimestamp('seconds').toString());
    setError(null);
  }, []);

  // 清空
  const handleClear = useCallback(() => {
    setTimestamp('');
    setDate(formatDateTimeInput(dayjs()));
    setOutputDate('');
    setOutputTimestamp('');
    setError(null);
  }, []);

  // 时间戳输入变化
  useEffect(() => {
    if (timestamp.trim()) {
      handleTimestampToDate();
    } else {
      setOutputDate('');
    }
  }, [timestamp, options, handleTimestampToDate]);

  // 日期输入变化
  useEffect(() => {
    if (date.trim()) {
      handleDateToTimestamp();
    } else {
      setOutputTimestamp('');
    }
  }, [date, timestampUnit, handleDateToTimestamp]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">时间戳转换</h1>
        <p className="text-gray-600">提供Unix时间戳与可读日期时间之间的相互转换</p>
      </div>

      <div className="card">
        {/* 当前时间戳显示 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">当前时间戳（秒）:</span>
            <span className="text-lg font-mono font-bold text-primary">{currentTimestamp}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button onClick={handleUseCurrentTime} className="btn btn-primary">
            使用当前时间
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            清空
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">时区:</label>
              <select
                value={options.timezone}
                onChange={(e) => setOptions({ ...options, timezone: e.target.value })}
                className="input text-sm w-48"
              >
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">格式:</label>
              <select
                value={options.format}
                onChange={(e) =>
                  setOptions({ ...options, format: e.target.value as 'iso' | 'local' })
                }
                className="input text-sm w-32"
              >
                <option value="local">本地格式</option>
                <option value="iso">ISO 8601</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">时间戳单位:</label>
              <select
                value={timestampUnit}
                onChange={(e) => setTimestampUnit(e.target.value as TimestampUnit)}
                className="input text-sm w-32"
              >
                <option value="seconds">秒级 (10位)</option>
                <option value="milliseconds">毫秒级 (13位)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 时间戳转日期 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">时间戳 → 日期</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">时间戳</label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="请输入时间戳（秒级或毫秒级）"
                className="input font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">日期时间</label>
              <input
                type="text"
                value={outputDate}
                readOnly
                placeholder="转换后的日期时间将显示在这里"
                className="input font-mono bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* 日期转时间戳 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">日期 → 时间戳</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">日期时间</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">时间戳</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outputTimestamp}
                  readOnly
                  placeholder="转换后的时间戳将显示在这里"
                  className="input font-mono bg-gray-50 flex-1"
                />
                <button
                  onClick={() => {
                    if (outputTimestamp) {
                      navigator.clipboard.writeText(outputTimestamp);
                    }
                  }}
                  className="btn btn-primary whitespace-nowrap"
                  disabled={!outputTimestamp}
                >
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
