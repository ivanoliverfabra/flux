# Flux API Library

The Flux API Library provides a convenient way to interact with the Flux API for managing wallets, transactions, and names. This library simplifies the process of making API calls and handling responses, allowing developers to focus on building their applications.

## Installation

To install the Flux API Library, you can use npm or yarn:

```bash
npm install @ivanoliverfabra/flux
# or
yarn add @ivanoliverfabra/flux
# or
pnpm add @ivanoliverfabra/flux
# or
bun add @ivanoliverfabra/flux
```

## Usage

# Initialization

To use the Flux API Library, first import it into your project:

```ts
import Flux from "@ivanoliverfabra/flux";
```

Then, create an instance of the Flux class with optional configuration options:

```ts
const flux = new Flux({
  apiUrl: "https://api.fabra.live",
  apiVersion: "v1",
});
```

## Wallets

# Get Wallets

Retrieve a list of wallets:

```ts
const wallets = await flux.wallets.get({ page: 1, limit: 10 });
```

# Create Wallet

Create a new wallet:

```ts
const newWallet = await flux.wallets.create();
```

# Get Rich Wallets

Retrieve a list of rich wallets:

```ts
const richWallets = await flux.wallets.rich({ page: 1, limit: 10 });
```

# Get Wallet by Address

Retrieve information about a specific wallet by its address:

```ts
const wallet = await flux.wallets.getByAddress("wallet_address");
```

# Get Wallet Transactions

Retrieve transactions associated with a specific wallet:

```ts
const transactions = await flux.wallets.getTransactions("wallet_address", {
  page: 1,
  limit: 10,
});
```

# Get Wallet Names

Retrieve names associated with a specific wallet:

```ts
const names = await flux.wallets.getNames("wallet_address");
```

## Transactions

# Get Transactions

Retrieve a list of transactions:

```ts
const transactions = await flux.transactions.get({ page: 1, limit: 10 });
```

# Create Transaction

Create a new transaction:

```ts
const newTransaction = await flux.transactions.create(
  privateKey,
  to,
  amount,
  metadata
);
```

# Get Latest Transactions

Retrieve the latest transactions:

```ts
const latestTransactions = await flux.transactions.latest({
  page: 1,
  limit: 10,
});
```

# Get Transaction by ID

Retrieve information about a specific transaction by its ID:

```ts
const transaction = await flux.transactions.getById("transaction_id");
```

## Names

#Get Names
Retrieve a list of names:

```ts
const names = await flux.names.get({ page: 1, limit: 10 });
```

# Get Name Cost

Retrieve the cost of a name:

```ts
const cost = await flux.names.cost();
```

# Get Latest Names

Retrieve the latest names:

```ts
const latestNames = await flux.names.latest({ page: 1, limit: 10 });
```

# Get Name Logs

Retrieve logs associated with a name:

```ts
const logs = await flux.names.logs({ page: 1, limit: 10 });
```

# Get Log by ID

Retrieve information about a specific log by its ID:

```ts
const log = await flux.names.logById("log_id");
```

# Get Logs by Name

Retrieve logs associated with a specific name:

```ts
const logs = await flux.names.logsByName("name", { page: 1, limit: 10 });
```

# Get Name by Name

Retrieve information about a specific name by its name:

```ts
const name = await flux.names.getByName("name");
```

# Create Name

Create a new name:

```ts
const newName = await flux.names.create(privateKey, "name");
```

# Transfer Name

Transfer ownership of a name:

```ts
const transfer = await flux.names.transfer(
  privateKey,
  "name",
  "new_owner_address"
);
```

# Check Name Availability

Check if a name is available:

```ts
const isAvailable = await flux.names.isAvailable("name");
```

# Contributing

Contributions are welcome! Feel free to open issues and pull requests on the GitHub repository.

# License

This library is licensed under the MIT License.
