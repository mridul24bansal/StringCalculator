const { expect } = require('@playwright/test');

export class StringCal {
  constructor(page) {
    this.page = page;
  }

  async gotoMainPage() {
    await this.page.goto("http://localhost:3000/", {
      waitUntil: 'domcontentloaded',
    });
  };

  async pageLoaded() {
    await expect(this.page.getByRole('textbox')).toBeVisible();
    return true;
  }

  async add(val, res) {
    await this.page.getByRole('textbox').fill(val);
    await this.page.getByRole("button").click();
    const result = await this.page.getByTestId("calResult").innerText();
    expect(result).toMatch(res);
  };

};