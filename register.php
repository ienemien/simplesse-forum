<?php #register.php
require('mysqli_connect.php');
require('includes/config.php');

if (isset($_GET['newname'], $_GET['newmail'], $_GET['newpass'])) {
    $trimmed = array_map('trim', $_GET);
    $u = $e = $p = FALSE;
    
    //validate username
    if(preg_match ('/^[A-Z \'.-]{2,20}$/i', $trimmed['newname'])) {
        $u = mysqli_real_escape_string($dbc, $trimmed['newname']);
    } else {
        $info['result'] = 'INVALID_USER';
        echo json_encode($info);
    }
    
    //validate email-address
    if(filter_var($trimmed['newmail'], FILTER_VALIDATE_EMAIL)) {
        $e = mysqli_real_escape_string($dbc, $trimmed['newmail']);
    } else {
        $info['result'] = 'INVALID_EMAIL';
        echo json_encode($info);
    }
    
    //validate password
    if(preg_match ('/^\w{4,20}$/', $trimmed['newpass'])){
        $p = mysqli_real_escape_string($dbc, $trimmed['newpass']);
    } else {
        $info['result'] = 'INVALID_PASS';
        echo json_encode($info);
    }
    
    if($u && $e && $p) {
        $q = "SELECT user_id FROM users WHERE email='$e'";
        $r =  mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
        
        //if email unused, register user
        if(mysqli_num_rows($r) == 0) {
            $a = md5(uniqid(rand(), true));
            $q = "INSERT INTO users (username, email, pass, reg_date) VALUES ('$u', '$e', SHA1('$p'), NOW())";
            $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MySQL Error: " . mysqli_error($dbc));
            
            //send email
            if(mysqli_affected_rows($dbc) == 1) {
                $body = "Welcome to Simplesse 4UM! Thank you for registering. To activate your account, please click on this link:\n\n";
                $body .= BASE_URL . 'activate.php?x=' . urlencode($e) . "&y=$a";
                mail($trimmed['newmail'], 'Registration Confirmation', $body, 'From: info@inekevermeulen.nl');
                
                //send info back to javascript
                $info['newname'] = $u;
                $info['newmail'] = $e;
                $info['result'] = 'CORRECT';
                echo json_encode($info);
            } else {
                $info['result'] = 'INCORRECT';
                echo json_encode($info);
            }
        } else { //email is already registered
            $info['result'] = 'NOT_UNIQUE';
            echo json_encode($info);
        }
    mysqli_close($dbc);
    }
} else { // Missing a variable
    $info['result'] = 'INCOMPLETE';
    echo json_encode($info);
}
?>