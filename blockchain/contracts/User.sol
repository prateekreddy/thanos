pragma solidity ^0.4.23;

import "./OnBoarding.sol";

contract User {
    bytes32 public userId;
	address userKey;
	uint256 public reputation;
	uint256 public borrowerNonce;
	address onBoarder;
    
    struct Loan {
	    address borrower;
	    bytes32 borrowerId;
	    address lender;
	    bytes32 lenderId;
	    uint256 amount;
	    uint256 noOfInstallments;
	    bytes32[] installments;
	    uint256 interestRate;
	    uint256 amountToRepay;
	    uint256 timePeriod;
	}
	
	mapping(bytes32 => Loan) loansProvided;
	mapping(bytes32 => Loan) loansTaken;
	// TODO - create nominees for changing userKey
	
	function verifySign(bytes32 hashedValue, uint8 v, bytes32 r, bytes32 s, address sigAddress) internal pure returns(bool verified) {
	    bytes memory prefix = "\x19Ethereum Signed Message:\n64";
        bytes32 prefixedHash = keccak256(prefix, hashedValue);
        require(ecrecover(prefixedHash, v, r, s) == sigAddress);
        return true;
	}
	
	function ifNonceValid(address borrower, uint256 nonce) internal view returns(bool nonceValid) {
	    User user = User(borrower);
	    require(user.borrowerNonce() == nonce);
	    return true;
	}
	
	function ifValidUser(address _user, bytes32 _userId) internal view returns(bool validUser) {
	    OnBoarding onBoard = OnBoarding(onBoarder);
	    require(onBoard.users(_userId) == _user);
	    return true;
	}

	constructor(bytes32 _userId, address _userKey) public {
		userKey = _userKey;
		userId = _userId;
		onBoarder = msg.sender;
	}

	function changeReputation(uint changeType, uint amount, uint time) {
	    
	}
	
	function calculateTotalAmount(uint256 amount, uint256 time, uint256 interestRate) public pure returns (uint256){
	    return amount+(amount*time*interestRate)/100*100*365;
	}

	function lend(uint256 nonce, bytes32 loanId, uint256 time, uint noOfInstallments, uint interestRate, bytes32 borrowerId, address borrower, uint amount, bytes32 hashedValue, uint8 v, bytes32 r, bytes32 s) public {
	    require(ifValidUser(borrower, borrowerId));
	    require( ifNonceValid(borrower, nonce) );
	    require(verifySign(hashedValue, v, r, s, borrower));
	    
		require(User(borrower).borrow(loanId, userId));
		bytes32[] memory paidInstallments;
		loansProvided[loanId] = Loan(borrower, borrowerId, this, userId, amount, noOfInstallments, paidInstallments, interestRate, calculateTotalAmount(amount, time, interestRate), time);
    }

    function installmentRepaid(uint256 nonce, uint amount) public {

    }

	function borrow(bytes32 loanId, bytes32 lenderId) public returns (bool borrowSuccess) {
	    require(ifValidUser(msg.sender, lenderId));
	    address lender;
	    uint256 amount;
	    uint256 noOfInstallments;
	    uint256 interestRate;
	    uint256 amountToRepay;
	    uint256 time;
	    (, , lender, , amount, noOfInstallments, interestRate, amountToRepay, time) = User(msg.sender).getLoan(loanId, 1);
	    bytes32[] memory paidInstallments;
        loansTaken[loanId] = Loan(this, userId, msg.sender, lenderId, amount, noOfInstallments, paidInstallments, interestRate, amount+(amount*time*interestRate)/100*100*365, time);
		borrowerNonce = borrowerNonce + 1;
        return true;
    }

    function repayInstallment(uint256 nonce, uint amount) public {

    }

    function closeLoan(uint256 nonce) public {
        
    }
    
    function getLoan(bytes32 loanId, uint256 loanType) public view returns(address borrower,
	    bytes32 borrowerId,
	    address lender,
	    bytes32 lenderId,
	    uint256 amount,
	    uint256 noOfInstallments,
	    uint256 interestRate,
	    uint256 amountToRepay,
	    uint256 timePeriod) {
	        Loan memory loan;
	        if(loanType == 1) {
	            loan = loansProvided[loanId];
	            return (loan.borrower, loan.borrowerId, loan.lender, loan.lenderId, loan.amount, loan.noOfInstallments, loan.interestRate, loan.amountToRepay, loan.timePeriod);
	        } else if(loanType == 2) {
	            loan = loansTaken[loanId];
	            return (loan.borrower, loan.borrowerId, loan.lender, loan.lenderId, loan.amount, loan.noOfInstallments, loan.interestRate, loan.amountToRepay, loan.timePeriod);
	        }
	    }
    
    function whoami() public pure returns(uint256 contractType) {
        return 1;
    }
}