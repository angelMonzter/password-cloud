<?php 
	require("conexion.php");
	class Mostrar_cuenta extends DBA{
		public function consulta() {
            $this->sentencia = "SELECT * FROM datos_cuenta;";
            return $this->obtener_sentencia();
        }
        
        public function buscar_cuentas($filtro) {
                $this->sentencia = "SELECT * FROM datos_cuenta LIKE = '%$filtro%' ";  
                return $this->obtener_sentencia();
        }
	}

	$obj = new Mostrar_cuenta();

	$consultado = $obj->consulta();
    while ( $fila = $consultado->fetch_assoc() ){
		
    	$cuenta_id[] = $fila["datos_cuenta_id"];

		$numero_cuentas = count($cuenta_id);
		$array_cuentas[] = $fila;
    }

	$datos_objeto = array(
		'cuenta_id' => $cuenta_id,
		'nombre_cuenta' => $nombre_cuenta,
		'usuario' => $usuario,
		'password' => $password,
		'datos_extra' => $datos_extra,
	);
	
	$datos = array(
		'no_cuentas' => $numero_cuentas,
		'cuentas' => $array_cuentas
	);

	die(json_encode($datos));

	if ($_POST['obtener'] === 'datos_edicion') {

		$obj = new Mostrar_cuenta();

	    $editar_id = $_POST['editar_id'];

		$consultado = $obj->buscar_cuentas($editar_id);
        while ( $fila = $consultado->fetch_assoc() ){
        	$nombre_cuenta = $fila["nombre_cuenta"];
        }

	    if ($consultado) {
		    $respuesta = array(
		        'respuesta' => 'datos',
		        'nombre_cuenta' => $nombre_cuenta,
		    );
	    }else{
			$respuesta = array(
		        'respuesta' => 'error'
		    );
	    }

		die(json_encode($respuesta));
	}

	//array_push($datos, $cuenta_id, $nombre_cuenta, $usuario, $password, $datos_extra);

	// echo "<pre>";
	// var_dump($datos);
	// echo "<pre>";
	//die(json_encode($datos));

	/*$fecha_filtro = $_POST['filtro'];

	$values = [];
	$label = array(
	    'clientes',
	    'prospectos',
	);
	$consultado = $obj->consulta($fecha_filtro);
    while ( $fila = $consultado->fetch_assoc() ){
    	$cliente_id[] = $fila["cliente_id"];
    	
    	$numero_clientes = count($cliente_id);
    }
	array_push($values, $numero_clientes);

    $consultado_segundo = $obj->consulta($fecha_filtro);
    while ( $fila = $consultado_segundo->fetch_assoc() ){
    	$prospecto_id[] = $fila["prospecto_id"];

    	$numero_prospectos = count($prospecto_id);
    }
	
	array_push($values, $numero_prospectos);

    if ($consultado) {
	    $respuesta = array(
	        'values' => $values,
	        'label' => $label
	    );
    }else{
		$respuesta = array(
	        'respuesta' => 'error'
	    );
    }
    
	die(json_encode($respuesta));*/
?>
