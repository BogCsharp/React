import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log('PrivateRoute: isAuthenticated =', isAuthenticated());
    
    if (!isAuthenticated()) {
        console.log('PrivateRoute: redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    console.log('PrivateRoute: rendering protected content');
    return children;
};

export default PrivateRoute; 