// /pages/api/generate-pdf.ts

import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    // Launch Puppeteer in headless mode
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page that contains the ResultsCards component
    const url = "srcappapigeneratePdfgeneratePdf.ts"; // Replace with the actual route
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for the #results-cards element to be loaded
    await page.waitForSelector("#resultsCards");

    // Select the #results-cards element
    const element = await page.$("#resultsCards");

    if (!element) {
      throw new Error("ResultsCards component not found");
    }

    // Generate PDF from the ResultsCards component
    const pdfBuffer = await element.screenshot({
      path: "results-cards.pdf",
      fullPage: false, // Capture only the component
      omitBackground: true,
    });

    // Close the browser
    await browser.close();

    // Set response headers to serve the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=results-cards.pdf");

    // Send the PDF buffer to the client
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
}
