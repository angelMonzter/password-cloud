
<?php 
	require("conexion.php");
	class Datos_cuenta extends DBA{
		public function alta($datos_cuenta_id,$nombre_cuenta,$usuario,$password,$datos_extra,$usuario_sid) {
			$this->sentencia = "INSERT INTO datos_cuenta VALUES ($datos_cuenta_id,'$nombre_cuenta','$usuario','$password','$datos_extra','$usuario_sid');";
			$this->ejecutar_sentencia();
		}
		public function modificar($nombre_cuenta,$usuario,$password,$datos_extra,$usuario_sid,$cuenta_editar_id){
			$this->sentencia="UPDATE datos_cuenta SET nombre_cuenta = '$nombre_cuenta', usuario = '$usuario', password = '$password' , datos_extra = '$datos_extra', usuario_sid = '$usuario_sid' WHERE datos_cuenta_id = '$cuenta_editar_id';";
			return $this->ejecutar_sentencia();
		}
		public function eliminar($datos_cuenta_id){
			$this->sentencia="DELETE FROM datos_cuenta WHERE datos_cuenta_id = $datos_cuenta_id";
			return $this->ejecutar_sentencia();
		}
		public function id($value){
			return $this->generator($value);
		}
	}

	if ($_POST['registro'] == 'cuenta') {

		$obj = new Datos_cuenta();

		//agregando cuenta 
	    $datos_cuenta_id = $obj->id(7);
	    $nombre_cuenta = $_POST['nombre_cuenta'];
	    $usuario = $_POST['usuario'];
	    $password = $_POST['password'];
		$datos_extra = $_POST['datos_extra'];
	    $cuenta_editar_id = $_POST['cuenta_editar_id'];
	    $usuario_sid = 0;

	    if ( empty($usuario) || empty($password) ) {
	    	$respuesta = array(
		        'respuesta' => 'error'
		    );
	    }else{

		    if (empty($cuenta_editar_id)) {
		    	$resultado = $obj->alta($datos_cuenta_id,$nombre_cuenta,$usuario,$password,$datos_extra,$usuario_sid);
	    	}else{
		    	$resultado = $obj->modificar($nombre_cuenta,$usuario,$password,$datos_extra,$usuario_sid,$cuenta_editar_id);
	    	}

		    if ($resultado) {
			    if(empty($cuenta_editar_id)){
					$respuesta = array(
						'respuesta' => 'agregado'
					);
				}else{
					$respuesta = array(
						'respuesta' => 'editado',
						'url' => 'password.html'
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

	if ($_POST['eliminar'] === 'datos_cuenta') {

		$obj = new Datos_cuenta();

	    $id = $_POST['id'];

	    $eliminado = $obj->eliminar($id);

	    if ($eliminado) {
		    $respuesta = array(
		        'respuesta' => 'eliminado'
		    );
	    }else{
			$respuesta = array(
		        'respuesta' => 'error'
		    );
	    }

		die(json_encode($respuesta));
	}
?>
