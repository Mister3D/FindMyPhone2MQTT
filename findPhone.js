const { readFileSync, writeFileSync } = require('fs');

const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const Xvfb = require('xvfb');

module.exports = findPhone;

async function findPhone(cookie) {
  const xvfb = new Xvfb({ silent: true });

  // Démmare un serveur X virtuel
  xvfb.start();

  let driver = new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build();

  await driver.get('https://www.google.fr/');


  // const cookies = JSON.parse(readFileSync(`./cookies/${cookie}.json`, 'utf-8'));
  // for (const item of cookies) {
  //     driver.manage().addCookie({ name: item['name'], value: item['value'] });
  //     console.log({ name: item['name'], value: item['value'] });
  // }

  await driver.navigate().refresh();
  
  await driver.takeScreenshot().then(function(data){
    var base64Data = data.replace(/^data:image\/png;base64,/,"")
    writeFileSync("out1.png", base64Data, 'base64');
  });

  await driver.get('https://www.google.fr/android/find/');

  // Fait une capture sous forme d'image

  // Fait une capture du html
  // const html = await driver.getPageSource();
  // writeFileSync('page.html', html);
  // const parentElement = driver.findElement(By.css('img[alt="Huawei Honor 8X"]'));
  
  const element = await driver.findElement(By.css('img[alt="HUAWEI BLN-L21"]'));

  await driver.takeScreenshot().then(function(data){
    const base64Data = data.replace(/^data:image\/png;base64,/,"")
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    writeFileSync(`out-${timestamp}.png`, base64Data, 'base64');
  });



  
  // // Recupere l'element sur le quel nous allons faire notre test.
  // const element = await driver.findElement(By.css('button[title="Faire sonner cet appareil"]'));

  // let isDisabled = await element.getAttribute('disabled') !== null;

  // let tries = 0;

  // while (isDisabled && tries < 60) {
  //   console.log('L\'élément est désactivé. Attente de 1 seconde...');
  //   await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
  //   tries++;
  //   isDisabled = await element.getAttribute('disabled') !== null;
  // }

  // if (tries < 60) {
  //   await element.click();
  // }

  await driver.quit();

  await xvfb.stop();
}