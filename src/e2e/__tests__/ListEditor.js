/* eslint-disable import/no-extraneous-dependencies */
import puppeteer from 'puppeteer';

jest.setTimeout(30000);

describe('List Editor', () => {
  let browser;
  let page;
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  });

  test('shoul be on the page', async () => {
    await page.waitForSelector('.list-editor');
    await page.waitForSelector('.popup-wrapper');
  });

  test('form inputs should be invalid', async () => {
    const addBnt = await page.$('.addBtn');
    await addBnt.click();
    await page.waitForSelector('.popup-wrapper.active');

    const inputName = await page.$('input[name="name"]');
    const inputPrice = await page.$('input[name="price"]');
    const saveBtn = await page.$('.saveBtn');

    await saveBtn.click();
    await page.waitForSelector('.invalid-input');

    await inputName.type('test');
    await saveBtn.click();
    await page.waitForSelector('.invalid-input');

    await inputPrice.type('0');
    await saveBtn.click();
    await page.waitForSelector('.invalid-input');
  });

  test('form should be valid and list-item should be added', async () => {
    const addBnt = await page.$('.addBtn');
    await addBnt.click();

    const inputName = await page.$('input[name="name"]');
    const inputPrice = await page.$('input[name="price"]');
    const saveBtn = await page.$('.saveBtn');

    await inputName.type('test');
    await inputPrice.type('100');
    await saveBtn.click();
    await page.waitForSelector('.list-item');
  });

  afterEach(async () => {
    await browser.close();
  });
});
