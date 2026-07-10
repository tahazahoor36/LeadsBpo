const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, '../code.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(htmlContent);

const cardHoverClasses = 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-royal/20 transition-all duration-300 cursor-pointer';

// Add hover effects to service cards
$('#services .grid > div').addClass(cardHoverClasses);

// Add hover effects to values/about cards
$('#about .grid > div').addClass(cardHoverClasses);

// Add hover effects to testimonial cards
$('#testimonials .grid > div').addClass(cardHoverClasses);

// Add scale to main buttons
$('a.bg-blue-royal, button.bg-blue-royal').addClass('hover:scale-105 transition-transform duration-300');

// Save the modified HTML
fs.writeFileSync(htmlPath, $.html());
console.log('Successfully added hover animations to code.html!');
