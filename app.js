var restify = require('restify');
var mongojs = require('mongojs');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'developement';

var ip_address = '192.168.0.102';
var port =  process.env.PORT || '8081';

var server = restify.createServer({
	name: "NeuBeaconRest"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(restify.CORS());
var connection_string = '';

if(env === 'developement'){
    connection_string = '127.0.0.1:27017/ibeacons';
}
else {
    connection_string = 'mongodb://sureshballa:password@ds033679.mongolab.com:33679/ibeacons';
}
var db = mongojs(connection_string, ['ibeacons']);
var ibeacons = db.collection("ibeacons");

var PATH = '/ibeacons'
server.get({path : PATH , version : '0.0.1'} , findAlliBeacons);
server.get({path : PATH +'/:ibeaconId' , version : '0.0.1'} , findiBeacon);
server.post({path : PATH , version: '0.0.1'} ,postNewiBeacon);
server.put({path: PATH, version: '0.0.1'}, updateiBeacon);
server.del({path : PATH +'/:ibeaconId' , version: '0.0.1'} ,deleteiBeacon);

server.listen(port, ip_address, function(){
	console.log("%s listening at %s", server.name, server.url);
});

function findAlliBeacons(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    ibeacons.find().limit(200).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }
 
    });
 
}
 
function findiBeacon(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    console.log('id is ' + req.params.ibeaconId);
    ibeacons.findOne({_id:req.params.ibeaconId} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}
 
function postNewiBeacon(req , res , next){
    var ibeacon = {};
    ibeacon.title = req.params.title;
    ibeacon.description = req.params.description;
    ibeacon.location = req.params.location;
    ibeacon._id = req.params._id;
    ibeacon.postedOn = new Date();
 
    res.setHeader('Access-Control-Allow-Origin','*');
 
    ibeacons.insert(ibeacon , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , ibeacon);
            return next();
        }else{
            return next(err);
        }
    });
}

function updateiBeacon(req , res , next){
    var ibeacon = {};
    ibeacon.title = req.params.title;
    ibeacon.description = req.params.description;
    ibeacon.location = req.params.location;
    ibeacon.updatedOn = new Date();

    ibeacons.update({_id:req.params._id}, { $set: ibeacon } , function(err, success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , ibeacon);
            return next();
        }else{
            return next(err);
        }
    });
}
 
function deleteiBeacon(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    ibeacons.remove({_id:req.params.ibeaconId} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();      
        } else{
            return next(err);
        }
    })
}

