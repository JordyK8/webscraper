import axios from 'axios'
import $ from 'cheerio'
import fs from 'fs'
import puppeteer from 'puppeteer'

export default class Scraper {
    constructor(url) { 
        this.url = url
    }
    async fetchUrlWithPuppeteer(url) {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto(url)
            const html = await page.content()
            $('h2', html).each(function() {
                console.log($(this).text());
            });
        } catch(err) {
        console.log(err);
        }
    }
    async fetchUrl() { 
        try {
            const response = await axios(this.url)
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    getBandLinks(html) {
        const foundHrefs = $('.wikitable > tbody > tr > td > a', html)
        const wikiUrls = Object.values(foundHrefs).map((item) => {
            return item.attribs ? `https://en.wikipedia.org${item.attribs.href}` : ''
        })
        return wikiUrls
    }

    async getBandInfo(url) {
        try {
            const response = await axios(url)
            const html = response.data
            const bandMemberNodes = $('th:contains("Members")', html).next().text()
            const bandMembers = bandMemberNodes.split(/(?<=[a-z])(?=[A-Z])/)
            const origin = $('th:contains("Origin")', html).next().text()
            const website = $('th:contains("Website")', html).next().text()
            const bandName = $('h1', html).text()
            const data = { bandName, bandMembers, origin, website }
            return data
        } catch (e) {
            console.log(e);
        }
    }
    async fileCreate(bandLinks) {
        const file = fs.createWriteStream('bands.txt')
        await bandLinks.map(async (link) => { 
            const data = await this.getBandInfo(link)
            if (data) {
                fs.appendFileSync('infobands.txt', JSON.stringify(data).replace(',', '\n').replace('{','').replace('}','').replace('"\n', '\n') + '\n\n', 'utf-8');
            }
            return data
        })
    }
}
