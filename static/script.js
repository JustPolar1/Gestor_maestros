$(document).ready(function() {

    $("#informacion-maestro").hide();

    $.ajax({
        url: '/maestros', // Reemplaza con la URL de tu API
        method: 'GET',
        success: (response) => {
            // Manejar la respuesta
            console.log(response);
            response.forEach((maestro) => {
                $("#maestros").append("<li>" + maestro[1] + " " + maestro[2] + " " + maestro[3] + "</li>");
            });
        },
        error: (error) => {
            // Manejar el error
            console.error(error);
        }
    });


    $("#buscar").submit(function(event) {
        event.preventDefault();
        $("#buscador").val('');
    });
});
