// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IERC20.sol";

contract VenueBStub {
    uint256 public rate; // tokenOut per tokenIn, 1e18 scale

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
        return (amountIn * rate) / 1e18;
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut) {
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "VenueB: transferFrom failed"
        );

        amountOut = (amountIn * rate) / 1e18;
        require(amountOut >= amountOutMin, "VenueB: slippage");

        require(
            IERC20(tokenOut).transfer(to, amountOut),
            "VenueB: transfer out failed"
        );
    }
}