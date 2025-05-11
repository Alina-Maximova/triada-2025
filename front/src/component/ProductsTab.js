import React, { useState } from 'react';
import { useAddProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../redux/apiSlice';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductsTab = () => {
  const [addProduct] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: products } = useGetProductsQuery();

  const [productModal, setProductModal] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', quantity: '', photo: null });
  const [editProduct, setEditProduct] = useState(null);

  const toggleProductModal = () => setProductModal(!productModal);

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
      toast.success(`Вы добавили товар`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Не получилось добавить товар`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.error('Error uploading photo:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success(`Вы удалили товар № "${id}"`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка удаление товара № ${id}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({ id: editProduct.id, ...productForm }).unwrap();
      setProductForm({ name: '', description: '', price: '', quantity: '', photo: null });
      setEditProduct(null);
      toggleProductModal();
      toast.success(`Вы обновили товар`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Ошибка при обновление товар`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
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
                
                <Button color="danger"  style={{ marginRight: "10px" }}  onClick={() => handleDeleteProduct(product.id)}>Удалить</Button>
                <Button color="warning" onClick={() => { setProductForm(product); setEditProduct(product); toggleProductModal(); }}>Редактировать</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </div>
  );
};

export default ProductsTab;
