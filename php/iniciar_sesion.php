<?php
error_reporting(0);

if ($_POST['login_usuario'] == 'usuario') {

	$usuario = $_POST['usuario'];

	try {

        $servername = "localhost";
        $username_db = "root";
        $password_db = "";
        $db = "password_cloud";

        $conn = new mysqli($servername,$username_db,$password_db,$db) or die("connection failed");

        mysqli_set_charset($conn, 'utf8'); 

        if ($conn->connect_error) {

            echo $error -> $conn->connect_error;

        }

		$stmt = $conn->prepare("SELECT * FROM usuario WHERE usuario = ?;");
		$stmt->bind_param("s", $usuario);
		$stmt->execute();
		$stmt->bind_result($usuario_id, $nombre, $usuario_admin, $correo, $password_user);
		if ($stmt->affected_rows) {
			$existe = $stmt->fetch();
			if ($existe) {
				$password = $_POST['password'];
				
				if ($password == $password_user) {
					session_start();
			        $_SESSION['usuario'] = $usuario_admin;
			        $_SESSION['usuario_id'] = $usuario_id;

					$respuesta = array(
						'respuesta' => 'exito',
						'usuario' => $usuario_id
					);
				}else{
					$respuesta = array(
						'respuesta' => 'error1',
						'password' => $password2,
						'password_user' => $password_user,
					);
				}
			}else{
				$respuesta = array(
					'respuesta' => 'error2',
					'usuario' => $usuario,
					'password_user' => $password_user,
				);
			}
		}
		$stmt->close();
		$conn->close();
	} catch (Exception $e) {
		echo "error" . $e->getMessage;
	}

	die(json_encode($respuesta));
}
	
if ($_POST['recuperar-contraseña'] == 'contraseña') {

  	$correo = $_POST['correo'];

  	require_once("usuario.php");

	$obj = new Usuario();
	$resultado = $obj->usuario_email($correo);

	while ( $fila = $resultado->fetch_assoc() ){
	  $correo_usuario = $fila['correo'];
	  $usuario = $fila['usuario'];
	  $nombre = $fila['nombre'];
	}

	# si son iguales se manda la nueva contraseña y se actualiza en la BD...
	if ($correo === $correo_usuario) {

	# generamos la contraseña
	$nueva_password = $obj->id(10);

	# guardamos la contraseña en base de datos
	try {
		include_once "conexion_simple.php";
		$stmt = $conn->prepare('UPDATE usuario SET password = ? WHERE correo = ?');
		$stmt->bind_param("ss", $nueva_password, $correo);
		$stmt->execute();
		if ($stmt->affected_rows) {
			$respuesta = array(
				'respuesta' => 'exito',
				'nueva_password' => $nueva_password,
				'correo' => $correo,
				'nombre' => $nombre,
				'usuario' => $usuario,
			);
			die(json_encode($respuesta));
		}else{
			$respuesta = array(
				'respuesta' => 'error'
			);
		}
		$stmt->close();
		$conn->close();
	} catch (Exception $e) {
		$respuesta = array(
			'respuesta' => $e->getMessage()
		);
	}
	
	die(json_encode($respuesta));

	}else{
		# si no lo son se da un mesaje...
		$respuesta = array(
		    'respuesta' => 'error'
		);
		die(json_encode($respuesta));
	}
}
?>