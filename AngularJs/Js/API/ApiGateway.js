const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

// TODO: Replace the following 4 param
const keyFilePath = '/Users/howardman/localhost-key.pem' // 1
const certFilePath = '/Users/howardman/localhost.pem' // 2
const port = 3030	// 3
const portS = 3000 // 4
const credentials = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
};

const express = require('express');
const app = express();
const hostname = 'localhost';

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const db = require('./Database/dbConnect')

httpServer.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
httpsServer.listen(portS, hostname, () => {
    console.log(`Server running at https://${hostname}:${portS}/`);
});

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

//handle request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/createOrder', async function (req, res) {
    console.log(req.url)
    console.log(req.body)
    await db.insertOrder(
        req.body.orderId,
        req.body.createTime,
        req.body.totalAmount,
        req.body.status,
        JSON.stringify(req.body.purchaseItems)
    ).then(() => {
        res.write(`Order Created`);
        res.end();
    });
});

app.post('/createProduct', async function (req, res) {
    console.log(req.url)
    console.log(req.body)
    await db.insertProduct(
        req.body.productId,
        req.body.createTime,
        req.body.name,
        req.body.price,
        req.body.quantity != undefined ? req.body.quantity : 0,
        req.body.description != undefined ? req.body.description : "",
        req.body.categoryName != undefined ? req.body.categoryName : "",
        req.body.categoryId != undefined ? req.body.categoryId : ""
    ).then(() => {
        res.write(`Product Created`);
        res.end();
    });
});

app.post('/editProduct', async function (req, res) {
    console.log(req.url);
    console.log(req.body);
    await db.updateProduct(
        req.body.productId,
        req.body.createTime,
        req.body.name,
        req.body.price,
        req.body.quantity,
        req.body.description,
        req.body.categoryName,
        req.body.categoryId
    ).then(() => {
        res.write(`Product Updated`);
        res.end();
    });
});

app.get('/deleteProduct', async function (req, res) {
    console.log(req.url);
    console.log(req.query);
    await db.deleteProduct(req.query.productId).then(() => {
        res.write(`Product deleted`);
        res.end();
    })
})

app.post('/createCategory', async function (req, res) {
    console.log(req.url);
    console.log(req.body);
    await db.insertCategory(req.body.categoryId, req.body.createTime, req.body.name).then(() => {
        res.write(`Category Created`);
        res.end();
    });
});

app.post('/editCategory', async function (req, res) {
    console.log(req.url);
    console.log(req.body);
    await db.updateCategory(req.body.categoryId, req.body.createTime, req.body.name).then(() => {
        res.write(`Category Updated`);
        res.end();
    });
});

app.get('/deleteCategory', async function (req, res) {
    console.log(req.url);
    console.log(req.query);
    await db.deleteCategory(req.query.categoryId).then(() => {
        res.write(`Category deleted`);
        res.end();
    })
})


app.get('/getCategories', async function (req, res) {
    console.log(req.url);
    console.log(req.query);
    await db.fetchCategory().then((data) => {
        res.write(data);
        res.end();
    })
})

app.get('/getProducts', async function (req, res) {
    console.log(req.url);
    console.log(req.query);
    await db.fetchProduct().then((data) => {
        res.write(data);
        res.end();
    })
})

app.get('/getOrders', async function (req, res) {
    console.log(req.url);
    console.log(req.query);
    await db.fetchOrder().then((data) => {
        res.write(data);
        res.end();
    })
})

app.get('/confirmOrder', async function (req, res) {
    console.log(req.url);
    console.log(req.query.orderId);
    await db.updateOrderStatus("confirm", req.query.orderId).then(() => {
        res.write("Order Confirmed");
        res.end();
    })
})