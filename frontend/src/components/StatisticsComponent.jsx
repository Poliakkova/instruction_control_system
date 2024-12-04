import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import '@xyflow/react/dist/style.css';
import '../css/Statistics.css';

import SideBarInstructionComponent from './panels/SideBarInstructionComponent';
import { listInstructions } from '../sevices/InstructionService';
import { listUsers } from '../sevices/UserService';

// Реєструємо елементи для chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const InstructionComponent = () => {

  const [instructions, setInstructions] = useState([])
  const [users, setUsers] = useState([])

  const [instructionTypeData, setInstructionTypeData] = useState({
    labels: [],
    datasets: []
  });
  const [instructionStatusData, setInstructionStatusData] = useState({
    labels: [],
    datasets: []
  });
  const [userRoleData, setUserRoleData] = useState({
    labels: [],
    datasets: []
  });
  const [userLoadData, setUserLoadData] = useState({
    labels: [],
    datasets: []
  });


  // useEffect(() => {
  //   listInstructions().then((response) => {
  //       console.log('Дані з API:', response.data); // Перевірте, що ви отримуєте дані
  //       if (response.data && response.data.length > 0) {
  //       setInstructions(response.data);
  //       updateChartData(response.data); // Оновлюємо дані для діаграм
  //   }}).catch(error => {
  //       console.error(error);
  //   })
  // }, [])

  useEffect(() => {
    // Використовуємо Promise.all для виконання обох запитів одночасно
    Promise.all([listInstructions(localStorage.getItem("token")), listUsers(localStorage.getItem("token"))])
      .then(([instructionsResponse, usersResponse]) => {
        console.log('Дані з API (інструкції):', instructionsResponse.data);
        console.log('Дані з API (користувачі):', usersResponse.data);
        
        if (instructionsResponse.data && instructionsResponse.data.length > 0) {
          setInstructions(instructionsResponse.data); // Оновлюємо стан для інструкцій
        }

        if (usersResponse.data && usersResponse.data.length > 0) {
          setUsers(usersResponse.data); // Оновлюємо стан для користувачів
        }

        // Оновлюємо дані для діаграми, передаючи інструкції та користувачів
        updateChartData(instructionsResponse.data, usersResponse.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const updateChartData = (instructions, users) => {
    console.log("updateChartData - instructions: " + instructions);
    console.log("updateChartData - users: " + users);

    // Підрахунок для типів
    const typeCounts = {
      'Науково-методична робота': 0,
      'Навчально-виховна робота': 0,
      'Профорієнтаційна робота': 0,
      'Навчально-організаційна робота': 0,
    };

    // Підрахунок для статусів
    const statusCounts = {
      'CREATED': 0,
      'IN_PROGRESS': 0,
      'CONFIRMATION': 0,
      'FINISHED': 0,
    };

    // Підрахунок для статусів
    const roleCounts = {
      'ADMIN': 0,
      'TEACHER': 0,
      'STUDENT': 0,
    };

    instructions.forEach((instruction) => {
      console.log('Instruction: ', instruction); // Перевіряємо кожну інструкцію

      // Підрахунок типів
      if (typeCounts[instruction.type] !== undefined) {
        typeCounts[instruction.type]++;
      }

      // Підрахунок статусів
      if (statusCounts[instruction.status] !== undefined) {
        statusCounts[instruction.status]++;
      }
    });

    // Підрахунок кількості інструкцій для кожного користувача
    const userInstructionCounts = {};

    users.forEach((user) => {
      console.log('user: ', user); // Перевіряємо кожну інструкцію

      // Підрахунок типів
      if (roleCounts[user.userJobTitle] !== undefined) {
        roleCounts[user.userJobTitle]++;
      }

      // Підрахунок кількості інструкцій для кожного користувача
      if (user.instructions) {
        userInstructionCounts[user.userLogin] = user.instructions.length;
      } else {
        userInstructionCounts[user.userLogin] = 0; // Якщо немає інструкцій
      }
    });

    // Оновлюємо дані для діаграми по типах
    setInstructionTypeData({
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: '# зразків',
          data: Object.values(typeCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(245, 39, 183, 0.2)',
            'rgba(152, 39, 245, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(245, 39, 183, 1)',
            'rgba(152, 39, 245, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    // Оновлюємо дані для діаграми по статусах
    setInstructionStatusData({
      labels: ['Назначено', 'В роботі', 'Очікує затвердження', 'Виконано'],
      datasets: [
        {
          label: '# зразків',
          data: [
            statusCounts['CREATED'],
            statusCounts['IN_PROGRESS'],
            statusCounts['CONFIRMATION'],
            statusCounts['FINISHED'],
          ],
          backgroundColor: [
            'rgba(255, 131, 74, 0.2)',
            'rgba(255, 219, 74, 0.2)',
            'rgba(76, 175, 80, 0.2)',
            'rgba(173, 181, 189, 0.2)',
          ],
          borderColor: [
            'rgba(255, 131, 74, 1)',
            'rgba(255, 219, 74, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(173, 181, 189, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    console.log("setUserRoleData "+ roleCounts['ADMIN'] + " " + roleCounts['TEACHER'] + " " + roleCounts['STUDENT']);

    // Оновлюємо дані для діаграми по статусах
    setUserRoleData({
      labels: ['Адмін', 'Викладач', 'Студ.представник'],
      datasets: [
        {
          label: '# зразків',
          data: [
            roleCounts['ADMIN'],
            roleCounts['TEACHER'],
            roleCounts['STUDENT'],
          ],
          backgroundColor: [
            'rgba(255, 0, 0, 0.2)',
            'rgba(0, 255, 0, 0.2)',
            'rgba(0, 0, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 0, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

      // Генеруємо кольори для всіх користувачів
    const colors = generateColors(users.length);

    // Оновлюємо дані для діаграми по кількості інструкцій для кожного користувача
    setUserLoadData({
      labels: Object.keys(userInstructionCounts), // Логіни користувачів
      datasets: [
        {
          label: 'Кількість інструкцій',
          data: Object.values(userInstructionCounts), // Кількість інструкцій для кожного користувача
          backgroundColor: colors.backgroundColors,
          borderColor: colors.borderColors,
          borderWidth: 1,
        },
      ],
    });
  };

  // Цей useEffect буде викликаний кожного разу, коли зміниться instruction
  useEffect(() => {
    console.log("typeData UPDATED: ", instructionTypeData);
  }, [instructionTypeData]);

    // Функція для генерації випадкового кольору
  function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}`;
  }

  // Функція для генерації масиву кольорів на основі кількості користувачів
  function generateColors(count) {
    const backgroundColors = [];
    const borderColors = [];

    for (let i = 0; i < count; i++) {
      const randomColor = getRandomColor();
      backgroundColors.push(`${randomColor}, 0.2)`); // З прозорістю
      borderColors.push(`${randomColor}, 1)`); // Без прозорості
    }

    return { backgroundColors, borderColors };
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          // Показуємо відсотки у спливаючих підказках (tooltip)
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(0);
            return `${currentValue} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        // Показуємо відсотки безпосередньо на секторах
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
        color: '#3d3d3d', // Колір підписів
        font: {
          size: 14, // Розмір шрифту
        },
      },
    },
  };

  return (
    <div className="wrapper">
      <SideBarInstructionComponent />

      <div className="main-content">
        <h3 className='title'>Статистика доручень</h3>
        <hr></hr>
        <Row style={{marginLeft: 'auto'}}>
          <Col className='diagram mr-3' style={{marginRight: '20px'}}>
            <div className="diagram-title ">Розподіл доручень за типом</div>
            <Pie className='pie' data={instructionTypeData} options={options}/>
          </Col>
          <Col className='diagram'>
            <div className="diagram-title">Розподіл доручень за статусом</div>
            <Pie className='pie' data={instructionStatusData} options={options} />
          </Col>
        </Row>

        <h3 className='title' style={{marginTop: "30px"}}>Статистика користувачів</h3>
        <hr></hr>
        <Row style={{marginLeft: 'auto'}}>
          <Col className='diagram mr-3' style={{marginRight: '20px'}}>
            <div className="diagram-title ">Розподіл ролей користувачів</div>
            <Pie className='pie' data={userRoleData} options={options} />
          </Col>
          <Col className='diagram' style={{marginRight: '20px'}}>
            <div className="diagram-title">Навантаження користувачів</div>
            <Pie className='pie' data={userLoadData} options={options} />
          </Col>
          {/* <Col className='diagram'>
            <div className="diagram-title">Є виконавцями</div>
            <Pie className='pie' data={performerData} options={options} />
          </Col> */}
        </Row>
      </div>
    </div>
  )
}

export default InstructionComponent