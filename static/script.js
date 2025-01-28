var maestro_actual;
$(document).ready(function() {
    function fetchMaestros(callback) {
        return $.ajax({
            url: '/maestros', // Reemplaza con la URL de tu API
            method: 'GET',
            success: (response) => {
                if (callback) {
                    callback(response);
                }
                return response;
            },
            error: (error) => {
                // Manejar el error
                console.error(error);
            }
        });
    }

    function renderMaestros(maestros) {
        console.log("Rendering maestros");

        const maestrosJSON = maestros.reduce((acc, maestro) => {
            acc[maestro[0]] = [maestro[1], maestro[2], maestro[3], maestro[5]];
            return acc;
        }, {});

        console.log(maestrosJSON);  // Ver el JSON creado

        // Limpiar la lista antes de agregar nuevos elementos
        $("#maestros").empty();

        if (maestros.length === 0) {
            $("#maestros").append("<li>No hay maestros registrados</li>");
            return;
        }

        maestros.forEach((maestro, index) => {
            // Agregar la ID del maestro como un atributo data-id
            $("#maestros").append("<li data-id='" + maestro[0] + "'>" + maestro[1] + " " + maestro[2] + " " + maestro[3] + "</li>");
            // Agregar <hr> solo si no es el último elemento
            if (index < maestros.length - 1) {
                $("#maestros").append("<hr>");
            }
        });

        console.log(maestrosJSON);
        return maestrosJSON;
    }

    function fetchBuscarMaestro(nombre_completo, callback) {
        return $.ajax({
            url: '/buscar_maestro', // Reemplaza con la URL de tu API
            method: 'GET',
            data: { nombre_completo: nombre_completo },
            success: (response) => {
                if (callback) {
                    callback(response);
                }
                return response;
            },
            error: (error) => {
                // Manejar el error
                console.error(error);
            }
        });
    }
    
    function renderBuscarMaestro(maestros) {
        console.log("Rendering search results");
    
        // Limpiar la lista antes de agregar nuevos elementos
        $("#maestros").empty();
    
        if (maestros.length === 0) {
            $("#maestros").append("<li>No se ha encontrado ningún maestro con ese nombre</li>");
            return;
        }
    
        maestros.forEach((maestro, index) => {
            // Agregar la ID del maestro como un atributo data-id
            $("#maestros").append("<li data-id='" + maestro[0] + "'>" + maestro[1] + " " + maestro[2] + " " + maestro[3] + "</li>");
            // Agregar <hr> solo si no es el último elemento
            if (index < maestros.length - 1) {
                $("#maestros").append("<hr>");
            }
        });
    
        console.log(maestros);
    }

    $("#agregar-maestro").hide();
    $("#modificar-maestro").hide();

    // Llamar a fetchMaestros con un callback
    fetchMaestros(renderMaestros);

    $("#agregar-maestro form").submit((event) => {
        event.preventDefault();
        $.ajax({
            url: '/maestros', // Reemplaza con la URL de tu API
            method: 'POST',
            contentType: 'application/json', // Asegúrate de que el tipo de contenido sea JSON
            data: JSON.stringify({
                maestro_nombres: $("#maestro_nombres").val(),
                maestro_apellido_paterno: $("#maestro_apellido_paterno").val(),
                maestro_apellido_materno: $("#maestro_apellido_materno").val(),
                fecha_nacimiento: $("#fecha_nacimiento").val()
            }),
            success: (response) => {
                // Manejar la respuesta
                console.log(response);
                fetchMaestros(renderMaestros);
                alert(response.message);
                $("#agregar-maestro form")[0].reset(); // Limpiar los campos del formulario
            },
            error: (error) => {
                alert(error.responseJSON.message);
                console.error(error);
            }
        });
    });

    $("#lista").click(() => {
        $("#guardar").text("Guardar maestro");

        $("#informacion-maestro").hide();
        $("#lista").hide();
        $("#modificar-maestro").hide();
        $("#agregar-maestro").show();
        $("#fecha_nacimiento").show();
    });

    $("#maestros").on("click", "li", function(event) {
        maestro_actual = $(this).data("id");  // Almacena la ID del maestro en una variable global
    
        $("#agregar-maestro").hide();
        $("#modificar-maestro").hide();
        $("#informacion-maestro").show();
        $("#lista").show();
    
        $.ajax({
            url: '/maestros?id=' + maestro_actual,  // Usar la ID almacenada en la variable global
            method: 'GET',
            success: (response) => {
                // Suponiendo que response es un array con la información del maestro
                // Si es un objeto o tiene otro formato, ajusta según la estructura de tu respuesta.
                $("#nombre").text(response[1] + " " + response[2] + " " + response[3]);
                $("#nombre_modificar").text(response[1] + " " + response[2] + " " + response[3]);
    
                const date = new Date(response[5]);
    
                // Formateando la fecha de forma legible
                const formattedDate = date.toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC"
                });
                $("#fecha").text(formattedDate);
            },
            error: (error) => {
                console.error(error);
            }
        });
    });

    $("#modificar").click(function(event) {
        $("#informacion-maestro").hide();
        $("#modificar-maestro").show();
    });

    $("#modificar-maestro form").submit( function(event) {
        event.preventDefault();
        $.ajax({
            url: '/maestros?id=' + maestro_actual, // Reemplaza con la URL de tu API
            method: 'PUT',
            contentType: 'application/json', // Asegúrate de que el tipo de contenido sea JSON
            data: JSON.stringify({
                maestro_nombres: $("#modificar_nombres").val(),
                maestro_apellido_paterno: $("#modificar_apellido_paterno").val(),
                maestro_apellido_materno: $("#modificar_apellido_materno").val()
            }),
            success: (response) => {
                // Manejar la respuesta
                fetchMaestros(renderMaestros);
                alert(response.message);
                $("#modificar-maestro").hide();
                $("#informacion-maestro").show();
                $("#lista").show();

                $("#nombre").text($("#modificar_nombres").val() + " " + $("#modificar_apellido_paterno").val() + " " + $("#modificar_apellido_materno").val());
            },
            error: (error) => {
                alert(error.responseJSON.message);
                console.error(error);
            }
        });
    });

    $("#baja").click(function(event) {
        $.ajax({
            url: '/maestros?id=' + maestro_actual, // Reemplaza con la URL de tu API
            method: 'DELETE',
            success: (response) => {
                // Manejar la respuesta
                fetchMaestros(renderMaestros);
                alert(response.message);
                $("#informacion-maestro").hide();
                $("#lista").hide();
            },
            error: (error) => {
                alert(error.responseJSON.message);
                console.error(error);
            }
        });
    });

    $("#buscar").submit(function(event) {
        event.preventDefault();
        const nombre_completo = $("#buscador").val();
        
        if (nombre_completo === '') {
            fetchMaestros(renderMaestros);
            return;
        }

        fetchBuscarMaestro(nombre_completo, renderBuscarMaestro);
        $("#buscador").val('');
    });
});
