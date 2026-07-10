const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../code.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Theming replacements for portfolio aesthetic
const replacements = [
    // Change background to Deep Space
    { from: /\bbg-black\b/g, to: 'bg-[#0b080c]' },
    { from: /\bbg-zinc-950\b/g, to: 'bg-[#0b080c]' },
    { from: /\bbg-zinc-900\b/g, to: 'bg-[#151030]' },
    { from: /\bbg-zinc-800\b/g, to: 'bg-[#151030]' },
    { from: /\bborder-zinc-900\b/g, to: 'border-[#151030]' },
    { from: /\bborder-zinc-800\b/g, to: 'border-[#151030]' },
    { from: /\bborder-zinc-700\b/g, to: 'border-[#2d2560]' },

    // Change Royal Blue to Glowing Violet (#915EFF)
    { from: /\bbg-blue-royal\b/g, to: 'bg-[#915EFF]' },
    { from: /\btext-blue-royal\b/g, to: 'text-[#915EFF]' },
    { from: /\bborder-blue-royal\b/g, to: 'border-[#915EFF]' },
    { from: /\bfrom-blue-royal\b/g, to: 'from-[#915EFF]' },
    { from: /\bvia-blue-royal\b/g, to: 'via-[#915EFF]' },
    { from: /\bto-blue-royal\b/g, to: 'to-[#915EFF]' },
    { from: /\bshadow-blue-royal\b/g, to: 'shadow-[#915EFF]' },
    { from: /\bg-blue-royal\/10\b/g, to: 'bg-[#915EFF]/10' },
    { from: /\bbg-blue-royal\/20\b/g, to: 'bg-[#915EFF]/20' },
    { from: /\bborder-blue-royal\/20\b/g, to: 'border-[#915EFF]/20' },
    { from: /\bshadow-blue-royal\/20\b/g, to: 'shadow-[#915EFF]/20' },
    { from: /\bfrom-black\/80\b/g, to: 'from-[#0b080c]/80' },
];

replacements.forEach(({ from, to }) => {
    htmlContent = htmlContent.replace(from, to);
});

// Write it back
fs.writeFileSync(htmlPath, htmlContent);
console.log('Portfolio theme colors applied!');
