const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const http = require('http');

const app = express();
const port = process.env.PORT || 9000;

app.use(morgan('dev'));
// matches any valid listing path
app.use(/listings\/[0-9]{9}\/[A-z-]+\/?(?!orderSidebar)/, express.static(path.join(__dirname, '../public')));

// * matches any amount of text
app.get('/orderSidebar/:file', (req, res) => {
  axios.get(`http://127.0.0.1:1541${req.path}`)
  .then(({headers, data}) => {
    res.setHeader('content-type', headers['content-type']);
    res.send(data);
  })
  .catch(err => {
    //console.error(err);
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
  // http.get(`http://127.0.0.1:1541${req.path}`, (image) => image.pipe(res));
});

app.listen(port, () => console.log(`Listening on port ${port}...`));