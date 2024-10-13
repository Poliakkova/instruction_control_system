import axios from "axios";

const REST_API_GET_USERS_URL = "http://localhost:8090/users/all";

export const listUsers = async () => {
    return axios.get(REST_API_GET_USERS_URL);
}

export const addUser = async () => {
    const response = await fetch('http://localhost:8090/users/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
        });
      
        if (response.ok) {
            alert('Користувач успішно створений');
        } else {
            alert('Помилка при створенні користувача. Перевірте дані');
    }
}