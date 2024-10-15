import React, {useCallback, useState, useEffect} from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import { ReactFlow, Background, Controls, MiniMap, 
         addEdge, applyNodeChanges, applyEdgeChanges,
         Handle, Position, ReactFlowProvider,  useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../css/Instruction.css'
import axios from 'axios';
import { getKey, deleteInstruction, updateInstructionStatus } from '../sevices/InstructionService';


const InstructionComponent = () => {

  const navigator = useNavigate();

  function createInstruction(){
    navigator('/instructions/new')
  }

  const editInstruction = (title) => {
    navigator(`/instructions/edit/${encodeURIComponent(title)}`);
  };

  const { title } = useParams(); // Отримуємо параметр title з URL
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
      const fetchInstruction = async () => {
          try {
            // Отримання ключа
            const keyResponse = await getKey();
            const uuidKey = keyResponse.data;
            console.log("uuidKey " + uuidKey);

            const response = await axios.get(`http://localhost:8090/instructions/get/${encodeURIComponent(title)}`, {
                headers: {
                    'key': uuidKey, // передайте ваш ключ у заголовку
                },
            });
            setInstruction(response.data);
          } catch (error) {
              console.error('Error fetching instruction:', error);
          }
      };

      fetchInstruction();
    }, [title]);

    // Цей useEffect буде викликаний кожного разу, коли зміниться instruction
  useEffect(() => {
    console.log("INSTRUCTION UPDATED: ", instruction);
  }, [instruction]);

  const DiamondNode = ({ data, isSelected }) => (
    <div style={{ /* Обводка */
      display: 'inline-flex',
      backgroundColor: 'black', 
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', /* Створюємо ромб */
      alignItems: 'center',
      justifyContent: 'center',
      border: isSelected ? '5px solid blue' : '1px solid black',
    }}>

      <div style={{ /* Внутрішній блок */
          maxWidth: '150px',
          padding: '25px',
          height: 'auto',
          display: 'flex',
          backgroundColor: '#fffdbd', 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', /* Створюємо ромб */
          alignContent: 'center',
      }}>
        <Handle type="target" position={Position.Top} style={{ top: '4px', background: 'green'}}/>
        <div style={{ fontSize: '12px', textAlign: 'center'  }}>{data.label}</div>
        <Handle id="source-left"  type="source" position={Position.Left} style={{ left: '5px', background: '#db4f4f'}}/>
        <Handle id="source-right"  type="source" position={Position.Right} style={{ right: '5px', background: '#db4f4f'}}/>

      </div>
    </div>
  );

  const CustomNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', borderRadius: 5, fontSize: 12, width: 150, background: '#d7fcfc' }}>
        {/* Контролери на всіх сторонах */}
        <Handle id="target-top" type="target" position={Position.Top} style={{ background: 'green' }} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left} style={{ background: 'green' }} /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right} style={{ background: '#db4f4f' }} /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom} style={{ background: '#db4f4f' }} /> {/* Вихід знизу */}
      </div>
    );
  };

  const CustomInputNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#bdffcd', borderRadius: '30px' }}>
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right}  /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom}  /> {/* Вихід знизу */}
      </div>
    );
  };

  const CustomOutputNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#ffbdbd', borderRadius: '30px' }}>
        <Handle id="target-top" type="target" position={Position.Top} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left}  /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
      </div>
    );
  };

  const nodeTypes = {
    diamond: DiamondNode, // Реєструєму новий тип
    custom: CustomNode,
    customInput: CustomInputNode,
    customOutput: CustomOutputNode
  };

  const initialNodes = [ //початкові ноди
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Початок' }, type: 'customInput' },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'Кінець' }, type: 'customOutput' }
  ];
  
  // const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'default', label: 'Виконати', animated: true,
  //   markerEnd: {
  //     type: 'arrowclosed', // Тип стрілки
  //   },
  // }]; //початкова грань

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(3); // Лічильник для унікальних ID нових нодів

  const [selectedNode, setSelectedNode] = useState(null); // Для відстеження вибраного нода
  const [selectedEdge, setSelectedEdge] = useState(null); // Для відстеження вибраної грані

  const [nodeLabel, setNodeLabel] = useState(''); // Для збереження нового тексту ноди
  const [nodeColor, setNodeColor] = useState(''); // Для збереження нового кольору
  const [edgeLabel, setEdgeLabel] = useState(''); // Для збереження нового тексту грані

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // Після завантаження інструкції оновлюємо вузли та грані
  useEffect(() => {
    if (instruction.mapProcess) {
        const processMapData = JSON.parse(instruction.mapProcess); // Парсимо JSON-дані
        setNodes(processMapData.nodes);
        setEdges(processMapData.edges);
    }
}, [instruction]);
  
  // Обробка створення нової грані
  const onConnect = (params) => {
    const newEdge = {
      ...params,
      id: `edge-${new Date().getTime()}`, // Унікальний ідентифікатор для нової грані
      label: "↓", // Початковий надпис для грані
      animated: true,
      markerEnd: {
        type: 'arrowclosed', // Тип стрілки
      },
    };
    
    setEdges((eds) => addEdge(newEdge, eds)); // Додаємо нову грань
  };

  // Функція для додавання нового ноду
  const addNode = (type) => {
    // var color = "transparent";
    // if (type == 'custom') {color = '#d7fcfc';}

    const newNode = {
      id: `${nodeId}`,
      position: { x: 200, y: 0  },
      data: { label: `Новий вузол ${nodeId}` },
      type: type,
      // style: {backgroundColor: color}
    };

    setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
    setNodeId((id) => id + 1); // Збільшуємо лічильник ID
  };

  // Функція для скругленого нового початку
  const addStartNode = () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: 200, y: 0 },
      data: { label: `Початок` },
      type: 'customInput',
    };

    setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
    setNodeId((id) => id + 1); // Збільшуємо лічильник ID
  };

    // Функція для скругленого нового кінця
    const addEndNode = () => {
      const newNode = {
        id: `${nodeId}`,
        position: { x: 200, y: 0 },
        data: { label: `Кінець` },
        type: 'customOutput',
      };
  
      setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
      setNodeId((id) => id + 1); // Збільшуємо лічильник ID
    };

  // Функція для вибору нода при натисканні
  const onNodeClick = (event, node) => {
    setSelectedNode(node.id); // Вибираємо нод
    setNodeLabel(node.data.label); // Встановлюємо поточний текст у текстове поле
    setNodeColor(node.data.color);
  };

  // Функція для збереження нового тексту ноди
  const handleLabelChange = (event) => {
    setNodeLabel(event.target.value);
  };

  // Функція для збереження нового кольору
  const handleColorChange = (event) => {
    setNodeColor(event.target.value);
    console.log("handle change color " + event.target.value)
  };

  // Функція для підтвердження зміни тексту ноди
  const updateNodeLabel = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode ? { ...node, data: { ...node.data, label: nodeLabel } } : node
      )
    );
    setSelectedNode(null); // Знімаємо вибір після редагування
  };

  // Функція для підтвердження зміни кольору
  const updateNodeColor = () => {
    console.log("NODECOLOR " + nodeColor)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode ? { ...node, style: { ...node.style, backgroundColor: nodeColor }, } : node
      )
    );
    setSelectedNode(null); // Знімаємо вибір після редагування
  };

  // Функція для збереження нового тексту грані
  const handleEdgeLabelChange = (event) => {
    setEdgeLabel(event.target.value);
  };

  // Обробка кліку по грані
  const onEdgeClick = (event, edge) => {
    console.log("ON CLICK " + edge.id)
    console.log("LABEL " + edge.label)

    setSelectedEdge(edge.id); 
    setEdgeLabel(edge.label); // Отримуємо існуючий текст надпису
  };

  // Функція для оновлення тексту надпису грані
  const updateEdgeLabel = () => {
    console.log("edge label " + edgeLabel);
    console.log("selectedEdge " + selectedEdge);

    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge
          ? { ...edge, label: edgeLabel } // Оновлюємо надпис для вибраної грані
          : edge
      )
    );
    setSelectedEdge(null); // Очищуємо вибрану грань
  };

  //Збереження стану
  const saveGraph = () => {
    const flowData = { nodes, edges };
    localStorage.setItem('flowData', JSON.stringify(flowData)); // Зберігаємо стан у локальне сховище
  };

  const handleSaveMap = () => {
    const flowData = {
        nodes: nodes,
        edges: edges
    };

    console.log("MAP " + JSON.stringify(flowData));

    // axios.post(`/api/instructions/${instructionId}/save-flow`, flowData)
    //   .then(response => {
    //     console.log('Diagram saved successfully!');
    //   })
    //   .catch(error => {
    //     console.error('Error saving diagram:', error);
    //   });
  };

  const [selectedStatus, setSelectedStatus] = useState(instruction.status || 'CREATED');

  // Функція для зміни статусу
  const handleChangeStatus = async (event) => {
    setSelectedStatus(event.target.value);
    try {
      await updateInstructionStatus(instruction.title, event.target.value); // Виклик функції сервісу
    } catch (error) {
        console.error('Failed to update instruction status:', error);
    }
  };

  // Функція для визначення класу на основі статусу
  const getStatusClass = (status) => {
    switch (status) {
      case 'CREATED':
        return 'status orange';
      case 'IN_PROGRESS':
        return 'status yellow';
      case 'CONFIRMATION':
        return 'status green';
      case 'FINISHED':
        return 'status grey';
      default:
        return 'status grey';
    }
  };

  useEffect(() => {
    setSelectedStatus(instruction.status); // Оновлюємо вибраний статус при зміні вхідних даних
  }, [instruction.status]);

  return (
    <div className="wrapper">
      <div className="sidebar">
          <button onClick={() => createInstruction()}>Створити доручення</button>
          <a className="menu-item" href='/instructions'><i class="bi bi-card-list"></i>Усі</a>
          <a className="menu-item" href='/instructions/archived'><i class="bi bi-archive"></i>Архів</a>
      </div>

      <div className="main-content">
        <div className="instruction">
          <div className="instruction-control">
            <a title="Редагувати" onClick={() => {editInstruction(instruction.title)}}><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a>
            <a title="Видалити" onClick={() => {deleteInstruction(instruction.title, navigator)}}><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></a>

            <select class={`form-select status ${getStatusClass(selectedStatus)}`} id="floatingSelect" aria-label="Choose role"
            value={selectedStatus} onChange={handleChangeStatus}>
              <option value="CREATED" className='status orange'>Назначено</option>
              <option value="IN_PROGRESS" className='status yellow'>В роботі</option>
              <option value="CONFIRMATION" className='status green'>Очікує затвердження</option>
              <option value="FINISHED" className='status grey'>Затверджено</option>
            </select>
          </div>

          <div className="uni-name">
            <p>НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ ІМ.ІГОРЯ СІКОРСЬКОГО"</p>
            <p>Інститут атомної та теплової енергетики</p>
            <p>Кафедра інженерії програмного забезпечення в енергетиці</p>
          </div>

          <br></br>
          <div className="block">
            <p>Протокол №{instruction.protocol} засідання кафедри від {new Date(instruction.makingTime).toLocaleDateString()}</p>
          </div>

          <br></br>
          <h2>ДОРУЧЕННЯ</h2>

          <br></br>
          <h4>{instruction.title}</h4>
          <p><span className='bold'>Джерело: </span>{instruction.sourceOfInstruction}</p>
          <p><span className='bold'>Тип: </span>{instruction.type}</p>

          <br></br>
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
                <span>No users selected</span> // Можна показати повідомлення, якщо масив порожній
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

                  <button className='button-square' onClick={()=>addNode('custom')}><i class="bi bi-square"></i></button> {/* Кнопка для додавання ноду */}
                  <button className='button-diamond' onClick={()=>addNode('diamond')}><i class="bi bi-diamond"></i></button> {/* Кнопка для додавання ромба */}
                </div>

                <div>
                  {/* Інпут для вибору кольору */}
                  {/* <div>
                    <label htmlFor="colorPicker">Оберіть колір вузла: </label>
                    <input
                      id="colorPicker"
                      type="color"
                      value={nodeColor}
                      onChange={handleColorChange}
                    />
                    <button onClick={updateNodeColor}>Оновити колір</button>
                  </div> */}

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
            <button className='button-save' onClick={handleSaveMap}>Зберегти карту</button>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>

        <div className="comments">
          <form className="comment-section">
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <span className='name'>Коваль Олександр Васильович</span>
              <textarea type='text' placeholder='Напишіть коментар...'></textarea>
            </div>
            <button className='send-button' type='submit'><i class="bi bi-send"></i></button>
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
        </div>
      </div>
    </div>
  )
}

export default InstructionComponent