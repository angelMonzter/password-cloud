let filtro;
let datos_api;
let sesion;
let usuario;
let registro;

$( "input" ).focus(function() {
  $( this ).prev( "label" ).addClass('aparecer_label');
});

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
function alerta(mensaje) {
    $.alert({
        title: '',
        content: mensaje,
        boxWidth: '90%',
        useBootstrap: false,
    });
}

function createData(dataThis) {

    const datos = $(dataThis).serializeArray();

    datos.push({name: 'usuario_id', value: usuario});

    if($('.campo_vacio').val() == ''){
        $('.campo_vacio').addClass("input_error");
    }else{
    	$.ajax({
        type: 'POST',
        data: datos,
        url: $(dataThis).attr('action'),
        dataType: 'json',
        success: function(data) {
                const respuesta = data.respuesta;
                console.log(data);
                switch (respuesta) {
                    case 'agregado':
                        $(dataThis)[0].reset();
                        alerta('Agregado!');
                        $('.campo_vacio').removeClass("input_error");
                        break;
                    case 'editado':
                        alerta('Editado!');

                        redireccionar(data.url);
                        $(dataThis)[0].reset();
                        $('#cuenta_editar_id').val('');
                        $('.campo_vacio').removeClass("input_error");
                        break;
                    case 'registro':
                        alerta('Registrado!');

                        $(dataThis)[0].reset();
                        redireccionar('login.html');
                        $('.campo_vacio').removeClass("input_error");
                        break;
                    case 'registrado':
                        alerta('Error, usuario registrado!');

                        break;
                    default:
                        alerta('Error');
                        break;
                }
            }
        })
    }
}
function deleteData(id, action, tabla) {
    $.confirm({
        boxWidth: '90%',
        useBootstrap: false,
        title: 'Eliminar',
        content: 'Confirma para eliminar',
        buttons: {
            confirmar: function () {
                alerta('Eliminado!');

                $.ajax({
                    type: 'POST',
                    data: {
                        id: id,
                        eliminar: tabla
                    },
                    url: action,
                    dataType: 'json',
                    success: function(data) {
                        jQuery('[data-id="' + id + '"]').parents('.tajeta_individual').remove();
                    }
                })
            },
            cancelar: function () {
                alerta('Cancelado!');
            }
        }
    });
}

function obtener_datos(filtro, action, tabla, funcionamiento, $usuario) {
    $.ajax({
        type: 'POST',
        data: {
            filtro: filtro,
            usuario_id: usuario,
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
                case 'login':
                    sesion = datos_api.usuario_id;
                    verificar_sesion(sesion);
                    break;
                default:
                    mostrar_cuentas(datos_api);
                    break;
            }
            return datos_api.usuario_id;
        }
    })
}

function verificar_sesion(sesion){
    if (sesion) {
        if(filtro == '' || filtro == null){
            //mostrar las cuentas guardadas
            obtener_datos('', 'php/mostrar_cuentas_api.php', 'datos', '');
        }else{
            //mostrar datos a editar
            obtener_datos(filtro, 'php/mostrar_cuentas_api.php', 'datos_edicion', 'editar');
        }
    }else{
        redireccionar('login.html');
    }
}

function cargar_datos_editar(datos_api) {

    //entramos al array para hacer destructuring de datos
    const array_datos = datos_api.cuentas[0];
    const { datos_cuenta_id, nombre_cuenta, usuario, password, datos_extra } = array_datos;

    $('#nombre_cuenta').val(nombre_cuenta);
    $('#usuario').val(usuario);
    $('#password').val(password);
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
                            <div class="large-6  medium-6 small-2 cell text-right">
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
                            <div class="large-6 medium-6 small-2 cell text-right">
                                <button class="button tiny hollow primary password_copiar" id-copiar="${datos_api.cuentas[i].datos_cuenta_id}">
                                    <i class="fa-solid fa-copy"></i>
                                    <input type="hidden" class="info_password" value="${datos_api.cuentas[i].password}">
                                </button>
                            </div>
                        </div>
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

$('#cerrar_sesion').on('click', function (e) {
    e.preventDefault();
    
    redireccionar('php/cerrar_sesion.php?cerrar_sesion=' + true);
})

$('#crear_cuenta').on('click', function (e) {
    e.preventDefault();
    
    redireccionar('cuenta.html?usuario_id=' + usuario);
})

$('.link_sesion').on('click', function (e) {
    e.preventDefault();
    
    redireccionar('passwords.html?usuario_id=' + usuario);
})
 
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

    redireccionar('cuenta.html?editar_id=' + filtro + '&usuario_id=' + usuario);
});

$( "#buscar" ).keyup(function() {
    const valor_buscar = $(this).val();

    obtener_datos(valor_buscar, 'php/mostrar_cuentas_api.php', 'datos_edicion', 'buscando');
});

$('.container_tarjetas').on('click', '.usuario_copiar', function(e){
    e.preventDefault();

    const id_copiar = $(this).attr('id-copiar');

    const input_valor =  jQuery('[id-copiar="' + id_copiar + '"]').children('.info_usuario').last();

    navigator.clipboard.writeText(input_valor.val());

    alerta('Copiado!');
});

$('.container_tarjetas').on('click', '.password_copiar', function(e){
    e.preventDefault();

    const id_copiar = $(this).attr('id-copiar');

    const input_valor =  jQuery('[id-copiar="' + id_copiar + '"]').children('.info_password').last();

    navigator.clipboard.writeText(input_valor.val());
    
    alerta('Copiado!');
});

$( document ).ready(function() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    usuario = urlParams.get('usuario_id');

    //consultar la URL para obtener el id a editar
    filtro = urlParams.get('editar_id');

    registro = urlParams.get('registro');

    if (usuario == '' || usuario == null || usuario == undefined) {
        if (registro) {
        }else{
            redireccionar('login.html');
        }
    }else{
        obtener_datos(usuario, 'php/usuario.php', 'usuario', 'login');
    }
});
