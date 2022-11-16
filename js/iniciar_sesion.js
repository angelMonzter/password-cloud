
$('.iniciar_sesion').on('click', function(e) {
    e.preventDefault();
    
    var datos = $('#datos_sesion').serializeArray();

    $.ajax({
        type: 'POST',
        data: datos,
        url: 'php/iniciar_sesion.php',
        dataType: 'json',
        success: function(data) {
            if (data.respuesta == 'exito') {
                const spin = $('#mostrar_spinner');
                spin.html('<div class="spinner"></div>');
                setTimeout(function() {
                    window.location.href = 'passwords.html?usuario_id=' + data.usuario;
                }, 2000);
            }else{
                if(data.usuario == '' || data.usuario == datos.usuario){
                    $('.usuario_sesion').css("border", "1px solid red");
                }
            }
        }
    })
});
$('.recuperar_contraseña').on('submit', function(e) {
    e.preventDefault();

    var datos = $(this).serializeArray();

    $.ajax({
        type: $(this).attr('method'),
        data: datos,
        url: $(this).attr('action'),
        dataType: 'json',
        success: function(data) {
            var resultado = data;

            if (resultado.respuesta == "exito") {

                $('.recuperar_contraseña')[0].reset();
                
                $.ajax({
                    type: "POST",
                    url: 'php/emails/recuperacion-password.php',
                    data: {
                        password: resultado.nueva_password,
                        correo: resultado.correo,
                        usuario: resultado.usuario,
                        nombre: resultado.nombre,
                    },
                    dataType: 'json',
                    success: function (data){
                    }
                });

            } else {

            }
        }
    })
});