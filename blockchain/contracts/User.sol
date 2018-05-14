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
	    uint256 createTime;
	    uint256 interestRate;
	    uint256 amountToRepay;
	    uint256 timePeriod;
	}
	
	mapping(bytes32 => Loan) loansProvided;
	mapping(bytes32 => Loan) loansTaken;
	
	event LoanProvided(bytes32 loanId, bytes32 borrowerId, bytes32 lenderId, uint256 amount, uint256 noOfInstallments, uint256 interestRate, uint256 timePeriod);
	event LoanTaken(bytes32 loanId, bytes32 borrowerId, bytes32 lenderId, uint256 amount, uint256 noOfInstallments, uint256 interestRate, uint256 timePeriod);
	event InstallmentRepaid(bytes32 loanId, bytes32 borrowerId, bytes32 lenderId, uint256 installmentAmount, uint256 remainingAmountToRepay);
	event CloseLoan(bytes32 loanId, bytes32 borrowerId, bytes32 lenderId, address closer);
	event ExtraAmountPaid(bytes32 loanId, bytes32 borrowerId, bytes32 lenderId, uint extraAmount);
	event ReputationChanged(bytes32 loanId, bytes32 userId, uint256 reputationChange, uint256 currentReputation);
	// TODO - create nominees for changing userKey
	
	function verifySign(bytes32 hashedValue, uint8 v, bytes32 r, bytes32 s, address sigAddress) internal pure returns(bool verified) {
	    bytes memory prefix = "\x19Ethereum Signed Message:\n64";
        bytes32 prefixedHash = keccak256(prefix, hashedValue);
        // require(ecrecover(prefixedHash, v, r, s) == sigAddress);
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
		reputation = 1000;
	}

	function changeReputation(uint changeType, uint amount, bytes32 loanId) internal returns(bool changeStatus) {
	    uint256 initReputation;
	    if(changeType == 1) {
	        // this is when loan is borrowed
	        initReputation = reputation;
	        reputation = reputation - 5;
	        emit ReputationChanged(loanId, userId, 5, reputation);
	        return true;
	    } else if(changeType == 2) {
	        // when installment is repaid
	        initReputation = reputation;
	        reputation = reputation + 10;
	        emit ReputationChanged(loanId, userId, 10, reputation);
	        return true;
	    } else {
	        assert(false);
	    }
	}
	
	function calculateTotalAmount(uint256 amount, uint256 time, uint256 interestRate) public pure returns (uint256){
	    return amount+(amount*time*interestRate)/100*100*365;
	}

	function lend(uint256 nonce, bytes32 loanId, uint256 time, uint noOfInstallments, uint interestRate, bytes32 borrowerId, address borrower, uint amount, bytes32 hashedValue, uint8 v, bytes32 r, bytes32 s) public {
	    require(ifValidUser(borrower, borrowerId));
	    require( ifNonceValid(borrower, nonce) );
	    require(verifySign(hashedValue, v, r, s, borrower));
	    
		require(User(borrower).borrow(loanId, userId));
		Loan memory loan = Loan(borrower, borrowerId, this, userId, amount, noOfInstallments, block.timestamp, interestRate, calculateTotalAmount(amount, time, interestRate), time);
		loansProvided[loanId] = loan;
		emit LoanProvided(loanId, borrowerId, userId, amount, noOfInstallments, interestRate, loan.timePeriod);
    }

    function installmentRepaid(bytes32 loanId, uint amount) public returns(bool isSuccess) {
        Loan storage loan = loansProvided[loanId];
		if(amount < loan.amountToRepay) {
            loan.amountToRepay = loan.amountToRepay - amount;   
        } else {
            uint256 extraAmount = amount - loan.amountToRepay;
            loan.amountToRepay = 0;
            closeLoan(loanId);
            ExtraAmountPaid(loanId, loan.borrowerId, loan.lenderId, extraAmount);
        }
		emit InstallmentRepaid(loanId, loan.borrowerId, loan.lenderId, amount, loan.amountToRepay);
		return true;
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
        loansTaken[loanId] = Loan(this, userId, msg.sender, lenderId, amount, noOfInstallments, block.timestamp, interestRate, amount+(amount*time*interestRate)/100*100*365, time);
		borrowerNonce = borrowerNonce + 1;
		require(changeReputation(1, amount, loanId));
		emit LoanTaken(loanId, userId, lenderId, amount, noOfInstallments, interestRate, time);
        return true;
    }

	// this is invoked when user is borrowering and repaying borrowed money
    function repayInstallment(bytes32 loanId, uint amount) public {
        Loan storage loan = loansTaken[loanId];
        address lenderAddress = loan.lender;
        User lender = User(lenderAddress);
        require(lender.installmentRepaid(loanId, amount));
        if(amount < loan.amountToRepay) {
            loan.amountToRepay = loan.amountToRepay - amount;   
        } else {
            uint256 extraAmount = amount - loan.amountToRepay;
            loan.amountToRepay = 0;
            closeLoan(loanId);
            ExtraAmountPaid(loanId, loan.borrowerId, loan.lenderId, extraAmount);
        }
		emit InstallmentRepaid(loanId, loan.borrowerId, loan.lenderId, amount, loan.amountToRepay);
    }

    function closeLoan(bytes32 loanId) public returns (bool isClosed) {
        Loan memory loan;
        if(loansTaken[loanId].borrower == 0x00 && loansProvided[loanId].borrower == 0x00) {
            return true;
        } else if(msg.sender == loansTaken[loanId].lender) {
            loan = loansTaken[loanId];
            require(changeReputation(2, loan.amount, loanId));
            delete loansTaken[loanId];
            emit CloseLoan(loanId, loan.borrowerId, loan.lenderId, msg.sender);
            return true;
        } else {
            loan = loansProvided[loanId];
            delete loansProvided[loanId];
            emit CloseLoan(loanId, loan.borrowerId, loan.lenderId, msg.sender);
            return true;
        }
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