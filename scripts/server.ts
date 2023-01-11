const http = require('http');
const fs = require('fs');
const url = require('url');
const { genWasm } = require('../lib/genWasm');

var server = http.createServer(async (req: any, res: any) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const _url = req.url == "/" ? "/index.html" : req.url;
    const urlObj = url.parse(_url, true);
    if (urlObj.pathname == "/circuit.wasm") {
        await genWasm(urlObj.query.ans, () => {
            console.log(urlObj.pathname, urlObj.query.ans);
            fs.readFile('./fake-circuits/circuit_js' + urlObj.pathname, (err: any, data: any) => {
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
        fs.readFile('./root' + urlObj.pathname, (err: any, data: any) => {
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

server.listen(5000);

console.log('Server at port 5000 is running')