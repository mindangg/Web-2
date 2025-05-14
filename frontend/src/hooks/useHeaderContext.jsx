import {useContext} from "react";
import {HeaderContext} from "../contexts/HeaderContext.jsx";

const useHeaderContext = () => {
    const headerContext = useContext(HeaderContext);
    if (!headerContext) {
        throw new Error('useHeaderContext must be used within a HeaderProvider');
    }
    return headerContext;
}

export default useHeaderContext;