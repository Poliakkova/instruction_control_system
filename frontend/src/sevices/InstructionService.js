import axios from "axios";

const REST_API_GET_ALL_URL = "http://localhost:8090/instructions/get/all";

const REST_API_GET_ARCHIVED_URL = "http://localhost:8090/instructions/archived";

const REST_API_ADD_URL = "http://localhost:8090/instructions/new/processing";

const REST_API_KEY_URL = "http://localhost:8090/instructions/key";

export const getKey = () => {
    return axios.get(REST_API_KEY_URL);
}

export const listInstructions = async () => {
    try {
        // Отримання ключа
        const keyResponse = await getKey();
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Додавання ключа до HTTP-запиту
        const response = await axios.get(REST_API_GET_ALL_URL, {
            headers: {
                'key': uuidKey
            }
        });

        return response;

    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const archivedInstructions = async () => {
    try {
        // Отримання ключа
        const keyResponse = await getKey();
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Додавання ключа до HTTP-запиту
        const response = await axios.get(REST_API_GET_ARCHIVED_URL, {
            headers: {
                'key': uuidKey
            }
        });

        return response;

    }catch (error) {
        console.error(error);
        throw error;
    }
}

// Функція для видалення інструкції
export const deleteInstruction = async (instructionTitle, navigate) => {
    const isConfirmed = window.confirm(`Ви дійсно хочете видалити інструкцію: ${instructionTitle}?`);
  
    if (isConfirmed) {
      try {
        // Отримання ключа
        const keyResponse = await getKey();
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        // Виконуємо запит на видалення
        await axios.post(`http://localhost:8090/instructions/${encodeURIComponent(instructionTitle)}`, null, {
          headers: {
            key: uuidKey, // передаємо ключ в заголовку
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

export const updateInstructionStatus = async (title, status) => {
    try {
        // Отримання ключа
        const keyResponse = await getKey();
        const uuidKey = keyResponse.data;

        console.log("uuidKey " + uuidKey);

        const response = await fetch('http://localhost:8090/instructions/status/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'key': uuidKey, // Передаємо ваш UUID ключ
            },
            body: JSON.stringify({
                title, // Наприклад, передаємо title інструкції
                status, // Передаємо новий статус
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        console.log('Status updated successfully');
        return response.json(); // Можливо, вам потрібна відповідь із сервера
    } catch (error) {
        console.error('Error updating status:', error);
        throw error; // Передаємо помилку далі
    }
};
