const hre = require("hardhat");

async function main() {
    const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1,000,000 tokens

    console.log("Deploying contracts to Base Sepolia...\n");

    // Deploy TokenMock for TokenIn
    console.log("1. Deploying TokenIn...");
    const TokenMock = await hre.ethers.getContractFactory("TokenMock");
    const tokenIn = await TokenMock.deploy("Token IN", "TIN", 18, initialSupply);
    await tokenIn.waitForDeployment();
    console.log(`   ✅ TokenIn deployed to: ${tokenIn.target}\n`);

    // Deploy TokenMock for TokenOut
    console.log("2. Deploying TokenOut...");
    const tokenOut = await TokenMock.deploy("Token OUT", "TOUT", 18, initialSupply);
    await tokenOut.waitForDeployment();
    console.log(`   ✅ TokenOut deployed to: ${tokenOut.target}\n`);

    // Fund venues with tokenOut so they can execute swaps
    console.log("3. Funding venues with TokenOut...");
    const venueSupply = hre.ethers.parseUnits("500000", 18); // 500k to each venue

    // Deploy VenueAStub with a rate
    console.log("4. Deploying VenueAStub...");
    const VenueAStub = await hre.ethers.getContractFactory("VenueAStub");
    const venueA = await VenueAStub.deploy(hre.ethers.parseUnits("1", 18)); // 1:1 rate
    await venueA.waitForDeployment();
    console.log(`   ✅ VenueAStub deployed to: ${venueA.target}`);

    // Send tokenOut to VenueA
    await tokenOut.transfer(venueA.target, venueSupply);
    console.log(`   💰 Funded VenueA with 500k TOUT\n`);

    // Deploy VenueBStub with a different rate
    console.log("5. Deploying VenueBStub...");
    const VenueBStub = await hre.ethers.getContractFactory("VenueBStub");
    const venueB = await VenueBStub.deploy(hre.ethers.parseUnits("1.05", 18)); // 1:1.05 rate (B is 5% better)
    await venueB.waitForDeployment();
    console.log(`   ✅ VenueBStub deployed to: ${venueB.target}`);

    // Send tokenOut to VenueB
    await tokenOut.transfer(venueB.target, venueSupply);
    console.log(`   💰 Funded VenueB with 500k TOUT\n`);

    // Deploy Router
    console.log("6. Deploying Router...");
    const Router = await hre.ethers.getContractFactory("Router");
    const router = await Router.deploy(venueA.target, venueB.target);
    await router.waitForDeployment();
    console.log(`   ✅ Router deployed to: ${router.target}\n`);

    // Print summary
    console.log("========================================");
    console.log("📋 Deployment Summary");
    console.log("========================================");
    console.log(`TokenIn (TIN):    ${tokenIn.target}`);
    console.log(`TokenOut (TOUT):  ${tokenOut.target}`);
    console.log(`VenueA (1:1):     ${venueA.target}`);
    console.log(`VenueB (1:1.05):  ${venueB.target}`);
    console.log(`Router:           ${router.target}`);
    console.log("========================================\n");

    console.log("💡 Next steps:");
    console.log("1. Update .env with ROUTER_ADDRESS");
    console.log("2. Test swaps using the Router contract");
    console.log("3. VenueB should give better rates (5% more output)");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
