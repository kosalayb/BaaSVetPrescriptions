const ePrescription = artifacts.require("ePrescription");

module.exports = function(deployer) {
  deployer.deploy(ePrescription);
};
