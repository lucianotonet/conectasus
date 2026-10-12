'use strict';

/**
 * Carrega unidades e monta select 
 */
async function getHealthUnits() {
    const data = await fetch('/api/health-units', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    const units = await data.json();

    const unitSelect = document.getElementById('health_unit_id');
    unitSelect.innerHTML = '';
    const placeholder = new Option('Selecione...', '');
    unitSelect.add(placeholder);

    units.forEach((unit) => {
        unitSelect.add(new Option(`${unit.name} - ${unit.city}`, unit.id));
    });
}

/**
 *  Carrega pacientes + busca
 */
async function getPatients() {
    const search = searchInput.value.trim();
    const query = search ? `?${new URLSearchParams({ search })}` : '';

    const data = await fetch(`/api/patients${query}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    const patients = await data.json();
    renderPatientsTable(patients);
}

/**
 *  Monta tabela de pacientes
 */
function renderPatientsTable(patients) {
    const patientsTable = document.getElementById('patients-list');
    patientsTable.innerHTML = '';

    patients.forEach((patient) => {
        const tableRow = document.createElement('tr');

        // Coluna nome
        var td = document.createElement('td');
        td.textContent = patient.name;
        tableRow.appendChild(td);

        // Coluna CPF
        var td = document.createElement('td');
        td.textContent = patient.cpf;
        tableRow.appendChild(td);

        // Coluna unidade
        var td = document.createElement('td');
        td.textContent = patient.health_unit.name + " - " + patient.health_unit.city;
        tableRow.appendChild(td);

        // Coluna ações
        var actions = document.createElement('td');

        var editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.className = 'small';

        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.className = 'small danger';

        // Monta tabela
        actions.append(editBtn, deleteBtn);
        tableRow.appendChild(actions);
        patientsTable.appendChild(tableRow);
    });
}

/**
 * Listener do input de busca
 */
const searchInput = document.getElementById('search');
let searchDebounceTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(getPatients, 400); // pequeno delay
});

/**
 * Listener do form de cadastro
 */
const patientsformCard = document.getElementById('patients-form');
const form = document.getElementById('patient-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors()

    const saveBtn = document.getElementById('btn-save');
    saveBtn.disabled = true

    const payload = {
        id: document.getElementById('patient-id').value,
        name: document.getElementById('name').value,
        cpf: document.getElementById('cpf').value,
        birth_date: document.getElementById('birth_date').value,
        phone: document.getElementById('phone').value,
        health_unit_id: document.getElementById('health_unit_id').value,
    };

    const response = await fetch(`/api/patients`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    saveBtn.disabled = false

    if (!response.ok) {
        showErrors(data)
        return
    }

    const patientsTable = document.getElementById('patients-list');

    const tableRow = document.createElement('tr');

    // Coluna nome
    var td = document.createElement('td');
    td.textContent = data.name;
    tableRow.appendChild(td);

    // Coluna CPF
    var td = document.createElement('td');
    td.textContent = data.cpf;
    tableRow.appendChild(td);

    // Coluna unidade
    var td = document.createElement('td');
    td.textContent = data.health_unit.name + " - " + data.health_unit.city;
    tableRow.appendChild(td);

    // Coluna ações
    var actions = document.createElement('td');

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'small';

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'small danger';

    // Insere o novo item no topo da tabela
    actions.append(editBtn, deleteBtn);
    tableRow.classList.add('new');
    tableRow.appendChild(actions);
    patientsTable.prepend(tableRow);

    // Mostra sucesso e oculta o form
    patientsformCard.classList.add('hidden');
    showSuccess()
    form.reset();
});

/** Mostra mensagens de erro */
function showErrors(data) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = "";
    feedback.classList.remove("hidden", "success")
    feedback.classList.add("error")
    const p = document.createElement('p');

    // Mensagem de erro principal
    p.textContent = data.message;
    feedback.appendChild(p);

    // Lista de erros de validação
    const errors = Object.keys(data.errors);
    const ul = document.createElement('ul');
    errors.forEach((error) => {
        const li = document.createElement('li');
        li.textContent = data.errors[error];
        ul.appendChild(li);

        var fieldWithError = document.getElementById(error)
        fieldWithError.classList.add("error")
    });
    feedback.appendChild(ul);
}

/** Limpa feedback de erros */
function clearErrors() {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = "";
    feedback.classList.add("hidden")

    document.querySelectorAll('input.error, select.error').forEach((input) =>
        input.classList.remove('error')
    )
}

/** Mostra mensagens de sucesso */
function showSuccess() {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = "";
    feedback.classList.remove("hidden", "error")
    feedback.classList.add("success")
    const p = document.createElement('p');
    p.textContent = "Paciente cadastrado com sucesso."
    feedback.appendChild(p);
}

document.getElementById('btn-new').addEventListener('click', () => {
    clearErrors();
    patientsformCard.classList.remove('hidden');
});

document.getElementById('btn-cancel').addEventListener('click', () => {
    clearErrors();
    form.reset();
    patientsformCard.classList.add('hidden');
});

/**
 * Inicializa
 */
await getHealthUnits();
await getPatients();
