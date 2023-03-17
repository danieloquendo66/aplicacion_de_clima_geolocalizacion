import inquirer, { QuestionCollection } from "inquirer";
import "colors.ts";

export type Opt = {
  opcion?: string | "";
  desc?: string;
};

type ObjectValues = {
  value: string;
  name: string;
};

export type Colection = {
  type: string;
  name: string;
  message: string;
  choices?: ObjectValues[];
  validate?: Function;
};

export class Menu {
  //

  static async createNewMenu(opciones: Colection): Promise<Opt> {
    // console.log("\n");
    const newOptions: Colection = opciones;

    newOptions.choices?.push(
      Menu.createNewMenuTarea("salir", `${"0.".green} Salir\n\n`)
    );

    const menuOpstions: QuestionCollection<any> = [newOptions];
    const opt: Opt = await inquirer.prompt(menuOpstions);

    return opt;
  }

  static async MenuPrincipal(): Promise<Opt> {
    const opciones: Colection = {
      type: "list",
      name: "opcion",
      message: "Que desea hacer?\n\n",
      choices: [
        Menu.createNewMenuTarea("1", `${"1.".green} Buscar ciudad`),
        Menu.createNewMenuTarea("2", `${"2.".green} Historial`),
        Menu.createNewMenuTarea("0", `${"0.".green} Salir`),
      ],
    };

    const menuOpstions: QuestionCollection<any> = [opciones];

    console.clear();

    console.log("==========================".green);
    console.log(" Seleccione una opcion ".white);
    console.log("==========================\n".green);

    const opt: Opt = await inquirer.prompt(menuOpstions);

    return opt;
  }

  static createNewMenuTarea(value: string, name: string): ObjectValues {
    const tarea: ObjectValues = {
      name,
      value,
    };

    return tarea;
  }

  static async pausa(): Promise<void> {
    const opciones: Colection = {
      type: "input",
      name: "Enter",
      message: `Presione ${"Enter".green} para continuar`,
    };

    const pausa: QuestionCollection<any> = [opciones];

    console.log("\n");

    await inquirer.prompt(pausa);
  }

  static async leerInput(message: string): Promise<Opt> {
    const forCuestion: Colection = {
      type: "input",
      name: "desc",
      message,
      validate(value: string): boolean | string {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }

        return true;
      },
    };

    const question: QuestionCollection<any> = [forCuestion];

    const algo: Opt = await inquirer.prompt(question);

    return algo;
  }
}
