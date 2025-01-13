import axios, { AxiosResponse } from 'axios';
import { apiURL } from '@/utils/baseurl';

// Fungsi fetcher generik menggunakan axios
export const fetcher = async (url: string): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(apiURL + url);
    return response.data; // Sesuaikan dengan struktur data API Anda
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};