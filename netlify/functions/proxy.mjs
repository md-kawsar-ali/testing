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

// proxy.js

import axios from 'axios';

exports.handler = async function (event, context) {
    try {
        // Fetch the entire HTML content including headers
        const response = await axios.get('https://allthewheyup.com', { responseType: 'arraybuffer' });

        // Set the headers of the original response to the current response
        const headers = response.headers;
        Object.keys(headers).forEach((key) => {
            context.headers[key] = headers[key];
        });

        // Return the HTML content as a buffer
        return {
            statusCode: 200,
            body: response.data.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error fetching content',
        };
    }
};
