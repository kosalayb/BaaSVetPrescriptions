pragma solidity ^0.5.16;
import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";
import "../contracts/ePrescription.sol";
import "../contracts/Migrations.sol";

contract TestePrescription{
    
    ePrescription epres;

    function beforeAll() public{
    	epres=ePrescription(DeployedAddresses.ePrescription());
    }

    function testAddMap() public{
        epres.addRegisteredVet("vet111","aaaa");
        Assert.equal(epres.getRegisteredVet("vet111"),"aaaa","return valid vet hash");
    }
    
    
}