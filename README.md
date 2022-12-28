# EthernautDAO CTF
This repository contains the full implementation of the EthernautDAO CTF game.

However, it was built with the idea of acting as a template for CTF games using `Hardhat` for backend and `React + TypeScript` for frontend.

## Backend
The backend is where:
- Challenges and their factories contracts are;
- The `Controller` contract, which is the contract the frontend interacts with, is. 
- The `Challenge` contract, which acts as an interface for every challenge factory contract, is.

To modify this project to your specific case you would need to:
- Create the challenges and respective factories contracts;
- Possibly make minor modifications to the `Controller` and `Challenge` contracts to be able to handle your specific challenges.

## Frontend
The frontend is of course tailored for the EthernautDAO CTF, so there are many modifications needed here.
Still, there are useful functionalities that you can reuse:
- Interacting with the `Controller` contract;
- Storing user progress;
- Loading contract code to display to the user:
    - This is done by having the challenge contracts in the `public` folder, and requesting them whenever we need to present them to the user;

<br/>

If you find any bugs or have any questions feel free to reach out to me on [Twitter](https://twitter.com/kyre_rs).

###### kyrers