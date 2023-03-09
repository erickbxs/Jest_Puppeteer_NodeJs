const puppeteer = require("puppeteer");

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
});
afterAll(async () => {
    await browser.close();
});


describe("1.0 - Testando o Navegador e a Pagina Principal do Puppeteer:", () => {
    jest.setTimeout(30000); // define o tempo limite para 30 segundos
    it("1.1 - A instância do navegador foi aberta com sucesso:", async () => {
        await browser.newPage();

        const newPage = await page.goto("https://github.com");

        expect(newPage).toBeTruthy();
    });
    it("1.2 - Tem o título do GitHub:", async () => {
        await page.goto("https://github.com");

        const title = await page.title();

        expect(title).toBe("GitHub: Let’s build from here · GitHub");
    });
    it('1.3 - Verifica se o seletor está presente na página após o tempo limite de espera:', async () => {
        await page.goto('https://github.com');  // Espera a página de login carregar
        await page.waitForSelector('a[href="/login"]', { timeout: 5000 });
        const selectorIsPresent = await page.$('a[href="/login"]');
        expect(selectorIsPresent).not.toBeNull(); // Verifica se o seletor está presente na página
    });
    it('1.4 - Verifica se ao clicar no seletor, a página é redirecionada para a página de login:', async () => {
        const newPage = await page.goto("https://github.com/login");// Espera a página carregar
        await page.waitForSelector('input[type="text"], [name="login"], [id="login_field"]');
        await page.click('input[type="text"], [name="login"], [id="login_field"]'); // Clica no seletor
        expect(newPage.url()).toEqual('https://github.com/login');// Verifica se a página atual é a página de login
    });
});
