'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

type CopyCommandBlockProps = {
  /** 要复制到剪贴板的完整文本（命令、JSON 等） */
  text: string;
};

/**
 * 可复制文本块 + 复制按钮（客户端交互）
 */
export function CopyCommandBlock({ text }: CopyCommandBlockProps) {
  const [copied, setCopied] = useState(false);
  // 单行命令与按钮垂直居中；多行 JSON 顶对齐，按钮与首行对齐
  const multiline = text.includes('\n');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级：execCommand（部分环境 clipboard API 不可用）
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
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
  }, [text]);

  return (
    <div
      className={`inline-flex w-fit max-w-full min-w-0 gap-2 rounded-md border border-fd-border bg-fd-card px-3 py-2 ${multiline ? 'items-start' : 'items-center'}`}
    >
      {/* w-fit：宽度随内容；max-w-full：不超出父容器；多行/过长时横向滚动 */}
      <code
        className={`min-w-0 max-w-full overflow-x-auto whitespace-pre font-mono text-sm ${multiline ? 'leading-relaxed' : ''}`}
      >
        {text}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex shrink-0 items-center justify-center rounded border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground ${multiline ? 'mt-0.5' : ''}`}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        title={copied ? 'Copied' : 'Copy'}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
