let filtro;
let datos_api;


function redireccionar(url) {
    setTimeout(function() {
        window.location.href = url;
    }, 1500);
}

function limpiarHTML(){
    const contenido = document.querySelector('.container_tarjetas');

    while ( contenido.firstChild ) {
        contenido.removeChild(contenido.firstChild);
    }
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
    		//redireccionar(data.url);
            console.log(data);
            $(dataThis)[0].reset();
            $('#cuenta_editar_id').val('');
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

function obtener_cuentas(filtro, action, tabla, funcionamiento) {
    console.log(filtro, action, tabla, funcionamiento);
    $.ajax({
        type: 'POST',
        data: {
            filtro: filtro,
            obtener: tabla
        },
        url: action,
        dataType: 'json',
        success: function(data) {
            datos_api = {...data};

            switch (funcionamiento) {
                case 'buscando':
                    limpiarHTML();

                    mostrar_cuentas(datos_api);
                    break;
                case 'editar':
                    mostrar_cuentas(datos_api);
                    cargar_datos_editar(datos_api);
                    break;
                default:
                    mostrar_cuentas(datos_api);
                    break;
            }
        }
    })
}

function cargar_datos_editar(datos_api) {

    //entramos al array para hacer destructuring de datos
    const array_datos = datos_api.cuentas[0];
    const { datos_cuenta_id, nombre_cuenta, usuario, password, datos_extra } = array_datos;

    $('#nombre_cuenta').val(nombre_cuenta);
    $('#usuario').val(usuario);
    $('#password').val(password);
    $('#datos_extra').val(datos_extra);
    $('#datos_extra').val(datos_extra);
    $('#cuenta_editar_id').val(datos_cuenta_id);
}

function mostrar_cuentas(datos_api) {
    let cuentas = datos_api.no_cuentas;
    if(cuentas == 0 || cuentas == null){
        $('.container_tarjetas').append(`<div class="card-divider"> <h2>No hay cuentas disponibles</h2> </div>`);
    }else{
        for (let i = 0; i < cuentas; i++) {
        $('.container_tarjetas')
            .append(`<div class="tajeta_individual">
                <div class="card">
                    <div class="card-divider">
                        <h2>${datos_api.cuentas[i].nombre_cuenta}</h2>
                    </div>
                    <div class="card-section">
                        <div class="grid-x">
                            <div class="large-6 medium-6 small-10 cell">
                                <h4>Usuario / Correo - ${datos_api.cuentas[i].usuario}</h4>
                            </div>
                            <div class="large-6  medium-6 small-2 cell text-center">
                                <button class="button tiny hollow primary usuario_copiar" id-copiar="${datos_api.cuentas[i].datos_cuenta_id}">
                                    <i class="fa-solid fa-copy"></i>
                                    <input type="hidden" class="info_usuario" value="${datos_api.cuentas[i].usuario}">
                                </button>
                            </div>
                        </div>
                        <div class="grid-x">
                            <div class="large-6 medium-6 small-10 cell">
                                <h4>Contraseña - ********* </h4>
                            </div>
                            <div class="large-6 medium-6 small-2 cell text-center">
                                <button class="button tiny hollow primary password_copiar" id-copiar="${datos_api.cuentas[i].datos_cuenta_id}">
                                    <i class="fa-solid fa-copy"></i>
                                    <input type="hidden" class="info_password" value="${datos_api.cuentas[i].password}">
                                </button>
                            </div>
                        </div>
                        <hr>
                        <div class="grid-x">
                            <div class="large-6 medium-6 small-6 cell">
                                <h5>Datos extra - ${datos_api.cuentas[i].datos_extra}</h5>
                            </div>
                            <div class="large-6 medium-6 small-6 cell">
                                <div class="text-right">
                                    <a href="#!" class="button warning hollow small editar_tarjeta" data-id="${datos_api.cuentas[i].datos_cuenta_id}">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </a>
                                    <a href="#!" class="button alert hollow small borrar_tarjeta" data-id="${datos_api.cuentas[i].datos_cuenta_id}">
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

    filtro = $(this).attr('data-id');

    redireccionar('cuenta.html?editar_id=' + filtro);
});

$( "#buscar" ).keyup(function() {
    const valor_buscar = $(this).val();

    obtener_cuentas(valor_buscar, 'php/mostrar_cuentas_api.php', 'datos_edicion', 'buscando');
});

$('.container_tarjetas').on('click', '.usuario_copiar', function(e){
    e.preventDefault();

    const id_copiar = $(this).attr('id-copiar');

    const input_valor =  jQuery('[id-copiar="' + id_copiar + '"]').children('.info_usuario').last();

    navigator.clipboard.writeText(input_valor.val());
});

$('.container_tarjetas').on('click', '.password_copiar', function(e){
    e.preventDefault();

    const id_copiar = $(this).attr('id-copiar');

    const input_valor =  jQuery('[id-copiar="' + id_copiar + '"]').children('.info_password').last();

    navigator.clipboard.writeText(input_valor.val());
});


$( document ).ready(function() {

    //consultar la URL para obtener el id a editar
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    filtro = urlParams.get('editar_id');

    if(filtro == '' || filtro == null){
        //mostrar las cuentas guardadas
        obtener_cuentas('', 'php/mostrar_cuentas_api.php', 'datos', '');
    }else{
        //mostrar datos a editar
        obtener_cuentas(filtro, 'php/mostrar_cuentas_api.php', 'datos_edicion', 'editar');
    }
});
