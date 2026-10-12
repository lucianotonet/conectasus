# ConectaSUS — Cadastro de Pacientes

Aplicação Laravel (API JSON) + JavaScript puro para cadastrar, listar, buscar, editar e excluir pacientes vinculados a unidades de saúde.

## Pré-requisitos

- PHP 8.3+ com extensão `pdo_mysql`
- Composer
- Node.js 22+ e npm
- MySQL ou MariaDB rodando localmente

## Como executar

```bash
git clone git@github.com:lucianotonet/conectasus.git
cd conectasus

composer install
npm install

# Windows: copy .env.example .env
cp .env.example .env
php artisan key:generate
```

Configure o banco no `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=conectasus
DB_USERNAME=root
DB_PASSWORD=
```

Crie o banco `conectasus` no MySQL e rode:

```bash
php artisan migrate --seed
```

Suba tudo com um comando só (backend + frontend):

```bash
composer run dev
```

Acesse **http://localhost:8000**.

> Alternativa: em vez de `composer run dev`, rode `npm run build` uma vez e depois `php artisan serve` em terminais separados (`npm run dev` em outro terminal se preferir o modo desenvolvimento do Vite).
