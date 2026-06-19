import puppeteer from 'puppeteer';
import fs from 'fs';

export class PdfRendererService {
  /**
   * Renders HTML content into a PDF buffer using Puppeteer.
   */
  static async renderHtmlToPdf(html: string): Promise<Buffer> {
    const launchOptions: any = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    };

    // If on Linux/Render, use @sparticuz/chromium
    if (process.platform !== 'win32') {
      try {
        const chromium = require('@sparticuz/chromium');
        launchOptions.executablePath = await chromium.executablePath();
        launchOptions.args = [...chromium.args, ...launchOptions.args];
      } catch (e) {
        console.warn("Failed to configure @sparticuz/chromium, falling back to default launch", e);
      }
    }

    try {
      const browser = await puppeteer.launch(launchOptions);
      return await this._generate(browser, html);
    } catch (e) {
      console.warn("Bundled Chromium failed to launch, trying system Chrome paths...", e);
      
      const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/chrome'
      ];
      
      let executablePath = null;
      for (const p of paths) {
        if (fs.existsSync(p)) {
          executablePath = p;
          break;
        }
      }

      if (!executablePath) {
        throw new Error("No valid Chrome/Edge installation found for PDF rendering.");
      }

      launchOptions.executablePath = executablePath;
      const browser = await puppeteer.launch(launchOptions);
      return await this._generate(browser, html);
    }
  }

  private static async _generate(browser: any, html: string): Promise<Buffer> {

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
