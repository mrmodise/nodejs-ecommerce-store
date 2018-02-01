module.exports = {
    database: 'mongodb://localhost/test',
    port: process.env.PORT || 3000,
    secretKey: "<secret_key>",
    facebook:{
        clientID: process.env.FACEBOOK_ID || '<facebook_id>',
        clientSecret: process.env.FACEBOOK_SECRET || '<facebook_secret>',
        profileFields: ['emails','displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}