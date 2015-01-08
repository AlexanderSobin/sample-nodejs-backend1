# Backend for 'your_name_here' service sample that can: 
* SignUp
* Validate
* LogIn 
* Reset password 
* Do all e-mail processing
* Handle HTTPS
* Use JWT for auth

## Main used technologies: MEAN stack
* 1) Node.JS
* 2) Express
* 3) MongoDB

## For Ubuntu only:
* Change 'your_name_here' to desired name in all files
* **sudo apt-get install build-essential make**
* Install npm/node: 
     **sudo apt-get install npm nodejs**
* Before running install Mocha and Forever:
     **npm install \-\-global mocha forever**
* Install mongodb: see **scripts/installmongo.sh**
* Modify **config.json** and **package.json**
* Add valid HTTPS (SSL) certificates to cert folder
* Run **npm install**
* To install as a daemon: ./scripts/installdaemon.sh
* Install **http://wkhtmltopdf.org/downloads.html** into your system
* Run tests (see below)

## Run:
* To run tests:
     ./run-tests.sh

* To run single test:
     **mocha \-\-reporter spec -g my_test**

* To run as a console application:
     **sudo node main.js**

* To run as a daemon:
     **sudo /etc/init.d/'your_name_here' start**

* To check out DB:
     mongo
     use 'your_name_here'
     db.users.find()

# APIs

**Create new user**

```javascript
POST /v1/users

Input: ---
Input object: {email: 'someuser@mail.com', pass: 'ahahahahha'}
Returns: 
* 1) status 200 if OK. 
* 2) status 200 + 'Already exists' data if user exists.
* 3) status 404 if something went wrong (to fool hackers)).
Returns object: {statusCode: 1, id: 123434} 
```

**Validate user e-mail**

```javascript
POST /v1/users/:shortId/validation?sig=1231231fsdafs

Input: 
* shortId - this is user is that has been sent to e-mail during user creation (equals to *id* in 1st method response)
* sig - this signature has been sent to e-mail during user creation
Input object: ---
Returns: 
* 1) status 200 + 'OK' data if OK.
* 2) status 404 if something went wrong.
```

**Reset password**

```javascript
POST /v1/users/:email/reset_password_request

Input: 
* email - this is user e-mail
Input object: ---
Returns: 
* 1) status 200 + 'OK' even on error (to fool hackers)).
```

**Create new password**

```javascript
PUT /v1/users/:shortId/password&sig=1231231fsdafs&new_val=MyNew123SupperPass4342

Input: 
* shortId - this is user is that has been sent to e-mail during prev.step (equals to *id* in 1st method response)
* sig - this signature has been sent to e-mail during prev.step
* new_val - new password
Input object: ---
Returns: 
* 1) status 200 + 'OK' even on error (to fool hackers)).
* 2) status 404 if something went wrong.
```

**Login**

```javascript
POST /v1/users/:email/login

Input: 
* email - this is user e-mail
Input object: { pass: 'MyNew123SupperPass4342'}
Returns: 
* 1) status 200 + JWT json object.
* 2) status 404 if something went wrong.
* 3) status 401 if wrong password. 
```