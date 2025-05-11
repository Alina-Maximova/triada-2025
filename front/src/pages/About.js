import React, { useEffect } from 'react';
import { Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import './About.css';

const About = () => {
  useEffect(() => {
    const loadYaMap = () => {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
    };

    const initMap = () => {
      const map = new window.ymaps.Map('about-map', {
        center: [55.952106, 40.862175],
        zoom: 15
      });

      const placemark = new window.ymaps.Placemark(
        [55.952106, 40.862175],
        {
          hintContent: 'ИТЦ ТРИАДА',
          balloonContent: 'г. Судогда, Большой Советский переулок, д.15'
        },
        {
          preset: 'islands#icon',
          iconColor: '#0095b6'
        }
      );

      map.geoObjects.add(placemark);
    };

    loadYaMap();

    return () => {
      const scripts = document.querySelectorAll('script[src*="api-maps.yandex.ru"]');
      scripts.forEach(script => document.body.removeChild(script));
    };
  }, []);

  // Данные команды
  const team = [
    { name: "Митрофанов Артем Юрьевич", position: "Директор" },
    { name: "Потягов Артур Романович", position: "Продавец-консультант" },
    { name: "Андреева Алёна Алексеевна", position: "Секретарь" },
    { name: "Сергеев Тимур Владимирович", position: "Технический специалист" }
  ];

  return (
    <div className="about-container">
      <h1 className="about-title">О компании</h1>
      
      <div className="about-content">
        <Card className="about-card">
          <CardBody>
            <h2>Наша команда</h2>
            <ListGroup flush>
              {team.map((member, index) => (
                <ListGroupItem key={index} className="team-member">
                  <strong>{member.name}</strong>
                  <div className="position">{member.position}</div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </CardBody>
        </Card>

        <Card className="about-card">
          <CardBody>
            <h2>Контакты</h2>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Адрес:</strong>
                <p>г. Судогда, Большой Советский переулок, д. 15</p>
              </div>
              <div className="contact-item">
                <strong>Телефоны:</strong>
                <p>+7 (49235) 2-23-20 (WhatsApp/Telegram)</p>
                <p>+7 (49235) 2-23-20 (офис)</p>
              </div>
              <div className="contact-item">
                <strong>Почта:</strong>
                <p>triada@yandex.ru</p>
             
              </div>
              <div className="contact-item">
                <strong>Режим работы:</strong>
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб: 10:00 - 15:00</p>
                <p>Вс: выходной</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="map-section">
        <h2>Мы на карте</h2>
        <div id="about-map" className="map-container"></div>
      </div>
    </div>
  );
};

export default About;