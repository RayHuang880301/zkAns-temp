const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path'); 
const express = require('express');
const { genWasm } = require('../utils/genWasm');
var app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

var server = http.createServer(async (req: any, res: any) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const _url = req.url == "/" ? "/index.html" : req.url;
    const urlObj = url.parse(_url, true);
    if (urlObj.pathname == "./circuit.wasm") {
        await genWasm(urlObj.query.ans, () => {
            console.log(urlObj.pathname, urlObj.query.ans);
            fs.readFile('/ans-circuits/circuit_js' + urlObj.pathname, (err: any, data: any) => {
                if (err) {
                    res.writeHead(404);
                    res.write('File Not Found');
                }
                else 
                    res.write(data);
                res.end();
            });
        });
    }
    else
        fs.readFile('./public' + urlObj.pathname, (err: any, data: any) => {
            if (err) {
                res.writeHead(404);
                res.write('File Not Found');
            }
            else {
                res.write(data);
            }
            res.end();
        });
});

server.listen(5500);

console.log('Server at port 5500 is running')