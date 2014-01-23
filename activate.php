<?php #activate.php
    require('mysqli_connect.php');
    require('includes/config.php');

    if(isset($_GET['x'], $_GET['y']) && filter_var($_GET['x'], FILTER_VALIDATE_EMAIL) && (strlen($_GET['y']) == 32)) {
        $q = "UPDATE users SET active=NULL WHERE (email='" . mysqli_real_escape_string($dbc, $_GET['x']) . "' AND active='" . mysqli_real_escape_string($dbc, $_GET['y']) . "') LIMIT 1";
        $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MySQL Error: " . mysqli_error($dbc));
        
        if (mysqli_affected_rows($dbc) == 1) {
            $url = BASE_URL . 'index.php';
            //ob_end_clean();
            header("Location: $url");
            exit();
        } else {
            $url = BASE_URL . 'index.php';
            ob_end_clean();
            header("Location: $url");
            exit();
        }
    mysqli_close($dbc);
    } else {
        echo 'Something went wrong, please try again.';
    }
?>