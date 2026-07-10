const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../code.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Theming replacements
const replacements = [
    { from: /\bbg-surface\b/g, to: 'bg-black' },
    { from: /\bbg-white\b/g, to: 'bg-zinc-950' },
    { from: /\btext-navy-deep\b/g, to: 'text-white' },
    { from: /\btext-slate-text\b/g, to: 'text-gray-400' },
    { from: /\border-border-subtle\b/g, to: 'border-zinc-800' },
    { from: /\border-white\b/g, to: 'border-black' },
    { from: /\bbg-slate-200\b/g, to: 'bg-zinc-800' },
    { from: /\btext-surface-variant\/70\b/g, to: 'text-gray-400' },
    { from: /\btext-surface-variant\b/g, to: 'text-gray-300' },
    { from: /\bfrom-navy-deep\/20\b/g, to: 'from-black/80' },
    { from: /\bhover:bg-navy-deep\b/g, to: 'hover:bg-zinc-800' },
    { from: /\bbg-gray-50\b/g, to: 'bg-zinc-900' }, // from modal
    { from: /\bbg-gray-500\b/g, to: 'bg-black' }, // from modal backdrop
    { from: /\btext-gray-900\b/g, to: 'text-white' }, // from modal
    { from: /\btext-gray-700\b/g, to: 'text-gray-300' }, // from modal
    { from: /\bbg-gray-200\b/g, to: 'bg-zinc-700' },
    { from: /\bbg-blue-royal\/5\b/g, to: 'bg-blue-royal/10' },
    { from: /\bborder-gray-300\b/g, to: 'border-zinc-700' },
    { from: /\btext-surface\b/g, to: 'text-black' },
    { from: /\bbg-navy-deep\b/g, to: 'bg-zinc-900' },
];

replacements.forEach(({ from, to }) => {
    htmlContent = htmlContent.replace(from, to);
});

// Since the whole site is black now, the section bg colors might need alternating.
// Black and zinc-950 will provide good contrast.

fs.writeFileSync(htmlPath, htmlContent);
console.log('Dark mode applied successfully!');
