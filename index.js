const {Builder, By, Key, util, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

const optionsChrome = new chrome.Options();
// const optionsFirefox = new firefox.Options();

optionsChrome.addArguments([
  "--allow-file-access-from-files",
"--use-fake-ui-for-media-stream",
"--allow-file-access",
'--use-fake-device-for-media-stream',
'--use-file-for-fake-video-capture=./test-video640s.y4m',
'--headless'
]); //

optionsChrome.addArguments('--disable-dev-shm-usage')
optionsChrome.addArguments('--no-sandbox')


// optionsFirefox.setPreference("media.navigator.streams.fake", true);
// optionsFirefox.setPreference("media.navigator.permission.disabled", true);

async function launchInstance(instanceId) {
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(optionsChrome).build();
  await driver.get('https://sharedboard.io/r/895-309-842');

  driver.switchTo().frame(driver.findElement(By.css("iframe[src='https://client.sharedboard.io/']")));
  
  //await driver.sleep(3000);
  await driver.wait(until.elementLocated(By.id('name-override-name-input')));
  await driver.wait(until.elementLocated(By.id('btn-complete-name-override')));

  await driver.sleep(1000); 

  driver.findElement(By.id('name-override-name-input')).sendKeys(instanceId);
  await driver.sleep(500); 
  driver.findElement(By.id('btn-complete-name-override')).click();

  await driver.wait(until.elementLocated(By.id('btn-join'), 10000));
  await driver.wait(until.elementLocated(By.id('btn-camera-enable'), 1000));
  await driver.wait(until.elementLocated(By.id('btn-mic-enable'), 1000));

  await driver.sleep(1000);

  driver.findElement(By.id('btn-camera-enable')).click();
  if (Math.random() < 0.1) {
    driver.findElement(By.id('btn-mic-enable')).click();
  }

  await driver.sleep(2000);

  driver.findElement(By.id('btn-join')).click();

  await driver.sleep(30 * 60 * 1000); // n minutes
  driver.quit();
}
const count = process.env.WORKERS || 1;

for (let i = 0; i < count; i++) {
  launchInstance('test' + i);
}