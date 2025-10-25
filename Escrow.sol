// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public buyer;
    address public seller;
    uint256 public balance;
    bool public buyerSigned;
    bool public sellerSigned;

    event Deposited(address indexed from, uint256 amount);
    event Signed(address indexed who);
    event Released(address indexed to, uint256 amount);
    event Refunded(address indexed to, uint256 amount);

    constructor(address _seller) payable {
        buyer = msg.sender;
        seller = _seller;
        if (msg.value > 0) {
            balance = msg.value;
            emit Deposited(msg.sender, msg.value);
        }
    }

    // Allow buyer or any account to deposit more funds (buyer normally)
    function deposit() external payable {
        require(msg.value > 0, "No value");
        balance += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Both parties call this to "sign" the agreement on-chain (simple flow)
    function signAgreement() external {
        require(msg.sender == buyer || msg.sender == seller, "Only parties");
        if (msg.sender == buyer) buyerSigned = true;
        if (msg.sender == seller) sellerSigned = true;
        emit Signed(msg.sender);
    }

    // When both have signed and balance > 0, either can call to release funds to seller
    function releaseIfReady() external {
        require(buyerSigned && sellerSigned, "Both parties must sign");
        require(balance > 0, "No funds");
        uint256 amt = balance;
        balance = 0;
        payable(seller).transfer(amt);
        emit Released(seller, amt);
    }

    // Buyer may refund if seller didn't sign after some time (simple version - no timeout implemented)
    function refundBuyer() external {
        require(msg.sender == buyer, "Only buyer");
        require(balance > 0, "No funds");
        uint256 amt = balance;
        balance = 0;
        payable(buyer).transfer(amt);
        emit Refunded(buyer, amt);
    }

    // View summary
    function getDetails() public view returns (address, address, uint256, bool, bool) {
        return (buyer, seller, balance, buyerSigned, sellerSigned);
    }
}
