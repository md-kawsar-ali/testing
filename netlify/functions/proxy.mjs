// src/functions/proxy.js

import puppeteer from 'puppeteer';

exports.handler = async function (event, context) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.amway.com/en_US/XS%E2%84%A2-Muscle-Multiplier---Berry-Blast-p-126753?utm_source=copy&utm_medium=sharebar&utm_campaign=us_en_3763670_9875642');

        // Wait for some time to ensure dynamic content is loaded (adjust as needed)
        await page.waitForTimeout(5000);

        // Extract the HTML content after it has been fully loaded
        const htmlContent = await page.content();

        await browser.close();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://darling-elf-017308.netlify.app',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Content-Type': 'text/html',
            },
            body: htmlContent,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching content' }),
        };
    }
};
