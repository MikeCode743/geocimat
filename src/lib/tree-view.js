import { baseURL, axios } from './base';

function getDirectory(project_id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/repositorio/mostrar/${project_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data.mensaje);
      });
  });
}

function createFolder(project) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/repositorio/crear`, project)
      .then((response) => {
        resolve(response.data.mensaje);
      })
      .catch((error) => {
        reject(error.response.data.mensaje);
      });
  });
}

function deleteElement(project) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${baseURL}/geocimat/repositorio/destruir`, project)
      .then((response) => {
        resolve(response.data.mensaje);
      })
      .catch((error) => {
        reject(error.response.data.mensaje);
      });
  });
}

function uploadElement(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/repositorio/almacenar`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        resolve(response.data.mensaje);
      })
      .catch((error) => {
        reject(error.response.data.mensaje);
      });
  });
}

export { getDirectory, createFolder, deleteElement, uploadElement };
