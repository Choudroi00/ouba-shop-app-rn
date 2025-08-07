import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const useSafeReturn = (path: string) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleBackButtonClick = (e: PopStateEvent) => {
          e.preventDefault();
          navigate(`/${path}`, {replace: true});
        };
      
        window.addEventListener("popstate", handleBackButtonClick);
      
        return () => {
          window.removeEventListener("popstate", handleBackButtonClick);
        };
    }, [navigate, path]);
}