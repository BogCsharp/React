const Error = ({ message }) => {
    return (
        <div style={{
            color: 'red',
            padding: '20px',
            border: '1px solid red',
            margin: '20px',
            textAlign: 'center'
        }}>
            Ошибка: {message}
        </div>
    );
};

export default Error;