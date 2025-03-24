import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NavigateFunction } from "react-router-dom";

// Ajouter un interceptor pour gérer les erreurs 403
export const setupInterceptors = (navigate : NavigateFunction) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if ((error.response && error.response.status === 401) || !error.response || error.response.data == "Token has expired." || error.response.data.startsWith("I/O error on")) {
        navigate("/unauthorized");
      }
      return Promise.reject(error);
    }
  );
};

// Fonction pour effectuer une requête GET
export const fetchDataGet = async (url: string, options: AxiosRequestConfig = {}): Promise<any> => {
  try {
    // Ajout de withCredentials pour inclure les cookies
    const token = localStorage.getItem('accessToken');
    const config: AxiosRequestConfig = {
      ...options,
      withCredentials: true,  // Active l'envoi des cookies
      headers:{
        'Authorization': token ? 'Bearer ' + token : ""
      }
    };
    const response: AxiosResponse = await axios.get(url, config);
    return response.data;
  } catch (error : any) {
    console.error('Erreur lors de la récupération des données avec GET:', error);
    throw error;
  }
};

// Fonction pour effectuer une requête POST
export const fetchDataPost = async (url: string, data: any, options: AxiosRequestConfig = {}): Promise<any> => {
  try {
    // Ajout de withCredentials pour inclure les cookies
    const token = localStorage.getItem('accessToken');
    const config: AxiosRequestConfig = {
      ...options,
      withCredentials: true,  // Active l'envoi des cookies
      headers:{
        'Authorization': token ? 'Bearer ' + token : ""
      }
    };
    const response: AxiosResponse = await axios.post(url, data, config);
    return response.data;
  } catch (error : any) {
    console.error('Erreur lors de l\'envoi des données avec POST:', error);
    throw error;
  }
};
