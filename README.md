# nodejs-ecommerce-store
An amazon clone ecommerce store built in NodeJS utilizing Express, Stripe Payment, MongoDB, Elastic Search, Faker API just to mention a few. Developed with the latest cutting edge industry standard technologies, eTswana stores allows a shopper to browse through the online store and buy products using a credit card. eTswana stores supports social sign up and sign in using Facebook.

# Live Demo
 <a target="_blank" href="https://nameless-eyrie-75082.herokuapp.com/">See</a> live demo as hosted on Heroku (application may take few seconds to open)

# Requirements
```
1. Internet connection
2. NodeJS (https://nodejs.org/)
3. Sublime Text Editor (optional)
4. MongoDB (you can use mlab.com)
5. Elastic Search (https://www.elastic.co/)
6. 
```
# Instructions
Open the project in Sublime Text, and navigate to config folder. Open the config.js in editor:

Add your mongodb url here:
```
 database: '<mongo_db_url>' e.g. mongodb://localhost/test
```
 Give a secret key:
 ```
 secretKey: "<add_secret_key>" - e.g. LKSJ&%$#XFE
 ```
Using Facebook developer site, create a Facebook app and retrieve the following:
```
clientID: process.env.FACEBOOK_ID || '<facebook_id>'

clientSecret: process.env.FACEBOOK_SECRET || '<facebook_secret_key>'
```
Create an account with Stripe Payment (https://stripe.com/)
```
Open routes/main.js to add the 'sk_test_SAF...' number
```
 
# Running the application

 Now that we are set. Open project in terminal, and:
 ```
 npm install (this will install all dependencies)
 ```
 
 Once all dependencies are installed
 ```
 npm start 
 ```
# Whats Next
 ```
 I am still add more functionality to the ecommerce store as well as write a detailed tutorial
 ```
 
