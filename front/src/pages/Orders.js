import React, { useState, useEffect } from 'react';
import {
  Table,
  Collapse,
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  useGetOrdersByUserIdQuery,
  useUpdateOrderStatusMutation,
  useGetLocalitysQuery
} from '../redux/apiSlice';
import { FaInfoCircle, FaTimes, FaBoxOpen } from 'react-icons/fa';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCartLoc } from '../redux/slices/cartSlice';

const Orders = () => {
  const { data: orders, error, isLoading } = useGetOrdersByUserIdQuery();
 
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [collapseStates, setCollapseStates] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
    const dispatch = useDispatch();
  

  const toggleCollapse = (orderId) => {
    setCollapseStates(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const toggleModal = () => setModal(!modal);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    toggleModal();
  };

  const handleUpdateOrderStatus = async () => {
    try {
      await updateOrderStatus({
        id: selectedOrderId,
        status: "Отменен"
      }).unwrap();
      toast.success(`Вы успешно отменили заказ №${selectedOrderId}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Ошибка при отмене заказа. Пожалуйста, попробуйте снова.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      toggleModal();
    }
  };

  
  if (isLoading) return <div className="text-center py-5">Загрузка заказов...</div>;
  if (error) return <div className="text-center py-5">Ошибка загрузки заказов: {error.message}</div>;
  if (!orders || orders.length === 0) return (
    <div className="text-center py-5">
      <p><h1>У вас нет заказов</h1></p>
      <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} href="/products">Перейти к товарам</Button>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Новый':
        return <Badge color="primary">{status}</Badge>;
      case 'В обработке':
        return <Badge color="warning">{status}</Badge>;
      case 'Выполнен':
        return <Badge color="success">{status}</Badge>;
      case 'Отменен':
        return <Badge color="danger">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
console.log(orders.last_name)
  return (
    <div className="orders-container">
      <h2 className="mb-4">Мои заказы</h2>
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
      {orders.map(order => (
        <Card key={order.id} className="mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <CardTitle tag="h5" className="mb-0">
                Заказ №{order.id}
              </CardTitle>
              {getStatusBadge(order.status)}
            </div>

            <div className="order-meta mb-3">
              <p className="mb-1">
                <strong>Дата:</strong> {new Date(order.order_date).toLocaleString()}
              </p>
              {order.status === 'Отменен' && order.cancel_reason && (
                <div><strong>Причина отмены:</strong> {order.cancel_reason}</div>
              )}
               {order.localityName  && (
                <div><strong>Выезд:</strong> {order.localityName} {order.localityPrice} ₽</div>
              )}
              <p className="mb-1">
                <strong>Итого:</strong> {order.total_amount} ₽
              </p>
            </div>

            <ButtonGroup className="mb-3">
              <Button
           
                onClick={() => toggleCollapse(order.id)} style={{ backgroundColor: '#ef8810', borderColor: '#ef8810', color:"White" }}
              >
                {collapseStates[order.id] ? 'Скрыть детали' : 'Показать детали'} <FaInfoCircle className="ml-2" />
              </Button>
              {order.status === 'Новый' && (
                <Button
                  color="danger"
                  onClick={() => handleCancelClick(order.id)}
                >
                  <FaTimes /> Отменить заказ
                </Button>
              )}
            </ButtonGroup>

            <Collapse isOpen={collapseStates[order.id]}>
              {order.products && order.products.length > 0 && (
                <>
                  <h6 className="mt-3">Товары:</h6>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Название</th>
                        <th className="text-center">Кол-во</th>
                        <th className="text-right">Цена</th>
                        <th className="text-right">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map(product => (
                        <tr key={`product-${product.id}`}>
                          <td>{product.product_name}</td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-right">{product.product_price} ₽</td>
                          <td className="text-right">{(product.product_price * product.quantity)} ₽</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              {order.services && order.services.length > 0 && (
                <>
                  <h6 className="mt-4">Услуги:</h6>
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Название</th>
                        <th className="text-right">Цена</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.services.map(service => (
                        <tr key={`service-${service.id}`}>
                          <td>{service.service_name}</td>
                          <td className="text-right">{service.service_price} ₽</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                 

                  
                </>
              )}
            </Collapse>
          </CardBody>
        </Card>
      ))}

      {/* Модальное окно подтверждения отмены */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Подтверждение отмены заказа</ModalHeader>
        <ModalBody>
          Вы действительно хотите отменить заказ № {selectedOrderId}?
          <div className="mt-3 text-warning">
            <FaBoxOpen className="mr-2" />
            После отмены восстановление заказа будет невозможно
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Отмена</Button>
          <Button color="danger" onClick={handleUpdateOrderStatus}>
            Да, отменить заказ
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Orders;
