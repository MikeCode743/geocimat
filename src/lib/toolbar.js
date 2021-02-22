import { baseURL, axios } from './base';

function getInfoUser(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/proyecto`, id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export { getInfoUser };
