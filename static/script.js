var maestrosLista;
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
            $("#maestros").append("<li>" + maestro[1] + " " + maestro[2] + " " + maestro[3] + "</li>");
            // Agregar <hr> solo si no es el último elemento
            if (index < maestros.length - 1) {
                $("#maestros").append("<hr>");
            }
        });

        console.log(maestrosJSON);
        return maestrosJSON
    }

    $("#informacion-maestro").hide();
    $("#agregar-maestro").hide();

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
        $("#lista").show();
        $("#agregar-maestro").hide();
    });

    $("#lista").click(() => {
        $("#agregar-maestro").show();
        $("#informacion-maestro").hide();
        $("#lista").hide();
    });

    $("#maestros").on("click", "li", function(event) {
        var index = $("#maestros li").index(this);

        $("#agregar-maestro").hide();
        $("#informacion-maestro").show();
        $("#lista").show();
        $.ajax({
            url: '/maestros?id=' + (index + 1), // Reemplaza con la URL de tu API
            method: 'GET',
            success: (response) => {
                $("#nombre").text(response[1] + " " + response[2] + " " + response[3]);

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

            }
        });
    });

    $("#buscar").submit(function(event) {
        event.preventDefault();
        $("#buscador").val('');
    });
});