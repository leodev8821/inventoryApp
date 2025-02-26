import puppeteer from 'puppeteer';

/**
 * Extrae información detallada de los municipios desde una tabla específica en https://www.ign.es/web/ane-datos-geograficos/-/datos-geograficos/datosPoblacion?tipoBusqueda=municipios.
 *
 * @async
 * @function getTownsInfo
 * @param {string} link - URL de la página que contiene la tabla con la información de los municipios.
 * @returns {Promise<Array<{ town: string, province: string, INE_code: string }>>} - Una promesa que resuelve en un array de objetos, donde cada objeto contiene el nombre del municipio, la provincia y el código INE.
 *
 * @throws {Error} - Lanza un error si ocurre un problema durante el proceso de scraping o si la estructura de la página no coincide con lo esperado.
 *
 * @example
 * const townsInfo = await getTownsInfo('https://www.ign.es/web/ane-datos-geograficos/-/datos-geograficos/datosPoblacion?tipoBusqueda=municipios');
 * console.log(townsInfo);
 * // [
 * //   { town: 'Abengibre', province: 'Albacete', INE_code: '02001' },
 * //   { town: 'Alatoz', province: 'Albacete', INE_code: '02002' },
 * //   { town: 'Albacete', province: 'Albacete', INE_code: '02003' },
 * //   ...
 * // ]
 */
const getTownsInfo = async (link) => {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link, { waitUntil: "domcontentloaded" });

        const towns = await page.evaluate(() => {
            let pAdvice = document.querySelector('p.advice');
            if (!pAdvice) return [];

            let table = pAdvice.nextElementSibling;

            // Verifica si la tabla existe y es realmente una tabla
            if (!table || table.tagName !== "TABLE") return [];

            const rows = table.querySelectorAll('tbody tr');
            return Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    town: cells.length > 1 ? cells[1]?.textContent.trim() || "Nombre no disponible" : "Nombre no disponible",
                    province: cells.length > 5 ? cells[5]?.textContent.trim() || "Provincia no disponible" : "Provincia no disponible",
                    INE_code: cells.length > 0 ? cells[0]?.textContent.trim() || "Código INE no disponible" : "Código INE no disponible"
                };
            });
        });

        towns.shift(); // Elimina el primer elemento que no es un municipio

        return towns;
    } catch (e) {
        console.error(`${e}`);
        throw new Error('Error en la función getTownsInfo');
    } finally {
        if (browser) await browser.close();
    }
}

/**
 * Realiza scraping de la página del IGN para obtener información detallada sobre los municipios de España.
 *
 * @async
 * @function scrapeSpainsTowns
 * @returns {Promise<Array<{ municipio: string, provincia: string, cod_INE: string }>>} - Una promesa que resuelve en un array de objetos, donde cada objeto contiene el nombre del municipio, la provincia y el código INE.
 *
 * @throws {Error} - Lanza un error si ocurre un problema durante el proceso de scraping, incluyendo errores al obtener la información de la página del IGN o si la estructura de la página no coincide con lo esperado.
 *
 * @example
 * scrapeSpainsTowns()
 * .then(townsInfo => console.log(townsInfo))
 * .catch(error => console.error("Error:", error));
 *
 * // Salida esperada:
 * // [
 * //   { municipio: 'Abengibre', provincia: 'Albacete', cod_INE: '02001' },
 * //   { municipio: 'Alatoz', provincia: 'Albacete', cod_INE: '02002' },
 * //   { municipio: 'Albacete', provincia: 'Albacete', cod_INE: '02003' },
 * //   ...
 * // ]
 */
export async function scrapeSpainsTownsAndProvinces() {
    try {
        let province_counter = 1;
        let allTowns = [];
        l

        console.log("Obteniendo información de las provincias y sus municipios...");

        const towns = await getTownsInfo('https://www.ign.es/web/ane-datos-geograficos/-/datos-geograficos/datosPoblacion?tipoBusqueda=municipios');
        allTowns = allTowns.concat(towns);

        console.log("Información de las provincias y sus municipios obtenida correctamente.");

        return {
            towns: allTowns,
            provinces: provinces
        };
    } catch (e) {
        console.error("Error en scrapeSpainsTownsAndProvinces:", e);
        throw new Error('Error en la función scrapeSpainsTownsAndProvinces');
    }
}