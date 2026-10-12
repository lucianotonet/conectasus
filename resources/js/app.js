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
 * Inicializa
 */
await getHealthUnits();
await getPatients();
