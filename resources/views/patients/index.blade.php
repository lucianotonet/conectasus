<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    @fonts

    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif
</head>

<body>
    <main class="py-18 max-w-4xl w-full mx-auto">
        <!-- Cabeçalho busca + botão cadastro -->
        <header class="page-header">
            <h1>Pacientes</h1>
            <div class="actions">
                <input type="search" id="search" placeholder="Buscar paciente...">
                <button type="button" id="btn-new">Novo paciente</button>
            </div>
        </header>

        <!-- Feedbacks do form -->
        <div id="feedback" class="hidden"></div>

        <!-- Form cadastro + edição -->
        <section id="patients-form" class="card hidden">
            <h2 id="form-title">Cadastrar paciente</h2>

            <form id="patient-form">
                <input type="hidden" id="patient-id">

                <div class="field">
                    <label for="name">Nome *</label>
                    <input type="text" id="name" name="name" required>
                </div>

                <div class="field">
                    <label for="cpf">CPF *</label>
                    <input type="text" id="cpf" name="cpf" maxlength="14" minlength="11" required>
                </div>

                <div class="field">
                    <label for="birth_date">Nascimento *</label>
                    <input type="date" id="birth_date" name="birth_date" required>
                </div>

                <div class="field">
                    <label for="phone">Telefone</label>
                    <input type="text" id="phone" name="phone" maxlength="15">
                </div>

                <div class="field">
                    <label for="health_unit_id">Unidade de saúde *</label>
                    <select id="health_unit_id" name="health_unit_id" required>
                        <option>Carregando...</option>
                    </select>
                </div>

                <div class="actions">
                    <button type="submit" id="btn-save">Salvar</button>
                    <button type="button" id="btn-cancel" class="secondary">Fechar</button>
                </div>
            </form>
        </section>

        <!-- Lista de pacientes -->
        <section class="card">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Unidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="patients-list">
                    <tr>
                        <td colspan="4" class="loading">Carregando...</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</body>

</html>
