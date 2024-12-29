# Solana Terminal V1 - Command Modification and Addition Guide

This README provides detailed instructions on how to modify existing commands, complete Solana-related commands, and add new commands to the Solana Terminal V1 project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Modifying Existing Commands](#modifying-existing-commands)
3. [Completing Solana-related Commands](#completing-solana-related-commands)
4. [Adding New Commands](#adding-new-commands)
5. [Testing Your Changes](#testing-your-changes)

## Project Structure

The main components related to terminal commands are:

- \`components/Terminal.tsx\`: The main terminal component
- \`hooks/useJsonFileSystem.ts\`: Handles file system operations
- \`hooks/use[CommandName].ts\`: Individual hook files for each command

## Modifying Existing Commands

To modify an existing command, follow these steps:

1. Locate the appropriate hook file in the \`hooks/\` directory. For example, \`hooks/useConnect.ts\` for the "connect" command.
2. Open the file and modify the function to implement the desired behavior.

Example (\`hooks/useConnect.ts\`):

\`\`\`typescript
import { useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

export function useConnect() {
  const [connection, setConnection] = useState<Connection | null>(null)

  return () => {
    try {
      const newConnection = new Connection('https://api.mainnet-beta.solana.com')
      setConnection(newConnection)
      return "Connected to Solana mainnet successfully."
    } catch (error) {
      return \`Failed to connect: \${error.message}\`
    }
  }
}
\`\`\`

## Completing Solana-related Commands

To complete the Solana-related commands, you'll need to implement the logic for each command using the Solana web3.js library. Here's an example of how to complete the \`useBalance\` command:

1. Open \`hooks/useBalance.ts\`
2. Implement the balance checking logic:

\`\`\`typescript
import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

export function useBalance() {
  const [balance, setBalance] = useState<number | null>(null)

  return async (publicKeyString: string) => {
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      const publicKey = new PublicKey(publicKeyString)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / 1e9) // Convert lamports to SOL
      return \`Balance: \${balance / 1e9} SOL\`
    } catch (error) {
      return \`Failed to get balance: \${error.message}\`
    }
  }
}
\`\`\`

Repeat this process for other Solana-related commands like \`useTransfer\`, \`useReceive\`, etc.

## Adding New Commands

To add a new command, follow these steps:

1. Create a new file in the \`hooks/\` directory, e.g., \`hooks/useNewCommand.ts\`
2. Implement the command logic in this new file
3. Import and add the new command to the \`Terminal\` component

Here's an example of adding a new "airdrop" command:

1. Create \`hooks/useAirdrop.ts\`:

\`\`\`typescript
import { Connection, PublicKey } from '@solana/web3.js'

export function useAirdrop() {
  return async (publicKeyString: string, amount: number) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com') // Use devnet for airdrops
      const publicKey = new PublicKey(publicKeyString)
      const signature = await connection.requestAirdrop(publicKey, amount * 1e9) // Convert SOL to lamports
      await connection.confirmTransaction(signature)
      return \`Airdropped \${amount} SOL to \${publicKeyString}\`
    } catch (error) {
      return \`Airdrop failed: \${error.message}\`
    }
  }
}
\`\`\`

2. Open \`components/Terminal.tsx\`
3. Import the new command:

\`\`\`typescript
import { useAirdrop } from '@/hooks/useAirdrop'
\`\`\`

4. Add the new command to the \`handleCommand\` function:

\`\`\`typescript
const airdrop = useAirdrop()

// Inside handleCommand function
case 'airdrop':
  if (args.length === 2) {
    const result = await airdrop(args[0], parseFloat(args[1]))
    return [...newOutput, result]
  } else {
    return [...newOutput, 'Usage: airdrop <public_key> <amount>']
  }
\`\`\`

5. Add the new command to the help message:

\`\`\`typescript
case 'help':
  return [
    ...newOutput,
    'Available commands:',
    // ... existing commands ...
    'airdrop <public_key> <amount> - Request an airdrop of SOL (devnet only)',
  ]
\`\`\`

## Testing Your Changes

After making changes or adding new commands:

1. Run the development server: \`npm run dev\` or \`yarn dev\`
2. Open the terminal in the browser
3. Test the modified or new commands to ensure they work as expected

Remember to handle errors gracefully and provide helpful error messages to users when something goes wrong.

By following this guide, you should be able to modify existing commands, complete the Solana-related commands, and add new commands to your Solana Terminal V1 project.

