import React from 'react'
import {useNavigate} from 'react-router-dom'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@xyflow/react/dist/style.css';
import '../css/Statistics.css';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Реєструємо елементи для chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const InstructionComponent = () => {
  const typeData = {
    labels: ['Науково-методична робота', 'Навчально-виховна робота', 'Профорієнтаційна робота', 'Навчально-організаційна робота'],
    datasets: [
      {
        label: '# зразків',
        data: [12, 19, 3, 5],
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
    ]
  }

  const statusData = {
    labels: ['Назначено', 'В роботі', 'Очікує затвердження', 'Затверджено'],
    datasets: [
      {
        label: '# зразків',
        data: [12, 19, 3, 6],
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
    ]
  }

  const userRolesData = {
    labels: ['Викладач', 'Студ.представник', 'Адмін'],
    datasets: [
      {
        label: '# зразків',
        data: [30, 3, 2],
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
    ]
  }

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

// Генеруємо кольори для всіх користувачів
const colors = generateColors(4);

  const headData = {
    labels: ['Викладач1', 'Викладач2', 'Викладач3', 'Викладач4'],
    datasets: [
      {
        label: '# зразків',
        data: [8, 5, 2, 4],
        backgroundColor: colors.backgroundColors,
        borderColor: colors.borderColors,
        borderWidth: 1,
      },
    ]
  }

  const performerData = {
    labels: ['Викладач1', 'Викладач2', 'Викладач3', 'Викладач4'],
    datasets: [
      {
        label: '# зразків',
        data: [0, 7, 5, 6],
        backgroundColor: colors.backgroundColors,
        borderColor: colors.borderColors,
        borderWidth: 1,
      },
    ]
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


  const navigator = useNavigate();

  function createInstruction(){
    navigator('/instructions/new')
  }

  return (
    <div className="wrapper">
      <div className="sidebar">
          <button onClick={() => createInstruction()}>Створити доручення</button>
          <a className="menu-item" href='/instructions'><i class="bi bi-card-list"></i>Усі</a>
          <a className="menu-item" href='/instructions'><i class="bi bi-archive"></i>Архів</a>
      </div>

      <div className="main-content">
        <h3 className='title'>Статистика доручень</h3>
        <hr></hr>
        <Row style={{marginLeft: 'auto'}}>
          <Col className='diagram mr-3' style={{marginRight: '20px'}}>
            <div className="diagram-title ">Розподіл доручень за типом</div>
            <Pie className='pie' data={typeData} options={options} />
          </Col>
          <Col className='diagram'>
            <div className="diagram-title">Розподіл доручень за статусом</div>
            <Pie className='pie' data={statusData} options={options} />
          </Col>
        </Row>

        <h3 className='title' style={{marginTop: "30px"}}>Статистика користувачів</h3>
        <hr></hr>
        <Row style={{marginLeft: 'auto'}}>
          <Col className='diagram mr-3' style={{marginRight: '20px'}}>
            <div className="diagram-title ">Розподіл ролей користувачів</div>
            <Pie className='pie' data={userRolesData} options={options} />
          </Col>
          <Col className='diagram' style={{marginRight: '20px'}}>
            <div className="diagram-title">Є відповідальними</div>
            <Pie className='pie' data={headData} options={options} />
          </Col>
          <Col className='diagram'>
            <div className="diagram-title">Є виконавцями</div>
            <Pie className='pie' data={performerData} options={options} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default InstructionComponent