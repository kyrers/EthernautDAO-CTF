declare module "highlightjs-solidity";

interface Window {
    ethereum: any
}

declare module "*.png" {
    const path: string;
    export default path;
}
