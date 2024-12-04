import axios from "axios";

//Функція отримання ключа
export const getKey = (token) => {
    return axios.get(`http://localhost:8090/instructions/key`, 
        {
            headers: {Authorization: `Bearer ${token}`}
        });
}

//Функція отримання конкретного доручення
export const getInstruction = async (code, token) => {
    try {
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        const response = await axios.get(`http://localhost:8090/instructions/get/${encodeURIComponent(code)}`, {
            headers: {
                key: uuidKey, // передаємо ключ у заголовку
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching instruction:', error);
        throw error;
    }
};

//Функція отримання усіх доручень
export const listInstructions = async (token) => {
    try {
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        // Додавання ключа до HTTP-запиту
        const response = await axios.get(`http://localhost:8090/instructions/get/all`, {
            headers: {
                key: uuidKey,
                Authorization: `Bearer ${token}`
            },
        });
        return response;

    }catch (error) {
        console.error('Error fetching instructions:', error);
        throw error;
    }
}

//Функція отримання усіх архівних доручень
export const archivedInstructions = async (token) => {
    try {
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Додавання ключа до HTTP-запиту
        const response = await axios.get(`http://localhost:8090/instructions/archived`, {
            headers: {
                'key': uuidKey,
                Authorization: `Bearer ${token}`
            }
        });

        return response;

    }catch (error) {
        console.error(error);
        throw error;
    }
}

// Функція для видалення доручення
export const deleteInstruction = async (instructionTitle, navigate, token) => {
    const isConfirmed = window.confirm(`Ви дійсно хочете видалити інструкцію?`);
  
    if (isConfirmed) {
      try {
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Виконуємо запит на видалення
        await axios.post(`http://localhost:8090/instructions/${encodeURIComponent(instructionTitle)}`, null, {
          headers: {
            key: uuidKey, // передаємо ключ в заголовку
            Authorization: `Bearer ${token}`
          },
        });
        
        alert('Інструкція успішно видалена');
        navigate('/instructions'); // Перенаправляємо на головну сторінку
      } catch (error) {
        console.error('Помилка під час видалення інструкції:', error);
        alert('Сталася помилка під час видалення інструкції');
      }
    }
}

//Функція оновлення статусу доручення
export const updateInstructionStatus = async (instruction, token) => {
    try {
        console.log("----UPDATE TOKEN: " + token);
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);
        console.log("updateINSTR " + instruction);

        const response = await axios.put('http://localhost:8090/instructions/status/update', instruction, {
            headers: {
                key: uuidKey, // Передаємо ваш UUID ключ
                Authorization: `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            alert('Статус інструкції успішно оновлено');
        }
    } catch (error) {
        console.error('Помилка при оновленні статусу інструкції:', error);
        alert('Не вдалося оновити статус інструкції');
    }
};

//Функція оновлення доручення
export const updateInstructionComment = async (instruction, navigate, token) => {
    console.log("ENTER COMMENT "+JSON.stringify(instruction));

    try {
        // Отримання ключа
        console.log("TOKEN" + token)
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        console.log("COMMENT uuidKey " + uuidKey);

        // Додавання ключа до HTTP-запиту
        const response = await axios.put("http://localhost:8090/instructions/update", instruction, {
            headers: {
                key: uuidKey,
                Authorization: `Bearer ${token}`
            },
        });

        console.log(response.data)

        if (response.status === 200) {
            navigate(`/instructions/${encodeURIComponent(instruction.code)}`);
        } 

    }catch (error) {
        console.error('Помилка при оновленні інструкції:', error);
        alert('Помилка додавання коментаря');
    }
};


//Функція оновлення доручення
export const updateInstruction = async (instruction, navigate, token) => {
    console.log(JSON.stringify(instruction));

    // Перевірка наявності хоча б одного користувача
    if (!instruction.users || instruction.users.length === 0) {
        alert("Необхідно призначити принаймні одного відповідального");
        return;
    }
    
    try {
        console.log(JSON.stringify(instruction));

        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Додавання ключа до HTTP-запиту
        const response = await axios.put("http://localhost:8090/instructions/update", instruction, {
            headers: {
                key: uuidKey,
                Authorization: `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            alert('Доручення успішно оновлено');
            navigate(`/instructions/${encodeURIComponent(instruction.code)}`);
        }

    }catch (error) {
        console.error('Помилка при оновленні інструкції:', error);
        alert('Помилка при оновленні доручення. Перевірте дані');
    }
};

//Функція створення доручення
export const createInstruction = async (e, instruction, navigate, token) => {
    e.preventDefault();
    console.log(JSON.stringify(instruction));

    console.log("Instruction Code:", instruction.code);
    
    if (!instruction.code) {
        alert("Відсутній унікальний код доручення!");
        return;
    }

    // Перевірка наявності хоча б одного користувача
    if (!instruction.users || instruction.users.length === 0) {
        alert("Необхідно призначити принаймні одного відповідального");
        return;
    }

    try {
        // Отримання ключа
        const keyResponse = await getKey(token);
        const uuidKey = keyResponse.data;

        const response = await axios.post('http://localhost:8090/instructions/new/processing', instruction, {
            headers: {
                key: uuidKey, // передаємо ключ у заголовку
                Authorization: `Bearer ${token}`
            },
        });

        alert('Доручення створено успішно!');
        navigate(`/instructions/${encodeURIComponent(instruction.code)}`)
        return response.data; // Повертаємо створену інструкцію (InstructionsDto)

    } catch (error) {
        console.error('Error creating instruction:', error);
        throw error;
    }
};