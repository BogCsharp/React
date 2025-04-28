import { useAuth } from '../hooks/UseAuth';

export const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-page">
            <h1>Добро пожаловать!</h1>
            {user ? (
                <p>Вы вошли как: {user.username}</p>
            ) : (
                <p>Пожалуйста, войдите в систему</p>
            )}
        </div>
    );
};
export default Home;