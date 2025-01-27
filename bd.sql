CREATE TABLE maestros (
    maestro_id INT PRIMARY KEY AUTO_INCREMENT,
    maestro_nombres VARCHAR(64) NOT NULL,
    maestro_apellido_paterno VARCHAR(64) NOT NULL,
    maestro_apellido_materno VARCHAR(64) NOT NULL,
    maestro_estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE especialidades (
    especialidad_id INT PRIMARY KEY AUTO_INCREMENT,
    especialidad_nombre VARCHAR(64) NOT NULL,
    especialidad_estado BOOLEAN DEFAULT TRUE
);

ALTER TABLE maestros ADD COLUMN especialidad_id INT;

INSERT INTO especialidades 
(especialidad_nombre) 
VALUES 
('Tecnologías de la información'),
("Desarrollo de negocios"),
("Mantenimiento industrial"),
("Procesos industriales");

INSERT INTO maestros 
(maestro_nombres, maestro_apellido_paterno, maestro_apellido_materno, especialidad_id) 
VALUES 
('Juan', 'Perez', 'Lopez', 1),
('Maria', 'Gonzalez', 'Hernandez', 2),
('Carlos', 'Ramirez', 'Martinez', 3),
('Ana', 'Sanchez', 'Diaz', 4);
