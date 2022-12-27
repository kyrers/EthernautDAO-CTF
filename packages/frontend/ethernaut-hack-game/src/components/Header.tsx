import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HelpModal from "./HelpModal";
import logo from "../assets/logo.png";

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

    const formatAddress = (address: string) => {
        return address.substring(0, 6) + "..." + address.slice(-4);
    }

    return (
        <header className="App-header">
            <div className="app-info-panel">
                <img className="cursor-pointer" src={logo} onClick={handleLogoClick} alt="Ethernaut DAO" />
                <HelpModal />
            </div>

            <div className="wallet-panel">
                <Button onClick={connect}>
                    {
                        connectedWallet !== "" ?
                            <span title={connectedWallet}>{formatAddress(connectedWallet)}</span>
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