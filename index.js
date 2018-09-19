const jr = require('./lib')

!(async () => {
    const browser = await jr.launchBrowser()
    const lineList = await jr.getLineList(browser)

    console.log(lineList)
})()