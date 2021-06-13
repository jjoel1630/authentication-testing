import React, { ReactElement, useRef, useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// interface Props {
//     {}: Props
// }

function ForgotPassword(): ReactElement {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const { resetPassword } = useAuth();
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current?.value);
            setMessage("Check your inbox for further instructions");
            history.push("/");
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Reset Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control ref={emailRef} type="email" required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Reset Password</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        Remember your password? <Link to="/login">Login</Link>
                    </div> 
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-3 mb-4">Don't have a account? <Link to="/signup">Signup</Link></div>            
        </>
    )
}

export default ForgotPassword
