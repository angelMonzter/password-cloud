let editar_id;

function redireccionar(url) {
	setTimeout(function() {
      window.location.href = url;
  }, 1500);
}

function createData(dataThis) {
	$.ajax({
    type: 'POST',
    data: $(dataThis).serializeArray(),
    url: $(dataThis).attr('action'),
    dataType: 'json',
    success: function(data) {
    	//resultado(data);
    	if (data.respuesta === 'agregado') {
    		$(dataThis)[0].reset();
    	}
    	if (data.respuesta === 'editado') {
    		redireccionar(data.url);
    	}
    }
  })
}

function deleteData(id, action, tabla) {
    $.ajax({
        type: 'POST',
        data: {
            id: id,
            eliminar: tabla
        },
        url: action,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            jQuery('[data-id="' + id + '"]').parents('.tajeta_individual').remove();
        }
    })
}

function datos_edicion(editar_id, action, tabla) {
    $.ajax({
        type: 'POST',
        data: {
            editar_id: editar_id,
            obtener: tabla
        },
        url: action,
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    })
}

function mostrar_cuentas(filtro) {
  $.ajax({
    type: 'POST',
    data: {
        filtro: filtro
    },
    url: 'php/mostrar_cuentas_api.php',
    dataType: 'json',
    success: function(data) {
        let cuentas = data.no_cuentas;
        if(cuentas == 0 || cuentas == null){
            $('.container_tarjetas').append(`<div class="card-divider"> <h2>No hay cuentas disponibles</h2> </div>`);
        }else{
            for (let i = 0; i < cuentas; i++) {
            $('.container_tarjetas')
                .append(`<div class="tajeta_individual">
                <div class="card">
                        <div class="card-divider">
                            <h2>${data.cuentas[i].nombre_cuenta}</h2>
                        </div>
                        <div class="card-section">
                            <div class="grid-x">
                                <div class="large-6 medium-6 small-10 cell">
                                    <h4>Usuario / Correo - ${data.cuentas[i].usuario}</h4>
                                </div>
                                <div class="large-6  medium-6 small-2 cell text-center">
                                    <button class="button tiny hollow primary">
                                        <i class="fa-solid fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="grid-x">
                                <div class="large-6 medium-6 small-10 cell">
                                    <h4>Contraseña - ********* </h4>
                                </div>
                                <div class="large-6 medium-6 small-2 cell text-center">
                                    <button class="button tiny hollow primary">
                                        <i class="fa-solid fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <hr>
                            <div class="grid-x">
                            <div class="large-6 medium-6 small-6 cell">
                                <h5>Datos extra - ${data.cuentas[i].datos_extra}</h5>
                            </div>
                            <div class="large-6 medium-6 small-6 cell">
                                <div class="text-right">
                                    <a href="#!" class="button warning hollow small editar_tarjeta" data-id="${data.cuentas[i].datos_cuenta_id}">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </a>
                                    <a href="#!" class="button alert hollow small borrar_tarjeta" data-id="${data.cuentas[i].datos_cuenta_id}">
                                        <i class="fa-solid fa-trash"></i>
                                    </a>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>`);
            }
        }
    }
  })
}

$('.registro-usuario').on('click', function(e){
    e.preventDefault();

    createData('#registro_usuario');
});

$('.registro-cuenta').on('click', function(e){
    e.preventDefault();

    createData('#registro_cuenta');
});

$('.container_tarjetas').on('click', '.borrar_tarjeta', function(e){
    e.preventDefault();

    const id = $(this).attr('data-id');

    deleteData(id, 'php/datos_cuenta.php', 'datos_cuenta');
});

$('.container_tarjetas').on('click', '.editar_tarjeta', function(e){
    e.preventDefault();

    editar_id = $(this).attr('data-id');

    redireccionar('cuenta.html?editar_id=' + editar_id);

});


$( document ).ready(function() {
    //mostrar las cuentas guardadas
    mostrar_cuentas();

    //consultar la URL para obtener el id a editar
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    editar_id = urlParams.get('editar_id');

    //mostrar datos a editar
    datos_edicion(editar_id, 'php/mostrar_cuentas_api.php', 'datos_edicion');
});
