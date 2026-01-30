
import React from 'react';

export const SimpleMarkdown = ({ content }) => {
    if (!content) return null;

    // Helper to process inline styles like **bold**
    const processInline = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} className="font-bold text-white">{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    // Split content by newlines to handle blocks
    const lines = content.split('\n');
    const elements = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Headers
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">
                    {processInline(line.slice(4))}
                </h3>
            );
        } else if (line.startsWith('## ')) {
            elements.push(
                <h2 key={i} className="text-xl font-bold text-white mt-5 mb-3 first:mt-0">
                    {processInline(line.slice(3))}
                </h2>
            );
        }
        // Ordered Lists (1. Item)
        else if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+)\.\s(.*)/);
            if (match) {
                elements.push(
                    <div key={i} className="flex gap-2.5 ml-1 my-1.5">
                        <span className="shrink-0 font-mono text-violet-400 text-xs mt-1">{match[1]}.</span>
                        <span className="text-zinc-300">{processInline(match[2])}</span>
                    </div>
                );
            }
        }
        // Unordered Lists (- Item or * Item)
        else if (/^[-*]\s/.test(line)) {
            elements.push(
                <div key={i} className="flex gap-2.5 ml-1 my-1.5">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-violet-400/50 mt-2" />
                    <span className="text-zinc-300">{processInline(line.slice(2))}</span>
                </div>
            );
        }
        // Blockquotes
        else if (line.startsWith('> ')) {
            elements.push(
                <div key={i} className="border-l-2 border-violet-500/30 pl-4 py-1 my-2 text-zinc-400 italic bg-white/5 rounded-r-lg">
                    {processInline(line.slice(2))}
                </div>
            );
        }
        // Empty lines (spacing)
        else if (!line.trim()) {
            elements.push(<div key={i} className="h-2" />);
        }
        // Regular Paragraphs
        else {
            elements.push(
                <p key={i} className="text-zinc-300 leading-relaxed mb-1">
                    {processInline(line)}
                </p>
            );
        }
    }

    return <div className="space-y-1">{elements}</div>;
};
