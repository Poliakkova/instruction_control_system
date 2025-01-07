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
import { flushSync } from 'react-dom';

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

  // Створюємо стан для пошукового запиту
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false); // Стан для чекбоксу "Усі"

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);  

  // Фільтрація даних на основі пошукового запиту
  const filteredData = users.filter((item) => {
    const searchWords = searchTerm.toLowerCase().trim();
    const itemText = item.userSurname + " " + item.userName + " " + item.userPatronymic;
    return itemText.toLowerCase().includes(searchWords)
  });

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
        const isAlreadySelected = prevSelectedUsers.some(selected => selected.userLogin === user.userLogin);

        if (isAlreadySelected) {
          // Видаляємо користувача, якщо він уже є
          return prevSelectedUsers.filter(selected => selected.userLogin !== user.userLogin);
        } else {
          // Додаємо користувача з прізвищем та ім'ям
          return [...prevSelectedUsers, { 
            userLogin: user.userLogin,
            userSurname: user.userSurname,
            userName: user.userName,
            userPatronymic: user.userPatronymic
          }];
        }
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Якщо обрано "Усі", очищаємо вибір
      setSelectedUsers([]);
    } else {
      // Якщо не обрано "Усі", вибираємо всіх користувачів
      setSelectedUsers(filteredData);
    }
    setIsAllSelected(!isAllSelected); // Змінюємо стан чекбоксу "Усі"
  };

  // Генерація звіту
  const handleGenerateReport = () => {
    // Фільтруємо інструкції за періодом та вибраними викладачами
    const filteredInstructions = instructions.filter((instruction) => {
      console.log("startTime: " + instruction.startTime)
      const instructionDate = instruction.startTime ? new Date(instruction.startTime).toISOString().split('T')[0] : null;
      console.log("instructionDate " + instructionDate);

      const isWithinDateRange = (!startDate || instructionDate >= startDate) &&
                                (!endDate || instructionDate <= endDate);
      console.log(isWithinDateRange);

      console.log("selectedUsers: " + selectedUsers);
      selectedUsers.some(user => 
        console.log(user.userLogin)
      );

      const isUserSelected = selectedUsers.some(user => 
        instruction.users?.some(head => head.userLogin === user.userLogin)
      );
      console.log(isUserSelected);
      return isWithinDateRange && isUserSelected;
    });
    // Підрахунок статистики
    const stats = calculateStatistics(filteredInstructions, selectedUsers);
    console.log("stats" + stats);
    setReportData(stats);
  };

  const calculateStatistics = (instructions, users) => {
    const userStats = users.map((user) => {
      console.log("user: " + user.userLogin + user.userSurname);
      const userInstructions = instructions.filter((instruction) =>
        instruction.users?.some(head => head.userLogin === user.userLogin)
      );
  
      const statusCounts = {
        CREATED: 0, IN_PROGRESS: 0, REGISTERED: 0, FINISHED: 0, CANCELLED: 0
      };
  
      const typeCounts = {};
      let completedOnTime = 0, completedOverdue = 0;
      let overdue = 0;
      let inProgress = 0;
      let allDaysEarly = 0, allDaysLate = 0;
      let daysEarly = 0, daysLate = 0;

  
      userInstructions.forEach((instruction) => {
        statusCounts[instruction.status] = (statusCounts[instruction.status] || 0) + 1;
        typeCounts[instruction.type] = (typeCounts[instruction.type] || 0) + 1;
        console.log(instruction.status + " " + statusCounts[instruction.status]);
        console.log(instruction.type + " " + typeCounts[instruction.type]);
  
        if (instruction.status === 'FINISHED') {
          console.log("doneTime:", instruction.doneTime);
          console.log("expTime:", instruction.expTime);

          const expDate = new Date(instruction.expTime);
          const doneDate = new Date(instruction.doneTime);
          console.log("exp: " + expDate + " done: " + doneDate);
          const difference = (doneDate - expDate) / (1000 * 60 * 60 * 24);
          console.log("diff: "+ difference);
  
          if (difference <= 0) {
            completedOnTime++;
            allDaysEarly += Math.abs(difference);
            console.log("completedOnTime: " + completedOnTime);
          } else {
            completedOverdue++;
            allDaysLate += difference;
            console.log("overdue: " + completedOverdue);
          }
        } else if (instruction.status === 'IN_PROGRESS' || instruction.status === 'CREATED' || instruction.status === 'REGISTERED') {
          inProgress++;
          const expDate = new Date(instruction.expTime);
          const today = new Date();
          const difference = (today - expDate) / (1000 * 60 * 60 * 24); // Різниця в днях


          if (difference > 0) {
            overdue++; // Якщо дата дедлайну більше, додаємо до прострочених
        }
        }
      });

      daysEarly = allDaysEarly/completedOnTime;
      daysLate = allDaysLate/completedOverdue;
  
      return {
        user: `${user.userSurname} ${user.userName} ${user.userPatronymic}`,
        total: userInstructions.length,
        statusCounts,
        typeCounts,
        completedOnTime,
        completedOverdue,
        avgDaysEarly: completedOnTime ? (daysEarly).toFixed(1) : 0,
        avgDaysLate: completedOverdue ? (daysLate).toFixed(1) : 0,
        inProgress,
        overdue
      };
    });
  
    return userStats;
  };
  

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
      'REGISTERED': 0,
      'IN_PROGRESS': 0,
      'FINISHED': 0,
      'CANCELLED': 0,
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
      labels: ['Внесено', 'Зареєстровано', 'В роботі', 'Виконано', 'Скасовано'],
      datasets: [
        {
          label: '# зразків',
          data: [
            statusCounts['CREATED'],
            statusCounts['REGISTERED'],
            statusCounts['IN_PROGRESS'],
            statusCounts['FINISHED'],
            statusCounts['CANCELLED'],
          ],
          backgroundColor: [
            'rgba(255, 131, 74, 0.2)',
            'rgba(255, 219, 74, 0.2)',
            'rgba(76, 175, 80, 0.2)',
            'rgba(173, 181, 189, 0.2)',
            'rgba(255, 131, 74, 0.2)'
          ],
          borderColor: [
            'rgba(255, 131, 74, 1)',
            'rgba(255, 219, 74, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(173, 181, 189, 1)',
            'rgba(255, 131, 74, 1)'
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
        <h3 className='title'>Сформувати звіт по роботі викладачів</h3>
        <hr></hr>
        <Row className='analyze-block'>
          <div className="custom-form-floating" style={{
            border: '1px solid #dee2e6',
            borderRadius: 6,
            padding: '16px 12px'}}>
            <div style={{marginBottom: 10}}>Оберіть виконавця</div>
            <div>
                <input type="text"
                placeholder="Пошук за іменем..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан при введенні
                style={{border: '1px solid #dee2e6',
                    borderRadius: 6,
                    padding: '5px 10px',
                    width: 300,
                    marginBottom: 10,}}
                />
                <div style={{maxHeight: 100, overflowY: 'auto'}}>
                  <div className="form-check" key='all-users'>
                    <input className="form-check-input" type="checkbox" id='all-users'
                      checked={isAllSelected} // Встановлюємо чи вибрано "Усі"
                      onChange={handleSelectAll} // Обробка зміни для чекбоксу "Усі"
                    />
                    <label className="form-check-label" htmlFor='all-users'>Усі</label>
                  </div>
                {
                    filteredData.map((user) => 
                        <div className="form-check" key={user.userLogin}>
                            <input className="form-check-input" type="checkbox" id={user.userLogin}
                            checked={selectedUsers.some(selected => selected.userLogin === user.userLogin)}// Перевірка чи обраний користувач
                            onChange={() => handleCheckboxChange(user)} // Обробка зміни
                            />
                            <label className="form-check-label" htmlFor={user.userLogin}>{user.userSurname} {user.userName} {user.userPatronymic}</label>
                        </div>
                    )
                }
                </div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', margin: '20px 0', padding: 0}}>
            <span style={{ color: '#3782e2', marginRight: 5}}>Дата створення доручення</span>
            <label>
                з: <input className="filter-input" type="date" 
                value={startDate} name="startDate" id="startDate"
                onChange={(e) => setStartDate(e.target.value)} 
                onClick={() => document.getElementById('startDate').showPicker?.()}/>
            </label>
            <label>
                до: <input className="filter-input" type="date" 
                value={endDate} name="endDate" id="endDate"
                onChange={(e) => setEndDate(e.target.value)} 
                onClick={() => document.getElementById('endDate').showPicker?.()}/>
            </label>
          </div>

          <button onClick={handleGenerateReport} className="btn btn-primary">
            Згенерувати звіт
          </button>

          {reportData.length > 0 && (
            <div style={{marginTop: 20}}>
              <h4>Звіт по роботі викладачів</h4>
              <table className="table table-bordered table-statistics">
                <thead>
                  <tr>
                    <th>Виконавець</th>
                    <th>Усього доручень</th>
                    <th>З них виконано</th>

                    <th>Виконані вчасно</th>
                    <th>Виконані з запізненням</th>

                    <th>В середньому випередили сроки (дні)</th>
                    <th>В середньому запізнення (дні)</th>

                    <th>Потрібно виконати</th>
                    <th>З них прострочені</th>

                  </tr>
                </thead>
                <tbody>
                <tr>
                      <td>Усі</td>
                      <td>{reportData.reduce((sum, item) => sum + item.total, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.FINISHED, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.completedOnTime, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.completedOverdue, 0)}</td>
                      <td>{(reportData.reduce((sum, item) => sum + Number(item.avgDaysEarly || 0), 0) / reportData.length).toFixed(1)}</td>
                      <td>{(reportData.reduce((sum, item) => sum + Number(item.avgDaysLate || 0), 0) / reportData.length).toFixed(1)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.inProgress, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.overdue, 0)}</td>

                    </tr>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.user}</td>
                      <td>{row.total}</td>
                      <td>{row.statusCounts.FINISHED || 0}</td>

                      <td>{row.completedOnTime}</td>
                      <td>{row.completedOverdue}</td>
                      <td>{row.avgDaysEarly}</td>
                      <td>{row.avgDaysLate}</td>
                      <td>{row.inProgress}</td>
                      <td>{row.overdue}</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 style={{marginTop: 40}}>Розподіл доручень за напрямком і статусом</h4>
              <table className="table table-bordered table-statistics">
                <thead>
                  <tr>
                    <th>Виконавець</th>
                    <th>Усього доручень</th>

                    <th>Внесено</th>
                    <th>Зареєстровано</th>
                    <th>Виконується</th>
                    <th>Виконано</th>
                    <th>Скасовано</th>

                    <th>Науково-методичні</th>
                    <th>Навчально-виховні</th>
                    <th>Проф орієнтаційні</th>
                    <th>Навчально-організаційні</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                      <td>Усі</td>
                      <td>{reportData.reduce((sum, item) => sum + item.total, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.CREATED, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.REGISTERED, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.IN_PROGRESS, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.FINISHED, 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + item.statusCounts.CANCELLED, 0)}</td>

                      <td>{reportData.reduce((sum, item) => sum + (item.typeCounts['Науково-методична робота'] || 0), 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + (item.typeCounts['Навчально-виховна робота'] || 0), 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + (item.typeCounts['Профорієнтаційна робота'] || 0), 0)}</td>
                      <td>{reportData.reduce((sum, item) => sum + (item.typeCounts['Навчально-організаційна робота'] || 0), 0)}</td>

                    </tr>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.user}</td>
                      <td>{row.total}</td>

                      <td>{row.statusCounts.CREATED || 0}</td>
                      <td>{row.statusCounts.REGISTERED || 0}</td>
                      <td>{row.statusCounts.IN_PROGRESS || 0}</td>
                      <td>{row.statusCounts.FINISHED || 0}</td>
                      <td>{row.statusCounts.CANCELLED || 0}</td>

                      <td>{row.typeCounts['Науково-методична робота'] || 0}</td>
                      <td>{row.typeCounts['Навчально-виховна робота'] || 0}</td>
                      <td>{row.typeCounts['Профорієнтаційна робота'] || 0}</td>
                      <td>{row.typeCounts['Навчально-організаційна робота'] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </Row>

        <h3 className='title' style={{marginTop: "30px"}}>Статистика доручень</h3>
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
        </Row>
      </div>
    </div>
  )
}

export default InstructionComponent