import { Menu, Opt, Colection } from "./helpers/inquirer.js";
import "colors.ts";

import { Busquedas, Ciudad, Info, CompleteInfo } from "./models/busquedas.js";

async function main() {
  let opt: Opt;

  do {
    opt = await Menu.MenuPrincipal();
    try {
      switch (opt.opcion) {
        case "1":
          const lugar: Opt = await Menu.leerInput("Ciudad: ");
          const lugares: Ciudad[] = await Busquedas.busqueda(lugar);

          const opciones: Colection = {
            type: "list",
            name: "opcion",
            message: "Seleccione un lugar\n\n",
            choices: [],
          };

          lugares.forEach((lugar, index) =>
            opciones.choices?.push(
              Menu.createNewMenuTarea(
                `${lugar.id}`,
                `${(index + 1).toString().green}. ${lugar.nombre.magenta}`
              )
            )
          );

          const newMenu: Opt = await Menu.createNewMenu(opciones);

          const city: Ciudad[] = lugares.filter(
            (lugar) => lugar.id === newMenu.opcion
          );

          const { nombre, lat, lng } = city[0];

          const result: Info = await Busquedas.getClima(lat, lng);

          const { desc, max, min, temp } = result;

          const completeInfo: CompleteInfo = {
            Ciudad: nombre,
            Lat: lat,
            Lng: lng,
            Descripcion: desc,
            Temperatura: temp,
            "Temperatura maxima": max,
            "Temperatura minima": min,
          };

          console.table(completeInfo);

          const resultadoSave = await Busquedas.get();

          const filterResult = resultadoSave.filter(
            (ciudad) => ciudad.Ciudad === completeInfo.Ciudad
          );

          if (!filterResult.length) {
            Busquedas.save(completeInfo);
          }
          if (resultadoSave.length > 5) {
            Busquedas.delete(resultadoSave[0].id);
          }

          break;
        case "2":
          const resultado = await Busquedas.get();

          resultado.map((ciudad, index) =>
            console.log(`\t${index + 1}.`.green, ciudad.Ciudad.red)
          );

          break;
      }
      if (opt.opcion !== "0") {
        await Menu.pausa();
      }
    } catch (error) {
      console.log(error);
    }
  } while (opt.opcion !== "0");
}

main();
