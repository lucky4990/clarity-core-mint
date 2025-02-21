import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can mint NFT with metadata",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const metadata = "ipfs://QmTest";
    
    let block = chain.mineBlock([
      Tx.contractCall("core-mint", "mint", [types.utf8(metadata)], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Ensure can transfer NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    const metadata = "ipfs://QmTest";
    
    let block = chain.mineBlock([
      Tx.contractCall("core-mint", "mint", [types.utf8(metadata)], wallet_1.address),
      Tx.contractCall("core-mint", "transfer", [
        types.uint(1),
        types.principal(wallet_1.address),
        types.principal(wallet_2.address)
      ], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
    
    // Verify new owner
    let result = chain.callReadOnlyFn(
      "core-mint",
      "get-owner",
      [types.uint(1)],
      wallet_1.address
    );
    result.result.expectOk().expectSome().expectPrincipal(wallet_2.address);
  },
});

Clarinet.test({
  name: "Ensure minting respects max supply limit",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet_1 = accounts.get("wallet_1")!;
    
    // Set max supply to 1
    let block = chain.mineBlock([
      Tx.contractCall("core-mint", "set-max-supply", [types.uint(1)], deployer.address),
      Tx.contractCall("core-mint", "mint", [types.utf8("ipfs://first")], wallet_1.address),
      Tx.contractCall("core-mint", "mint", [types.utf8("ipfs://second")], wallet_1.address)
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUint(1);
    block.receipts[2].result.expectErr().expectUint(105);
  },
});
