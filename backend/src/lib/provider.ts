import { JsonRpcProvider, type TransactionRequest } from 'ethers';
import { withRetry, withTimeout, isRetryableError, RPCError } from './errors.js';

/**
 * Enhanced RPC provider with retry logic and timeouts
 */
export class EnhancedProvider {
  private provider: JsonRpcProvider;
  private rpcUrl: string;

  constructor(rpcUrl: string) {
    this.rpcUrl = rpcUrl;
    this.provider = new JsonRpcProvider(rpcUrl);
  }

  /**
   * Get block number with retry and timeout
   */
  async getBlockNumber(): Promise<number> {
    return withRetry(
      () => withTimeout(
        this.provider.getBlockNumber(),
        5000,
        'RPC timeout: getBlockNumber'
      ),
      {
        maxRetries: 3,
        shouldRetry: isRetryableError
      }
    ).catch((error) => {
      throw new RPCError(`Failed to get block number: ${error.message}`, {
        rpcUrl: this.rpcUrl
      });
    });
  }

  /**
   * Call contract method with retry and timeout
   */
  async call(tx: TransactionRequest): Promise<string> {
    return withRetry(
      () => withTimeout(
        this.provider.call(tx),
        5000,
        'RPC timeout: contract call'
      ),
      {
        maxRetries: 3,
        shouldRetry: isRetryableError
      }
    ).catch((error) => {
      throw new RPCError(`Contract call failed: ${error.message}`, {
        rpcUrl: this.rpcUrl,
        to: tx.to,
        data: tx.data
      });
    });
  }

  /**
   * Get the underlying ethers provider
   */
  getProvider(): JsonRpcProvider {
    return this.provider;
  }

  /**
   * Perform multiple calls in parallel with error handling
   */
  async parallelCalls<T>(
    calls: Array<() => Promise<T>>
  ): Promise<T[]> {
    const results = await Promise.allSettled(calls.map(fn => fn()));

    // Check if any calls failed
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      const firstFailure = failures[0] as PromiseRejectedResult;
      throw new RPCError(
        `Parallel RPC calls failed: ${failures.length}/${results.length}`,
        { error: firstFailure.reason }
      );
    }

    return results.map(r => (r as PromiseFulfilledResult<T>).value);
  }
}
