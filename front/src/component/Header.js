import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Nav as NavTabs,
  NavItem as NavItemTab,
  Badge
} from 'reactstrap';
import { FaShoppingCart } from 'react-icons/fa';
import classnames from 'classnames';
import Login from './Login';
import Register from './Register';
import logo from "../img/logo.png";
import '../index.css';
import { clearCart } from '../redux/slices/cartSlice';

const Header = () => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { count } = useSelector((state) => state.cart);

  const toggle = () => setModal(!modal);
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleLogout = () => {
    dispatch(logout());
     dispatch(clearCart());
  };
  console.log(user?.role)


  return (
    <Navbar color="dark" dark expand="md" className="px-4">
      <NavbarBrand href="/" className="font-weight-bold">
        <img alt="logo" src={logo} style={{ height: 70, width: 200 }} />
      </NavbarBrand>

      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink href="/products" className="text-white">Товары</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/services" className="text-white">Услуги</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/about" className="text-white">О нас</NavLink>
        </NavItem>
        {user?.role === 1 && <NavItem>
          <NavLink href="/admin" className="text-white">Админ</NavLink>
        </NavItem>}

      </Nav>

      <Nav navbar className="align-items-center">
        {token ? (
          <>
            <NavItem className="me-3">
              <NavLink href="/cart" className="text-white position-relative">
                <FaShoppingCart size={20} />
                {count > 0 && (
                  <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {count}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/orders" className="text-white">Заказы</NavLink>
            </NavItem>
            <NavItem className="ms-3">
              <Button onClick={handleLogout} style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} className="px-4">
                Выход
              </Button>
            </NavItem>
          </>
        ) : (
          <NavItem className="ms-3">
            <Button onClick={toggle} style={{ backgroundColor: '#ef8810', borderColor: '#ef8810' }} className="px-4">
              Вход
            </Button>
          </NavItem>
        )}
      </Nav>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle} className="border-0 pb-0">
          <NavTabs tabs className="w-100">
            <NavItemTab>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggleTab('1')}>
                Авторизация
              </NavLink>
            </NavItemTab>
            <NavItemTab>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggleTab('2')}>
                Регистрация
              </NavLink>
            </NavItemTab>
          </NavTabs>
        </ModalHeader>
        <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Login toggleModal={toggle} />
            </TabPane>
            <TabPane tabId="2">
              <Register toggleModal={toggle} />
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </Navbar>
  );
};

export default Header;