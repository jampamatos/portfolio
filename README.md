# Jampa Matos Win98 Portfolio

Portfolio pessoal com interface inspirada no Windows 98. O site é um frontend estático em HTML, CSS e TypeScript, com janelas arrastáveis e redimensionáveis, catálogo de projetos localizado em PT/EN/ES e formulário de contato via EmailJS.

## Visão geral

- Janela principal centralizada no carregamento e movível/redimensionável no desktop
- Janelas secundárias com foco, arraste, resize, minimizar e maximizar
- Catálogo de projetos carregado a partir de `src/data/projects.json`
- Textos localizados em `src/locales/en.json`, `src/locales/pt.json` e `src/locales/es.json`
- Tela de splash com mensagens rotativas
- Layout responsivo com comportamento adaptado para mobile/tablet

## Stack

- HTML5
- CSS3
- TypeScript
- `http-server` para servir o site localmente
- EmailJS para o formulário de contato
- Docker opcional para rodar o projeto em container

## Estrutura do projeto

```text
.
├── index.html
├── src/
│   ├── assets/          # imagens, ícones e thumbs dos projetos
│   ├── css/             # estilos globais
│   ├── data/            # dados estruturados do catálogo
│   ├── js/              # JavaScript gerado pelo TypeScript
│   ├── locales/         # textos localizados
│   └── ts/
│       ├── app/
│       │   ├── about.ts
│       │   ├── contact.ts
│       │   ├── localization.ts
│       │   ├── menus.ts
│       │   ├── projects.ts
│       │   ├── shell.ts
│       │   ├── splash.ts
│       │   ├── state.ts
│       │   ├── templates.ts
│       │   ├── types.ts
│       │   └── windows.ts
│       └── main.ts      # bootstrap da aplicação
├── docker/
├── package.json
└── tsconfig.json
```

## Como rodar localmente

### Pré-requisitos

- Node.js
- npm
- Navegador moderno

### Setup

1. Clone o repositório:

```bash
git clone https://github.com/jampamatos/portfolio.git
cd portfolio
```

2. Instale as dependências:

```bash
npm install
```

3. Compile o TypeScript:

```bash
npm run build
```

4. Suba um servidor local:

```bash
npm run start
```

5. Abra:

```text
http://localhost:3000
```

Observação: o fluxo atual de desenvolvimento no navegador usa `npm run build` + `npm run start`. O código TypeScript fica em `src/ts` e o JavaScript gerado vai para `src/js`.

## Docker

Se preferir rodar em container:

```bash
docker compose -f docker/docker-compose.yaml up --build
```

Depois, abra a URL exposta pelo container.

## Gerenciamento de conteúdo

### Adicionar um novo projeto

Para adicionar um projeto novo, você não precisa mais mexer em constantes TypeScript.

1. Adicione a imagem em `src/assets/projects/`
2. Cadastre o projeto em `src/data/projects.json`
3. Adicione `title`, `summary` e `details` em:
   - `src/locales/pt.json`
   - `src/locales/en.json`
   - `src/locales/es.json`

Exemplo de entrada em `src/data/projects.json`:

```json
{
  "id": "novoProjeto",
  "order": 11,
  "image": "src/assets/projects/novo_projeto.png",
  "github": "https://github.com/usuario/novo-projeto",
  "live": "https://exemplo.com"
}
```

O `id` precisa bater com a chave dentro de `projects` nos arquivos de locale.

### Atualizar textos existentes

Se o projeto já existe e você quer mudar só o conteúdo textual, basta editar os arquivos em `src/locales/`.

## Organização interna

- `main.ts`: inicialização da aplicação
- `shell.ts`: controles da janela principal e popup de idioma/saída
- `windows.ts`: drag, resize, foco, minimizar, maximizar e criação de janelas
- `projects.ts`: catálogo, grid de projetos e detalhes
- `localization.ts`: carregamento e aplicação de traduções
- `state.ts`: estado compartilhado da aplicação

## Funcionalidades atuais

- Janela principal com ícones de navegação
- Janela Sobre Mim
- Janela de Projetos
- Janela de detalhes por projeto
- Janela de contato com badges sociais e formulário
- Alternância de idioma em tempo real
- Comportamento de foco entre janelas
- Reabertura correta de janelas já abertas

## Créditos

- Ícones baseados em recursos clássicos do Windows 98
- Badges geradas com Shields.io
- Formulário de contato via EmailJS

## Licença

MIT. Veja [LICENSE](./LICENSE).
