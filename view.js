
function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 

include('server.js');


$(document).ready(function () { 


    $("#view").click(function (){

      // adding values to table
      var table = document.getElementById('viewTable');
    

      //reading events
      instance.getPastEvents('eventCreatePrescription',
        {
              fromBlock: 0,
              toBlock: 'latest'
        },
        (error, events)=>{
          //console.log(events[0]);
          console.log("number of events :"+events.length);
          let len=events.length;

          for(let i=len-1; i>=0;i--){

            var row = document.createElement('tr');

            var td_btn = document.createElement('td');
            var r_btn = document.createElement('td');


            var btn= document.createElement("button");
            btn.setAttribute('content', 'test content');
            btn.setAttribute('class', 'btn');
            btn.setAttribute("id","id"+i);
            var txt = document.createTextNode("Block Details");//creat text on button
            btn.appendChild(txt);//attached text on button


            //create a button for records
            var rbtn= document.createElement("button");
            rbtn.setAttribute('content', 'test content');
            rbtn.setAttribute('class', 'btn');
            rbtn.setAttribute("id","id"+i);
            var rtxt = document.createTextNode("Details of Record "+i);//creat text on button
            rbtn.appendChild(rtxt);//attached text on button


            td_btn.appendChild(btn);
            r_btn.appendChild(rbtn);


            row.appendChild(r_btn);
            row.appendChild(td_btn);
            table.children[0].appendChild(row);

            //display record details
            rbtn.onclick = function(){

              var _id=event.srcElement.id;
              console.log("ID",_id);
              var n=_id.slice(2);// delete the first two characters
              var tmp=events[n];

              var str=tmp.returnValues['pres'];
              console.log("prescription :" +str);

              var para = document.createElement("P");

              var remedy=str[4].split(',');
              var dispensed=str[6].split(',');
              var vetDetails=str[7];

              var displayData = "Serial Number:"+str[0]+"<br/>" + 
                              "Prescription Granted To: Name :"+str[1]+"<br/>"+"Prescription Granted To: Address :"+str[2]+"<br/>"+
                              "Validity: This prescription is valid until: "+str[3]+"<br/>"+"===================="+"<br/>"+
                              "Animal Remedy Prescribed/Dispensed :"+"<br/>"
                              +"Description or Identity of Animal(s): "+remedy[0]+" | " +"Authorised Name of Animal Remedy *1: "+remedy[1]+" | " +
                              "VPA Or  EU Numbe: "+remedy[2]+" | " +"Total quantity: "+remedy[3]+" | " +"Dose  Rate: "+remedy[4]+" | " +
                              "Frequency of treatment: "+remedy[5]+" | " +"Manner/Site of administering: "+remedy[6]+" | " +
                              "Withdrawal Period(s)*2 Meat: "+remedy[7]+" | " +"Withdrawal Period(s)*2 Milk: "+remedy[8]+ " || " +
                              "Batch No: "+dispensed[0]+" | "+"Expiry Date: "+dispensed[1]+" | " +"Quantity & Date: "+dispensed[2]+"<br/>"+"===================="+"<br/>"+
                              "Special Instructions, Precautions, Risks: " + str[5] + "<br/>"+ "===================="+ "<br/>"+    
                              "Prescribing veterinarian :"  + "<br>"+  
                              "Name: "+vetDetails[0] +" | "+ "Practice Name: "+vetDetails[1]+ "<br/>"+
                              "Address: "+ vetDetails[2] + "<br/>"+
                              "Contact Details:"+ vetDetails[3] + "<br/>"+
                              "Signature:"+ vetDetails[4] + "<br/>"+
                              "Date:"+ vetDetails[5] ;

              para.innerHTML = displayData;


              var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
              winPrint.document.write(para.innerHTML);
              winPrint.focus();

            }


            btn.onclick = function(){
              //alert(event.srcElement.id);
              var _id=event.srcElement.id;
              var n=_id.slice(2);// delete the first two characters
              var tmp=events[n];
              //var data=JSON.stringify(tmp);
              console.log(tmp);

              var ts=tmp.returnValues['timestamp'];
              var tstime = new Date(ts*1000).toTimeString();

              var para = document.createElement("P");
              para.innerHTML="Transaction Hash :"+tmp['transactionHash']+"<br>"
                      +"Block Hash :" + tmp['blockHash'] +"<br>"
                      +"Block Number :"+ tmp['blockNumber']+"<br>"
                      +"Contract Address :"+tmp['address']+"<br>"
                      // +"Document Hash :"+tmp.returnValues['hash']+"<br>"
                      +"Block Time :"+tstime;

              var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
              winPrint.document.write(para.innerHTML);
              winPrint.focus();
              
            };

          }//end for


        } //events

      );






    });//end view click



});//end document