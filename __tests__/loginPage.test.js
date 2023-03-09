const puppeteer = require("puppeteer");
require('dotenv').config();

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
});

const emailForm = process.env.GITHUB_USER;
const passwordForm = process.env.GITHUB_PASSWORD;
const userForm = process.env.GITHUB_USERNAME

describe('2.0 - Testes para a pagina de login e seu preenchimento:', () => {
    jest.setTimeout(60000);
    it('2.1 - Testes complementares, para entrar no github, acessar a pagina de repositorios, escolher um de forma aleatoria, clicar, depois ir para a pagina de pull request, depois sair do github', async () => {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ["--start-maximized"],
            slowMo: 100,
        });
        const page = await browser.newPage();
        await page.goto("https://github.com");
        await page.click('a[href="/login"]');
        await page.waitForNavigation();
        await page.waitForSelector('input[type="text"], [name="login"], [id="login_field"]');
        // input de login
        await page.type('input[type="text"], [name="login"], [id="login_field"]', emailForm);
        await page.waitForSelector('input[type="password"], [name="password"], [id="password"]');
        await page.type('input[type="password"], [name="password"], [id="password"]', passwordForm);
        await page.click('input[name="commit"]');
        await page.waitForSelector('.js-navigation-container');
        // Espera a página principal do Github carregar
        await page.waitForSelector('summary.Header-link[aria-label="View profile and more"]');
        // Espera o seletor do avatar estar disponível e clica nele
        await page.click('summary.Header-link[aria-label="View profile and more"]');
        await page.waitForSelector('a[data-ga-click="Header, go to repositories, text:your repositories"]');
        // Espera a lista de opções do menu ser exibida e clica em "Your repositories"
        await page.click('a[data-ga-click="Header, go to repositories, text:your repositories"]');
        await page.waitForNavigation();
        const USERNAME = userForm;
        const repositoriesUrl = `https://api.github.com/users/${USERNAME}/repos`;
        const page2 = await browser.newPage();
        await page2.goto(repositoriesUrl);
        await page.bringToFront();
        const response = await page2.goto(repositoriesUrl);
        // Obter a lista de repositórios do usuário via API
        const repositories = await response.json();
        const randomIndex = Math.floor(Math.random() * repositories.length);
        const randomRepository = repositories[randomIndex];
        // Selecionar um repositório aleatório
        const repositoryUrl = randomRepository.html_url;
        await page.goto(repositoryUrl);
        // Navegar para a página do repositório aleatório
        const url = page.url();
        expect(url).toBe(repositoryUrl);
        // Verificar se estamos na página correta do repositório
        await page.bringToFront();
        const pullRequestsButton = await page.waitForSelector('a[id="pull-requests-tab"]', { visible: true });
        await Promise.all([
            pullRequestsButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
        // Espera pelo carregamento da página de pull requests
        await page.waitForSelector('summary.Header-link[aria-label="View profile and more"]');
        await page.click('summary.Header-link[aria-label="View profile and more"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Espera 1 segundo antes de clicar no botão de logout
        await page.waitForSelector('button[data-ga-click="Header, sign out, icon:logout"]');
        await page.click('button[data-ga-click="Header, sign out, icon:logout"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        const loggedOut = await page.$('summary.Header-link[aria-label="View profile and more"]');
        if (!loggedOut) {
            await page.close();
            await browser.close();
        } else {
            throw new Error('Logout falhou');
        }
    });
});
afterAll(async () => {
    await browser.close();
});