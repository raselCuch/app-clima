require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let otp;

  do {
    otp = await inquirerMenu(); // muestra menu y captura dato

    console.log({ otp });

    switch (otp) {
      case 1:
        // mostrar mensaje
        const termino = await leerInput("Cuidad: ");

        // buscar el lugar
        const lugares = await busquedas.ciudad(termino);

        // seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === "0") continue;

        const lugarSelect = lugares.find((l) => l.id === id);
        // console.log(lugarSelect);

        // guardar en DB
        busquedas.agregarHistorial(lugarSelect.nombre);

        // clima
        // mostrar resultados
        console.log("\n Informacion de la ciudad\n".green);
        console.log("Ciudad: ", lugarSelect.nombre);
        console.log("Lat: ", lugarSelect.lat);
        console.log("Lng:", lugarSelect.lng);

        const clima = await busquedas.climaLugar(
          lugarSelect.lat,
          lugarSelect.lng
        );
        //
        console.log("Descripcion: ", clima.desc);
        console.log("Temperatura: ", clima.temp);
        console.log("Minima: ", clima.min);
        console.log("Maxima: ", clima.max);

        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;

      default:
        break;
    }

    if (otp !== 0) {
      await pausa();
    }
  } while (otp !== 0);
};

main();
