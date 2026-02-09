// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IERC20.sol";

interface IVenueA {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut);

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 amountOut);
}

interface IVenueB {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut);

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 amountOut);
}

contract Router {
    address public immutable venueA;
    address public immutable venueB;

    constructor(address _venueA, address _venueB) {
        require(_venueA != address(0), "venueA zero");
        require(_venueB != address(0), "venueB zero");
        venueA = _venueA;
        venueB = _venueB;
    }

    function getQuoteVenueA(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        amountOut = IVenueA(venueA).getAmountOut(amountIn, tokenIn, tokenOut);
    }

    function getQuoteVenueB(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        amountOut = IVenueB(venueB).getAmountOut(amountIn, tokenIn, tokenOut);
    }

    function getBestVenue(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint8 bestVenue, uint256 amountOut) {
        uint256 outA = IVenueA(venueA).getAmountOut(amountIn, tokenIn, tokenOut);
        uint256 outB = IVenueB(venueB).getAmountOut(amountIn, tokenIn, tokenOut);

        if (outA >= outB) {
            bestVenue = 1; // A
            amountOut = outA;
        } else {
            bestVenue = 2; // B
            amountOut = outB;
        }
    }

    function swapBestRoute(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external returns (uint256 amountOut, uint8 usedVenue) {
        require(amountIn > 0, "amountIn = 0");

        // 1. Pull tokenIn from user
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "Router: transferFrom failed"
        );

        // 2. Approve venues (simple, not gas-optimised)
        require(
            IERC20(tokenIn).approve(venueA, amountIn),
            "Router: approve A failed"
        );
        require(
            IERC20(tokenIn).approve(venueB, amountIn),
            "Router: approve B failed"
        );

        // 3. Compute best venue
        (uint8 bestVenue, uint256 bestAmountOut) = this.getBestVenue(
            tokenIn,
            tokenOut,
            amountIn
        );
        require(bestAmountOut >= amountOutMin, "Router: slippage");

        // 4. Execute swap on chosen venue
        if (bestVenue == 1) {
            amountOut = IVenueA(venueA).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                tokenIn,
                tokenOut,
                msg.sender
            );
        } else {
            amountOut = IVenueB(venueB).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                tokenIn,
                tokenOut,
                msg.sender
            );
        }

        usedVenue = bestVenue;
    }
}