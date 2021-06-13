import React, { ReactElement } from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    component: React.FunctionComponent<any>
    exact?: boolean;
    path: string;
}

function PrivateRoute({component: Component, ...rest}: Props): ReactElement {
    const { currentUser } = useAuth();

    return (
        <Route {...rest} render={(props: RouteComponentProps<any>) => (
            currentUser ? <Component {...props} /> : <Redirect to="/login" />
        )}>

        </Route>
    )
}
    
export default PrivateRoute
