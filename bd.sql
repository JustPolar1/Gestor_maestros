CREATE TABLE maestros (
    maestro_id INT PRIMARY KEY AUTO_INCREMENT,
    maestro_nombres VARCHAR(64) NOT NULL,
    maestro_apellido_paterno VARCHAR(64) NOT NULL,
    maestro_apellido_materno VARCHAR(64) NOT NULL,
    maestro_estado BOOLEAN DEFAULT TRUE
);

