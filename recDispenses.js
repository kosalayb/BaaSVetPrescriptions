
// //create json object with new data
// function addDispensedDetails(json_STR){

// 	if(!($("#_D10").value="")){
// 		str = $("#_D10").value+","+$("#_D20").value+","+$("#_D30").value+","+$("#_D40").value+",";
// 	}

// 	if(!($("#_D11").value="")){
// 		str+=$("#_D11").value+","+$("#_D21").value+","+$("#_D31").value+","+$("#_D41").value+",";
// 	}

// 	if(!($("#_D12").value="")){
// 		str+=$("#_D12").value+","+$("#_D22").value+","+$("#_D32").value+","+$("#_D42").value+",";
// 	}

// 	if(!($("#_D13").value="")){
// 		str+=$("#_D13").value+","+$("#_D23").value+","+$("#_D33").value+","+$("#_D43").value+",";
// 	}

// 	if(!($("#_D14").value="")){
// 		str+=$("#_D14").value+","+$("#_D24").value+","+$("#_D34").value+","+$("#_D44").value+",";
// 	}

// 	var json = JSON.parse(json_STR);
// 	json.dispensed_details=str;

// 	console.log("after adding new dispenses :"+json);

// 	return json;

// }



//get json object from a given url
function getJson(_url){
	  $.ajax({
	    url:_url,
	    dataType: 'json',
	    success:function(data){
	    	//return data;
	    	var _jsonData= JSON.stringify(data); //The result will be a string following the JSON notation.
	    	console.log("data :" + _jsonData);

	    //TODO: set data items to prescription fields
	    	var json = JSON.parse(_jsonData); //transform json string to json object
	    	console.log("serial no :" + json.serialNo);
	    	$("#SerialNo").val(json.serialNo);
			$("#serialNo").val(json.serialNo);

			//farmer details
			$("#grantedTo_name").val(json.grantedTo_name);
			$("#grantedTo_address").val(json.grantedTo_address);

			$("#validity").val(json.validity);

			//animal remedy prescribed
			var rem = json.remedy_details;
			var items = rem.split(",");
			var numRecords=items.length;
			var it= numRecords/9;
			var n=0;
			while(it >=1){ //ad each line to form
				$("#_I1"+n).val(items[n]);
				$("#_I2"+n).val(items[n+1]);
				$("#_I3"+n).val(items[n+2]);
				$("#_I4"+n).val(items[n+3]);
				$("#_I5"+n).val(items[n+4]);
				$("#_I6"+n).val(items[n+5]);
				$("#_I7"+n).val(items[n+6]);
				$("#_I8"+n).val(items[n+7]);
				$("#_I9"+n).val(items[n+8]);

				n++;
				it--;
			}

			//animal remedy dispensed
			var dispensed = json.dispensed_details;
			//alert("despensed :"+dispensed);
			var dItems=dispensed.split(",");
			var numDRecords=dItems.length;
			var dit= numDRecords/4;
			var d=0; var n=0;
			while(dit >0){ //ad each line to form
				$("#_D1"+d).val(dItems[n]);
				n++;
				$("#_D2"+d).val(dItems[n]);
				n++;
				$("#_D3"+d).val(dItems[n]);
				n++;
				$("#_D4"+d).val(dItems[n]);
				n++;

				d++;
				dit--;
			}

			//Remedy administered
			var administered = json.administered_details;
			var aItems=administered.split(",");
			var numARecords=aItems.length;
			var ait= numARecords/4;
			var a=0; var p=0;
			while(ait >0){ //ad each line to form
				$("#_A1"+a).val(aItems[p]);
				p++;
				$("#_A2"+a).val(aItems[p]);
				p++;
				$("#_A3"+a).val(aItems[p]);
				p++;
				$("#_A4"+a).val(aItems[p]);
				p++;

				a++;
				ait--;
			}

			//special instructions
			special_instructions
			var _ins = json.special_instructions;
			$("#special_instructions").val(_ins);


			//vet details
			var vetItems = json.vet_details.split(",");
			$("#_v1ID").val(vetItems[0]);
			$("#_v1").val(vetItems[1]);
			$("#_v2").val(vetItems[2]);
			$("#_v3").val(vetItems[3]);
			$("#_v4").val(vetItems[4]);
			$("#_v5").val(vetItems[5]);
			$("#_v6").val(vetItems[6]);

	    },
	    error:function(error){
	    	console.log("reading json object error :"+error);
	    }

	 });
}



//improve json object and write to blockchain
function improveJson(url){

	  console.log("in improve json function" + url);

	  $.ajax({
		    url:url,
		    dataType: 'json',
		    success:function(data){
		    	var _jsonData= JSON.stringify(data);
 				console.log("in improve json function-json object"+_jsonData);
		    	var width = 0;
		    	var str="";
		    	var str2="";
			    while(width<5){ //ad each line to form

			    	var tmp=$("#_D1"+width).val();
			    	if (tmp!=""){
			    		str += $("#_D1"+width).val() +","+$("#_D2"+width).val()+","+$("#_D3"+width).val()+","+$("#_D4"+width).val()+",";
			    	}

			    	var tmp2=$("#_A1"+width).val();
			    	if (tmp2!=""){
			    		str2 += $("#_A1"+width).val() +","+$("#_A2"+width).val()+","+$("#_A3"+width).val()+","+$("#_A4"+width).val()+",";
			    	}


					width ++;
				}//end while

				//create json object from json string
				var json = JSON.parse(_jsonData); 
				json.dispensed_details=str;
				json.administered_details=str2;

				var newJsonStr=JSON.stringify(json);
				console.log("newly build json string" + newJsonStr);

				//TODO: write json object to IPFS
				$.ajax({
					url: "http://localhost:3000/writeJSON",
					method:"POST",
					data:newJsonStr,
					contentType:"application/json",
					success: function(_hash){ 
						console.log("write Json to IPFS:"+_hash);

						var _serialNo=json.serialNo;
						var _grantedTo_name=json.grantedTo_name;
						var _vid=json.vet_details[0];
						
						// Record on blockchain - map(serial number, hash of the file)
						instance.methods.addPrescription(_serialNo,_grantedTo_name,_vid,_hash)
						.send({
								from: account,
								gas:150000,
								gasPrice:'125000000000'
							})
						.then(function(tx){
							console.log("Transaction after improving the prescription:",tx);
						});

					},
					error:function(jqXHR, textStatus, errorThrown){
					   	console.log("POST ERROR :"+errorThrown);
					}
				});

		    }

	  });



}



$(document).ready( function () { 


	$("#viewDisp").click(function (){
		//alert("view dispenses");
		
        instance.getPastEvents('eventCreatePrescription',
	        {
	              fromBlock: 0,
	              toBlock: 'latest'
	        },
	        (error, events)=>{
		          console.log("number of events :"+events.length);
		          let len=events.length;

		          //find the most recent record based on the serial number or farmer ID
		          for(let i=len-1; i>=0;i--){

		          	    var tmp=events[i];
		          	    var _serialNo=tmp.returnValues['serialNo'];
		          	    var _hash=tmp.returnValues['presHash'];
		          	    var _timeStamp=tmp.returnValues['timestamp'];
		          	    var _farmerID=tmp.returnValues['farmerID'];

		          	    // compare serial numbers - user input and one read from events
		          	    var _tmpSN =$("#SerialNo").val();
		          	    var farmer=$("#FarmerID").val();

		          	    if(_tmpSN===_serialNo){
		          	    	console.log("matching ===>"+_tmpSN+":"+_serialNo);
		          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
		          	    	getJson(url);
		          	    	return; //exit the loop
		          	    }else
		          	    if(_farmerID===farmer){
		          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
		          	    	getJson(url);
		          	    	return; //exit the loop
		          	    }

		          }

			});//end instance get events

	});//end view click





    //adding the prescription with new records
	$("#addRecords").click(async function (){
		//TODO: read all fildes, create a json object and write to IPFS and blockchain
		instance.getPastEvents('eventCreatePrescription',
			        {
			              fromBlock: 0,
			              toBlock: 'latest'
			        },
			        (error, events)=>{
				          console.log("number of events :===>"+events.length);
				          let len=events.length;

							//find the most recent record based on the serial number or farmer ID
				            for(let i=len-1; i>=0;i--){
				          	    var tmp=events[i];
				          	    console.log("event"+tmp);
				          	    var _serialNo=tmp.returnValues['serialNo'];
				          	    var _hash=tmp.returnValues['presHash'];
				          	    console.log("prescription hash from events" +_hash);

				          	    // compare serial numbers - user input and one read from events
				          	    var _tmpSN =$("#SerialNo").val();

				          	    if(_tmpSN===_serialNo){
				          	    	console.log("selected event :"+tmp);
				          	    	console.log("matching ===>"+_tmpSN+":"+_serialNo);
				          	    	var url = "https://gateway.ipfs.io/ipfs/"+_hash;
				          	    	improveJson(url); //improve and write to blockchain
				          	    	return; //exit the loop
				          	    }
		          			}//end for

		});//end instance


	});//end add records



});