pragma solidity ^0.5.16;
//pragma experimental ABIEncoderV2;

contract ePrescription {
    
    mapping(string=>string) public vets; //vetID->vetHash on IPFS, Vet details can be extracted from IPFS
    mapping(string=>string) public trustW; //farmer ID => hash of trust details on IPFS
    mapping(string=>string) public presDetails; // serial no => hash of prescription details on IPFS

    event eventCreatePrescription(
        string serialNo,
        string farmerID,
        string vetID,
        string presHash,
        uint256 timestamp
    );

    event eventRegisterVet(
        string vetID,
        string vetDetailsHash,
        uint256 timestamp
    );

    event eventCreateTrustW(
        string farmerID,
        string hash,
        uint256 timestamp
    );

   

//----trust calculations for farmers

    //adding hash of trustworthiness details (farmeID:Hash of trustworthiness) to blockchain
    function addingTrustW(string memory farmerID, string memory hash)public{
        trustW[farmerID]=hash;
        emit eventCreateTrustW(farmerID, hash, block.timestamp);
    }



//---adding and viewing vet practioners

    //adding registered vets to the map. Vet details are on IPFS
    function addRegisteredVet(string memory _vetID, string memory _vetHash) public {
        vets[_vetID]=_vetHash;
        emit eventRegisterVet(_vetID,_vetHash,block.timestamp);
    }

    //get hash of vet details - vet details can be found in IPFS using the hash
    function getRegisteredVet(string memory _vid) public view returns(string memory){
        return vets[_vid];
    }


//---adding/viewing prescriptions

    //adding prescriptions to a map
    function addPrescription(string memory _serialNo, string memory _farmerID, string memory _vetID, string memory _presHash)public{ 
        presDetails[_serialNo]=_presHash;
        emit eventCreatePrescription(_serialNo, _farmerID, _vetID, _presHash,block.timestamp);
    }

    //get prescriptions from the map based on the serial no
    function getPrescription(string memory _serialNo)public view returns(string memory){
        return presDetails[_serialNo];
    }




    //TODO: 1. find all prescriptions issued by a vet
    //TODO: 2. update prescription when buying medicine (3.2 animal remedy dispensed). Records will be added only to this section of the created prescription. 
    //TODO: 3. update prescription when administering medicine (3.3 animal remedy administered). Records will be added only to this section of the created prescription.  

}