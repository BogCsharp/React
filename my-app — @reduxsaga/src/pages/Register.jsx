import RegisterForm from '../components/RegisterForm';

const Register = () => {
    return (
        <main className="register-page" role="main" id="main-content" tabIndex="-1">
            <h1 className="visually-hidden">Страница регистрации</h1>
            <RegisterForm />
        </main>
    );
};

export default Register; 