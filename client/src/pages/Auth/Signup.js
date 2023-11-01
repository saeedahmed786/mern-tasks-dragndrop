import React, { useState } from 'react';
import './Auth.css';
import Loading from '../../components/Loading/Loading';
import { Error, Success } from '../../components/Messages/messages';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../../queries';

export const Signup = (props) => {
    const [loading, setLoading] = useState(false);
    const [signUp] = useMutation(SIGNUP_USER);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirm: '',
    });

    const { fullName, email, password, confirm } = userData;

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            Error("Passwords don't match");
        } else {
            setLoading(true);
            try {
                const { data } = await signUp({ variables: { fullName, email, password } });
                // Handle success, e.g., store the token in localStorage
                console.log('Login success:', data);
                if (data?.signUp) {
                    Success("Account created successfully");
                    props.history.push("/login")
                }
                setLoading(false);
            } catch (error) {
                // Handle error, e.g., display an error message
                console.error('Login error:', error);
                setLoading(false);
            }
        }
    };

    return (
        loading
            ?
            <Loading />
            :
            <>
                <div className='auth'>
                    <div className="auth-inner-bubble-container">
                        <h2>Create account</h2>
                        <form onSubmit={submitHandler}>
                            <div className='item'>
                                <label>Full Name</label>
                                <div className="input-group">
                                    <input name='fullName' type="text" className="form-control" placeholder="Full Name" onChange={handleChange} />
                                </div>
                            </div>
                            <div className='item'>
                                <label>Email</label>
                                <div className="input-group">
                                    <input name='email' type="text" className="form-control" placeholder="Email" onChange={handleChange} />
                                </div>
                            </div>
                            <div className='item'>
                                <label>Password</label>
                                <div className="input-group">
                                    <input name='password' type="password" className="form-control" placeholder="Password" onChange={handleChange} />
                                </div>
                            </div>
                            <div className='item'>
                                <label>Retype Password</label>
                                <div className="input-group">
                                    <input name='confirm' type="password" className="form-control" placeholder="Retype Password" onChange={handleChange} />
                                </div>
                            </div>
                            <button className='btn' type="submit">Signup</button>
                        </form>
                        <div className='end-text'>
                            <div>Already have an account?</div>
                            <Link to="/login">
                                <b className='fw-bold'>Login</b>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
    );
};
