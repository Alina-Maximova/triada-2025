import React, { useState } from 'react';
import { useGetProductsQuery } from '../redux/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartItem } from '../redux/slices/cartSlice';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Input, InputGroup, InputGroupText, Badge } from 'reactstrap';
import './Products.css';
import { FaShoppingCart, FaSearch, FaClock, FaSignInAlt } from 'react-icons/fa';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { token, user } = useSelector((state) => state.auth);

  if (isLoading) return <div className="text-center py-5">Загрузка товаров...</div>;
  if (error) return <div className="text-center py-5">Ошибка загрузки товаров: {error.message}</div>;

  const handleAddToCart = (product) => {
    dispatch(addToCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      maxQur: product.quantity,
      quantity: 1,
      photo_path: product.photo_path
    }));

    toast.success(`Товар "${product.name}" добавлен в корзину!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="products-container">
      <h2 className="mb-4">Товары</h2>
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
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p>Товары не найдены</p>
        </div>
      ) : (
        <Row>
          {filteredProducts.map(product => (
            <Col key={product.id} md="3" sm="6" xs="12" className="mb-4">
              <Card className="h-100 product-card">
                <div className="image-container">
                  <img
                    alt={product.name}
                    src={`http://localhost:5000/uploads/${product.photo_path}`}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5" className="product-title">{product.name}</CardTitle>
                  <CardText className="product-description">{product.description}</CardText>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <CardText className="product-price mb-0">{product.price} ₽</CardText>
                    {token ? (
                      product.quantity > 0 ? (

                        <FaShoppingCart className="me-2"  onClick={() => handleAddToCart(product)}
                        style={{ cursor: 'pointer' }}
                        aria-label={`Добавить ${product.name} в корзину`}/>
                      ) : (
                        <Badge color="warning" pill className="out-of-stock-badge">
                          <FaClock className="me-2" />
                          Ожидаем поставку
                        </Badge>
                      )
                    ) : (
                      <>
                        Войдите для заказа
                      </>

                    )}


                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Products;