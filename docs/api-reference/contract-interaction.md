# Contract Interaction

## Overview

The FeeBumpStudio contract (`FeeBumpStudioContract`) provides minimal on-chain state for verifiable fee-bump event recording.

## Contract Interface

### Functions

| Function | Access | Description |
|----------|--------|-------------|
| `initialize(admin: Address)` | `admin.require_auth()` | Sets admin in instance storage |
| `record(actor: Address, reference: String)` | `actor.require_auth()` | Stores reference under actor |
| `read(actor: Address) → Option<String>` | Public | Reads stored reference |

### Storage Layout

```
Instance Storage:
  "admin" → Address

Persistent Storage:
  Address (actor) → String (reference)
```

### Events

The contract emits diagnostic events via Soroban host. No custom events in baseline.

## Client Usage (TypeScript)

### Generate Client

```bash
# From fee-bump-studio-contracts repo
stellar contract bindings typescript \
  --contract-id <CONTRACT_ID> \
  --network testnet \
  --output-dir ./generated/contract
```

### Initialize Contract

```typescript
import { FeeBumpStudioContract } from "./generated/contract";

async function initializeContract(
  adminKeypair: Keypair,
  rpcUrl: string
): Promise<string> {
  const contract = new FeeBumpStudioContract({
    contractId: CONTRACT_ID, // After deployment
    networkPassphrase: Networks.TESTNET,
    rpcUrl,
  });
  
  // Admin must authorize
  const tx = contract.initialize({ admin: adminKeypair.publicKey() });
  const prepared = await tx.prepare({ authorize: [adminKeypair.publicKey()] });
  const signed = prepared.sign(adminKeypair);
  const result = await signed.submit();
  
  return result.hash;
}
```

### Record Reference

```typescript
async function recordReference(
  actorKeypair: Keypair,
  reference: string,
  contract: FeeBumpStudioContract
): Promise<string> {
  const tx = contract.record({
    actor: actorKeypair.publicKey(),
    reference,
  });
  
  const prepared = await tx.prepare({ authorize: [actorKeypair.publicKey()] });
  const signed = prepared.sign(actorKeypair);
  const result = await signed.submit();
  
  return result.hash;
}
```

### Read Reference

```typescript
async function readReference(
  actorAddress: string,
  contract: FeeBumpStudioContract
): Promise<string | null> {
  const result = await contract.read({ actor: actorAddress });
  return result ?? null;
}
```

## Client Usage (Rust)

### From fee-bump-studio-contracts

```rust
use fee_bump_studio_contracts::{FeeBumpStudioContract, FeeBumpStudioContractClient};

fn record_and_read(env: &Env, admin: &Address, actor: &Address) {
    let contract_id = env.register(FeeBumpStudioContract, (admin,));
    let client = FeeBumpStudioContractClient::new(env, &contract_id);
    
    client.initialize(admin);
    client.record(actor, &String::from_str(env, "TX-abc-001"));
    
    let reference = client.read(actor);
    assert_eq!(reference, Some(String::from_str(env, "TX-abc-001")));
}
```

## Authorization Model

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  initialize(admin)                                          │
│  └─ admin.require_auth()  ← Admin must sign                │
│                                                             │
│  record(actor, reference)                                   │
│  └─ actor.require_auth() ← Actor must sign                 │
│                                                             │
│  read(actor)                                                │
│  └─ Public (no auth required)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Simulation (Before Submission)

```typescript
async function simulateRecord(
  actor: string,
  reference: string,
  contract: FeeBumpStudioContract
): Promise<Api.SimulateTransactionResponse> {
  const tx = contract.record({ actor, reference });
  return tx.simulate({ authorize: [actor] });
}
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `AuthFailed` | Missing/invalid signature | Ensure correct keypair signs |
| `ContractNotInitialized` | `initialize` not called | Call `initialize` first |
| `StorageError` | Storage write failed | Check network, retry |
| `InvalidArgs` | Malformed reference | Validate string encoding |

## Testing

### Host Tests (Rust)

```rust
#[test]
fn record_requires_auth() {
    let env = Env::default();
    env.mock_all_auths(); // Auto-authorize in tests
    
    let admin = Address::generate(&env);
    let actor = Address::generate(&env);
    
    let contract_id = env.register(FeeBumpStudioContract, ());
    let client = FeeBumpStudioContractClient::new(&env, &contract_id);
    
    client.initialize(&admin);
    client.record(&actor, &String::from_str(&env, "test"));
    
    assert_eq!(client.read(&actor), Some(String::from_str(&env, "test")));
}
```

### Integration Tests (TypeScript)

```typescript
// Requires deployed contract on Testnet
describe("FeeBumpStudioContract", () => {
  let contract: FeeBumpStudioContract;
  let admin: Keypair;
  let actor: Keypair;
  
  beforeAll(async () => {
    contract = new FeeBumpStudioContract({
      contractId: process.env.TEST_CONTRACT_ID!,
      networkPassphrase: Networks.TESTNET,
      rpcUrl: process.env.TEST_RPC_URL!,
    });
    admin = Keypair.fromSecret(process.env.ADMIN_SECRET!);
    actor = Keypair.fromSecret(process.env.ACTOR_SECRET!);
  });
  
  it("records and reads reference", async () => {
    await contract.initialize({ admin: admin.publicKey() })
      .prepare({ authorize: [admin.publicKey()] })
      .sign(admin)
      .submit();
    
    await contract.record({ 
      actor: actor.publicKey(), 
      reference: "test-123" 
    }).prepare({ authorize: [actor.publicKey()] })
      .sign(actor)
      .submit();
    
    const result = await contract.read({ actor: actor.publicKey() });
    expect(result).toBe("test-123");
  });
});
```

## Deployment

See [fee-bump-studio-contracts deployment guide](https://feebumpstudio.github.io/fee-bump-studio-contracts/deployment/build.html).

## Security Considerations

- **Admin key** — Controls contract initialization; rotate if compromised
- **Actor authorization** — Each record requires actor's signature
- **No upgrade path** — Baseline contract is immutable; plan for upgradeability in production
- **Reference size** — String stored in persistent storage; keep reasonable

## Resources

- [Contract Source](../developer-guide/architecture.md#contracts)
- [Soroban SDK Docs](https://soroban.stellar.org/docs)
- [Contract Deployment](../deployment/build.md)