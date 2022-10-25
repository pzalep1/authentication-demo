const express = require('express')
const app = express()
const port = 4300

app.post('/users', (req, res) => {
  res.send('Hello World!');
});

app.patch('/users/tokens', (req, res) => {
    res.send('Patch users');
});

app.listen(port, () => {
  console.log(`Example authentication app listening on port ${port}`)
})