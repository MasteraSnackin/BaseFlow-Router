// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IERC20.sol";

contract VenueAStub {
    // Very simple constant-price AMM-style stub
    // rate: how many tokenOut units per 1 tokenIn, scaled by 1e18
    uint256 public rate; // e.g. 1e18 = 1:1

    constructor(uint256 _rate) {
        rate = _rate;
    }

    function setRate(uint256 _rate) external {
        rate = _rate;
    }

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256) {
        // ignore tokens here, just apply rate
        return (amountIn * rate) / 1e18;
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut) {
        // pull tokenIn from caller
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "VenueA: transferFrom failed"
        );

        // compute output
        amountOut = (amountIn * rate) / 1e18;
        require(amountOut >= amountOutMin, "VenueA: slippage");

        // send tokenOut to recipient
        require(
            IERC20(tokenOut).transfer(to, amountOut),
            "VenueA: transfer out failed"
        );
    }
}