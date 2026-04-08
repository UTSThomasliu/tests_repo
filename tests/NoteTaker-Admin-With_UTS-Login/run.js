const { By, until } = require("selenium-webdriver");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

/**
 * Test: UTS Bookmark NavBar Presence
 * @param {WebDriver} driver   - Provided by your sequence runner, should be a fresh driver.
 */
module.exports = async function (driver, parameters = {}) {
  log("🟠 Starting UTS Bookmark NavBar Presence Test");

  try {
    // Step 1: Go to the UTS bookmark URL
    const url = "https://notetaker-admin.uts.edu.au/";
    
    const cookies = await driver.manage().getCookies();

    const hasOktaSession = cookies.some(
      (cookie) => cookie.name === "sid"
      );

    if (hasOktaSession) {
       console.log("✅ Okta session exists (user is logged in into OKTA Test Environment)");
       url = "https://notetaker-admin.dev.uts.edu.au/";
      }


    log(`🌏 Navigating to ${url}`);
    await driver.get(url);

    // Step 2: Wait for possible page or SSO loads
    await driver.sleep(2000);

    // Step 3: Wait for the <div class="navbar-header">
    log("🔎 Waiting for navbar div (class='navbar-header')...");
    let navbarDiv;
    try {
      navbarDiv = await driver.wait(
        until.elementLocated(By.css('div.navbar-header')),
        12000 // adjust if network is slow
      );
      await driver.wait(until.elementIsVisible(navbarDiv), 9000);
    } catch (e) {
      log("❌ FAIL: NavBar div (class='navbar-header') not found or not visible.");
      throw new Error("NavBar div not present/visible");
    }

    // Step 4: Success log and exit
    log("🟢 NavBar div found and visible.");
    log("✅ PASS: Page loaded NavBar successfully.");

  } catch (err) {
    process.stderr.write(`🔥 Fatal test error: ${err && err.message}\n`);
    throw err;
  }
};
