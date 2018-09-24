const jr = require('./lib')

!(async () => {
    const browser = await jr.launchBrowser()
    // const lineList = await jr.getLineList(browser)

    // console.log(lineList)

    // const jcLine = lineList.find((element) => element.name === '中央線快速電車')
    // console.log(JSON.stringify(await jr.lineInformation(browser, jcLine), null, '    '))
    const detail = await jr.getTrainDetail(browser, {
        link: 'https://rp.cloudrail.jp/zw-web-01/makecontents/trainDetail/#?inLineCode=56&inDirName=%E6%9D%B1%E4%BA%AC%E3%83%BB%E5%8D%83%E8%91%89%E6%96%B9%E9%9D%A2&inStFrom=%E4%BA%80%E6%88%B8&inStTo=&inTrainNo=%E3%80%802142C&inTrainNoSeq=172152112&inTimestamp=20180922223826&inLng=ja&inScreenDiv=0',
    })

    console.log(JSON.stringify(detail, null, '    '))
})()
