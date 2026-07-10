const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, '../code.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(htmlContent);

// 1. Add AOS CSS to head if not present
if (!$('link[href*="aos.css"]').length) {
    $('head').append('<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n');
}

// 2. Add AOS JS and init script to end of body if not present
if (!$('script[src*="aos.js"]').length) {
    $('body').append('<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n');
    $('body').append(`<script>
        document.addEventListener("DOMContentLoaded", function() {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 50
            });
        });
    </script>\n`);
}

// 3. Add data-aos attributes

// Hero Section (h1, p, buttons)
$('#home h1').attr('data-aos', 'fade-up');
$('#home p').attr('data-aos', 'fade-up').attr('data-aos-delay', '100');
$('#home .flex.gap-4').attr('data-aos', 'fade-up').attr('data-aos-delay', '200');

// Section headers (h2)
$('section h2').each((i, el) => {
    $(el).attr('data-aos', 'fade-up');
});

// Section paragraphs below h2
$('section h2 + p').each((i, el) => {
    $(el).attr('data-aos', 'fade-up').attr('data-aos-delay', '100');
});

// Services grid items
$('#services .grid > div').each((i, el) => {
    $(el).attr('data-aos', 'fade-up').attr('data-aos-delay', (i * 100).toString());
});

// About section items
$('#about .grid > div').each((i, el) => {
    $(el).attr('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
});

// Testimonials
$('#testimonials .grid > div').each((i, el) => {
    $(el).attr('data-aos', 'fade-up').attr('data-aos-delay', (i * 100).toString());
});

// FAQ items
$('#faqs .space-y-4 > div').each((i, el) => {
    $(el).attr('data-aos', 'fade-up').attr('data-aos-delay', (i * 50).toString());
});

// Contact section
$('#contact .grid > div:first-child').attr('data-aos', 'fade-right');
$('#contact .grid > div:last-child').attr('data-aos', 'fade-left');

// Careers section
$('#careers .lg\\:w-1\\/2:first-child').attr('data-aos', 'fade-right');
$('#careers .lg\\:w-1\\/2:last-child').attr('data-aos', 'fade-left');

// Navbar logo & links
$('nav > div > div:first-child').attr('data-aos', 'fade-down');
$('nav > div > div:nth-child(2)').attr('data-aos', 'fade-down').attr('data-aos-delay', '100');
$('nav > div > div:last-child').attr('data-aos', 'fade-down').attr('data-aos-delay', '200');

// Save the modified HTML
fs.writeFileSync(htmlPath, $.html());
console.log('Successfully added AOS animations to code.html!');
