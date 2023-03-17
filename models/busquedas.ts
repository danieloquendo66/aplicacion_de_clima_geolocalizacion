import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import * as dotenv from "dotenv";

import { Opt } from "../helpers/inquirer";

dotenv.config();

export type CompleteInfo = {
  id?: number;
  Ciudad: string;
  Lat: number;
  Lng: number;
  Descripcion: string;
  Temperatura: number;
  "Temperatura maxima": number;
  "Temperatura minima": number;
};

export type CiudadesArr = {
  id: string;
  place_name: string;
  center: number[];
};

export type Ciudad = {
  id: string;
  nombre: string;
  lng: number;
  lat: number;
};

export type Info = {
  desc: string;
  min: number;
  max: number;
  temp: number;
};

export class Busquedas {
  //
  static async busqueda(lugar: Opt): Promise<Ciudad[]> {
    const config: CreateAxiosDefaults = {
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar.desc}.json`,
      params: {
        access_token: process.env.MAPBOX_KEY,
        limit: 5,
        language: "es",
      },
    };

    try {
      const instance: AxiosInstance = axios.create(config);

      const respuesta = await instance.get("");

      return respuesta.data.features.map(
        (lugar: CiudadesArr) =>
          ({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1],
          } as Ciudad)
      );
    } catch (error) {
      throw error;
    }
  }

  static async getClima(lat: number, lon: number): Promise<Info> {
    try {
      const config: CreateAxiosDefaults = {
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          access_token: process.env.OPENWEATHER_KEY,
          lat: lat,
          lon: lon,
          appid: process.env.OPENWEATHER_KEY,
          units: "metric",
          lang: "es",
        },
      };

      const instance: AxiosInstance = axios.create(config);

      const data: AxiosResponse = await instance.get("");

      const info: Info = {
        desc: data.data.weather[0].description,
        max: data.data.main.temp_max,
        min: data.data.main.temp_min,
        temp: data.data.main.temp,
      };

      return info;
    } catch (error) {
      throw error;
    }
  }

  static async get(): Promise<CompleteInfo[]> {
    try {
      const ciudades = await axios.get("http://localhost:3000/city");

      const ciudadesResponse: AxiosResponse = await ciudades;

      return ciudadesResponse.data;
    } catch (error) {
      throw error;
    }
  }

  static async save(data: CompleteInfo): Promise<void> {
    try {
      await axios.post("http://localhost:3000/city", data);
      console.log("\nGuardado!!");
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number | undefined): Promise<void> {
    try {
      await axios.delete(`http://localhost:3000/city/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
