let cheerio = require("cheerio");
require("isomorphic-fetch");
let fs = require("fs");

async function runScraper(url) {
    try {
        let no_of_leads = process.argv[2];

        for (let i = 1; i <= no_of_leads; i++) {
            let response = await fetch(url);

            let markup = await response.text();
            let $ = cheerio.load(markup);

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
        let file_name = "black tax professionals.json";
        let data = JSON.stringify(leads);

        fs.writeFile(file_name, data, (err) => {
            if (err) console.log("Saving Error:\n" + err);
            else console.log("\nLeads saved");
        });
    } catch (error) {
        console.log("Scraper Error:\n" + error);
    }
}

let leads = [];
runScraper(
    "https://blacktaxprofessionals.com/taxprofessionals/smart-business-solutions/"
);
