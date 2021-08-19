const { cpu } = require("node-os-utils");
const rateLimit = require("./middleware/rateLimitter");
const cpuPercentage = require("./middleware/cpuusage.js");
test("CPU overuse test", () => {
  const percentage = cpuPercentage();
  var current_percentage;
  cpu.usage().then((curr_value) => {
    current_percentage = curr_value;
  });
  expect(percentage).toBe(current_percentage);
});
