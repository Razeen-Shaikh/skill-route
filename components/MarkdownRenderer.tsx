"use client";

import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables tables, strikethrough, and lists
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none text-muted-foreground">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-3">{children}</h3>
          ),
          p: ({ children }) => <p className="text-gray-500 mt-2">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => <li className="ml-4">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <table className="table-auto border-collapse w-full">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border px-4 py-2 bg-gray-200">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border px-4 py-2">{children}</td>
          ),

          // ✅ Fix: Detect Inline vs Block Code Properly
          code({ className, children }) {
            const isBlockCode = className && className.startsWith("language-");

            if (!isBlockCode) {
              // Inline Code Styling
              return (
                <code className="bg-gray-200 text-red-600 px-1 py-0.5 rounded text-sm">
                  {String(children)}
                </code>
              );
            }

            // Block Code Styling with Syntax Highlighting
            const language = className.replace("language-", "") || "text";
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-lg overflow-hidden"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
