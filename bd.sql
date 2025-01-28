CREATE TABLE maestros (
    maestro_id INT PRIMARY KEY AUTO_INCREMENT,
    maestro_nombres VARCHAR(64) NOT NULL,
    maestro_apellido_paterno VARCHAR(64) NOT NULL,
    maestro_apellido_materno VARCHAR(64) NOT NULL,
    maestro_estado BOOLEAN DEFAULT TRUE,
    fecha_nacimiento DATE NOT NULL
);

INSERT INTO maestros (maestro_nombres, maestro_apellido_paterno, maestro_apellido_materno, fecha_nacimiento)
VALUES ('Juan', 'Perez', 'Garcia', '1990-01-01'),
       ('Maria', 'Gonzalez', 'Lopez', '1995-02-02'),
       ('Pedro', 'Rodriguez', 'Hernandez', '1998-03-03'),
       ('Ana', 'Martinez', 'Gomez', '2000-04-04'),
       ('Luis', 'Sanchez', 'Perez', '1985-05-05'),
       ('Laura', 'Torres', 'Ramirez', '2000-06-06');
