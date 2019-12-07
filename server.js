var connect = require('connect');
var serveStatic = require('serve-static');
var mysql = require('mysql');
const express = require('express');
const cookie_parser = require('cookie-parser');
const cors = require('cors')
var Crypt = require('cryptr');
var CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
var process = require('process');
var user_details = require('./user_details');
var fs = require('fs');
var http = require('http');

crypt = new Crypt('devnami');

var db;

connect().use(serveStatic(__dirname)).listen(3000, function() {
    console.log('Server running on 3000...');
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodemysql"
    });
      
    db.connect((err) => {
        if (err) {
          throw err;
        }
        console.log("My sql connected... ");
    });
});   

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookie_parser());
app.listen(3001);

const cors_options = {
    origin: '*'
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.put('/get_username_put', cors(cors_options), (req, res, next) => {
    res.status(200).send({username: user_details.username});
});

app.post('/add_new_user', cors(cors_options), (req, res, next) => {
    let user = req.body.username;
    let password = req.body.password;
    let sql = 'INSERT INTO moneyretainertabel SET ?';
    let query = db.query(sql, req.body, (err, result) => {
        if (err) throw err;
        res.status(200).send({
            success: 'true'
        });
    });
});

app.post('/login_user', cors(cors_options), (req, res, next) => {
    let db_query = "SELECT * FROM moneyretainertabel WHERE username=" 
                    + '"' + req.body.username + '"';
    db.query(db_query, function(error, result, fields) {
        if (error) throw error;
        if (result.length != 0) {
            current_password = result[0].password;
            if (req.body.password != current_password) {
                res.status(404).send({success: false});
            } else {
                const token = jwt.sign({
                    username: result[0].username
                }, 'mihai', {
                    expiresIn: 20
                });
                user_details.username = result[0].username;
                user_details.token = token;
                res.status(200).send({
                    success: 'true',
                });
            }
        } else {
            res.status(404).send({success: 'false'});
        }
    });
});

app.get('/get_user', (req, res) => {
    let current_user = req.query.username;
    let db_query = "SELECT * FROM moneyretainertabel WHERE username=" + '"' + current_user + '"';
    db.query(db_query, function(error, result, fields) {
        if (error) throw error;
        if (result.length != 0) {
            res.status(200).send({
                success: 'true',
                username: result[0].username
            });
        } else {
            res.status(404).send({success: 'false'});
        }
    });
});

app.get('/get_sum', (req, res) => {
    let current_user = req.query.username;
    let db_query = "SELECT * FROM moneyretainertabel WHERE username=" + '"' + current_user + '"';
    db.query(db_query, function(error, result, fields) {
        if (error) throw error;
        if (result.length != 0) {
            res.status(200).send({
                success: 'true',
                value_sum1: result[0].Sum1,
                value_sum2: result[0].Sum2,
                value_sum3: result[0].Sum3
            });
        } else {
            res.status(404).send({success: 'false'});
        }
    });
});

app.get('/get_username', (req, res) => {
    res.status(200).send({username: user_details.username});
});

app.get('/change_value', (req, res) => {

    let current_token = user_details.token;

    jwt.verify(current_token, 'mihai', (err, auth_data) => {
        if (err) {
            res.status(403).send({success: false});
        } else {
            if (auth_data.exp <= (new Date().getTime() + 1) / 1000) {
                res.status(403).send({success: false});
            } else {
                let index = req.query.index;
                let value = req.query.currentvalue;
                let current_user = req.query.username;
                let index_query = "";
                if (index == '1') {
                    index_query = 'Sum1';
                } else if (index == '2') {
                    index_query = 'Sum2';
                } else {
                    index_query = 'Sum3';
                }
                let db_query = "UPDATE moneyretainertabel SET " + index_query + " = " + value + " WHERE username = "
                                + '"' + current_user + '"';

                db.query(db_query, function(error, result, fields) {
                    if (error) throw error;
                    res.status(200).send({success: "true"});
                });
            }
        }
    });


});

app.get('/get_sums', (req, res) => {
   
    let current_user = req.query.username;
    let db_query = "SELECT * FROM moneyretainertabel WHERE username=" + '"' + current_user + '"';
    db.query(db_query, function(error, result, fields) {
        if (error) throw error;
        let current_result = Object.values(JSON.parse(JSON.stringify(result[0])));
        res.status(200).send({
            sum1: current_result[3],
            sum2: current_result[4],
            sum3: current_result[5]
        });
    });
});

app.get('/sign_out', (req, res) => {

    let current_token = user_details.token;

    jwt.verify(current_token, 'mihai', (err, auth_data) => {
        if (err) {
            res.status(403).send({success: false});
        } else {
            user_details.username = "";
            user_details.token = "";
            res.status(200).send({success: true});
        }
    });
});

app.delete('/delete_account', (req, res) => {

    
    let current_user = user_details.username;
    let current_token = user_details.token;

    jwt.verify(current_token, 'mihai', (err, auth_data) => {
        if (err) {
            res.status(403).send({success: false});
        } else {        
            let db_query = "DELETE FROM moneyretainertabel WHERE username=" + '"' + current_user + '"';
            db.query(db_query, function(error, result, fields) {
                if (error) throw error;
                res.status(200).send({success: true});
            });
        }
    });

});