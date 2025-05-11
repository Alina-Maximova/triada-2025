// src/components/Register.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../redux/apiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const Register = ({ toggleModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role_id: 2
      }).unwrap();
      
      dispatch(setCredentials({
        token: response.token
      }));
      toggleModal();
    } catch (err) {
      setError(err.data || "Ошибка регистрации");
    }
  };

  return (
    <div>
      {error && <Alert color="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="firstName">Логин</Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder='Введите логин'
          />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Имя</Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder='Введите имя'
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Почта</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
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
          Зарегистрироваться
        </Button>
      </Form>
    </div>
  );
};

export default Register;