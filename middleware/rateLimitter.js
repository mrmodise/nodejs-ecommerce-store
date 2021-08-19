const rateLimit = require("express-rate-limit");
rateLimit({
  windowMs: 12 * 60 * 60 * 1000, //   Window time interval in which user can make requests
  max: 5000, //Maximum number of requests user can make in the given interval
  message: "Please slow down ! ", // message to be displayed to user after exhauting the limit
  headers: true,
});

module.exports = rateLimit;
