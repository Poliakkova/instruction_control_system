import { useState, useEffect, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const useNodeFlow = (instruction, updateInstruction, navigator) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [nodeId, setNodeId] = useState(3);

    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);

    const [nodeLabel, setNodeLabel] = useState('');
    const [edgeLabel, setEdgeLabel] = useState('');

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

    // Завантаження вузлів та граней з інструкції
    useEffect(() => {
        if (instruction.mapProcess) {
        const processMapData = JSON.parse(instruction.mapProcess);
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
        const newNode = {
        id: `node-${new Date().getTime()}`,
        position: { x: 200, y: 0  },
        data: { label: `Новий вузол ${nodeId}` },
        type: type,
        };

        setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
        setNodeId((id) => id + 1); // Збільшуємо лічильник ID
    };

    // Функція для скругленого нового початку
    const addStartNode = () => {
        const newNode = {
        id: `node-${new Date().getTime()}`,
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
        id: `node-${new Date().getTime()}`,
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
    };

    // Функція для збереження нового тексту ноди
    const handleLabelChange = (event) => {
        setNodeLabel(event.target.value);
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

    const handleSaveMap = () => {
        const flowData = {
            nodes: nodes,
            edges: edges
        };
    
        console.log("MAP " + JSON.stringify(flowData));
    
        // Оновлюємо поле mapProcess в інструкції
        const updatedInstruction = {
          ...instruction,  // Зберігаємо інші поля інструкції
          mapProcess: JSON.stringify(flowData)  // Додаємо карту процесу у поле mapProcess
        };
    
        // Викликаємо метод для оновлення інструкції
        updateInstruction(updatedInstruction, navigator, localStorage.getItem("token"));
    };

    return {
        nodes,
        edges,
        selectedNode,
        selectedEdge,
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
    };
};

export default useNodeFlow;