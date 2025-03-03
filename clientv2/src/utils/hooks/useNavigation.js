import { useNavigate } from "react-router-dom";

function useNavigation() {
    const navigate = useNavigate();
    return { navigate };
}

export default useNavigation;
