import { useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';

/**
 * 剪贴板Hook
 * @returns { copied: boolean, copy: (text: string) => Promise<void> }
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return { copied, copy };
}
