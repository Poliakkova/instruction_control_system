import axios from "axios";

const REST_API_GET_USERS_URL = "http://localhost:8090/users/all";

export const listUsers = async () => {
    return axios.get(REST_API_GET_USERS_URL);
}

// Функція для отримання користувача за логіном
export const getUserByLogin = async (userLogin) => {
    try {
      const response = await axios.get(`http://localhost:8090/users/get/{userLogin}?userLogin=${userLogin}`);
      console.log("Отримано дані користувача:", response.data);
      return response.data; // Повертаємо дані користувача
    } catch (error) {
        if (error.response) {
          // Сервер відповів з кодом статусу, що не в діапазоні 2xx
          console.error('Помилка при отриманні користувача:', error.response.data);
          console.error('Статус відповіді:', error.response.status);
          console.error('Заголовки відповіді:', error.response.headers);
        } else if (error.request) {
          // Запит був зроблений, але відповіді не отримано
          console.error('Запит був зроблений, але відповіді не отримано:', error.request);
        } else {
          // Щось інше трапилось під час налаштування запиту
          console.error('Помилка при налаштуванні запиту:', error.message);
        }
        console.error('Конфігурація запиту:', error.config);
        throw error; // Викидаємо помилку для обробки в компоненті
      }
  };

export const addUser = async (user, navigator) => {
    console.log(JSON.stringify(user));

    const response = await fetch('http://localhost:8090/users/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
        });
      
    if (response.ok) {
        alert('Користувач успішно створений');
        navigator('/users');
    } else {
        alert('Помилка при створенні користувача. Перевірте дані');
    }
}

export const updateUser = async (user, navigator) => {
    console.log("updateUser - userJSON " + JSON.stringify(user));

    const response = await fetch('http://localhost:8090/users/update', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (response.ok) {
        alert('Користувач успішно оновлений');
        navigator('/users'); // Перенаправляємо користувача на сторінку зі списком користувачів
    } else {
        alert('Помилка при оновленні користувача. Перевірте дані');
    }
};

export const deleteUser = async (userLogin, navigator) => {
    console.log("userLogin - login " + userLogin);

    const response = await fetch(`http://localhost:8090/users/delete/{userLogin}?userLogin=${userLogin}`, {
        method: 'POST',
    });

    if (response.ok) {
        alert('Користувач успішно видалений');
        navigator('/users'); // Перенаправляємо користувача на сторінку зі списком користувачів
    } else {
        alert('Помилка при видаленні користувача');
    }
  };