// app.js
//TODO:can deploy smart contracts to Ethereum testnet using INFURA

const express = require('express');
const IPFS = require('ipfs-api');
//infura provides ipfs api to write to global IPFS network
//that can be accessed as https://gateway.ipfs.io/ipfs/<hashOfFile>
const ipfs = new IPFS({host:'ipfs.infura.io', port:5001, protocol:'https'});
var path = require('path');

const app = express();
app.use(express.json());

//file system module to read json file
var fs=require('fs')


//setting virtual path so that js files can be read from html files.
app.use('/', express.static(path.join(__dirname, '/')));


//read abi
app.get('/abi', function(req,res){
	var contract_json = "../ePrescription/build/contracts/ePrescription.json";
	var parsed= JSON.parse(fs.readFileSync(contract_json));
	var abi = parsed.abi;
	res.send(abi);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});


//---supplier as a service------------------------------------

app.get('/supplierAS/recDispenses', function(req, res) {
    res.sendFile(path.join(__dirname + '/recDispenses.html'));
});



//----------------------------------------------------------




//--farmer as a service-------------------------------

app.get('/farmerAS/remUsage', function(req, res) {
    res.sendFile(path.join(__dirname + '/recDispenses.html'));
});

app.get('/farmerAS/remPurchased', function(req, res) {
    res.sendFile(path.join(__dirname + '/remPurchased.html'));
});

//----------------------------------------------------






//----vet as a service < vetAS > ----

app.get('/vetAS/addPrescription', function(req, res) {
    res.sendFile(path.join(__dirname + '/addPrescription.html'));
});

app.get('/vetAS/vreg', function(req, res) {
    res.sendFile(path.join(__dirname + '/vreg.html'));
});

app.get('/vetAS/vpres', function(req, res) {
    res.sendFile(path.join(__dirname + '/viewPres.html'));
});

//------------------------------------------------------






//---trust as a service-----------------------------------

app.get('/trustAS/trcal', function(req, res) {
    res.sendFile(path.join(__dirname + '/trustCal.html'));
});

app.get('/trustAS/vtrust', function(req, res) {
    res.sendFile(path.join(__dirname + '/ViewTrust.html'));
});

//-------------------------------------------------------------




app.get('/view', function(req, res) {
    res.sendFile(path.join(__dirname + '/view.html'));
});



app.listen(3000, ()=>{
	console.log('Server listening on port 3000');
});


//write json object to IPFS and return hash of the file
app.post('/writeJSON', async(req,res)=>{
	const data =req.body;
	const jsonData=JSON.stringify(data);

	const filesAdded = await ipfs.add(Buffer.from(jsonData));
	const fileHash=filesAdded[0].hash;
	console.log("file hash :"+ fileHash);

	//return hash of the file
	return res.send(fileHash); 
});


//write vet details to IPFS
app.post('/addVet', async(req,res)=>{
	const data =req.body;
	const jsonData=JSON.stringify(data);
	console.log("vet details in add.js :"+jsonData);

	//write json object to IPFS
	const filesAdded = await ipfs.add(Buffer.from(jsonData));
	const fileHash=filesAdded[0].hash;
	console.log("file hash :"+ fileHash);
	//console.log(data["vet_id"]);
	return res.send(fileHash); 
	//url to view the message connected from fileHash is as follows.
	// https://gateway.ipfs.io/ipfs/QmdtfayHRcUzeZjfVYdm9ZshfzagbWEoeJYbWiE6FiqAFN
});


app.post('/upload', async(req,res)=>{
	const data = req.body;
	console.log(data);
	const fileHash = await addFile(data);
	console.log("file hash :"+ fileHash);
	return res.send('https://gateway.ipfs.io/ipfs/${fileHash}');
});


const addFile = async({ path,content})=>{
	const file ={path:path, content: Buffer.from(content)};
	const filesAdded = await ipfs.add(file);
	return filesAdded[0].hash;
}

