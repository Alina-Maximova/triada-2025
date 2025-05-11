// src/components/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../redux/apiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const Login = ({ toggleModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
  
      dispatch(setCredentials({
        token: response.token
      }));
      toggleModal();
    } catch (err) {
      setError(err.data || "Ошибка авторизации");
    }
  };

  return (
    <div>
      {error && <Alert color="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Почта</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Введите электронную почту'
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Пароль</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Введите пароль'
          />
        </FormGroup>
        <Button 
          color="primary" 
          block 
          type="submit" 
          style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }}
        >
          Войти
        </Button>
      </Form>
    </div>
  );
};

export default Login;