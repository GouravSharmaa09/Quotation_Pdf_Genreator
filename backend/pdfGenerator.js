import puppeteer from 'puppeteer';
import { generateTemplate } from './templateGenerator.js';

/**
 * Generates a PDF from the provided form data
 * @param {Object} formData - The form data for the quotation
 * @returns {Promise<Buffer>} - A promise that resolves to the PDF buffer
 */
export async function generatePDF(formData) {
  try {
    // Generate HTML from template
    const html = generateTemplate(formData);
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
       executablePath: '/usr/bin/chromium', // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set content to our HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0' // Wait until the network is idle
    });
    
    // Generate PDF with print-friendly settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });
    
    // Close the browser
    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
}
