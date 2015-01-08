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

## Before you go
### For Ubuntu only:
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
* DO NOT FORGET TO CHANGE 'salt' in config.json! Using sample salt will lead to vulnerability!
* Use HTTPS only (set *enable_https* to true config.json) to prevent JWT or other data stealing in the middle
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

### **Create new user**
Will:
* 1) Create new user with unique id
* 2) Send e-mail to 'email' address with instructions on how to validate

```javascript
POST /v1/users

Input: ---
Input object: {email: 'someuser@mail.com', pass: 'ahahahahha'}
Returns: 
* 1) status 200 if OK. 
* 2) status 200 + 'Already exists' data if user exists.
* 3) status 404 if something went wrong (to fool hackers)).
Returns object: {statusCode: 1, shortId: 123434} 
```

### **Validate user e-mail**
Will:
* 1) Find user with 'shortId'
* 2) Check if validation is still neeeded
* 3) Compare sig. If signature is different -> error
* 4) Set 'validated' flag to true
* 5) Send 'registration complete' e-mail to user 

```javascript
POST /v1/users/:shortId/validation?sig=1231231fsdafs

Input: 
* shortId - this is user is that has been sent to e-mail during user creation (equals to *shortId* in 1st method response)
* sig - this signature has been sent to e-mail during user creation
Input object: ---
Returns: 
* 1) status 200 + 'OK' data if OK.
* 2) status 404 if something went wrong.
```

### **Reset password**
Will:
* 1) Find user with 'email'
* 2) Generate special 'reset' signature for that object
* 3) Send e-mail with instructions on how to reset password

```javascript
POST /v1/users/:email/reset_password_request

Input: 
* email - this is user e-mail
Input object: ---
Returns: 
* 1) status 200 + 'OK' even on error (to fool hackers)).
```

### **Create new password**
Will: 
* 1) Find user with 'shortId'
* 2) Compare sig. If signature is different -> error
* 3) Change password
* 4) Send 'password changed' e-mail

```javascript
PUT /v1/users/:shortId/password&sig=1231231fsdafs&new_val=MyNew123SupperPass4342

Input: 
* shortId - this is user is that has been sent to e-mail during prev.step (equals to *shortId* in 1st method response)
* sig - this signature has been sent to e-mail during prev.step
* new_val - new password
Input object: ---
Returns: 
* 1) status 200 + 'OK' even on error (to fool hackers)).
* 2) status 404 if something went wrong.
```

### **Login**
Will:
* 1) Find user with 'email'
* 2) Compare password hashes
* 3) Send JWT that can be used as a 'auth token' later

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
