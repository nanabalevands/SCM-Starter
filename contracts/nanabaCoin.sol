// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


contract nanabaCoin {

    // public variables here
    string public tokenName = "nanabaCoin";
    
    uint public totalSupply = 0;

   
    // mint function
    function mint(uint amount) public {
        totalSupply += amount;
        
    }

    // burn function
    function burn(uint amount) public {
        totalSupply -= amount;
    }

}
