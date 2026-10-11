'use strict';

// Carrega unidades e monta select
async function loadHealthUnits() {
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

/* Carrega pacientes e monta tabela */
async function loadPatients() {
    const data = await fetch('/api/patients', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    
    const patients = await data.json();
    
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

await loadHealthUnits();
await loadPatients();
