const defaultChromeLocation = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const defaultProcessArgs =  [   '--incognito',
                                '--bwsi',
                                '--allow-insecure-localhost',
                                '--disable-web-security',
                                '--disable-popup-blocking'
                            ];
const defaultUrl = 'about:blank';

class ChromeLauncher extends BrowserLauncher{

    constructor(chromeLocation=defaultChromeLocation, processArgs=defaultProcessArgs, url=defaultUrl){
        super(browserLocation, processArgs, url)
    }
}


module.exports = ChromeLauncher;