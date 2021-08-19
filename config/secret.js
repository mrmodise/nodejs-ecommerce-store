module.exports = {
  database: "<mongo_db_url>",
  port: process.env.PORT || 3000,
  secretKey: "<add_secret_key>",
  facebook: {
    clientID: process.env.FACEBOOK_ID || "<facebook_id>",
    clientSecret: process.env.FACEBOOK_SECRET || "<facebook_secret_key>",
    profileFields: ["emails", "displayName"],
    callbackURL: "https://localhost/auth/facebook/callback",
  },
};
