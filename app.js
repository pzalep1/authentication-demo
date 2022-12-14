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
        fs.writeFileSync('database.json', JSON.stringify(user));
        res.status(201).send('User created!')
    } else {
        res.status(400).send('Email, name, and password must be included in request for user');
    }
});

app.patch('/users/tokens', (req, res) => {
    // 1. Check that the information for authentication is provided

    // 2. See if the user exists in the database

    // 3. If the user exists lets see if the password they send and the password in the database are correct

    // 4. If they are correct lets generate that token

    // 5. If they are not correct let them know

    // 6. Let's send that token off to be put to good use!
    res.status(200).send();
});

app.listen(port, () => {
  console.log(`Example authentication app listening on port ${port}`)
});