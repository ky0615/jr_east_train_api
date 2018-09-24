const puppeteer = require('puppeteer')
const querystring = require('querystring')

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || null
const HEADLESS = (process.env.HEADLESS || 'true') === 'true'
const USER_AGENT = process.env.USER_AGENT || 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36'
const USER_ID = process.env.USER_ID || '114514'

const config = {
    headless: HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // puppeteer内蔵のChromiumではなく、外部にインストールしたChroniumを使用する場合にパスを指定する
    executablePath: CHROMIUM_PATH,
}

const launchBrowser = async () => {
    return await puppeteer.launch(config)
}

module.exports.launchBrowser = launchBrowser

const configurePage = async (browser) => {
    const page = await browser.newPage()

    await page.setUserAgent(USER_AGENT)
    await page.setExtraHTTPHeaders({ 'user-id': USER_ID })

    return page
}

module.exports.configurePage = configurePage

const getLineList = async (browser) => {
    const page = await configurePage(browser)

    await page.goto('https://rp.cloudrail.jp/rp/zw01/top.html?at=596')
    // const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const jrLineList = await page.evaluate(() => {
        // This block is running on the browser
        let result = []
        $('#tab_jre #scroll_body>div').each((index, element) => {
            const line = $($(element)[0])
            result.push({
                name: line.find('#lineName>a')[0].text.trim(),
                link: line.find('#lineName>a')[0].href,
                delay: {
                    type: line.find('#abnormalText a')[0].text.trim() || '',
                    text: line.find('#delayTime>a')[0].text.trim() || '',
                    icon: $(line.find('#abnormalIcon>a>img')[0]).attr('src') || '',
                },
            })
        })

        return result
    })

    if (HEADLESS) page.close()
    return jrLineList
}

module.exports.getLineList = getLineList

const lineInformation = async (browser, args) => {
    const page = await configurePage(browser)
    const url = args.link
    await page.goto(url)
    const stationList = await page.evaluate(() => {
        let result = []
        $('.stNameInc .stNameInc4 .stNameCommon').each((index, element) => {
            result.push({
                id: element.id,
                name: element.innerText,
            })
        })
        return result
    })

    const trainList = (await page.evaluate(() => {
        let result = []
        $('.train_common .delayTime').each((index, element) => {
            result.push({
                url: element.href,
                hash: element.hash,
                delay: element.innerText,
            })
        })
        return result
    })).map((element) => {
        return {
            url: element.url,
            hash: querystring.parse(element.hash),
            delay: element.delay,
        }
    })

    return {
        stationList,
        trainList,
    }
}

module.exports.lineInformation = lineInformation

const getTrainDetail = async (browser, args) => {
    const page = await configurePage(browser)
    const url = args.link
    await page.goto(url)
    const details = await page.evaluate(() => {
        let result = []
        $('.container_body .detail_trainInfoInc').each((index, element) => {
            const trains = $($(element)[0])
            result.push({
                nowLocale: trains.find('.detail_location')[0].innerText,
                destination: trains.find('.detail_destination_common')[0].innerText,
                formation: trains.find('.detail_composed')[0].innerText,
                delayTime: trains.find('.detail_delayTime')[0].innerText,
            })
        })

        return result
    })

    return details
}

module.exports.getTrainDetail = getTrainDetail