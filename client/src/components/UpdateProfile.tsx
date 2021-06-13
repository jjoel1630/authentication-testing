import React, { ReactElement, useRef, useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// interface Props {
//     {}: Props
// }

function UpdateProfile(): ReactElement {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const { currentUser, updatePassword, updateEmail } = useAuth();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        setError("");
        setLoading(true);

        if(passwordRef.current?.value !== confirmPasswordRef.current?.value) return setError("Passwords do not match!");

        const promises = [];
        if(emailRef.current?.value !== currentUser.email) promises.push(updateEmail(emailRef.current?.value));
        if(passwordRef.current?.value) promises.push(updatePassword(passwordRef.current?.value));

        Promise.all(promises).then(() => {
            history.push("/dashboard");
        }).catch(err => {
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>New Email</Form.Label>
                            <Form.Control ref={emailRef} defaultValue={currentUser.email} type="email" required/>
                        </Form.Group>
                        <Form.Group id="password" className="mt-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control ref={passwordRef} placeholder="Leave blank to remain the same" type="password"/>
                        </Form.Group>
                        <Form.Group id="confirm-password" className="mt-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control ref={confirmPasswordRef} placeholder="Leave blank to remain the same" type="password"/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Update</Button>
                    </Form>
                </Card.Body>
                <div className="w-100 text-center mt-2 mb-4"><Link to="/dashboard">Cancel</Link></div>            
            </Card>
        </>
    )
}

export default UpdateProfile
