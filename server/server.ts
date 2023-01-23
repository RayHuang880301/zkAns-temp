const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path'); 
const express = require('express');
const { genWasm } = require('./genWasm');
var app = express();

app.use('/circuit.wasm', async function(req: any, res: any) {
    console.log({
        req: req.query
    })
    const ans = req.query?.ans;
    if(!ans) {
        res.writeHead(400);
        res.json({
            status: 400,
            error: "No ans provided"
        })
        return
    }
    await genWasm(ans, (wasmPath: string) => {
        fs.readFile(wasmPath, (err: any, data: any) => {
            if (err) {
                res.writeHead(404);
                res.write('File Not Found');
            }
            else 
                res.write(data);
            res.end();
        });
    });
})
app.use('/', express.static(path.resolve(__dirname, '../public')));

app.listen(5500);

console.log('Server at port 5500 is running')