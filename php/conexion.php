
<?php
	error_reporting(0);

	abstract class DBA{
		private static $host = 'localhost';
		private static $usuario = 'root';
		private static $password = '';
		protected $base = 'password_cloud';
		protected $sentencia;
		private $conexion;

		private function abrir_conexion(){
			$this->conexion = new mysqli(self::$host, self::$usuario, self::$password, $this->base);
		}

		private function cerrar_conexion(){
			$this->conexion->close();
		}

		protected function ejecutar_sentencia(){
			$this->abrir_conexion();
			$resultado = $this->conexion->query($this->sentencia);

			return $resultado;
		}

		protected function obtener_sentencia(){
			$this->abrir_conexion();
			$result = $this->conexion->query($this->sentencia);
			return $result;
		}

		protected function generator($lenth) {
			$number = array("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
  
			for ($i = 0; $i < $lenth; $i++) {
					  $rand_value = rand(0, 9);
					  $rand_number = $number["$rand_value"];
  
				  if (empty($con)) {
					$con = $rand_number;
				  } else {
				$con = "$con" . "$rand_number";
			  }
			}
			return $con;
		}
	}
?>
