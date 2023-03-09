# 🚀 Projeto Puppeteer e Jest em Node.js 🚀

Esse projeto foi criado com o objetivo de testar a
autenticação e a navegação em um perfil do GitHub utilizando
a biblioteca Puppeteer e o framework de testes Jest em Node.js.

## 💻 Como executar o projeto 💻

Para executar o projeto, siga os seguintes passos:

1. Clone o repositório em sua máquina;
2. Instale as dependências com o comando `npm install`;
3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
   * GITHUB_USERNAME=Aqui_vai_seu_username
   * GITHUB_USER=Aqui_vai_seu_email
   * GITHUB_PASSWORD=Aqui_vai_seu_password
4. Execute o comando `npm test` para rodar os testes.
5. Execute o comando `npm start` para rodar a aplicação.
___

## DICA:
    Esteja com o celular em mãos para fazer a autenticação de 2 fatores.

___
## 📝 Especificações do teste 📝

O teste consiste em realizar as seguintes ações:

1. Abrir o navegador;
2. Acessar a página do GitHub;
3. Acessar a página de login;
4. Preencher o formulário de login com as credenciais fornecidas no arquivo `.env`;
5. Efetuar autenticação;
6. Validar se a autenticação foi bem sucedida;
7. Checar se o usuário foi redirecionado para a URL esperada após o login;
8. Validar o nome do usuário da página localizado abaixo da foto do perfil;
9. Navegar até a aba "Repositories";
10. Acessar um repositório aleatório do perfil;
11. Navegar até a aba "Pull Requests";
12. Deslogar do GitHub;
13. Validar se foi possível deslogar;
14. Encerrar o teste.
___
## 📝 Resultados 📝


Caso o teste seja bem sucedido, ele seguirá pelos testes subsequentes e finalizará normalmente. Caso ocorra algum erro, uma exceção será lançada contendo uma mensagem de erro, por exemplo "Autenticação falhou". Para armazenar as credenciais de login, utilizamos a biblioteca dotenv.
___
## 🛠️ Bibliotecas utilizadas 🛠️

Para a execução dos testes, foram utilizadas as seguintes bibliotecas:

- Puppeteer
- Jest
- dotenv

Esperamos que esse projeto ajude você a entender melhor como utilizar o Puppeteer e o Jest para testar aplicações web em Node.js.
___# Jest_Puppeteer_NodeJs

