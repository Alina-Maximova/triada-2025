const db = require('../utils/db');

exports.getOrders = async (req, res) => {
  try {
    const orders = await db('orders')
      .select('orders.*', 'users.first_name', 'users.last_name', 'locality.name as localityName', 'locality.price as localityPrice')
      .leftJoin('users', 'orders.user_id', 'users.id')
      .leftJoin('locality', 'orders.locality_id', 'locality.id');

    for (const order of orders) {
      order.products = await db('order_products')
        .where({ order_id: order.id })
        .select('order_products.*', 'products.name as product_name', 'products.price as product_price', 'products.photo_path')
        .leftJoin('products', 'order_products.product_id', 'products.id');

      order.services = await db('order_services')
        .where({ order_id: order.id })
        .select('order_services.*', 'services.name as service_name', 'services.price as service_price')
        .leftJoin('services', 'order_services.service_id', 'services.id');
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const orders = await db('orders')
      .where({ user_id: userId })
      .select('orders.*', 'users.first_name', 'users.last_name', 'locality.name as localityName', 'locality.price as localityPrice')
      .leftJoin('users', 'orders.user_id', 'users.id') 
      .leftJoin('locality', 'orders.locality_id', 'locality.id');

    for (const order of orders) {
      order.products = await db('order_products')
        .where({ order_id: order.id })
        .select('order_products.*', 'products.name as product_name', 'order_products.price as product_price', 'products.photo_path')
        .leftJoin('products', 'order_products.product_id', 'products.id');

      order.services = await db('order_services')
        .where({ order_id: order.id })
        .select('order_services.*', 'services.name as service_name', 'services.price as service_price')
        .leftJoin('services', 'order_services.service_id', 'services.id');
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addOrder = async (req, res) => {
  const userId = req.user.id;
  const { total_amount, items, services, address, phone_number, locality_id } = req.body;
  const order_date = new Date().toISOString();
  const status = 'Новый';

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Начинаем транзакцию
  const trx = await db.transaction();

  try {
    // 1. Создаем запись заказа
    const [orderId] = await trx('orders')
      .insert({ 
        user_id: userId, 
        order_date, 
        status, 
        total_amount ,
        address,
        phone_number,
        locality_id
      })
      .returning('id');

    // 2. Добавляем товары в заказ (если есть)
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: orderId.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price // Сохраняем цену на момент заказа
      }));
      await trx('order_products').insert(orderItems);
    }

    // 3. Добавляем услуги в заказ (если есть)
    if (services && services.length > 0) {
      const orderServices = services.map(service => ({
        order_id: orderId.id,
        service_id: service.service_id,
        price: service.price  // Сохраняем цену на момент заказа
      }));
      await trx('order_services').insert(orderServices);
    }

    // Если все успешно - коммитим транзакцию
    await trx.commit();

    res.status(200).json({ 
      success: true,
      message: 'Order added successfully', 
      orderId: orderId.id 
    });
  } catch (error) {
    // В случае ошибки - откатываем транзакцию
    await trx.rollback();
    
    console.error('Error adding order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error adding order',
      details: error.message 
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, cancel_reason } = req.body;

  const trx = await db.transaction();

  try {
    // Проверяем существование заказа
    const order = await trx('orders').where({ id }).first();
    if (!order) {
      await trx.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData = { status };

    // Если статус "Отменен" и указана причина, добавляем её
    if (status === 'Отменен' && cancel_reason) {
      updateData.cancel_reason = cancel_reason;
    }

    // Обновляем статус
    await trx('orders').where({ id }).update(updateData);

    // Если статус изменен на "В процессе", уменьшаем количество товара
    if (status === 'Выполнено') {
      const orderProducts = await trx('order_products').where({ order_id: id }).select('product_id', 'quantity');

      for (const orderProduct of orderProducts) {
        await trx('products')
          .where({ id: orderProduct.product_id })
          .decrement('quantity', orderProduct.quantity);
      }
    }

    await trx.commit();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: await db('orders').where({ id }).first()
    });
  } catch (error) {
    await trx.rollback();
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating order status',
      details: error.message
    });
  }
};
