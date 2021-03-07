import ScraperService from './svc/ScraperService.js'

const url = 'https://en.wikipedia.org/wiki/List_of_heavy_metal_bands'
const scraper = new ScraperService(url)
const html = await scraper.fetchUrl()
const htmlReddit = await scraper.fetchUrlWithPuppeteer('https://www.reddit.com')
// const heavyMetalBandLinks = scraper.getBandLinks(html)
// await scraper.getBandInfo(heavyMetalBandLinks[29])
// scraper.fileCreate(heavyMetalBandLinks)