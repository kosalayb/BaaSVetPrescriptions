$(document).ready(function () { 
	clearRecords();
	autoFillVetDetails();
	processPrescriptions();
});


//clear fields
function clearRecords(){
  $("#clearRecords").click(function (){
    $("#setData").trigger('reset');
  });
}


//get json object from a given url
function getJson(_url){
	  $.ajax({
	    url:_url,
	    dataType: 'json',
	    success:function(data){
	    	//return data;
	    	var _jsonData= JSON.stringify(data);
	    	console.log("data :" + _jsonData);
	    	var parsedJSON = JSON.parse(_jsonData);
	    	console.log("vet_name====>"+parsedJSON.vet_name);
			$("#_v1").val(parsedJSON.vet_name);
			$("#_v2").val(parsedJSON.vet_practice_name);
			$("#_v3").val(parsedJSON.vet_address);
			$("#_v4").val(parsedJSON.vet_contact_details);
			$("#_v5").val(parsedJSON.vet_signature);
			//set current time
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var dateTime = date+' '+time;
			$("#_v6").val(dateTime);
	    },
	    error:function(error){
	    	console.log("reading json object error :"+error);
	    }

	 });
}


//autofill registered vet practioner details
function autoFillVetDetails(){
	//Registered vet details fill from the registry
	$("#_v1").click(async function (){
		//alert("click text box");
		var _vid =$("#_v1ID").val();
		console.log("vid :" +_vid);
		instance.methods.getRegisteredVet(_vid).call()
				.then(result =>{
					console.log("result===>"+result);
					//https://gateway.ipfs.io/ipfs/QmdtfayHRcUzeZjfVYdm9ZshfzagbWEoeJYbWiE6FiqAFN
					var url = "https://gateway.ipfs.io/ipfs/"+result;
					console.log("url : "+url);
					//window.open(url);
					getJson(url);
		});

	});
}



//Process prescriptions - add records, view records
function processPrescriptions(){


	$("#addRecords").click(async function (){

		console.log("I am in addPrescription.js");

		//create prescription parameters
		var _serialNo = $("#serialNo").val();

		var _grantedTo_name = $("#grantedTo_name").val();
		var _grantedTo_address = $("#grantedTo_address").val();

		var _validity = $("#validity").val();

		var _remedy_details = $("#_I1").val() +","+$("#_I2").val() +","+ $("#_I3").val()+"," +$("#_I4").val() 
							  +","+$("#_I5").val() +","+ $("#_I6").val()+","+$("#_I7").val() +","+ $("#_I8").val()+"," +$("#_I9").val();
		var _dispensed_details = $("#_I10").val() +","+$("#_I11").val() +","+ $("#_I12").val()+","+ $("#_I13").val() ;
		var _administered_details = $("#_I20").val() +","+$("#_I21").val() +","+ $("#_I22").val()+","+ $("#_I23").val() ;

		var _special_instructions = $("#special_instructions").val();

		//creat vet - parameters
		var _vid =$("#_v1ID").val();
		var _name =$("#_v1").val();
		var _pname =$("#_v2").val();
		var _address =$("#_v3").val();
		var _contact_details =$("#_v4").val();
		var _signature =$("#_v5").val();
		var _date =$("#_v6").val();

		var _vet_details=_vid+","+_name+","+_pname+"."+_address+","+_contact_details+","+_signature+","+_date;


		//build a json object for prescription details
		var jsonPrescription = JSON.stringify({
			"serialNo": _serialNo,
			"grantedTo_name":_grantedTo_name,
			"grantedTo_address":_grantedTo_address,
			"validity":_validity,
			"remedy_details":_remedy_details,
			"dispensed_details":_dispensed_details,
			"administered_details":_administered_details,
			"special_instructions":_special_instructions,
			"vet_details":_vet_details
		});

		//write prescription json object to IPFS
		$.ajax({
			url: "http://localhost:3000/writeJSON",
			method:"POST",
			data:jsonPrescription,
			contentType:"application/json",
			success: function(_hash){ 
				console.log("write Json to IPFS:"+_hash);

				//TODO: Record on blockchain - map(serial number, hash of the file)
				instance.methods.addPrescription(_serialNo,_grantedTo_name,_vid,_hash)
				.send({
						from: account,
						gas:150000,
						gasPrice:'125000000000'
					})
				.then(function(tx){
					console.log("Transaction for adding a prescription:",tx);
				});

			},
			error:function(jqXHR, textStatus, errorThrown){
			   	console.log("POST ERROR :"+errorThrown);
			}
		});


	});//end button click

}



// function include(file) { 
//   var script  = document.createElement('script'); 
//   script.src  = file; 
//   script.type = 'text/javascript'; 
//   script.defer = true; 
//   document.getElementsByTagName('head').item(0).appendChild(script); 
// } 

		// //create vet
		// instance.methods.addVet(_vid,_name,_pname,_address,_contact_details,_signature,_date)
		// 	.send({
		// 		from: account,
		//  		gas:1500000,
		//  		gasPrice: '30000000000000'
		// 	})
		// 	.then(function(tx){
		// 		console.log("Transaction for creating vet:",tx);
		// });


		// //reading from solidity get function
		// instance.methods.getVetDetails().call()
		// .then( result => {
		// 			var vet = result;
		// 			console.log("result is", vet);

		// 			//create prescription
		// 			instance.methods.createPrescription(_serialNo, _grantedTo_name, _grantedTo_address, _validity, _remedy_details, _special_instructions,_dispensed_details, vet)
		// 				.send({
		// 					from: account,
		//  					gas:1500000,
		//  					gasPrice: '30000000000000'
		// 				})
		// 				.then(function(tx){
		// 					console.log("Transaction for creating prescription:",tx);
		// 			});

		// 			//view created prescription
		// 			instance.methods.getPrescriptions().call()
		// 			.then( pres =>{
		// 				console.log("new prescription is", pres);
		// 			});
		// });
	

