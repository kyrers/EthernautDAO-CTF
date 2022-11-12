import { Spinner } from "react-bootstrap";

type FunctionProps = {
    show: Boolean;
};


function LoadingScreen({ show }: FunctionProps) {
    return (
        show ?
            <div className="loading-screen">
                <Spinner className="custom-spinner" animation="border" role="status" />
            </div>
            :
            <></>
    );
}

export default LoadingScreen;
