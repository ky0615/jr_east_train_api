const puppeteer = require('puppeteer')

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || null
const HEADLESS = (process.env.HEADLESS || 'true') === 'true'

!(async () => {
    const config = {
        headless: HEADLESS,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // puppeteer内蔵のChromiumではなく、外部にインストールしたChroniumを使用する場合にパスを指定する
        executablePath: CHROMIUM_PATH
    }

    const browser = await puppeteer.launch(config)
    const page = await browser.newPage()

    await page.setUserAgent('Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36')
    await page.setExtraHTTPHeaders({
        'user-id': '114514'
    })

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

    console.log(jrLineList)

    page.close()
    process.exit(0)
})()