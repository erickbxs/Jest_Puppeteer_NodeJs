require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--start-maximized'],
        'ignoreHTTPSErrors': true,
        slowMo: 100,
    });
    const page = await browser.newPage();

    try {
        // Acessa a página do GitHub
        await page.goto('https://github.com/');

        // Clica no botão de login
        await page.click('a[href="/login"]');

        // lista de abas abertas
        const pages = await browser.pages();
        console.log('Numero de abas abertas:', pages.length);

        // Espera a página de login carregar
        await page.waitForSelector('input[type="text"], [name="login"], [id="login_field"]', { timeout: 5000 });

        // Preenche o formulário de login e senha

        const emailForm = process.env.GITHUB_USER;
        const passwordForm = process.env.GITHUB_PASSWORD;
        console.log('GITHUB_USER = ', emailForm);
        console.log('GITHUB_PASSWORD = ', passwordForm);

        const loginInput = await page.$('input[type="text"], [name="login"], [id="login_field"]', { delay: 300 });
        if (!loginInput) {
            throw new Error('Campo de login não encontrado');
        }
        await loginInput.type(emailForm);

        const passwordInput = await page.$('input[type="password"], [name="password"], [id="password"]');

        if (!passwordInput) {
            throw new Error('Campo de senha não encontrado');
        }
        await passwordInput.type(passwordForm);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('input[name="commit"]')
        ]);

        // Espera a página de redirecionamento carregar
        await new Promise(resolve => setTimeout(resolve, 20000)); // espera 10 segundos

        await page.waitForSelector('.Header-item .octicon.octicon-bell', { waitUntil: 'networkidle2', delay: 100 });
        console.log('Autenticação realizada com sucesso!');


        // Verifica se o usuário foi redirecionado para a URL esperada
        const expectedUrl = 'https://github.com/';
        console.log('URL esperada = ', expectedUrl);
        if (page.url() !== expectedUrl) {
            throw new Error(`Redirecionamento falhou. URL atual: ${page.url()}`);
        }
        // Obtém o nome de usuário a partir do elemento
        const userNameElement = await page.$('.css-truncate.css-truncate-target.ml-1');
        const userName = await page.evaluate(span => span.textContent.trim(), userNameElement);
        console.log('User extraido da pagina principal: ', userName);

        // Verifica o nome do usuário na página
        const expectedUserName = process.env.GITHUB_USERNAME;
        console.log('User extraido do arquivo .env:', expectedUserName);
        if (userName !== expectedUserName) {
            throw new Error(`Nome do usuário incorreto. Nome atual: ${userName}`);
        }

        // Navega até a aba "Repositories" e acessa um repositório aleatório

        await page.waitForSelector('summary.Header-link[aria-label="View profile and more"]');// Espera o seletor do avatar estar disponível e clica nele
        await page.click('summary.Header-link[aria-label="View profile and more"]');
        console.log('Deu certo o click no avatar');


        await page.waitForSelector('a[data-ga-click="Header, go to repositories, text:your repositories"]'); // Espera a lista de opções do menu ser exibida e clica em "Your repositories"
        await page.click('a[data-ga-click="Header, go to repositories, text:your repositories"]');
        console.log('Deu certo o click para mudar para a pagina de repositorios');

        // Espera o carregamento completo da página
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const USERNAME = expectedUserName;
        console.log('Essa função será utilizada para obter os repos, com esse login: ', USERNAME);

        // Obtém a quantidade de repositórios usando a API do GitHub
        const response = await axios.get(`https://api.github.com/users/${USERNAME}/repos`);
        const repositoriesCount = response.data.length;

        console.log(repositoriesCount);

        // Acessa um repositório aleatório
        const randomRepositoryIndex = Math.floor(Math.random() * repositoriesCount);
        const randomRepositoryName = response.data[randomRepositoryIndex].name;
        await page.goto(`https://github.com/${USERNAME}/${randomRepositoryName}`);

        // Acessa a aba "Pull Requests" do repositório
        const pullRequestsLink = await page.$(`a[href="/${USERNAME}/${randomRepositoryName}/pulls"]`);
        await pullRequestsLink.click();
        await page.waitForNavigation();

        // Desloga do GitHub
        await page.waitForSelector('summary.Header-link[aria-label="View profile and more"]');
        await page.click('summary.Header-link[aria-label="View profile and more"]');
        await new Promise(resolve => setTimeout(resolve, 1000));// Espera 1 segundo antes de clicar no botão de logout
        await page.waitForSelector('button[data-ga-click="Header, sign out, icon:logout"]');
        await page.click('button[data-ga-click="Header, sign out, icon:logout"]');

        // Espera a página de logout carregar
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Verifica se o logout foi bem sucedido
        const loggedOut = await page.$('summary.Header-link[aria-label="View profile and more"]');
        if (!loggedOut) {
            console.log('Logout realizado com sucesso');
        } else {
            throw new Error('Logout falhou');
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Fecha o navegador
      await browser.close();
    }
})();
