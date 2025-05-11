// src/components/AdminPanel.js
import React, { useState } from 'react';
import { useAddProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../redux/apiSlice';
import { useAddServiceMutation, useGetServicesQuery, useDeleteServiceMutation, useUpdateServiceMutation } from '../redux/apiSlice';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../redux/apiSlice';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Table, Badge, Alert } from 'reactstrap';
import classnames from 'classnames';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const AdminPanel = () => {
  const [addProduct] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: products } = useGetProductsQuery();

  const [addService] = useAddServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const { data: services } = useGetServicesQuery();

  const { data: orders } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();


  const [activeTab, setActiveTab] = useState('1');
  const [productModal, setProductModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [cancelReasonModal, setCancelReasonModal] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusChangeError, setStatusChangeError] = useState('');
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', quantity: '', photo: null });
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [editService, setEditService] = useState(null);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleProductModal = () => setProductModal(!productModal);
  const toggleServiceModal = () => setServiceModal(!serviceModal);
  const toggleOrderDetailsModal = () => setOrderDetailsModal(!orderDetailsModal);
  const toggleCancelReasonModal = () => setCancelReasonModal(!cancelReasonModal);
  const toggleConfirmStatusModal = () => setConfirmStatusModal(!confirmStatusModal);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', productForm.photo);

    try {
      const response = await axios.post('http://localhost:5000/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const photoUrl = response.data.photoUrl;

      await addProduct({ ...productForm, photoUrl }).unwrap();
      setProductForm({ name: '', description: '', price: '', quantity: '', photo: null });
        toggleProductModal();
        toast.success(`Вы добавили товар `, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      
    } catch (error) {
     
      toast.error(`Не получилось добавить товар`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error uploading photo:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try{
      await deleteProduct(id).unwrap();
      toast.success(`Вы удалили товар № "${id}"`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    }catch(err) {
     toast.error(`Ошибка удаление товара № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({ id: editProduct.id, ...productForm }).unwrap();;
      setProductForm({ name: '', description: '', price: '', quantity: '', photo: null });
      setEditProduct(null);
      toggleProductModal();
      toast.success(`Вы обновили товар`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch(err) {
     
      toast.error(`Ошибка при обновление товар`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addService(serviceForm).unwrap();
      setServiceForm({ name: '', description: '', price: '' });
      toggleServiceModal();
      toast.success(`Вы добавили услугу `, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch(err) {
      
      toast.error(`Ошибка добавление услуги`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id).unwrap();
      toast.success(`Вы удалили услугу № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch(err) {
      
      toast.error(`Ошибка удаление услуги № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await updateService({ id: editService.id, ...serviceForm }).unwrap();;
      setServiceForm({ name: '', description: '', price: '' });
      setEditService(null);
      toggleServiceModal();
      toast.success(`Вы обновили услугу № ${editService.id}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch(err) {
      
      toast.error(`Ошибка обновление услуги № ${editService.id}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  };

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    toggleOrderDetailsModal();
  };

  const handleStatusChange = async (order, status) => {
    // Check status transition rules
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
    toast.success(`Вы обновили статус заказа  № "${selectedOrder.id}"`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const confirmStatusUpdate = async () => {
    try {
      await updateOrderStatus({ id: selectedOrder.id, status: newStatus });
      toggleConfirmStatusModal();

      toast.success(`Вы обновили статус заказа  № "${selectedOrder.id}"`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
     
      console.error('Error updating status:', error);
      setStatusChangeError('Ошибка при изменении статуса');
      toast.error('Ошибка при изменении статуса', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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

  return (
    <div>
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
      <Nav tabs className='mb-2'>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Товары
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Услуги
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { toggle('3'); }}
          >
            Заказы
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} onClick={toggleProductModal}>Добавить товар</Button>
          <Table striped>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products && products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Button color="danger" onClick={() => handleDeleteProduct(product.id)}>Удалить</Button>
                    <Button color="warning" onClick={() => { setProductForm(product); setEditProduct(product); toggleProductModal(); }}>Редактировать</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>

        <TabPane tabId="2">
          <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} onClick={toggleServiceModal}>Добавить услугу</Button>
          <Table striped>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {services && services.map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.price}</td>
                  <td>
                    <Button color="danger" onClick={() => handleDeleteService(service.id)}>Удалить</Button>
                    <Button color="warning" onClick={() => { setServiceForm(service); setEditService(service); toggleServiceModal(); }}>Редактировать</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPane>

        <TabPane tabId="3">
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
                    <Button color="info" onClick={() => handleShowOrderDetails(order)}>Детали</Button>
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
        </TabPane>
      </TabContent>

      {/* Product Modal */}
      <Modal isOpen={productModal} toggle={toggleProductModal}>
        <ModalHeader toggle={toggleProductModal}>{editProduct ? 'Редактирование товара' : 'Добавление товара'}</ModalHeader>
        <ModalBody>
          <Form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
            <FormGroup>
              <Label for="productName">Название</Label>
              <Input type="text" id="productName" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="productDescription">Описание</Label>
              <Input type="text" id="productDescription" required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="productPrice">Цена</Label>
              <Input type="number" id="productPrice" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="productQuantity">Количество на складе</Label>
              <Input type="number" id="productQuantity" required value={productForm.quantity} onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })} />
            </FormGroup>
            {!editProduct && (
              <FormGroup>
                <Label for="productPhoto">Фото</Label>
                <Input type="file" id="productPhoto" onChange={(e) => setProductForm({ ...productForm, photo: e.target.files[0] })} />
              </FormGroup>
            )}
            <div className="d-flex justify-content-end">
              <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} type="submit">{editProduct ? 'Обновить' : 'Добавить'}</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Service Modal */}
      <Modal isOpen={serviceModal} toggle={toggleServiceModal}>
        <ModalHeader toggle={toggleServiceModal}>{editService ? 'Редактирование услуги' : 'Добавление услуги'}</ModalHeader>
        <ModalBody>
          <Form onSubmit={editService ? handleUpdateService : handleAddService}>
            <FormGroup>
              <Label for="serviceName">Название</Label>
              <Input type="text" id="serviceName" required value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="serviceDescription">Описание</Label>
              <Input type="text" id="serviceDescription" required value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="servicePrice">Цена</Label>
              <Input type="number" id="servicePrice" required value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} type="submit">{editService ? 'Обновить' : 'Добавить'}</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Order Details Modal */}
      <Modal isOpen={orderDetailsModal} toggle={toggleOrderDetailsModal} size="lg">
        <ModalHeader toggle={toggleOrderDetailsModal}>Детали заказа #{selectedOrder?.id}</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <h5>Информация о клиенте:</h5>
              <p>Имя: {selectedOrder.last_name}</p>
              <p>Телефон: {selectedOrder.phone_number}</p>
              <p>Адрес: {selectedOrder.address}</p>


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

      {/* Cancel Reason Modal */}
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

      {/* Status Change Confirmation Modal */}
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

export default AdminPanel;
