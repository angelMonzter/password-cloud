<?php
    session_start();
    $cerrar_sesion = $_GET['cerrar_sesion'];
    if ($cerrar_sesion) {
        session_destroy();
        header('Location:../index.html');
    }
?>