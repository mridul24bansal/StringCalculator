import { test, expect } from '@playwright/test';
import { StringCal } from './pageModal/stringCalPOM';

test.describe("Check String Calculator", () => {

  let StringCalPom;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    StringCalPom = new StringCal(page);

    // Navigate to Page
    await StringCalPom.gotoMainPage();
  });

  test("Check is calculator visible", async () => {
    await expect(await StringCalPom.pageLoaded()).toBeTruthy();
  });

  test("Check empty input return zero", async () => {
    await StringCalPom.add("", "0");
  });

  test("Check one input returns same output", async () => {
    await StringCalPom.add("1", "1");
  });

  test("Check two input returns added their sum", async () => {
    await StringCalPom.add("1,2", "3");
  });

  test("Check multiple input returns their added sum", async () => {
    await StringCalPom.add("1,2,6,8", "17");
  });

  test("Check new line between numbers acts as comma", async () => {
    await StringCalPom.add("1\\n2,3", "6");
  });

  test("Check new line after numbers is invalid", async () => {
    await StringCalPom.add("1,\n", "Expression not supported");
  });

  test("Change delimiter from comma to semicolon and validate input", async () => {
    await StringCalPom.add("//;\\n1;2;1", "4");
  });

  test("Change delimiter from comma to colon and validate input", async () => {
    await StringCalPom.add("//:\\n1:2", "3");
  });

  test("Check negative number throws exception", async () => {
    await StringCalPom.add("1,-1", "Negative numbers are not allowed -1");
  });

  test("Check multiple negative number throws exception with all numbers listed", async () => {
    await StringCalPom.add("1,-1,3,5,-9,-78", "Negative numbers are not allowed -1,-9,-78");
  });

  test("Ignore number bigger than 1000 with one input", async () => {
    await StringCalPom.add("2,1003,1", "3");
  });

  test("Ignore number bigger than 1000 with multiple input", async () => {
    await StringCalPom.add("1003", "0");
  });

  test("Ignore number bigger than 1000 with multiple input and newline", async () => {
    await StringCalPom.add("1\\n2,3,10003", "6");
  });

  test("Add lengthy delimiter and validate input", async () => {
    await StringCalPom.add("//***\\n1***2", "3");
  });

  test("Allow multiple delimiter and validate input", async () => {
    await StringCalPom.add("//*%\\n1*2%3", "6");
  });

  test("Allow multiple lengthy delimiter and validate input", async () => {
    await StringCalPom.add("//***%%%\\n1***2%%%3", "6");
  });

});