'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

type CopyCommandBlockProps = {
  /** 要复制到剪贴板的完整命令 */
  command: string;
};

/**
 * 命令行 + 复制按钮（客户端交互）
 */
export function CopyCommandBlock({ command }: CopyCommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级：execCommand（部分环境 clipboard API 不可用）
      try {
        const ta = document.createElement('textarea');
        ta.value = command;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        // 静默失败，避免打断页面
      }
    }
  }, [command]);

  return (
    <div className="inline-flex w-fit max-w-full min-w-0 items-center gap-2 rounded-md border border-fd-border bg-fd-card px-3 py-2">
      {/* w-fit：宽度随命令变长；max-w-full：不超出父容器；超长时横向滚动 */}
      <code className="min-w-0 max-w-full overflow-x-auto whitespace-pre text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center justify-center rounded border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
        aria-label={copied ? 'Copied' : 'Copy command'}
        title={copied ? 'Copied' : 'Copy'}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
