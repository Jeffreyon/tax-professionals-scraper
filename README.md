# Tax Professional Leads Scraper

I found a job prompt on Upwork that required scraping of black tax professional leads from a website. I felt i could handle it.

So I wanted to apply for the job but first, i had to prove to myself that i could build a web scraper that can compile those leads

This is the prototype i built

## Overview

I built a script that scraped the contacts of black tax professionals from a website. The task was to compile them into a google sheet, but i had them written to a json file instead which i manually converted online and attached to my proposal.

### The challenge

1. The script (or bot) should visit the [target website](https://blacktaxprofessionals.com/taxprofessionals/smart-business-solutions/)
2. It should scrape the business name, email and website from each lead on the directory by visiting the page for that lead
3. It should export that data to a google sheet

### My solution

1. The script (or bot) visits the page of a lead on the target website
2. It scrapes the business name, email and website from that page and adds it to an array
3. It then gets a link (A "Next" button) pointing to the next lead on the directory
4. It repeats the steps 1 - 3 for the amount of leads needed to be scraped
5. Lastly the script saves the leads as a json file which i took and manually uploaded to google sheets

### Screenshot

![preview](./preview.gif)

### Links

-   Solution URL: [View on Github](https://github.com/Jeffreyon/tax-professionals-scraper)
-   Live Site URL: [Coming soon](#)

## My process

I started the script basing it off a [former scraper](https://github.com/Jeffreyon/jumia-flash-sales-web-scraper) i built for myself, so i had a good setup for this kind of data harvesting

Initially i assumed the website was rendered dynamically with javascript so i pulled up puppeteerJS and started automating my browser to visit the website.

To scrape the target website successfully, i had to structure my scraper to how the website was structured, the website is a simple directory that showcases black tax professionals on a grid with pagination at the bottom, there were about 53 pages of information to be scraped.

Also each listing on the website lead to a page about the tax professional showing their name and contact details and had a link at the bottom of the page linking to the next tax professional on the directory. Neat

I had done a pagination scraper before, but i knew i didn't want to do the whole job for the client off the bat (I was still trying to get hired after all 😅).

So I built something lightweight that simply visited a black professional's page (Using `puppeteer`), scraped the information i needed (using `cheerio`) and visited the next black professional within a loop which runs for the number of leads i wanted (I submitted 20 leads as a sample in my proposal).

But it felt slow, i was scrpaing leads at a slow rate, and jobs like these expected speed, so i went back to the website and found out it was a server-rendered application. So i improved the speed by skipping `puppeteer` and loading the website as html using `isomorphic-fetch` and scraped the data i needed.

At the end the script was scraping leads at 1 lead per second (Sometimes longer, sometimes shorter due to varying internet speed)

After the scraping is done, the data is converted to json and saved as a file named `black tax professionals.json` which i attached to my proposal when submitting it

And that's how i built this project

### Built with

-   JavaScript [NodeJS]
-   CheerioJS (DOM Parser)
-   PuppeteerJS (Browser automation tool)

### What I learned

I learnt a ton of new things:

1. Learnt how to use command-line arguments to control a program
2. Learnt how to scrape static sites using cheerioJS and isomorphic-fetch packages
3. Learnt how to use puppeteer to navigate a page
4. Learnt how to parse a webpage using cheerio

### Continued development

Some things i would love to improve in my next scraper includes:

1. Building an interface for interacting with the script, right now it's a cli application which is not very end-user friendly. One idea i have is creating a telegram bot the user can interact with
2. Converting the data into a csv file and pushing it to a google sheet via their api
3. Making the bot faster. In my `scraper-pptr` where i used puppeteer, the script scrapes at 1 lead per 2 seconds which i feel is slow because it visits the lead pages sequentially. I believe if i scrape the links to all the leads first before visiting them i can scrape data much faster by opening multiple pages at the same time.

## Author

-   Github - [Jeffrey Onuigbo](https://www.github.com/Jeffreyon)
-   Frontend Mentor - [@jeffreyon](https://www.frontendmentor.io/profile/Jeffreyon)
-   Twitter - [@jeffreyon\_](https://www.twitter.com/jeffreyon_)
