import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { setAuthentication } from '../../components/Auth/auth';
import './Auth.css';
import Loading from '../../components/Loading/Loading';
import { Error, Success } from '../../components/Messages/messages';
import { LOGIN_USER } from '../../queries';
import { useMutation } from '@apollo/client';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    onError: (err) => {
      console.log(err)
    }
  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { email, password } });
      // Handle success, e.g., store the token in localStorage
      if (data?.login?.status === "error") {
        Error(data?.login?.message);
      } else {
        if (data.login.user) {
          Success("Logged in successfully");
          setAuthentication(data?.login.user, data?.login.token);
          props.history.push("/");
          document.location.reload();
        }
      }
    } catch (error) {
      // Handle error, e.g., display an error message
      console.error('Login error:', error.response);
      Error("Unknown error");
    }
  };


  return (
    <>
      <div className='auth'>
        <div className="auth-inner-bubble-container">
          <h2>Login</h2>
          <p>Login with email and password</p>
          {
            loading
              ?
              <Loading />
              :
              <form onSubmit={submitHandler}>
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
                <button className='btn' type="submit">Login</button>
              </form>
          }
          <div className='end-text'>
            <div>Don't have an account?</div>
            <Link to="/signup">
              <b className='fw-bold'>Register</b>
            </Link>
          </div>
        </div>
      </div>
    </ >

  );
}
