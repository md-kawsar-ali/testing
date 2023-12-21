// import axios from 'axios';

// exports.handler = async function (event, context) {
//     try {
//         const response = await axios.get('https://allthewheyup.com');
//         // https://www.amway.com/en_US/XS%E2%84%A2-Muscle-Multiplier---Berry-Blast-p-126753?utm_source=copy&utm_medium=sharebar&utm_campaign=us_en_3763670_9875642
//         return {
//             statusCode: 200,
//             headers: {
//                 'Access-Control-Allow-Origin': 'https://darling-elf-017308.netlify.app',
//                 'Access-Control-Allow-Methods': 'GET, OPTIONS',
//                 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
//             },
//             body: JSON.stringify(response.data),
//         };
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Error fetching content' }),
//         };
//     }
// };

import axios from 'axios';
import cheerio from 'cheerio';

exports.handler = async function (event, context) {
    try {
        // Fetch the content from the external website
        const response = await axios.get('https://allthewheyup.com');

        // Clean up the HTML using cheerio
        const cleanedHTML = cleanUpHTML(response.data);

        // Return the cleaned HTML as the response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Accept',
                'Content-Type': 'text/html'
            },
            body: cleanedHTML
        };
    } catch (error) {
        console.error('Error fetching content:', error);

        // Return an error response
        return {
            statusCode: 500,
            body: 'Error fetching content',
            headers: {
                'Content-Type': 'text/plain',
            },
        };
    }
};

function cleanUpHTML(html) {
    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Get the base URL of the original website
    const baseUrl = 'https://allthewheyup.com'; // Replace with the actual base URL

    // Fix resource paths in the HTML
    $('img').each((index, element) => {
        const src = $(element).attr('src');
        if (src && !src.startsWith('http')) {
            // Update absolute paths
            if (!src.startsWith('/')) {
                $(element).attr('src', baseUrl + '/' + src);
            } else {
                $(element).attr('src', baseUrl + src);
            }
        }
    });

    $('link[rel="stylesheet"]').each((index, element) => {
        const href = $(element).attr('href');
        if (href && !href.startsWith('http')) {
            // Update absolute paths
            if (!href.startsWith('/')) {
                $(element).attr('href', baseUrl + '/' + href);
            } else {
                $(element).attr('href', baseUrl + href);
            }
        }
    });

    // Clean up the HTML as needed
    // For example, remove unnecessary elements, attributes, or whitespace
    // Here, we're removing script tags for demonstration purposes
    $('script').remove();

    // Return the cleaned HTML
    return $.html();
}