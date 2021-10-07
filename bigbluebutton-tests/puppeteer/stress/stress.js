const Page = require('../core/page');
const e = require('../core/elements');
const c = require('../core/constants');
const util = require('./util');

class Stress extends Page {
  constructor() {
    super();
  }

  async moderatorAsPresenter(testName) {
    try {
      const maxFailRate = c.JOIN_AS_MODERATOR_TEST_ROUNDS * c.MAX_JOIN_AS_MODERATOR_FAIL_RATE;
      let failureCount = 0;
      for (let i = 1; i <= c.JOIN_AS_MODERATOR_TEST_ROUNDS; i++) {
        await this.init(true, true, testName, `Moderator-${i}`);
        await this.waitForSelector(e.userAvatar);
        const hasPresenterClass = await this.page.evaluate(util.checkIncludeClass, e.userAvatar, e.presenterClassName);
        await this.waitAndClick(e.actions);
        const canStartPoll = await this.hasElement(e.polling);
        if (!hasPresenterClass || !canStartPoll) {
          failureCount++;
          await this.screenshot(testName, `loop-${i}-failure-${testName}`);
        }
        await this.close();
        await this.logger(`Loop ${i} of ${c.JOIN_AS_MODERATOR_TEST_ROUNDS} completed`);
        if (failureCount > maxFailRate) return false;
      }
      return true;
    } catch (err) {
      await this.close();
      this.logger(err);
      return false;
    }
  }
}

module.exports = exports = Stress;