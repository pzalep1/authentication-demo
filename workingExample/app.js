const express = require('express');
// Declare a new express application
const app = express();

// Setup app to user body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Set port for the app to run on
const port = 4300;

// Setup fs to read and write to files
const fs = require('fs');

// Setup bcrypt for hashing
var bcrypt = require('bcrypt');
const saltRounds = 10;

// Setup JWT for tokens
const jwt = require('jsonwebtoken');

/**
 * Will create a user in the database.json file
 */
app.post('/users', (req, res) => {
    const user = req.body;
    // Verify that the user has sent everything I need to create a user
    if(user.username && user.password && user.name) {
        // Verify the password is 8 characters
        if(user.password.length < 8) {
            res.status(400).send('Password is too short!')
        }
        // Verify that the password has 1 special character
        const specialCharacter = user.password.match(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g);
        if(!specialCharacter) {
            res.status(400).send('Password must contain at least 1 special character!')
        }

        // Now let's insert this into the database!
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
            user.password = hash;
            fs.writeFileSync('database.json', JSON.stringify(user));
        });
        res.status(201).send('User created!')
    } else {
        res.status(400).send('Email, name, and password must be included in request for user');
    }
});

/**
 * Will see if a user exists, checks if the passwords match, and will return a token
 */
app.patch('/users/tokens', (req, res) => {
    // 1. Check that the information for authentication is provided
    const user = req.body;
    if(!user.username || !user.password) {
        res.status(400).send('Username and password must be included!');
    }
    // 2. See if the user exists in the database
    const dbUser = JSON.parse(fs.readFileSync('database.json'));
    if(dbUser.username !== user.username) {
        res.status(404).send('The user does not exist!');
    }
    // 3. If the user exists lets see if the password they send and the password in the database are correct
    bcrypt.compare(user.password, dbUser.password, (err, data) => {
        // If they match we will get data back
        if (data) {
            // 4. If they are correct lets generate that token that will expire in 30 mins
            const token = jwt.sign({ data: user.username}, 'SecretValue', { expiresIn: '1800s' });
             // 5. Let's send that token off to be put to good use!
            res.status(200).send(token);
        } else {
            return res.status(401).json({ msg: "Passwords do not match!" })
        }

    });
});

app.listen(port, () => {
  console.log(`Example authentication app listening on port ${port}`)
});