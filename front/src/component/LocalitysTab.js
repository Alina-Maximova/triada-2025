import React, { useState } from 'react';
import { useAddLocalityMutation, useGetLocalitysQuery, useDeleteLocalityMutation, useUpdateLocalityMutation } from '../redux/apiSlice';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { toast } from 'react-toastify';

const LocalitysTab = () => {
  const [addLocality] = useAddLocalityMutation();
  const [deleteLocality] = useDeleteLocalityMutation();
  const [updateLocality] = useUpdateLocalityMutation();
  const { data: localitys } = useGetLocalitysQuery();


  const [localityModal, setLocalityModal] = useState(false);
  const [localityForm, setLocalityForm] = useState({ name: '', price: '' });
  const [editLocality, setEditLocality] = useState(null);

  const toggleLocalityModal = () => setLocalityModal(!localityModal);

  const handleAddLocality = async (e) => {
    e.preventDefault();
    try {
      await addLocality(localityForm).unwrap();
      setLocalityForm({ name: '', price: '' });
      toggleLocalityModal();
      toast.success(`Вы добавили населенный пункт`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка добавление населенный пункт`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteLocality = async (id) => {
    try {
      await deleteLocality(id).unwrap();
      toast.success(`Вы удалили населенный пункт № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка удаление населенный пункт № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateLocality = async (e) => {
    e.preventDefault();
    try {
      await updateLocality({ id: editLocality.id, ...localityForm }).unwrap();
      setLocalityForm({ name: '', price: '' });
      setEditLocality(null);
      toggleLocalityModal();
      toast.success(`Вы обновили населенный пункт № ${editLocality.id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка обновление населенный пункт № ${editLocality.id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} onClick={toggleLocalityModal}>Добавить населенный пункт</Button>
      <Table striped>
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {localitys && localitys.map(locality => (
            <tr key={locality.id}>
              <td>{locality.name}</td>
              <td>{locality.price}</td>
              <td>
                <Button color="danger" style={{ marginRight: "10px" }}  onClick={() => handleDeleteLocality(locality.id)}>Удалить</Button>
                <Button color="warning" onClick={() => { setLocalityForm(locality); setEditLocality(locality); toggleLocalityModal(); }}>Редактировать</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={localityModal} toggle={toggleLocalityModal}>
        <ModalHeader toggle={toggleLocalityModal}>{editLocality ? 'Редактирование населенный пункт' : 'Добавление населенный пункт'}</ModalHeader>
        <ModalBody>
          <Form onSubmit={editLocality ? handleUpdateLocality : handleAddLocality}>
            <FormGroup>
              <Label for="localityName">Название</Label>
              <Input type="text" id="localityName" required value={localityForm.name} onChange={(e) => setLocalityForm({ ...localityForm, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="localityAmount">Цена</Label>
              <Input type="number" id="localityAmount" required value={localityForm.price} onChange={(e) => setLocalityForm({ ...localityForm, price: e.target.value })} />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} type="submit">{editLocality ? 'Обновить' : 'Добавить'}</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default LocalitysTab;
