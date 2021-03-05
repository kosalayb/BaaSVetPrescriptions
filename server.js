//  import ePrescription from '../build/contracts/ePrescription.json';

    var provider = 'HTTP://127.0.0.1:7545';
    var web3Provider = new Web3.providers.HttpProvider(provider);
    var web3 = new Web3(web3Provider);


    var contractAddress ='0xFdf373736683Ba903F1428CD750bCC3f4B7f6FFe';
    var contractABI;

    //read abi from rest call
    function getABI(){
      $.ajax({
        url:"http://localhost:3000/abi",
        dataType: 'JSON',
        async:false,
        success:function(data){
          contractABI = data;
        }
      });
    }

    getABI();
    console.log("contractABI :"+contractABI);

    web3.eth.getBlockNumber().then((result) => {
      console.log("Latest Ethereum Block is ",result);
    });

   var instance = new web3.eth.Contract(contractABI, contractAddress);
   var account;



    //finding accounts
    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        alert("Error retrieving accounts.");
        return;
      }
      if (accounts.length == 0) {
        alert("No account found! Make sure the Ethereum client is configured properly.");
        return;
      }
      account = accounts[1];
      console.log('Account: ' + account);
      web3.eth.defaultAccount = account;
    });



