import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCartItem,
  updateQuantityItem,
  clearCart,
  removeFromCartServ,
  addToCartLoc
} from '../redux/slices/cartSlice';
import {
  Button,
  Table,
  Input,
  InputGroup,
  Form,
  FormGroup,
  Label,
} from 'reactstrap';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { IMaskInput } from "react-imask";
import { useAddOrderMutation, useGetLocalitysQuery } from '../redux/apiSlice';


const CartItem = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [addOrder] = useAddOrderMutation();
  const { data: localitys, error, isLoading } = useGetLocalitysQuery();
  console.log(localitys)
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  let priceLoc = 0;
  if (isLoading) return <div className="text-center py-5">Загрузка услуг...</div>;
  if (error) return <div className="text-center py-5">Ошибка загрузки услуг: {error.message}</div>;
 

  const cartItems = Array.isArray(cart.items) ? cart.items : [];
  const cartServices = Array.isArray(cart.services) ? cart.services : [];


  const totalServ = [...cartServices].reduce(
    (sum, item) => sum + Number(item.price), 0

  );
  const totalItem = [...cartItems].reduce(
    (sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0
  );
  console.log(cart)
  if(cart.services.length>0){
     priceLoc = localitys.find(l => l.id == cart.locality_id)?.price ||0;

  }else{
     priceLoc = 0;

  }
  console.log(totalItem+" "+totalServ+" "+priceLoc)
  const totalAmount = Number(totalItem) + Number(totalServ)+ Number(priceLoc);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCartItem(itemId));
  };

  const handleRemoveService = (serviceId) => {
    dispatch(removeFromCartServ(serviceId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleItemQuantityChange = (itemId, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantityItem({ id: itemId, quantity }));
    }
  };

  const handleLocalityChange = (localityId) => {
    // Обновление стоимости заказа с учетом стоимости доставки
    dispatch(addToCartLoc({
      locality_id: localityId
    }));
  };

  const handleCheckout = async () => {
    console.log(address+phoneNumber)
    if(cart.services.length>0&&!cart.locality_id){
      toast.error('Пожалуйста, выберите населенный.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    return;

    }
    if (!address || !phoneNumber) {
      toast.error('Пожалуйста, заполните адрес и номер телефона.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    return;

    }


    const order = {
      total_amount: totalAmount,
      address,
      phone_number: phoneNumber,
      locality_id: cart.locality_id,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,

      })),
      services: cartServices.map(service => ({
        service_id: service.id,
        price: service.price
      }))
    };
    console.log(order)
    try {
      await addOrder(order).unwrap();
      dispatch(clearCart());
      toast.success('Заказ успешно оформлен!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error('Ошибка при оформлении заказа. Пожалуйста, попробуйте снова.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="cart-container">
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
      {cartItems.length > 0 && (
        <>
          <h5 className="mt-4">Товары</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>Товар</th>
                <th className="text-center">Количество</th>
                <th className="text-right">Цена</th>
                <th className="text-right">Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={`item-${item.id}`}>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.photo_path && (
                        <img
                          alt={item.name}
                          src={`http://localhost:5000/uploads/${item.photo_path}`}
                          className="cart-item-image mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <InputGroup className="quantity-control">
                      <Button
                        color="secondary"
                        onClick={() => handleItemQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.maxQur}
                        onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 1)}


                      />
                      <Button
                        color="secondary"
                        onClick={() => handleItemQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity == item.maxQur}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </td>
                  <td className="text-right">{item.price} ₽</td>
                  <td className="text-right">{(item.price * item.quantity)} ₽</td>
                  <td className="text-center">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Удалить ${item.name} из корзины`}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {cartServices.length > 0 && (
        <>
          <h5 className="mt-4">Услуги</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>Услуга</th>

                <th className="text-right">Цена</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartServices.map(service => (
                <tr key={`service-${service.id}`}>
                  <td>{service.name}</td>
                  <td className="text-right">{service.price} ₽</td>

                  <td className="text-center">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveService(service.id)}
                      aria-label={`Удалить ${service.name} из корзины`}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {(cartItems.length === 0 && cartServices.length === 0) && (
        <div className="text-center py-5">
          <p><h1>Ваша корзина пуста</h1></p>
          <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} href="/products">Перейти к товарам</Button>
        </div>
      )}

      {(cartItems.length > 0 || cartServices.length > 0) && (
        <div className="cart-summary mt-4">
          <Form>
            {/* Выбор населенного пункта */}
            {(cartServices.length > 0) && (
            <FormGroup className="mt-3">
              <Label for={`locality-${cart.locality_id}`}>Населенный пункт:</Label>
              <Input
                type="text"
                id={`locality-${cart.locality_id}`}
                value={
                  cart.locality_id
                    ? localitys.find(l => l.id == cart.locality_id)?.name || 'Неизвестный населенный пункт'
                    : 'Не выбрано'
                }
                readOnly
              />
              <Input
                type="select"
                className="mt-2"
                value={cart.locality_id || ''}
                onChange={(e) => handleLocalityChange(e.target.value)}
              >
                <option value="">Выберите населенный пункт...</option>
                {localitys && localitys.map(locality => (
                  <option key={locality.id} value={locality.id}>
                    {locality.name} ({locality.price} руб.)
                  </option>
                ))}
              </Input>
            </FormGroup>
            )}
            <FormGroup>
              <Label for="address">Адрес</Label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Номер телефона</Label>

              <IMaskInput
                mask="+7 (000) 000-00-00"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="form-control" // Это стандартный класс Bootstrap для Input
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  color: '#212529',
                  backgroundColor: '#fff',
                  backgroundClip: 'padding-box',
                  border: '1px solid #ced4da',
                  appearance: 'none',
                  borderRadius: '0.25rem',
                  transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }}
              />

            </FormGroup>
          </Form>

          <div className="d-flex justify-content-between align-items-center">
            <h4>
              Итого: {totalAmount} ₽
            </h4>
            <div>
              <Button
                color="danger"
                onClick={handleClearCart}
                className="mr-2"
              >
                Очистить корзину
              </Button>
              <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810', color:"White" }} onClick={handleCheckout}>
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
