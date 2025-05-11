import React, { useState } from 'react';
import { useAddServiceMutation, useGetServicesQuery, useDeleteServiceMutation, useUpdateServiceMutation } from '../redux/apiSlice';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { toast } from 'react-toastify';

const ServicesTab = () => {
  const [addService] = useAddServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const { data: services } = useGetServicesQuery();

  const [serviceModal, setServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });
  const [editService, setEditService] = useState(null);

  const toggleServiceModal = () => setServiceModal(!serviceModal);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addService(serviceForm).unwrap();
      setServiceForm({ name: '', description: '', price: '' });
      toggleServiceModal();
      toast.success(`Вы добавили услугу`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка добавление услуги`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id).unwrap();
      toast.success(`Вы удалили услугу № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка удаление услуги № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await updateService({ id: editService.id, ...serviceForm }).unwrap();
      setServiceForm({ name: '', description: '', price: '' });
      setEditService(null);
      toggleServiceModal();
      toast.success(`Вы обновили услугу № ${editService.id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка обновление услуги № ${editService.id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
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
                <Button color="danger" style={{ marginRight: "10px" }}  onClick={() => handleDeleteService(service.id)}>Удалить</Button>
                <Button color="warning" onClick={() => { setServiceForm(service); setEditService(service); toggleServiceModal(); }}>Редактировать</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </div>
  );
};

export default ServicesTab;
