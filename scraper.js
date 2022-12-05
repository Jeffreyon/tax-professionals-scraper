/**
 * Scraping Boilerplate
 */

let puppeteer = require("puppeteer-core");
let cheerio = require("cheerio");
let browserConnectionUrl = require("./lib/browser.js")({
    chromeFlags: ["--headless"],
});

async function runScraper(url) {
    // connect puppeteer to broser from chrome launcher
    let browser = await puppeteer.connect({
        browserWSEndpoint: await browserConnectionUrl,
    });

    try {
        // create new page
        let page = await browser.newPage();

        // set up page optimization and timeout
        page.setRequestInterception(true);

        page.on("request", (req) => {
            if (
                req.resourceType() == "image" ||
                req.resourceType() == "stylesheet" ||
                req.resourceType() == "font"
            ) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // navigate to url
        await page.goto(url);

        // get flash sales items
        let selector = "body";

        await page.waitForSelector(selector, { timeout: 0 });

        // get resulting html
        let pageData = await page.evaluate(() => {
            return document.documentElement.innerHTML;
        });

        // load the html as cheerio object
        let $ = cheerio.load(pageData);

        // print the page
        console.log($().html());

        await browser.close();
    } catch (error) {
        console.log("Scraper Error:\n" + error);
        await browser.close();
    }
}

runScraper("https://google.com");
