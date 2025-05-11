import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { ToastContainer } from 'react-toastify';
import ProductsTab from '../component/ProductsTab';
import ServicesTab from '../component/ServicesTab';
import OrdersTab from '../component/OrdersTab';
import LocalitysTab from '../component/LocalitysTab';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <ToastContainer />
      <div style={{ marginTop: '1%' }}>
      <Nav tabs className="mb-2" >
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
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '4' })}
            onClick={() => { toggle('4'); }}
          >
            Населенный пункты
          </NavLink>
        </NavItem>
      </Nav>
      </div>


      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <ProductsTab />
        </TabPane>
        <TabPane tabId="2">
          <ServicesTab />
        </TabPane>
        <TabPane tabId="3">
          <OrdersTab />
        </TabPane>
        <TabPane tabId="4">
          <LocalitysTab />
        </TabPane>
      </TabContent>

    </div>
  );
};

export default AdminPanel;
