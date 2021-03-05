//get json object from a given url
function getJson(_url){
	  $.ajax({
	    url:_url,
	    dataType: 'json',
	    success:function(data){
	    	//return data;
	    	var _jsonData= JSON.stringify(data,null,'\n');
	    	console.log("data :" + _jsonData);
	    	document.getElementById('mydiv').innerHTML+=_jsonData+"<br>"+"<br>";

	    },
	    error:function(error){
	    	console.log("reading json object error :"+error);
	    }

	 });
}




$(document).ready( function () { 


	$("#viewPres").click(function (){
		//alert("I am in view prescription");
		//reading events
        instance.getPastEvents('eventCreatePrescription',
	        {
	              fromBlock: 0,
	              toBlock: 'latest'
	        },
	        (error, events)=>{
		          console.log("number of events :"+events.length);
		          let len=events.length;
		          document.getElementById('mydiv').innerHTML="";

		          for(let i=len-1; i>=0;i--){

		          	    var tmp=events[i];
		          	    var _serialNo=tmp.returnValues['serialNo'];
		          	    var _hash=tmp.returnValues['presHash'];
		          	    var _timeStamp=tmp.returnValues['timestamp'];
		          	    var _farmerID=tmp.returnValues['farmerID'];
		          	    var _vetID=tmp.returnValues['vetID'];

		          	    // compare serial numbers - user input and one read from events
		          	    var _tmpSN =$("#SerialNo").val();
		          	    var farmer=$("#FarmerID").val();
		          	    var vet=$("#vetID").val();

		          	    if(_tmpSN===_serialNo){
		          	    	console.log("matching ===>"+_tmpSN+":"+_serialNo);
		          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
		          	    	getJson(url);
		          	    }else
		          	    if(_farmerID===farmer){
		          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
		          	    	getJson(url);
		          	    }else
		          	    if(_vetID===vet){
		          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
		          	    	getJson(url);
		          	    }

		          }

			});



	});





});