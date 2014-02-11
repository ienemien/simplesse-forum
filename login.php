<?php # login.php
require('includes/config.php');
require(MYSQL);

// Need two pieces of information:
if (isset($_GET['email'], $_GET['password'])) {
    //validate email and password (with functions)
    
	// Need a valid email address(add more security later)
	if (filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)) {
		$e = ($_GET['email']);
        $p = ($_GET['password']);
        
        // retrieve password and other user info
        $q = "SELECT username, email, userpic FROM users WHERE email='$e' AND pass=SHA1('$p') AND active IS NULL";
        $r = @mysqli_query($dbc, $q);
        
		// Must match specific values (later get values from sql query)
		if (mysqli_num_rows($r) == 1) {
            $info = mysqli_fetch_array($r, MYSQLI_ASSOC);
            $info['result'] = 'CORRECT';
            echo json_encode($info);
            mysqli_free_result($r);
			mysqli_close($dbc);
		} else { // Mismatch!
			$info['result'] = 'INCORRECT';
            echo json_encode($info);
		}
		
	} else { // Invalid email address!
		$info['result'] = 'INVALID_EMAIL';
        echo json_encode($info);
	}

} else { // Missing one of the two variables!
	$info['result'] = 'INCOMPLETE';
    echo json_encode($info);
}

?>