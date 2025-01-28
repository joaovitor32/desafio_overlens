### Passo a Passo para Executar o Projeto Localmente

Para rodar as aplicações localmente, siga os seguintes passos:

1. **Configuração dos arquivos `.env`**:
   Altere os arquivos `.env` com base nos arquivos de exemplo fornecidos, para garantir que as variáveis de ambiente estejam corretas.

2. **Rodando o Backend**:
   Navegue até a pasta `backend` e execute os seguintes comandos:

   ```
   docker compose up --build -d
    npx prisma migrate dev --name init

   yarn start
   ```

   Isso irá inicializar o ambiente Docker e iniciar o servidor backend.

3. **Rodando o Frontend**:
   Navegue até a pasta `frontend` e execute o seguinte comando:

   ```
   yarn start
   ```

   Isso irá iniciar o servidor de desenvolvimento do frontend.

### O Maior Desafio do Projeto

O maior desafio nesse projeto foi definir e implementar as regras de validação e de negócio de forma que a aplicação fosse coesa e que nenhuma ação do usuário pudesse resultar em comportamentos inesperados. Esse cuidado foi fundamental para garantir a robustez do sistema e evitar falhas críticas.

### O que Aprendi

Aprendi novas tecnologias como **GraphQL** e **Shadcdn**, que foram desafios interessantes para aprender e aplicar no prazo estipulado. Foi uma experiência valiosa aprender a usar essas ferramentas de maneira eficaz e integrá-las ao projeto.

### O que Gostaria de Melhorar

Gostaria de melhorar o **UI/UX**, especialmente o design da interface, para torná-la mais intuitiva e agradável para o usuário. Além disso, há algumas partes do código do frontend que poderiam ser mais refatoradas para aumentar qualidade de código e para que alguns glitchs não aconteçam, e as regras de validação no backend também podem ser aprimoradas para garantir uma maior flexibilidade e segurança no processamento dos dados.
