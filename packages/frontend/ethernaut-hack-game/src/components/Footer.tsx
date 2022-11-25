import ozLogo from "../assets/oz_logo.png";
import { Globe, Twitter, Discord, Medium } from "react-bootstrap-icons";

type FunctionProps = {
    footerText: string;
};

function Footer({ footerText }: FunctionProps) {
    return (
        <footer className="App-footer">
            <div>
                <a href="https://mint.ethernautdao.io/" target="_blank" rel="noopener noreferrer">
                    <Globe className="social-icon" size={24} />
                </a>

                <a href="https://twitter.com/EthernautDAO" target="_blank" rel="noopener noreferrer">
                    <Twitter className="social-icon" size={24} />
                </a>
                <a href="https://discord.com/invite/RQ5WYDxUF3" target="_blank" rel="noopener noreferrer">
                    <Discord className="social-icon" size={24} />
                </a>
                <a href="https://ethernautdao.medium.com/" target="_blank" rel="noopener noreferrer">
                    <Medium className="social-icon" size={24} />
                </a>
            </div>

            <div className="footer-brands">
                <a href="https://www.openzeppelin.com/" target="_blank" rel="noopener noreferrer">
                    <img src={ozLogo} alt="Open Zeppelin"/>
                </a>
                <a className="ethernaut-footer" href="https://mint.ethernautdao.io/" target="_blank" rel="noopener noreferrer">
                    <p>{footerText}</p>
                </a>
            </div>
        </footer>
    );
}

export default Footer;
