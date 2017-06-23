## Nodejs Ecommerce Store
An amazon clone ecommerce store built in NodeJS utilizing Express, Stripe Payment, MongoDB, Elastic Search, Faker API just to mention a few. Developed with the latest cutting edge industry standard technologies, eTswana stores allows a shopper to browse through the online store and buy products using a credit card. eTswana stores supports social sign up and sign in using Facebook.

### Live Demo
 <a target="_blank" href="https://nameless-eyrie-75082.herokuapp.com/">See</a> live demo as hosted on Heroku (application may take few seconds to open)

### Requirements
```
1. Internet connection
2. NodeJS (https://nodejs.org/)
3. Sublime Text Editor (optional: I use WebStorm)
4. MongoDB (you can use www.mlab.com)
5. Elastic Search (https://www.elastic.co/)
```
### Instructions
Open the project in Sublime Text, and navigate to config folder. Open the config.js in the editor:

Add mongodb URL:
```
 database: '<mongo_db_url>' e.g. mongodb://localhost/test
```
 Provide a secret key:
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
Open routes/main.js to add the 'sk_test_SAF...' number retrieved from Stripe.com
```
 
## Running the application

 Now that we are set. Open project in terminal, and:
 ```
 npm install (this will install all dependencies)
 ```
 
 Once all dependencies are installed
 ```
 npm start 
 ```
 
 aggg!! Project does not run
 ```
 There are cases where node module versions conflict. If that is the case, remove the ^ on all the 
 node modules in Package.json. Delete the node modules folder and run 'npm install' then 'npm start'
 ```
## Whats Next
 ```
 1. REFACTOR! Clean code comments
 2. REFACTOR! Improved code readability
 3. More functionality to the ecommerce 
 4. Write a detailed tutorial - probably use a package to generate one from the code comments
 ```
 ### License
 
 ```
 The MIT License (MIT)
 
 Copyright (c) 2016 Mr Modise
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
```