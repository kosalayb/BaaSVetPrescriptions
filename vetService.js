
$(document).ready( function () { 


	//clear fields
	function clearRecords(){
	  $("#clearVRecords").click(function (){
	    $("#vetData").trigger('reset');
	  });
	}

	//check registered vet on IPFS
	$("#checkVRecords").click(async function(){

		var _vid =$("#_vRID").val();
		instance.methods.getRegisteredVet(_vid).call()
			.then(result =>{
				console.log("result===>"+result);
				//https://gateway.ipfs.io/ipfs/QmdtfayHRcUzeZjfVYdm9ZshfzagbWEoeJYbWiE6FiqAFN
				var url = "https://gateway.ipfs.io/ipfs/"+result;//.split(":")[1];
				console.log("url : "+url);
				window.open(url);
			});
	});



	//function to call registerVet() function from the smart contract
	$("#addVRecords").click(async function (){

			alert("I am in register.js - to register a veterinary doctor details");

			//extract vet - parameters
			var _vid =$("#_vrID").val();
			var _name =$("#_vr1").val();
			var _pname =$("#_vr2").val();
			var _address =$("#_vr3").val();
			var _contact_details =$("#_vr4").val();
			var _signature =$("#_vr5").val();
			var _date =$("#_vr6").val();

			var jsonData = JSON.stringify({
				"vet_id":_vid,
				"vet_name":_name,
				"vet_practice_name":_pname,
				"vet_address":_address,
				"vet_contact_details":_contact_details,
				"vet_signature":_signature,
				"vet_date":_date
			});

			//writing vet details to ipfs network using a post in nodejs(app.js)
			$.ajax({ 
			   url: "http://localhost:3000/addVet",
			   method:"POST",
			   data:jsonData,
			   contentType:"application/json",
			   success: function(vetHash){        
			     	console.log("addVet POST successful:"+vetHash);

					//writing vet id and IPFS hash of the vet details to blockchain
					instance.methods.addRegisteredVet(_vid,vetHash)
					.send({
							from: account,
							gas:150000,
							gasPrice:'125000000000'
						})
					.then(function(tx){
						console.log("Transaction for creating vet:",tx);
					});

			   },
			   error:function(jqXHR, textStatus, errorThrown){
			   	console.log("POST ERROR :"+errorThrown);
			   }
			});//end ajax call


		});
});
