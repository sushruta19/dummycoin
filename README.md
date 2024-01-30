# DummyCoin - A Simplified Blockchain Implementation

DummyCoin is a TypeScript implementation of a simplified version of bitcoin blockchain from scratch, focusing on the creation and management of "dummy coins". This project provides a basic understanding of blockchain concepts such as transactions, mining, and wallet management. The implementation includes key components like transactions, blocks, and a blockchain itself.

## Features

- **Blockchain Implementation:** DummyCoin provides a basic yet functional blockchain structure implemented **from scratch** in TypeScript.
  
- **Transactions:** Users can create transactions, sign them with their private keys, and add them to the blockchain.

- **Mining:** The project includes a basic proof-of-work mechanism where users can mine blocks to earn rewards.

- **Wallet Management:** A key generation module allows the creation of private and public key pairs along with corresponding wallet addresses.

## Directory Structure

```
📦 dummycoin
 ┣ 📂 dist
 ┃ ┣ 📜 blockchain.js
 ┃ ┗ 📜 main.js
 ┣ 📂 src
 ┃ ┣ 📜 blockchain.ts
 ┃ ┗ 📜 main.ts
 ┣ 📜 keyGenerator.js
 ┣ 📜 dummyKeys.json
 ┣ 📜 jsonGenerator.js
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 .gitignore
```

- **dist:** Contains the transpiled JavaScript files.
- **src:** Holds the TypeScript source code, including the main application and blockchain implementation.
- **keyGenerator.js:** Module for generating private keys, public keys, and wallet addresses.
- **dummyKeys.json:** JSON file containing a list of public and private keys for testing transactions.
- **jsonGenerator.js:** Script to generate the dummyKeys.json file.
- **package.json:** Configuration and dependencies for the project.
- **tsconfig.json:** TypeScript configuration file.
- **.gitignore:** Excludes unnecessary files and directories from version control.


## Key Features of Blockchain

1. **Proof-of-Work (PoW):** Implemented through the `mineBlock` method in the `Block` class, requiring miners to find a nonce that results in a hash with a specific leading difficulty.

2. **Transaction Signing:** Transactions are signed using the sender's private key, providing authenticity and integrity. Verification is done through the `isValid` method.

3. **Wallet Address Mechanism:** The `pubKey` property is added to the `Transaction` class, representing the public key of the sender.

4. **Mining Reward:** Miners receive a reward (`miningReward`) for successfully mining a block.

5. **Difficulty Adjustment:** The blockchain adjusts its mining difficulty every 10 blocks (`blocksPerDifficultyAdjustment`) to maintain a consistent block creation rate.

6. **Genesis Block:** The blockchain starts with a genesis block created in the `createGenesisBlock` method.

7. **Balance Checking:** The `getBalanceOfAddress` method calculates the balance of a wallet address based on transaction history.


## How to run the project in your local system?
- Make sure that you have node, git and MongoDB installed in your system.
- Clone the repository to your local machine:
   ```bash
   git clone https://github.com/sushruta19/dummycoin.git
   ```

- Navigate to the project directory:
   ```bash
   cd dummycoin
   ```

- Install dependencies:
   ```bash
   npm install
   ```

- Run the key generation script to create dummyKeys.json (optional):
   ```bash
   node jsonGenerator.js
   ```

- Transpile TypeScript to JavaScript:
   ```bash
   npm run build
   ```

- Run the main application:
   ```bash
   npm start
   ```

- Explore DummyCoin by creating transactions, mining blocks, and checking wallet balances.

## Usage

- The main.ts file showcases how to instantiate a blockchain, perform transactions, and check the validity of the blockchain.

- The keyGenerator.js module assists in creating private keys, public keys, and wallet addresses.

- The dummyKeys.json file contains a list of keys for testing transactions.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or improvements for the Blog-Application, please do the following steps : 
- **Fork** the repository. <br>![Fork Icon](https://i.imgur.com/an7hXVR.png)
- **Clone** the repository: Clone the forked repository to your local machine using the following command:
```bash
git clone <forked-repo-url>
```
This will create a local copy of the project that you can work on.
- **Create a new branch**: Before making any changes, create a new branch to work on your changes. Naming the branch based on the feature or bug fix you're working on is a good practice. For example:
```bash
git checkout -b improvement/ui-refactoring  #for improvements
git checkout -b bugfix/login-issue          #for bugfix
git checkout -b feature/user-registration   #for new features
git checkout -b hotfix/security-vulnerable  #for hotfix
```
Here the slash(/) doesn't denote any address but its a part of the new branch name "bugfix/anything", etc.
- **Make your changes**: Make the necessary changes or additions to the project
- Stage, commit and push your changes to **your** remote forked repo at the new branch(not the master branch of your remote forked repo)
```bash
git add .
git commit -m "Add a concise commit message describing the changes"
git push origin <new-branch-you-worked-on>
```
- **Create a pull request**: Then, from your forked repository's page on GitHub, click on the "New pull request" button to create a pull request (PR) to the original repository. Provide a clear description of the changes you've made and why they are valuable. It's also helpful to reference any relevant issues or feature requests.
- The project maintainers or other contributors may provide feedback or request changes on your pull request. Be responsive and address the feedback accordingly. This may involve making additional commits to your branch based on the feedback.
- Once your pull request is approved, the project maintainers will merge your changes into the main branch. At this point, your contributions are part of the project.

Please make sure to follow these guidelines to ensure a smooth and collaborative contribution process. If you have any questions or need further assistance, feel free to reach out to us.

Thank you for your contribution!

#### ! Please put `node_modules/` in your `.gitignore` file. ! Do not push them in remote repo!
## License
This project is licensed under the [MIT License](LICENSE)