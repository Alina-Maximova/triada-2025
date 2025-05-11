import React, { useState } from 'react';
import { useGetServicesQuery } from '../redux/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartServ } from '../redux/slices/cartSlice';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import './Products.css';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
  const { data: services, error, isLoading } = useGetServicesQuery();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { token, user } = useSelector((state) => state.auth);


  if (isLoading) return <div className="text-center py-5">Загрузка услуг...</div>;
  if (error) return <div className="text-center py-5">Ошибка загрузки услуг: {error.message}</div>;

  const handleAddToCart = (service) => {
    dispatch(addToCartServ({ ...service }));
    toast.success(`Услуга "${service.name}" добавлена в корзину!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      {/* Поисковая строка */}
      <div className="mb-4">
        <InputGroup>

          <InputGroupText>
            <FaSearch />
          </InputGroupText>
          <Input
            placeholder="Поиск услуг..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Row>
        {filteredServices?.length > 0 ? (
          filteredServices.map(service => (
            <Col key={service.id} md="3" sm="6" xs="12" className="mb-4">
              <Card className="h-100 product-card">
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5" className="product-title">{service.name}</CardTitle>
                  <CardText className="product-description">{service.description}</CardText>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <CardText className="product-price">{service.price} ₽</CardText>
                    {token ? (

                      <FaShoppingCart
                        onClick={() => handleAddToCart(service)}
                        style={{ cursor: 'pointer' }}
                        aria-label={`Добавить ${service.name} в корзину`} />

                    ) : (
                      <>
                        Войдите для заказа
                      </>

                    )}

                   

                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4>Услуги не найдены</h4>
            {searchTerm && <p>Попробуйте изменить поисковый запрос</p>}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Services;