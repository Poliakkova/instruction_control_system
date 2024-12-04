import axios from "axios";

//Функція отримання усіх користувачів
export const listUsers = async (token) => {
    return axios.get("http://localhost:8090/users/all", 
        {
            headers: {Authorization: `Bearer ${token}`}
        });
};

// Функція для отримання користувача за логіном
export const getUserByLogin = async (userLogin, token) => {
    try {
      const response = await axios.get(`http://localhost:8090/users/get/{userLogin}?userLogin=${userLogin}`, 
        {
            headers: {Authorization: `Bearer ${token}`}
        });
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

//Функція створення користувача
export const addUser = async (user, navigate, token) => {
    console.log(JSON.stringify(user));

    const response = await axios.post('http://localhost:8090/users/new', user, 
        {
            headers: {Authorization: `Bearer ${token}`}
        });
      
    if (response.status === 200) {
        alert('Користувач успішно створений');
        navigate(`/users/${encodeURIComponent(user.userLogin)}`);
    } else {
        alert('Помилка при створенні користувача. Перевірте дані');
    }
};

//Функція оновлення користувача
export const updateUser = async (user, navigate, token) => {
    console.log("updateUser - userJSON " + JSON.stringify(user));

    const response = await axios.put('http://localhost:8090/users/update', user, 
        {
            headers: {Authorization: `Bearer ${token}`}
        });

    console.log("responce: " + response.status + response.error);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
};

//Функція видалення користувача
export const deleteUser = async (userLogin, navigator, token) => {
    console.log("userLogin - login " + userLogin);

    const response = await axios.post(`http://localhost:8090/users/delete?userLogin=${userLogin}`, {},
        {
            headers: {Authorization: `Bearer ${token}`}
        });

    if (response.status === 200) {
        alert('Користувач успішно видалений');
        navigator('/users'); // Перенаправляємо користувача на сторінку зі списком користувачів
    } else {
        alert('Помилка при видаленні користувача');
    }
};

//Функція зміни пароля
export const changePassword = async (userLogin, oldPassword, newPassword, token) => {
try {
    const response = await axios.put('http://localhost:8090/users/change-password',
    { userLogin, oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
    alert('Пароль успішно змінено');
    }
} catch (error) {
    console.error('Помилка під час зміни пароля:', error.response.data);
    alert('Не вдалося змінити пароль. Перевірте введені дані.');
}
};
  