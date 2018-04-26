const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const http = require('http');

const app = express();
const port = process.env.PORT || 9000;

app.use(morgan('dev'));
// matches any valid URL
// app.use(/listings\/[0-9]{9}\/[A-z-]+\/?(?!.*orderSidebar)/, express.static(path.join(__dirname, '../public')));

// The above worked previously, but the images component doen't prefix file requests
// with any special path, and you can't have both static assets 
// and images-component assets requests requested via the same path.
// So handling the proxy assets with two manual get handlers.

app.get('/listings/:listingNum/:listingName/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname, '../public/styles.css')))

app.get('/listings/:listingNum/:listingName/:file', (req, res) => {
  axios.get(`http://127.0.0.1:24623${req.path}`, {responseType: 'arraybuffer'})
  .then(({headers, data}) => {
    res.setHeader('content-type', headers['content-type']);
    res.send(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  });
});

app.get('/listings/:listingNum/:listingName/orderSidebar/:file', (req, res) => {
  axios.get(`http://127.0.0.1:1541${req.path}`, {responseType: 'arraybuffer'})
  .then(({headers, data}) => {
    res.setHeader('content-type', headers['content-type']);
    res.send(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));