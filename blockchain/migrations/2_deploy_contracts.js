var ConvertLib = artifacts.require("./User.sol");
var MetaCoin = artifacts.require("./OnBoarding.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};
