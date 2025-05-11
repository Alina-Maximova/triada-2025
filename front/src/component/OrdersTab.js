import React, { useState } from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../redux/apiSlice';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Table, Badge, Alert } from 'reactstrap';
import { toast } from 'react-toastify';

const OrdersTab = () => {
  const { data: orders } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [cancelReasonModal, setCancelReasonModal] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusChangeError, setStatusChangeError] = useState('');

  const toggleOrderDetailsModal = () => setOrderDetailsModal(!orderDetailsModal);
  const toggleCancelReasonModal = () => setCancelReasonModal(!cancelReasonModal);
  const toggleConfirmStatusModal = () => setConfirmStatusModal(!confirmStatusModal);

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    toggleOrderDetailsModal();
  };

  const handleStatusChange = async (order, status) => {
    if (order.status === 'Отменен' || order.status === 'Выполнен') {
      setStatusChangeError('Нельзя изменить статус завершенного или отмененного заказа');
      return;
    }

    if (order.status === 'Новый' && status === 'Выполнен') {
      setStatusChangeError('Нельзя перевести заказ из статуса "Новый" сразу в "Выполнен"');
      return;
    }

    if (order.status === 'В процессе' && status === 'Новый') {
      setStatusChangeError('Нельзя вернуть заказ в статус "Новый" из "В процессе"');
      return;
    }

    setStatusChangeError('');

    if (status === 'Отменен') {
      setSelectedOrder(order);
      toggleCancelReasonModal();
    } else {
      setSelectedOrder(order);
      setNewStatus(status);
      toggleConfirmStatusModal();
    }
  };

  const handleCancelOrder = async () => {
    await updateOrderStatus({
      id: selectedOrder.id,
      status: 'Отменен',
      cancel_reason: cancelReason
    });
    setCancelReason('');
    toggleCancelReasonModal();
    toast.success(`Вы обновили статус заказа № "${selectedOrder.id}"`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const confirmStatusUpdate = async () => {
    try {
      await updateOrderStatus({ id: selectedOrder.id, status: newStatus });
      toggleConfirmStatusModal();
      toast.success(`Вы обновили статус заказа № "${selectedOrder.id}"`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatusChangeError('Ошибка при изменении статуса');
      toast.error('Ошибка при изменении статуса', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Новый': return 'primary';
      case 'В процессе': return 'warning';
      case 'Выполнен': return 'success';
      case 'Отменен': return 'danger';
      default: return 'secondary';
    }
  };
  console.log(orders)

  return (
    <div>
      {statusChangeError && <Alert color="danger">{statusChangeError}</Alert>}
      <Table striped>
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Клиент</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.last_name}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>
                <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                {order.status === 'Отменен' && order.cancel_reason && (
                  <div><small>Причина: {order.cancel_reason}</small></div>
                )}
              </td>
              <td>
                <Button   style={{ backgroundColor: '#ef8810', borderColor: '#ef8810',  marginBottom: "10px", color:"White" }} onClick={() => handleShowOrderDetails(order)}>Детали</Button>
                <Input
                  type="select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value)}
                  disabled={order.status === 'Отменен' || order.status === 'Выполнен'}
                >
                  <option value={order.status} disabled>{order.status}</option>
                  {order.status === 'Новый' && (
                    <>
                      <option value="В процессе">В процессе</option>
                      <option value="Отменен">Отменен</option>
                    </>
                  )}
                  {order.status === 'В процессе' && (
                    <>
                      <option value="Выполнен">Выполнен</option>
                      <option value="Отменен">Отменен</option>
                    </>
                  )}
                </Input>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={orderDetailsModal} toggle={toggleOrderDetailsModal} size="lg">
        <ModalHeader toggle={toggleOrderDetailsModal}>Детали заказа #{selectedOrder?.id}</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <h5>Информация о клиенте:</h5>
              <p>Имя: {selectedOrder.last_name}</p>
              <p>Телефон: {selectedOrder.phone_number}</p>
              <p>Адрес: {selectedOrder.address}</p>
               {selectedOrder.localityName  && (
                <p>Выезд: {selectedOrder.localityName} {selectedOrder.localityPrice} ₽</p>
              )}

              <h5 className="mt-4">Товары:</h5>
              <Table>
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Количество</th>
                    <th>Цена</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products && selectedOrder.products.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="mt-4">Услуги:</h5>
              <Table>
                <thead>
                  <tr>
                    <th>Услуга</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.services && selectedOrder.services.map(service => (
                    <tr key={service.id}>
                      <td>{service.service_name}</td>
                      <td>{service.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="mt-4">Общая информация:</h5>
              <p>Статус: <Badge color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
              <p>Общая сумма: {selectedOrder.total_amount}</p>
              <p>Дата создания: {new Date(selectedOrder.order_date).toLocaleString()}</p>
              {selectedOrder.status === 'Отменен' && selectedOrder.cancel_reason && (
                <p>Причина отмены: {selectedOrder.cancel_reason}</p>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleOrderDetailsModal}>Закрыть</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={cancelReasonModal} toggle={toggleCancelReasonModal}>
        <ModalHeader toggle={toggleCancelReasonModal}>Причина отмены заказа</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="cancelReason">Укажите причину отмены:</Label>
            <Input
              type="textarea"
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCancelOrder}>Подтвердить отмену</Button>
          <Button color="secondary" onClick={toggleCancelReasonModal}>Отмена</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={confirmStatusModal} toggle={toggleConfirmStatusModal}>
        <ModalHeader toggle={toggleConfirmStatusModal}>Подтверждение изменения статуса</ModalHeader>
        <ModalBody>
          Вы уверены, что хотите изменить статус заказа #{selectedOrder?.id} с "{selectedOrder?.status}" на "{newStatus}"?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmStatusUpdate}>Подтвердить</Button>
          <Button color="secondary" onClick={toggleConfirmStatusModal}>Отмена</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OrdersTab;
