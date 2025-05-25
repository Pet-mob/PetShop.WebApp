# petshop.webapp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


seguir essa estrutura:
src/
├── assets/              # Imagens, ícones, fontes
├── components/          # Botões, Modal.vue, Card.vue, etc.
├── layouts/             # MainLayout.vue, AuthLayout.vue
├── pages/               # Página completa por rota (HomePage.vue, PetListPage.vue)
├── router/              # index.js com rotas
├── services/            # petService.js, authService.js
├── stores/              # petStore.js, userStore.js (com Pinia)
├── composables/         # useAuth.js, usePetForm.js → lógica reutilizável
├── utils/               # funções utilitárias (formatação, validação, etc)
├── constants/           # enums, textos fixos
├── styles/              # global.css, variáveis SCSS
├── App.vue
└── main.js
