<?php
session_start();

if(!empty($_SESSION['message'])) {
    foreach($_SESSION['message'] as $message) {
        echo $message;
    }
    unset($_SESSION['message']);
}


?>



