$(document).ready( function () { 


	$("#viewTrust").click(async function (){


		let ps=instance.getPastEvents('createTrustW',
			{
		        fromBlock: 0,
		        toBlock: 'latest'
			});

		var para = document.createElement("P");
		var _farmerID = $("#farmerID").val();

		ps.then((events)=>{
				console.log(events);
				l = events.length;

				//iterate for all events
        		for (var i = l - 1; i >= 0; i--) {

        			var tmp = events[i];
        			var id = tmp.returnValues[0];
        			var hash=tmp.returnValues[1];

        			//select events for a given farmer
        			if (_farmerID===id){

        				//alert(_farmerID +":"+id);

        				var _url="https://gateway.ipfs.io/ipfs/"+hash;
        				console.log("url :"+_url);

        				//read data from url
        				$.get( _url, function(data, status){
        					//console.log("data :"+data);
        					var tmp= "Date:"+ data["Date"] +"  ---->  "+"Trustworthiness :"+ data["Trustworthiness"];
        					var text = document.createTextNode(tmp);

        					var br = document.createElement("br");
        					document.getElementById("add_to_me").appendChild(br);//adding empty line
        					document.getElementById("add_to_me").appendChild(text);


        				});

        			}


        		}//end for

        		
        		console.log("para" + para);
		});



		

	});






});