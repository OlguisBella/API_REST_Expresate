
var http = require('http'),
	express  = require('express'),
	bodyParser   = require('body-parser');

var multer = require('multer'); 
const pg    = require('pg');

pg.defaults.ssl = true;
var conString = "postgres://stnzxomwmgvbxu:2497a58b8a9a79df90811e6b11aab4015761ca8313ee761ce4b4cd476c0f1dc3@ec2-54-221-238-248.compute-1.amazonaws.com:5432/d4viksdgp0darc"
var express = require('express');
var http = require('http'),
    formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra');
function permitirCrossDomain(req, res, next) {
  //en vez de * se puede definir SÓLO los orígenes que permitimos
  res.header('Access-Control-Allow-Origin', '*'); 
  //metodos http permitidos para CORS
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.use(permitirCrossDomain);


app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/listRespuesta', (req, res, next) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
    
        client.query('SELECT * FROM respuesta', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
    
            client.end();
            return res.json(result.rows);
            
        });
    });
});

app.get('/listRespuesta/:id',(req,res)=>{
    var client = new pg.Client(conString);
    var id=req.params.id;

    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT * FROM respuesta WHERE id=' + id + ';', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            
            //console.log(result);
                client.end();
            return res.json(result.rows);
        
        });
        
    });
});
app.post('/SaveRespuesta', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        
        console.log("commit "+util.inspect(req,false,null));
        
        client.query("INSERT INTO  respuesta  (p1, p2) VALUES ('"+req.body.p1+"', '"+req.body.p2+"');", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
        
            //console.log(result);
            client.end();
            return res.json(result.rows);
            
        });
        
    });
});

app.listen(process.env.PORT || 8080, function(){console.log("the server is running");});

