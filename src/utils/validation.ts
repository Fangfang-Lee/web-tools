/**
 * 验证文本长度
 * @param text - 文本
 * @param maxLength - 最大长度（字节）
 * @returns 是否有效
 */
export function validateTextLength(text: string, maxLength: number): boolean {
  return new Blob([text]).size <= maxLength;
}

/**
 * 验证文件大小
 * @param size - 文件大小（字节）
 * @param maxSize - 最大大小（字节）
 * @returns 是否有效
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}
