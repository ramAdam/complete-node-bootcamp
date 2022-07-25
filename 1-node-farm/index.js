const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./starter/modules/replaceTemplate');
// const txtIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(`${txtIn}`);

// const txtOut = `Read text ${txtIn}}`;
// const fname = "output.txt"
// fs.writeFileSync(`./starter/txt/${fname}`, txtOut);
// console.log(`written file, Created on ${Date.now()}`);

const tempCards = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/overview' || pathname === '/') {
    const cardHtml = dataObj
      .map((elm) => replaceTemplate(tempCards, elm))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    // console.log(output)
    res.end(output);
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(output);
  } else if (pathname === '/API') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    console.log(dataObj);
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'bad request',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on port 8000');
});
