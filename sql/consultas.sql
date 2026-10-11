-- 1. Listar os pacientes com seus nomes e o nome da respectiva unidade de saúde (JOIN).
SELECT 
    p.id,
    p.name AS paciente,
    u.name AS unidade
FROM patients AS p
INNER JOIN health_units AS u
    ON u.id = p.health_unit_id
ORDER BY p.name;

-- 2. Contar quantos pacientes existem em cada unidade, incluindo unidades sem pacientes (GROUP BY e LEFT JOIN). 
SELECT     
    u.id,
    u.name AS unidade,
    u.city AS cidade,
    COUNT(p.id) AS total
FROM health_units AS u
LEFT JOIN patients AS p
    ON p.health_unit_id = u.id
GROUP BY u.id, u.name, u.city
ORDER BY total DESC;

-- 3. Listar os pacientes cujo nome contenha um termo informado, como "Maria" (LIKE).
-- Nota: deixei sem LIMIT intencionalmente pois o desafio não pede
SELECT id, name, cpf, birth_date, phone
FROM patients
WHERE name LIKE '%Luciano%';