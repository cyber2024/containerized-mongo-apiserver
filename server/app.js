const express = require('express');
const app = express();
let mongoose = require('mongoose');

mongoose.connection.on('connected', ()=>{
    console.log("connected")
})
mongoose.connection.on('error', err=>{
    console.log(err);
    setTimeout(connect, 5000);
})

function connect(){
    mongoose.connect('mongodb://mongo:27017/api');
}
connect();

let EndpointSchema = new mongoose.Schema({
    name: {type: 'string', required: true}, 
    description: 'string'
});
let Endpoint = mongoose.model('Endpoint', EndpointSchema);


function logger(req,res,next){
    console.log(`${req.method}\t${req.path}`);
    next();
}

app.use(logger);
app.use('/', express.static(__dirname+'/../public'));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/../public/index.html');
})
app.get('/health', function(req,res){
    res.sendStatus(200);
})
app.get('/endpoints', function(req,res){
    if(mongoose.connection.readyState == 1){
        Endpoint.find()
        .exec()
        .then(async endpoints=>{
            if(endpoints.length === 0)
                endpoints = await createEndpoints();
            console.log({endpoints})
            return res.send(endpoints);
        })
        .catch(err=>{
            console.log('Caught: ', err);
            return res.sendStatus(500);
        })
    } else {
        return res.json([{name:"Database not connected"}]);
    }
})
async function createEndpoints(){
    let promises = ["get","post","delete","update"].map(el=>{
        return new Endpoint({name: el.toUpperCase(), description: el}).save();
    });
    promises = await Promise.all(promises);
    return promises;
}

app.set('PORT', process.env.PORT || 8080);
app.listen(app.get('PORT') || 8080, ()=>{
    console.log('listening on ' + app.get('PORT'));
})