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

interface IVenuePumpFun {
    function getBuyQuote(uint256 solAmountIn) external view returns (uint256 tokenAmountOut);
    function getSellQuote(uint256 tokenAmountIn) external view returns (uint256 solAmountOut);
    function getCurrentPrice() external view returns (uint256 price);
    function getBondingProgress() external view returns (uint256 progress);
    function hasGraduated() external view returns (bool);
    function buy() external payable returns (uint256 tokenAmount);
    function sell(uint256 tokenAmount) external returns (uint256 solAmount);
}

contract Router {
    address public immutable venueA;
    address public immutable venueB;
    address public immutable venuePumpFun;

    constructor(address _venueA, address _venueB, address _venuePumpFun) {
        require(_venueA != address(0), "venueA zero");
        require(_venueB != address(0), "venueB zero");
        require(_venuePumpFun != address(0), "venuePumpFun zero");
        venueA = _venueA;
        venueB = _venueB;
        venuePumpFun = _venuePumpFun;
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

    function getQuotePumpFun(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        // PumpFun uses ETH/SOL as base, so check direction
        // For buying tokens: SOL -> Token (use getBuyQuote)
        // For selling tokens: Token -> SOL (use getSellQuote)

        // Simplified: assume buying if amountIn > 0
        amountOut = IVenuePumpFun(venuePumpFun).getBuyQuote(amountIn);
    }

    function getBestVenue(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint8 bestVenue, uint256 amountOut) {
        uint256 outA = IVenueA(venueA).getAmountOut(amountIn, tokenIn, tokenOut);
        uint256 outB = IVenueB(venueB).getAmountOut(amountIn, tokenIn, tokenOut);
        uint256 outPumpFun = IVenuePumpFun(venuePumpFun).getBuyQuote(amountIn);

        // Find best quote
        amountOut = outA;
        bestVenue = 1; // VenueA

        if (outB > amountOut) {
            amountOut = outB;
            bestVenue = 2; // VenueB
        }

        if (outPumpFun > amountOut) {
            amountOut = outPumpFun;
            bestVenue = 3; // RobinPump.fun
        }
    }

    function getPumpFunInfo() external view returns (
        uint256 currentPrice,
        uint256 bondingProgress,
        bool graduated
    ) {
        currentPrice = IVenuePumpFun(venuePumpFun).getCurrentPrice();
        bondingProgress = IVenuePumpFun(venuePumpFun).getBondingProgress();
        graduated = IVenuePumpFun(venuePumpFun).hasGraduated();
    }

    function swapBestRoute(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    ) external payable returns (uint256 amountOut, uint8 usedVenue) {
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
        } else if (bestVenue == 2) {
            amountOut = IVenueB(venueB).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                tokenIn,
                tokenOut,
                msg.sender
            );
        } else if (bestVenue == 3) {
            // RobinPump.fun: Buy tokens with ETH
            amountOut = IVenuePumpFun(venuePumpFun).buy{value: msg.value}();
            require(amountOut >= amountOutMin, "Router: pumpfun slippage");
        }

        usedVenue = bestVenue;
    }
}