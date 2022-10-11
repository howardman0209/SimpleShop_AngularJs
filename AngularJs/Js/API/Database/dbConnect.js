var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "240959747",
    database: "AngularJsProject"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database connected!");
});

exports.insertOrder = function (orderId, createTime, totalAmount, status, purchaseItems) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO Orders (orderId, createTime, totalAmount, status, purchaseItems) VALUES ('${orderId}', '${createTime}', '${totalAmount}', '${status}', '${purchaseItems}')`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record inserted");
            resolve()
        });
    });
};

exports.insertProduct = function (
    productId,
    createTime,
    name,
    price,
    quantity,
    description,
    categoryName,
    categoryId) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO Products ( productId, createTime, name, price, quantity, description, categoryName, categoryId) VALUES ('${productId}', '${createTime}', '${name}', '${price}', '${quantity}','${description}', '${categoryName}','${categoryId}')`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record inserted");
            resolve()
        });
    });
};

exports.updateProduct = function (
    productId,
    createTime,
    name,
    price,
    quantity,
    description,
    categoryName,
    categoryId) {
    return new Promise((resolve, reject) => {
        var sql = `Update Products SET createTime = '${createTime}', name = '${name}' , price = '${price}' , name = '${name}' , quantity = '${quantity}' , description = '${description}' , categoryName = '${categoryName}' , categoryId = '${categoryId}' WHERE productId = '${productId}'`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record updated");
            resolve()
        });
    });
};

exports.deleteProduct = function (productId) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM Products WHERE productId = '${productId}'`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record deleted");
            resolve()
        });
    });
};

exports.insertCategory = function (categoryId, createTime, name) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO Categories (categoryId, createTime, name) VALUES ('${categoryId}', '${createTime}', '${name}')`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record inserted");
            resolve()
        });
    });
};

exports.updateCategory = function (categoryId, createTime, name) {
    return new Promise((resolve, reject) => {
        var sql = `Update Categories SET name = '${name}', createTime = '${createTime}' WHERE categoryId = '${categoryId}'`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record updated");
            resolve()
        });
    });
};

exports.deleteCategory = function (categoryId) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM Categories WHERE categoryId = '${categoryId}'`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record deleted");
            resolve()
        });
    });
};

exports.fetchCategory = function () {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM Categories`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("Categories fetched");
            resolve(JSON.stringify(result))
        });
    });
};

exports.fetchProduct = function () {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM Products`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("Products fetched");
            resolve(JSON.stringify(result))
        });
    });
};

exports.fetchOrder = function () {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM Orders`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("Orders fetched");
            resolve(JSON.stringify(result))
        });
    });
};

exports.updateOrderStatus = function (status, orderId) {
    return new Promise((resolve, reject) => {
        var sql = `Update Orders SET status = '${status}' WHERE orderId = '${orderId}'`;
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record updated");
            resolve()
        });
    });
};