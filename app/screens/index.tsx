import { ViewProps } from "react-native"
import WindView from "../components/rebase/WindView"




const AppContent : React.FC<ViewProps>= (props) => {
    return(
        <WindView>
            {props.children}
        </WindView>
    )
}

export default AppContent;