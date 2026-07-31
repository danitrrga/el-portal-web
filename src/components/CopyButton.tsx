"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      data-copied={copied}
      className="group absolute top-2 right-2 inline-flex size-11 md:size-7 items-center justify-center rounded-md border border-zinc-800/60 bg-zinc-900/70 text-zinc-400 backdrop-blur transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100 active:scale-95 data-[copied=true]:border-emerald-500/30 data-[copied=true]:text-emerald-400"
    >
      <span className="relative block h-3.5 w-3.5">
        <Copy
          className="absolute inset-0 h-3.5 w-3.5 transition-all duration-200 ease-out group-data-[copied=true]:scale-50 group-data-[copied=true]:opacity-0 group-data-[copied=true]:-rotate-45"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <Check
          className="absolute inset-0 h-3.5 w-3.5 scale-50 rotate-45 opacity-0 transition-all duration-200 ease-out group-data-[copied=true]:scale-100 group-data-[copied=true]:rotate-0 group-data-[copied=true]:opacity-100"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
