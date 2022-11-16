
<?php
	require("conexion.php");
	class Usuario extends DBA{
		public function alta($usuario_id,$nombre,$usuario,$correo,$password) {
			$this->sentencia = "INSERT INTO usuario VALUES ($usuario_id,'$nombre','$usuario','$correo','$password');";
			$this->ejecutar_sentencia();
		}
		public function consulta() {
			$this->sentencia = "SELECT * FROM usuario;";
			return $this->obtener_sentencia();
		}
		public function consulta_sesion($usuario_id) {
			$this->sentencia = "SELECT * FROM usuario WHERE usuario_id = $usuario_id;";
			return $this->obtener_sentencia();
		}
		public function modificar($plan_id,$status_cliente, $fecha_hoy){
			$this->sentencia="UPDATE seguro_persona SET status_cliente_seguro = '$status_cliente', fecha_cambio_status = '$fecha_hoy' WHERE seguro_perona_id = '$plan_id';";
			return $this->ejecutar_sentencia();
		}
		public function eliminar($seguro_persona_id){
			$this->sentencia="DELETE FROM seguro_persona WHERE seguro_perona_id = '$seguro_persona_id'";
			return $this->ejecutar_sentencia();
		}
		public function id($value){
			return $this->generator($value);
		}
	}

	if ($_POST['registro'] == 'usuario') {

		$obj = new Usuario();

		//agregando usuario
	    $usuario_id = $obj->id(7);
	    $nombre = $_POST['nombre'];
	    $usuario = $_POST['usuario'];
	    $correo = $_POST['correo'];
	    $password = $_POST['password'];
	    $editar = $_POST['editar'];

	    if ( empty($usuario) || empty($correo) || empty($password) ) {
	    	$respuesta = array(
		        'respuesta' => 'error'
		    );
	    }else{

		    if (empty($editar)) {
		    	$resultado = $obj->alta($usuario_id,$nombre,$usuario,$correo,$password);
	    	}else{
		    	$resultado = $obj->modificar($nombre,$usuario,$correo,$password,$usuario_id);
	    	}

		    if ($resultado) {
			    if(empty($editar)){
					$respuesta = array(
						'respuesta' => 'agregado'
					);
				}else{
					$respuesta = array(
						'respuesta' => 'editado',
						'url' => 'perfil.html'
					);
				}
		    }else{
				$respuesta = array(
			        'respuesta' => 'error'
			    );
		    }
	    }
		die(json_encode($respuesta));
	}

	if ($_POST['obtener'] == 'usuario') {
		
		$obj = new Usuario();

		$usuario_id = $_POST['filtro'];

		$consultado = $obj->consulta_sesion($usuario_id);
		while ( $fila = $consultado->fetch_assoc() ){
			$usuario = $fila["usuario_id"];
		}

		$datos = array(
			'respuesta' => 'exito',
			'usuario_id' => $usuario
		);

		die(json_encode($datos));
	}
?>
