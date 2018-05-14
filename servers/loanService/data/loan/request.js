const Web3 = require("web3");
const Tx = require('ethereumjs-tx');

const config = require("../../config/config.json");
const compiledContracts = require("../../build/compiledContracts.json");
const web3 = new Web3(new Web3.providers.HttpProvider(config.geth.url));
/**
 * Operations on /loan/request
 */
module.exports = {
    /**
     * summary: This endpoint helps to add an request loan.
     * description: 
     * parameters: loanDetails
     * produces: 
     * responses: 200
     * operationId: 
     */
    post: {
        200: function (req, res, callback) {
            // const signedTx = req.payload.signedTx;

            // web3.eth.sendSignedTransaction(signedTx).on('receipt', (receipt) => {
            //     callback(null, receipt);
            // });

            // console.log(req.payload)
            const payload = req.payload;

            const onBoardingContract = new web3.eth.Contract(JSON.parse(compiledContracts["User.sol:User"].abi), payload.lenderAddress);
            console.log(payload.nonce, payload.loanId, payload.duration, payload.installment, payload.interest, payload.borrowerId, payload.borrowerAddress, payload.amount, payload.hashedValue, payload.v, payload.r, payload.s)
            const txPayload = onBoardingContract.methods.lend(payload.nonce, payload.loanId, payload.duration, payload.installment, payload.interest, payload.borrowerId, payload.borrowerAddress, payload.amount, payload.hashedValue, payload.v, payload.r, payload.s).encodeABI();
            const nonce = web3.utils.toHex(payload.txNonce);
            const gasPrice = web3.utils.toHex(2);

            const txData = {
                nonce, 
                gasPrice,
                gasLimit: web3.utils.toHex(80000000),
                to: payload.lenderAddress,
                from: payload.address,
                value: '0x00',
                data: txPayload
            }

            const tx = new Tx(txData);

            const privKey = Buffer.from(payload.privateKey, 'hex')
            tx.sign(privKey);

            const rawTx = tx.serialize();

            web3.eth.sendSignedTransaction(rawTx, console.log)
        }
    }
};
