/**
 * Scraping Boilerplate
 */

let puppeteer = require("puppeteer-core");
let cheerio = require("cheerio");
let browserConnectionUrl = require("./lib/browser.js")({
    chromeFlags: ["--headless"],
});
let fs = require("fs");

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

        let no_of_leads = 20;

        console.log("Starting scraper");

        for (let i = 1; i <= no_of_leads; i++) {
            // navigate to url
            await page.goto(url, { timeout: 0 });

            // wait for page to load
            let selector = "body";

            await page.waitForSelector(selector, { timeout: 0 });

            // get resulting html
            let pageData = await page.evaluate(() => {
                return document.documentElement.innerHTML;
            });

            // load the html as cheerio object
            let $ = cheerio.load(pageData);

            // scrape the business name, email and website
            let bizname_selector = "#left-area .main_title";
            let email_selector =
                "#gd_output_location-2 > div > div.geodir_post_meta.list-group-item.list-group-item-action.geodir-field-email > a";
            let website_selector =
                "#gd_output_location-2 > div > div.geodir_post_meta.list-group-item.list-group-item-action.geodir-field-website > a";

            let lead = {
                business_name: $(bizname_selector).text(),
                email: $(email_selector).text(),
                website: $(website_selector).text(),
            };

            // add lead to list
            leads.push(lead);

            console.log(`Lead #${i} added`);

            // goto the next lead
            let next_lead_selector = "a[rel='next']";

            if ($(next_lead_selector).length) {
                url = $(next_lead_selector).attr("href");
            }
        }

        // write leads to json file
        let file_name = "black tax professinals.json";
        let data = JSON.stringify(leads);

        fs.writeFile(file_name, data, (err) => {
            if (err) console.log("Saving Error:\n" + err);
            else console.log("\nLeads saved");
        });

        await browser.close();
    } catch (error) {
        console.log("Scraper Error:\n" + error);
        await browser.close();
    }
}

let leads = [];

runScraper(
    "https://blacktaxprofessionals.com/taxprofessionals/smart-business-solutions/"
);
