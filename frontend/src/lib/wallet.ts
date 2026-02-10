export async function connectWallet(): Promise<string | null> {
  const eth = (window as any).ethereum;
  if (!eth) return null;

  const accounts: string[] = await eth.request({
    method: 'eth_requestAccounts'
  });

  return accounts[0] ?? null;
}

export async function sendRouterTx(
  from: string,
  calldata: { to: string; data: string; value: string }
): Promise<string> {
  // MOCK MODE: Intercept transactions to the mock router
  if (calldata.to.toLowerCase() === '0x1234567890123456789012345678901234567890'.toLowerCase()) {
    console.log('🎭 Mock Mode: Simulating transaction execution...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    return '0xmocktransactionhash' + Math.random().toString(16).slice(2);
  }

  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error('No wallet found');
  }

  const txParams = {
    from,
    to: calldata.to,
    data: calldata.data,
    value: calldata.value
  };

  const txHash: string = await eth.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  });

  return txHash;
}
