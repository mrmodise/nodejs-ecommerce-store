    module.exports = {
    database: 'mongodb://localhost/test',
    port: process.env.PORT || 3000,
    secretKey: "LKSJ&%REKZ",
    facebook:{
        clientID: process.env.FACEBOOK_ID || '186729898391051',
        clientSecret: process.env.FACEBOOK_SECRET || 'efd0e9f14d23ad5ddfadb040db1c3066',
        profileFields: ['emails','displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
};