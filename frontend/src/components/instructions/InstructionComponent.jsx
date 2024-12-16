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
      console.log("Response data: ", instructionData); 
      setInstruction(instructionData);
    };
    fetchInstruction();
  }, [code]);

    // Цей useEffect буде викликаний кожного разу, коли зміниться instruction
  useEffect(() => {
    console.log("INSTRUCTION UPDATED: ", instruction);
  }, [instruction]);

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
    } catch (error) {
      console.error('Failed to update instruction status:', error);
    }
  };

  useEffect(() => {
    setSelectedStatus(instruction.status); // Оновлюємо вибраний статус при зміні вхідних даних
  }, [instruction.status]);

  const [comment, setComment] = useState("")

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

  const handleCommentChange = (e) => {
    const { id, value } = e.target;
    console.log("ID, VALUE " + id + " " + value);
    setComment(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Запобігаємо переносу рядка
      handleSubmitComment(e); // Викликаємо функцію відправки коментаря
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
  
  

  return (
    <div className="wrapper">
      <SideBarInstructionComponent />

      <div className="main-content">
        <div className="instruction">
          <div className="instruction-control">
            {isAdmin ? <a title="Редагувати" onClick={() => {editInstruction(instruction.code)}}><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a>
            :<a title="Немає доступу"><i className="bi bi-pencil-square" style={{ fontSize: '18px', color: 'lightgray'}}></i></a>}
            
            {isAdmin ? <a title="Видалити" onClick={() => {deleteInstruction(instruction.code, navigator, localStorage.getItem("token"))}}><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></a>
            :<a title="Немає доступу"><i className="bi bi-trash3" style={{ fontSize: '18px', color: 'lightgray'}}></i></a>}

            {isAdmin || isTeacher ? <select className={`form-select status ${getStatusClassFromDBValue(selectedStatus)}`} id="floatingSelect" aria-label="Choose role"
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

          <div className="uni-name">
            <p>НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ ІМ.ІГОРЯ СІКОРСЬКОГО"</p>
            <p>Інститут атомної та теплової енергетики</p>
            <p>Кафедра інженерії програмного забезпечення в енергетиці</p>
          </div>

          <br></br>
          <div className="block">
            <p>Код доручення: {instruction.code}</p>
            <p>Протокол №{instruction.protocol} засідання кафедри</p>
            <p>Дата видачі доручення: {new Date(instruction.makingTime).toLocaleDateString()}</p>
          </div>

          <br></br>
          <h2>ДОРУЧЕННЯ</h2>

          <br></br>
          <h4>{instruction.title}</h4>
          <p><span className='bold'>Джерело: </span>{instruction.sourceOfInstruction}</p>
          <p><span className='bold'>Напрям доручення: </span>{instruction.type}</p>

          <p>Короткий опис: {instruction.shortDescription}</p>
          <p>Повний опис: {instruction.fullDescription}</p>
          <p>{instruction.text}</p>

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
          <p><span className='bold'>Розпочати від: </span>{new Date(instruction.startTime).toLocaleDateString()}</p>
          <p><span className='bold'>Виконати до: </span>{new Date(instruction.expTime).toLocaleDateString()}</p>
        </div>

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
            {isAdmin || isTeacher ? <button className='button-save' onClick={handleSaveMap}>Зберегти карту</button>
            : <button className='button-save' style={{background: 'lightgrey', cursor: 'default'}}>Зберегти карту</button>}

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>

        {isAdmin || isTeacher ? <div className="comments">
          <form className="comment-section" onSubmit={handleSubmitComment}>
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <span className='name'>{localStorage.getItem("surname")} {localStorage.getItem("name")} {localStorage.getItem("patronymic")}</span>
              <textarea required type='text' placeholder='Напишіть коментар...' id='comment'
              onChange={handleCommentChange} maxLength={255} value={comment} onKeyDown={handleKeyDown} ></textarea>
            </div>
            <button className='send-button' type='submit'><i className="bi bi-send"></i></button>
          </form>

          <div className="comment-section">
            <div className="input-comment-block">
              <div className="comment" style={{ whiteSpace: 'pre-line' }}>
                {instruction.comment}
              </div>
            </div>
          </div>
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