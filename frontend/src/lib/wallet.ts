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
