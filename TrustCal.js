$(document).ready( function () { 

	$("#TrustCalc").click(async function (){

			console.log("I am in TrustCal js - to calculate and save trustworthiness of farmer");
			alert("calculate trusthworthiness and write to blockchain");

			//extract trust - parameters
			var _farmerID =$("#_FarmerID").val();
			var _date = $("#_Date").val();
			var _TAC1 =parseFloat($("#_TAC1").val());
			var _TAC2 =parseFloat($("#_TAC2").val());
			var _TAC3 =parseFloat($("#_TAC3").val());
			var _TAC4 =parseFloat($("#_TAC4").val());
			var _TAC5 =parseFloat($("#_TAC5").val());
			var _TAC6 =parseFloat($("#_TAC6").val());
			var _TAC7 =parseFloat($("#_TAC7").val());

			var trustworthiness = ((_TAC1+_TAC2+_TAC3+_TAC4+_TAC5+_TAC6+_TAC7)/7).toFixed(2);

			//build a json object
			var jsonData = JSON.stringify({
				"FarmerID":_farmerID,
				"Date":_date,
				"Trustworthiness":trustworthiness
			});

			//writing json object to ipfs network using a post in nodejs(app.js)
			$.ajax({ 
			   url: "http://localhost:3000/writeJSON",
			   method:"POST",
			   data:jsonData,
			   contentType:"application/json",
			   success: function(_hash){        
			     	console.log("write Json to IPFS:"+_hash);

					//Recording on Blockchain
					instance.methods.addingTrustW(_farmerID,_hash)
						.send({
							from: account,
					 		gas:150000,
					 		gasPrice:'125000000000'
						})
						.then(function(tx){
							console.log("Transaction for adding trustworthiness to blockchain:",tx);
					});

			    },
			   error:function(jqXHR, textStatus, errorThrown){
			   	console.log("POST ERROR :"+errorThrown);
			   }
			});




	});


});