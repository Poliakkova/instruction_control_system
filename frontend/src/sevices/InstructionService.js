import axios from "axios";

const REST_API_GET_ALL_URL = "http://localhost:8090/instructions/get/all";

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