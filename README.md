# CoreMint
A decentralized platform for minting and managing NFTs on the Stacks blockchain.

## Features
- Mint new NFTs with metadata
- Transfer NFTs between accounts
- View NFT ownership and metadata
- Configurable minting limits and costs

## Contract Functions
### Minting
- `mint`: Mint a new NFT by providing metadata and paying the mint price
- `mint-admin`: Admin-only function to mint NFTs without cost

### Transfer
- `transfer`: Transfer an NFT to another account

### View Functions  
- `get-token-uri`: Get the metadata URI for a token
- `get-owner`: Get the current owner of a token
- `get-token-count`: Get total supply of tokens

## Testing
Run tests with: `clarinet test`
