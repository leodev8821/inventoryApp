import { By, Key, Builder } from "selenium-webdriver";
import "chromedriver";

async function loginTest() {
    //Datos para insertar en el login
    let user = 'john_doe';
    let pass = 'miPass_1'

    //Esperamos a que se abra la ventana de Chrome
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.sleep(1000);

    //Accedemos a la aplicación en una petición get
    await driver.get("http://localhost:3002/");
    await driver.sleep(2000);

    //Escribimos en los campos y pulsamos enter
    await driver.findElement(By.id("login")).sendKeys(user, Key.TAB);
    await driver.sleep(3000);

    await driver.findElement(By.id("password")).sendKeys(pass, Key.ENTER);
    await driver.sleep(3000);

    //Mostramos el título de la página
    var title = await driver.getTitle();
    console.log('Title is:', title);

    //Cerramos el navegador
    await driver.sleep(5000);
    await driver.quit();

}

loginTest();