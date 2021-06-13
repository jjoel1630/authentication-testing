import React, { ReactElement, useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

// interface Props {
//     {}: Props
// }

function Login(): ReactElement {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const { login } = useAuth();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true); 
            await login(emailRef.current?.value, passwordRef.current?.value);
            history.push("/dashboard");
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control ref={emailRef} type="email" required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control ref={passwordRef} type="password" required/>
                        </Form.Group>
                    <Button disabled={loading} className="w-100 mt-4" type="submit">Login</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgotpassword">Forgot password?</Link>
                    </div> 
                </Card.Body>
            </Card>
            <div className="w-100 text-center mb-4">Don't have an account? <Link to="/signup">Signup</Link></div>            
        </>
    )
}

export default Login
