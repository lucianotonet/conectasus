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
 *  Carrega pacientes + busca + paginação
 */
let currentPage = 1;
let lastPage = 1;

async function getPatients(page = currentPage) {
    currentPage = page;
    const params = new URLSearchParams();
    const search = searchInput.value.trim();
    if (search) params.set('search', search);
    params.set('page', currentPage);
    const query = `?${params.toString()}`;

    const data = await fetch(`/api/patients${query}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    const result = await data.json();
    const patients = Array.isArray(result) ? result : (result.data ?? []);
    lastPage = result.last_page ?? 1;
    currentPage = result.current_page ?? currentPage;

    // Se a página ficou vazia (ex.: ao excluir último item), volta uma página
    if (patients.length === 0 && currentPage > 1) {
        return getPatients(currentPage - 1);
    }

    renderPatientsTable(patients);
    renderPagination(result);
}

/**
 *  Monta tabela de pacientes
 */
function renderPatientsTable(patients) {
    const patientsTable = document.getElementById('patients-list');
    patientsTable.innerHTML = '';

    if (patients.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.className = 'loading';
        td.textContent = searchInput.value.trim()
            ? 'Nenhum paciente encontrado para sua busca.'
            : 'Nenhum paciente cadastrado.';
        tr.appendChild(td);
        patientsTable.appendChild(tr);
        return;
    }

    patients.forEach((patient) => {
        patientsTable.appendChild(insertPatientRow(patient));
    });
}

/**
 *  Monta controles de paginação (Anterior/Próxima)
 */
function renderPagination(result) {
    const pagination = document.getElementById('pagination');
    const info = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    if (!result || !result.total) {
        pagination.classList.add('hidden');
        return;
    }

    lastPage = result.last_page ?? 1;
    currentPage = result.current_page ?? currentPage;

    info.textContent = `Página ${currentPage} de ${lastPage} — Total: ${result.total} paciente(s)`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= lastPage;

    pagination.classList.toggle('hidden', lastPage <= 1);
}

function insertPatientRow(patient) {
    const tableRow = document.createElement('tr');

    // Coluna nome
    var td = document.createElement('td');
    td.textContent = patient.name;
    tableRow.appendChild(td);

    // Coluna CPF
    var td = document.createElement('td');
    td.textContent = formatCPF(patient.cpf);
    tableRow.appendChild(td);

    // Coluna unidade
    var td = document.createElement('td');
    td.textContent = `${patient.health_unit.name} - ${patient.health_unit.city}`;
    tableRow.appendChild(td);

    // Coluna ações
    var actions = document.createElement('td');

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'small';
    editBtn.dataset.id = patient.id;
    editBtn.dataset.action = 'edit';

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'small danger';
    deleteBtn.dataset.id = patient.id;
    deleteBtn.dataset.action = 'delete';

    actions.append(editBtn, deleteBtn);
    tableRow.appendChild(actions);

    return tableRow;
}

function formatCPF(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
        return digits.length === 2 ? `(${digits}) ` : `(${digits}`;
    }

    const areaCode = digits.slice(0, 2);
    const number = digits.slice(2);
    const subscriberLength = digits.length > 10 ? 5 : 4;
    const subscriber = number.slice(0, subscriberLength);
    const suffix = number.slice(subscriberLength);

    return `(${areaCode}) ${subscriber}${suffix ? `-${suffix}` : ''}`;
}

/**
 * Listener do input de busca
 */
const searchInput = document.getElementById('search');
let searchDebounceTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => getPatients(1), 400); // pequeno delay
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentPage > 1) getPatients(currentPage - 1);
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (currentPage < lastPage) getPatients(currentPage + 1);
});

/**
 * Listener do form de cadastro
 */
const patientsformCard = document.getElementById('patients-form');
const form = document.getElementById('patient-form');
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', () => {
    cpfInput.value = formatCPF(cpfInput.value);
});
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors()

    const saveBtn = document.getElementById('btn-save');
    saveBtn.disabled = true

    const payload = {
        id: document.getElementById('patient-id').value,
        name: document.getElementById('name').value,
        cpf: cpfInput.value.replace(/\D/g, ''),
        birth_date: document.getElementById('birth_date').value,
        phone: phoneInput.value.replace(/\D/g, ''),
        health_unit_id: document.getElementById('health_unit_id').value,
    };
    const isEditing = Boolean(payload.id);

    const response = await fetch(isEditing ? `/api/patients/${payload.id}` : '/api/patients', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    saveBtn.disabled = false;

    if (!response.ok) {
        showErrors(data)
        return
    }

    // const tableRow = insertPatientRow(data);
    // tableRow.classList.add('new');

    if (isEditing) {
        await getPatients();
        const patientsTable = document.getElementById('patients-list');
        const existingRow = [...patientsTable.querySelectorAll('tr')].find((row) =>
            row.querySelector('button[data-id]')?.dataset.id === String(data.id)
        );
        existingRow?.classList.add('new');
    } else {
        searchInput.value = '';
        await getPatients(1);
    }

    // Mostra sucesso e oculta o form
    patientsformCard.classList.add('hidden');
    showSuccess(isEditing
        ? 'Paciente atualizado com sucesso.'
        : 'Paciente cadastrado com sucesso.'
    );
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
function showSuccess(message) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = "";
    feedback.classList.remove("hidden", "error")
    feedback.classList.add("success")
    const p = document.createElement('p');
    p.textContent = message;
    feedback.appendChild(p);
}

document.getElementById('btn-new').addEventListener('click', () => {
    clearErrors();
    form.reset();
    document.getElementById('patient-id').value = '';
    document.getElementById('form-title').textContent = 'Cadastrar paciente';
    patientsformCard.classList.remove('hidden');
    document.getElementById('name').focus();
});

document.getElementById('btn-cancel').addEventListener('click', () => {
    clearErrors();
    form.reset();
    patientsformCard.classList.add('hidden');
});

document.getElementById('patients-list').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;

    const { id, action } = button.dataset;
    if (action === 'delete') deletePatient(id, button);
    else openPatientForm(id);
});

async function deletePatient(id, button) {
    const patientName = button.closest('tr').cells[0].textContent;
    if (!window.confirm(`Tem certeza que deseja excluir o paciente ${patientName}?`)) {
        return;
    }

    const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();

    if (!response.ok) {
        showRequestError(data.message || 'Não foi possível excluir o paciente.');
        return;
    }

    showSuccess(data.message);
    
    const tr = button.closest('tr')
    tr.classList.add('removed')
    setTimeout(() => getPatients(), 300);
}

async function openPatientForm(id) {
    clearErrors();

    const response = await fetch(`/api/patients/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const patient = await response.json();

    if (!response.ok) {
        showRequestError(patient.message || 'Não foi possível carregar os dados do paciente.');
        return;
    }

    document.getElementById('patient-id').value = patient.id;
    document.getElementById('name').value = patient.name;
    cpfInput.value = formatCPF(patient.cpf);
    document.getElementById('birth_date').value = patient.birth_date;
    phoneInput.value = formatPhone(patient.phone || '');
    document.getElementById('health_unit_id').value = patient.health_unit_id;
    document.getElementById('form-title').textContent = 'Editar paciente';
    patientsformCard.classList.remove('hidden');
    document.getElementById('name').focus();
}

function showRequestError(message) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';
    feedback.classList.remove('hidden', 'success');
    feedback.classList.add('error');

    const p = document.createElement('p');
    p.textContent = message;
    feedback.appendChild(p);
}

/**
 * Inicializa
 */
await getHealthUnits();
await getPatients();
