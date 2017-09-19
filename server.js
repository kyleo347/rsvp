const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors =  require("cors");

const config = require("./server/config");


/*
 |--------------------------------------
 | MongoDB
 |--------------------------------------
 */

mongoose.connect(config.MONGO_URI, { useMongoClient : true });
const monDb = mongoose.connection;

monDb.on('error', function(){
    
  console.error('MongoDB Connection Error. Please make sure that', config.MONGO_URI);
});

monDb.on('open', function callback(){
    console.info('connected to mongoDB: ', config.MONGO_URI);
});


/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

const port = process.env.port || '8082';
app.set('port',port);

// const domain = process.env.IP || '0.0.0.0';
// app.set('domain',domain);

// Set static path to Angular app in dist
// Don't run in dev
if(process.env.NODE_ENV !== 'dev'){
    app.use('/', express.static(path.join(__dirname, './dist')));
}


/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */
 
require("./server/api")(app,config);

// Pass routing to Angular app
// Don't run in dev

if(process.env.NODE_ENV !== 'dev'){
    app.get('*', function(req,res){
        res.sendFile(path.join(__dirname,'./dist/index.html'));
    });
}

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */
 
 app.listen(port, () => console.log(`server running on localhost:${port}`));