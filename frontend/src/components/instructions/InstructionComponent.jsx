import React, {useCallback, useState, useEffect} from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import { ReactFlow, Background, Controls, MiniMap, 
         addEdge, applyNodeChanges, applyEdgeChanges,
         Handle, Position } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import '../../css/Instruction.css'

import SideBarInstructionComponent from '../panels/SideBarInstructionComponent';
import { getInstruction, deleteInstruction, updateInstructionStatus, updateInstruction, updateInstructionComment } from '../../sevices/InstructionService';
import useNodeFlow from './js/useNodeFlow';
import nodeTypes from './js/nodeTypes';
import LoginService from '../../sevices/LoginService';
import { getStatusClassFromDBValue } from './js/statusUtils';


const InstructionComponent = () => {

  const isAdmin = LoginService.isAdmin();
  const isHeadAdmin = LoginService.isHeadAdmin();
  const isTeacher = LoginService.isTeacher();

  const navigator = useNavigate();

  const editInstruction = (code) => {
    navigator(`/instructions/edit/${encodeURIComponent(code)}`);
  };

  const { code } = useParams(); // Отримуємо параметр title з URL
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    const fetchInstruction = async () => {
      // Отримання інструкції за кодом
      const instructionData = await getInstruction(code, localStorage.getItem("token"));
      setInstruction(instructionData);
    };
    fetchInstruction();
  }, [code]);

  const {
    nodes,
    edges,
    nodeLabel,
    edgeLabel,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addStartNode,
    addEndNode,
    onNodeClick,
    handleLabelChange,
    updateNodeLabel,
    handleEdgeLabelChange,
    onEdgeClick,
    updateEdgeLabel,
    handleSaveMap
  } = useNodeFlow(instruction, updateInstruction, navigator);

  const [selectedStatus, setSelectedStatus] = useState(instruction.status || 'CREATED');

  // Функція для зміни статусу
  const handleChangeStatus = async (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    try {
      // Оновлюємо статус в об'єкті instruction і відправляємо на сервер
      const updatedInstruction = { ...instruction, status: newStatus };
      await updateInstructionStatus(updatedInstruction, localStorage.getItem("token")); // Передаємо об'єкт інструкції

      // Після успішного оновлення, отримуємо актуальні дані з сервера
      const updatedData = await getInstruction(code, localStorage.getItem("token"));
      setInstruction(updatedData); // Оновлюємо локальний стан

    } catch (error) {
      console.error('Failed to update instruction status:', error);
    }
  };

  useEffect(() => {
    setSelectedStatus(instruction.status); // Оновлюємо вибраний статус при зміні вхідних даних
  }, [instruction.status]);

  const [comment, setComment] = useState("")
  const [report, setReport] = useState(instruction.report || "")


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const currentTime = getCurrentTime(); // Отримання поточного часу
    
    const newComment = "➣ " + localStorage.getItem("surname") + " " +
    localStorage.getItem("name") + " " +
    localStorage.getItem("patronymic") +
    ` ${currentTime}` + // Додаємо час до коментаря
    "\n" +
    comment + "\n";    
    
    // Оновлюємо стан перед запитом
    const updatedInstruction = {
      ...instruction,
      comment: newComment + "\n" + (instruction.comment || "") 
    };

    setInstruction(updatedInstruction);

    updateInstructionComment(updatedInstruction, navigator, localStorage.getItem("token"));
    setComment("");

  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    // Оновлюємо стан перед запитом
    const updatedInstruction = {
      ...instruction,
      report: report
    };

    setInstruction(updatedInstruction);

    updateInstruction(updatedInstruction, navigator, localStorage.getItem("token"));
    setIsEditing(false); // Вихід з режиму редагування

  };

  const handleCommentChange = (e) => {
    const { id, value } = e.target;
    setComment(value);
  };

  const handleReportChange = (e) => {
    const { id, value } = e.target;
    setReport(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Запобігаємо переносу рядка
      handleSubmitComment(e); // Викликаємо функцію відправки коментаря
    }
  };

  const handleKeyDownReport = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Запобігаємо переносу рядка
      handleSubmitReport(e); // Викликаємо функцію відправки 
      setIsEditing(false); // Вихід з режиму редагування
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  const handleAcquanted = async (e) => {
    e.preventDefault();
    
    // Оновлюємо стан перед запитом
    const updatedInstruction = {
      ...instruction,
      acquainted: true 
    };

    setInstruction(updatedInstruction);

    updateInstruction(updatedInstruction, navigator, localStorage.getItem("token"));
  };

  // Функція для перетворення тексту на клікабельні посилання
const makeLinksClickable = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g; // Пошук URL, які починаються з http або https
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

  const [isEditing, setIsEditing] = useState(false); // Стан редагування

  return (
    <div className="wrapper">
      <SideBarInstructionComponent />

      <div className="main-content">
        <div className="instruction">
          <div className="instruction-control">
            {(isAdmin && instruction.status==="CREATED") || isHeadAdmin ? <a title="Редагувати" onClick={() => {editInstruction(instruction.code)}}><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a>
            :<a title="Немає доступу"><i className="bi bi-pencil-square" style={{ fontSize: '18px', color: 'lightgray'}}></i></a>}
            
            {(isAdmin && instruction.status==="CREATED") || isHeadAdmin ? <a title="Видалити" onClick={() => {deleteInstruction(instruction.code, navigator, localStorage.getItem("token"))}}><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></a>
            :<a title="Немає доступу"><i className="bi bi-trash3" style={{ fontSize: '18px', color: 'lightgray'}}></i></a>}

            {(isAdmin || isHeadAdmin) ? 
              <div style={{marginLeft: 10}}>{instruction.acquainted ? 
                <i className="bi bi-check2-all" style={{color: '#3782e2'}}> Виконавець ознайомився</i> 
                : <i class="bi bi-ban" style={{color: '#ff6969'}}> Виконавець поки не ознайомився</i>}</div>
            : isTeacher ? 
              instruction.acquainted ? 
                <i className="bi bi-check2-all" style={{color: '#3782e2'}}> З дорученням ознайомився</i>  
                : <button className='acquanted-button' onClick={handleAcquanted}>Я ознайомився</button>
              : <></>}

            {isAdmin || isHeadAdmin || isTeacher ? <select className={`form-select status ${getStatusClassFromDBValue(selectedStatus)}`} id="floatingSelect" aria-label="Choose role"
            value={selectedStatus} onChange={handleChangeStatus}>
              <option value="CREATED" className='status orange'>Внесено</option>
              <option value="REGISTERED" className='status yellow'>Зареєстровано</option>
              <option value="IN_PROGRESS" className='status green'>Виконується</option>
              <option value="FINISHED" className='status grey'>Виконано</option>
              <option value="CANCELLED" className='status green'>Скасовано</option>
            </select>
            : <select className={`form-select status ${getStatusClassFromDBValue(selectedStatus)}`} id="floatingSelect" aria-label="Choose role"
            value={selectedStatus}>
              <option value="CREATED" className='status orange'>Внесено</option>
              <option value="REGISTERED" className='status yellow'>Зареєстровано</option>
              <option value="IN_PROGRESS" className='status green'>Виконується</option>
              <option value="FINISHED" className='status grey'>Виконано</option>
              <option value="CANCELLED" className='status green'>Скасовано</option>
            </select>}
          </div>

          {instruction.status === "FINISHED" ? 
              <div style={{marginBottom: 40, textAlign: 'right'}}><em>Виконано {new Date(instruction.doneTime).toLocaleString()}</em></div> : <></>}

          <div className="uni-name">
            <p>НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ ІМ.ІГОРЯ СІКОРСЬКОГО"</p>
            <p>Інститут атомної та теплової енергетики</p>
            <p>Кафедра інженерії програмного забезпечення в енергетиці</p>
          </div>

          <br></br>
          <div className="block">
            <p>Код доручення: {instruction.code}</p>
            <p>Протокол №{instruction.protocol} засідання кафедри</p>
            <p>Дата видачі доручення: {new Date(instruction.startTime).toLocaleDateString()}</p>

          </div>

          <br></br>
          <h2>ДОРУЧЕННЯ</h2>

          <br></br>
          <h4>{instruction.title}</h4>
          <p><span className='bold'>Джерело: </span>{instruction.sourceOfInstruction}</p>
          <p><span className='bold'>Напрям доручення: </span>{instruction.type}</p>

          <p><span className='bold'>Опис: </span> {instruction.shortDescription}</p>

          <br></br>
          <p><span className='bold'>До виконання:</span></p>
          {
            Array.isArray(instruction.users) && instruction.users.length > 0 ? (
                instruction.users.map(user => (
                    <span key={user.userLogin}>
                        {user.userSurname} {user.userName} {user.userPatronymic}<br />
                    </span>
                ))
            ) : (
                <span>Немає назначених користувачів<br /></span> // Можна показати повідомлення, якщо масив порожній
            )
          }

          <br></br>
          <p><span className='bold'>Виконати до: </span>{new Date(instruction.expTime).toLocaleDateString()}</p>
        </div>

        {isAdmin || isTeacher || isHeadAdmin ? <div className="report">
          <div className="report-section" >
            <div className='report-name'>Звіт про виконану роботу</div>
            {isEditing || !instruction.report ? 
              <form onSubmit={handleSubmitReport}>
                <textarea type='text' placeholder='Напишіть звіт...' id='report'
                onChange={handleReportChange} maxLength={2000} value={report} onKeyDown={handleKeyDownReport} ></textarea>
                <button className='send-report-button' type='submit'>Відправити звіт</button>
              </form>
            : 
              <div className="input-report-block">
                <div className="report" style={{ whiteSpace: 'pre-line' }}>
                  {instruction.report}
                </div>
                <button className='send-report-button' onClick={() => {
                  setIsEditing(true);
                  setReport(instruction.report || "");
                }}>Виправити звіт</button>
              </div>}
          </div>
        </div> 
        :<></>}

        <div className="process-map">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Додайте карту процесів</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <button className='button-start' onClick={addStartNode}>Початок</button> {/* Кнопка для додавання ноду */}
                  <button className='button-finish' onClick={addEndNode}>Кінець</button> {/* Кнопка для додавання ноду */}

                  <button className='button-square' onClick={()=>addNode('custom')}><i className="bi bi-square"></i></button> {/* Кнопка для додавання ноду */}
                  <button className='button-diamond' onClick={()=>addNode('diamond')}><i className="bi bi-diamond"></i></button> {/* Кнопка для додавання ромба */}
                  <button className='button-prepare' onClick={()=>addNode('prepare')}><i className="bi bi-hexagon" style={{transform: 'rotate(90deg)' }}></i></button> {/* Кнопка для додавання ромба */}
                  <button className='button-parallel' onClick={()=>addNode('parallel')}><i className="bi bi-box-arrow-in-down-right"></i></button> {/* Кнопка для додавання ромба */}
                  <button className='button-document' onClick={()=>addNode('document')}><i className="bi bi-file-earmark"></i></button> {/* Кнопка для додавання */}
                  <button className='button-sticky' onClick={()=>addNode('sticky')}><i className="bi bi-sticky"></i></button> {/* Кнопка для додавання */}
                  </div>

                <div>
                  <div>
                    <input
                      type="text"
                      value={nodeLabel}
                      onChange={handleLabelChange}
                      placeholder="Введіть нову назву вузла"
                      style={{width: 210}}
                    />
                    <button className='button-update' onClick={updateNodeLabel}>Оновити назву</button>
                  </div>

                  <div style={{marginTop: 5}}>
                    <input
                      type="text"
                      value={edgeLabel}
                      onChange={handleEdgeLabelChange}
                      placeholder="Введіть новий надпис грані"
                      style={{width: 210}}
                    />
                    <button className='button-update' onClick={updateEdgeLabel}>Оновити грань</button>
                  </div>
                </div>
            </div>

            <div className='map'>
              <ReactFlow nodes={nodes}
                          edges={edges}
                          onNodesChange={onNodesChange}
                          onEdgesChange={onEdgesChange}
                          onNodeClick={onNodeClick} // Додаємо обробник кліків по нодам
                          onEdgeClick={onEdgeClick} // Додаємо обробник кліків по гранях
                          nodeTypes={nodeTypes} 
                          onConnect={onConnect} // Додаємо нові грані
                          fitView
                          snapToGrid={true} snapGrid={[15, 15]}
                          >
                <MiniMap />
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            {isAdmin || isTeacher || isHeadAdmin ? <button className='button-save' onClick={handleSaveMap}>Зберегти карту</button>
            : <button className='button-save' style={{background: 'lightgrey', cursor: 'default'}}>Зберегти карту</button>}

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>

        {isAdmin || isTeacher || isHeadAdmin ? <div className="comments">
          <form className="comment-section" onSubmit={handleSubmitComment}>
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <span className='name'>{localStorage.getItem("surname")} {localStorage.getItem("name")} {localStorage.getItem("patronymic")}</span>
              <textarea required type='text' placeholder='Напишіть коментар...' id='comment'
              onChange={handleCommentChange} maxLength={255} value={comment} onKeyDown={handleKeyDown} ></textarea>
            </div>
            <button className='send-button' type='submit'><i className="bi bi-send"></i></button>
          </form>

          {instruction.comment ? <div className="comment-section">
            <div className="input-comment-block">
              <div className="comment" style={{ whiteSpace: 'pre-line' }}>
                {instruction.comment}
              </div>
            </div>
          </div> : <></>}
        </div> 
        :<></>}

        {/* <div className="comments">
          <form className="comment-section">
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <span className='name'>Коваль Олександр Васильович</span>
              <textarea type='text' placeholder='Напишіть коментар...'></textarea>
            </div>
            <button className='send-button' type='submit'><i className="bi bi-send"></i></button>
          </form>

          <div className="comment-section">
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <div className="name-date-section">
                <span className='name'>Тарасенко Тарас Тарасович</span>
                <span className='datetime'>29.09.2024 12:35</span>
              </div>
              <div className="comment">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo soluta debitis reiciendis ea quo autem placeat dignissimos nobis neque rerum tenetur architecto similique nesciunt esse laborum, ut voluptatum eius iste.
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default InstructionComponent