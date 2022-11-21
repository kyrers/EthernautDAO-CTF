import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import HelpModal from "./HelpModal";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

type FunctionProps = {
    targetNetwork: any;
    connectedWallet: string;
    connect: MouseEventHandler<HTMLButtonElement>;
};

function Header({ targetNetwork, connectedWallet, connect }: FunctionProps) {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    }

    return (
        <header className="App-header">
            <div className="app-info-panel">
                <img className="cursor-pointer" src={logo} onClick={handleLogoClick} />
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