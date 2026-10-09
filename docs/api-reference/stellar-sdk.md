# Stellar SDK Integration

## Overview

The app uses `@stellar/stellar-sdk` v17.2.1 for all Stellar network interactions:

- Transaction construction and signing
- XDR encoding/decoding
- RPC communication
- Contract invocation
- Network configuration

## Installation

```bash
npm install @stellar/stellar-sdk@17.2.1
```

## Core Imports

```typescript
import {
  // Network
  Networks,
  Config,
  
  // Keypairs & Accounts
  Keypair,
  Account,
  AccountResponse,
  
  // Transactions
  Transaction,
  TransactionBuilder,
  TransactionEnvelope,
  FeeBumpTransaction,
  FeeBumpTransactionEnvelope,
  
  // Operations
  Operation,
  PaymentOp,
  InvokeHostFunctionOp,
  
  // Assets
  Asset,
  NativeAsset,
  
  // Contracts
  Contract,
  Address,
  ScVal,
  xdr,
  
  // RPC
  rpc,
  Api,
  
  // Crypto/Hashing
  hash,
  StrKey,
  
  // Errors
  BASE_FEE,
} from "@stellar/stellar-sdk";
```

## Network Configuration

```typescript
// Configure for Testnet (default)
Config.setDefault({
  networkPassphrase: Networks.TESTNET,
  // Or Mainnet:
  // networkPassphrase: Networks.PUBLIC,
});

// Custom RPC endpoint
const server = new rpc.Server("https://soroban-testnet.stellar.org", {
  allowHttp: false, // Enforce HTTPS
});
```

## Account Management

### Load Account

```typescript
async function loadAccount(publicKey: string): Promise<Account> {
  const accountResponse = await server.getAccount(publicKey);
  return new Account(accountResponse.accountId(), accountResponse.sequenceNumber());
}
```

### Create Keypair (for testing only)

```typescript
// NEVER use in production with real funds
const keypair = Keypair.random();
console.log("Public:", keypair.publicKey());
console.log("Secret:", keypair.secret()); // Only for Testnet testing!
```

## Transaction Construction

### Basic Payment

```typescript
async function buildPayment(
  source: Account,
  destination: string,
  amount: string,
  asset: Asset = Asset.native()
): Promise<Transaction> {
  return new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.payment({
      destination,
      asset,
      amount,
    }))
    .setTimeout(30) // 30 seconds
    .build();
}
```

### Contract Invocation

```typescript
async function buildContractCall(
  source: Account,
  contractId: string,
  functionName: string,
  args: xdr.ScVal[]
): Promise<Transaction> {
  const contract = new Contract(contractId);
  
  return new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.invokeHostFunction({
      function: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: contract.toScAddress(),
          functionName: functionName,
          args: args,
        })
      ),
      auth: [], // Will be filled by wallet simulation
    }))
    .setTimeout(60) // Longer for contract calls
    .build();
}
```

## Fee-Bump Transactions

### Build Fee-Bump Envelope

```typescript
async function buildFeeBump(
  innerEnvelope: TransactionEnvelope,
  feeSource: string,
  replacementFee: number
): Promise<FeeBumpTransactionEnvelope> {
  const feeBumpTx = new FeeBumpTransaction(
    feeSource,
    replacementFee,
    innerEnvelope
  );
  
  return new FeeBumpTransactionEnvelope(feeBumpTx);
}
```

### Sign Fee-Bump (Wallet)

```typescript
// Wallet signs the fee-bump envelope
// Inner transaction signatures are preserved
async function signFeeBump(
  envelope: FeeBumpTransactionEnvelope,
  wallet: WalletInterface
): Promise<FeeBumpTransactionEnvelope> {
  // Wallet must sign as feeSource
  const signed = await wallet.signFeeBump(envelope);
  return signed;
}
```

## XDR Handling

### Encode to XDR (Base64)

```typescript
function toXDR(tx: Transaction | FeeBumpTransaction): string {
  const envelope = tx instanceof FeeBumpTransaction
    ? new FeeBumpTransactionEnvelope(tx)
    : new TransactionEnvelope(tx);
  return envelope.toXDR("base64");
}
```

### Decode from XDR

```typescript
function fromXDR(xdrBase64: string): TransactionEnvelope | FeeBumpTransactionEnvelope {
  const buffer = Buffer.from(xdrBase64, "base64");
  
  // Try fee-bump first
  try {
    return FeeBumpTransactionEnvelope.fromXDR(buffer);
  } catch {
    return TransactionEnvelope.fromXDR(buffer);
  }
}
```

## RPC Operations

### Simulate Transaction (Contract)

```typescript
async function simulateContractCall(
  tx: Transaction,
  sourceAccount: string
): Promise<Api.SimulateTransactionResponse> {
  return server.simulateTransaction(tx, {
    account: sourceAccount,
  });
}
```

### Submit Transaction

```typescript
async function submitTransaction(
  envelope: TransactionEnvelope | FeeBumpTransactionEnvelope
): Promise<Api.SendTransactionResponse> {
  const xdr = envelope.toXDR("base64");
  return server.sendTransaction(xdr);
}
```

### Get Transaction Status

```typescript
async function getTransactionStatus(
  hash: string
): Promise<Api.GetTransactionResponse> {
  return server.getTransaction(hash);
}
```

## Error Handling

### Common Error Types

```typescript
import { 
  RpcError, 
  TimeoutError, 
  PrepareTransactionError 
} from "@stellar/stellar-sdk";

try {
  const result = await server.sendTransaction(xdr);
} catch (error) {
  if (error instanceof RpcError) {
    // RPC-level error (network, rate limit)
    console.error("RPC Error:", error.message);
  } else if (error instanceof TimeoutError) {
    // Submission timeout — check status manually
    console.error("Timeout — check transaction status");
  } else if (error instanceof PrepareTransactionError) {
    // Simulation/prepare failed
    console.error("Prepare failed:", error.simulateTransactionResponse);
  } else {
    // Unknown error
    console.error("Unexpected error:", error);
  }
}
```

### Transaction Result Codes

```typescript
// Check result after confirmation
const status = await server.getTransaction(hash);

if (status.status === "SUCCESS") {
  // Parse result meta
  const resultMeta = xdr.TransactionMeta.fromXDR(
    Buffer.from(status.resultMetaXdr!, "base64")
  );
  
  // Check operations
  const operations = resultMeta.v3()?.sorobanMeta()?.events() || [];
} else {
  // Failed — check result codes
  console.error("Failed:", status.resultCodes);
  console.error("Error:", status.errorResultXdr);
}
```

## TypeScript Types

### Custom Types for App

```typescript
// types/stellar.ts
export interface NetworkConfig {
  networkPassphrase: string;
  rpcUrl: string;
  contractId?: string;
}

export interface FeeEstimate {
  minFee: bigint;
  recommendedFee: bigint;
  conservativeFee: bigint;
  breakdown: FeeBreakdown;
}

export interface TransactionDisplay {
  hash: string;
  source: string;
  fee: bigint;
  operations: OperationDisplay[];
  status: "pending" | "success" | "failed";
  ledger?: number;
  timestamp?: Date;
}
```

## Best Practices

| Practice | Reason |
|----------|--------|
| Always simulate contract calls | Catches errors before spending fees |
| Use `BASE_FEE` constant | Ensures minimum fee compliance |
| Set appropriate timeouts | Prevents stuck transactions |
| Validate addresses with `StrKey` | Catches typos early |
| Handle `TimeoutError` separately | Transaction may still succeed |
| Preserve inner signatures in fee-bump | Maintains original authorization |

## Resources

- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Stellar Developer Docs](https://developers.stellar.org/)
- [Soroban RPC Spec](https://soroban.stellar.org/api)
- [Fee-Bump Transactions](https://developers.stellar.org/docs/encyclopedia/fee-bump-transactions)