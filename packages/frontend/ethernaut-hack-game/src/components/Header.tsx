import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import HelpModal from "./HelpModal";
import logo from "../assets/logo.png";

type FunctionProps = {
    name: string;
    targetNetwork: any;
    connectedWallet: string;
    connect: MouseEventHandler<HTMLButtonElement>;
};

function Header({ name, targetNetwork, connectedWallet, connect }: FunctionProps) {
    return (
        <header className="App-header">
            <div className="app-info-panel">
                <a href="https://mint.ethernautdao.io/" target="_blank" rel="noopener noreferrer">
                    <img src={logo} />
                </a>
                <HelpModal />
            </div>
            
            <div className="wallet-panel">
                <Button onClick={connect}>
                    {
                        connectedWallet !== "" ?
                            <span>{connectedWallet}</span>
                            :
                            <span>Connect wallet</span>
                    }
                </Button>
                <span className="header-target-network" style={{ color: targetNetwork.color }}>{targetNetwork.name}</span>
            </div>
        </header>
    );
}

export default Header;