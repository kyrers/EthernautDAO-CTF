import ozLogo from "../assets/oz_logo.png";
import { Twitter, Discord, Medium } from "react-bootstrap-icons";

function Footer() {
    return (
        <footer className="App-footer">
            <div>
                <a href="https://twitter.com/EthernautDAO" target="_blank" rel="noopener noreferrer">
                    <Twitter className="social-icon" size={24}/>
                </a>
                <a href="https://discord.com/invite/RQ5WYDxUF3" target="_blank" rel="noopener noreferrer">
                    <Discord className="social-icon" size={24}/>
                </a>
                <a href="https://ethernautdao.medium.com/" target="_blank" rel="noopener noreferrer">
                    <Medium className="social-icon" size={24} />
                </a>
            </div>

            <div className="footer-brands">
                <a href="https://www.openzeppelin.com/" target="_blank" rel="noopener noreferrer">
                    <img src={ozLogo} />
                </a>
                <a className="ethernaut-footer" href="https://mint.ethernautdao.io/" target="_blank" rel="noopener noreferrer">
                    <p>EthernautDAO 2022✧</p>
                </a>
            </div>
        </footer>
    );
}

export default Footer;
