<?php 
require('mysqli_connect.php');
require('includes/config.php');

// Need current info + new info
if (isset($_GET['curname'], $_GET['curmail'], $_GET['newname'], $_GET['newmail'], $_GET['newpass'])) {
    
	// Need a valid email address(add more security later)
	if (filter_var($_GET['newmail'], FILTER_VALIDATE_EMAIL)) {
        $cu = ($_GET['curname']);
		$ce = ($_GET['curmail']);
        $nu = ($_GET['newname']);
        $ne = ($_GET['newmail']);
        $np = ($_GET['newpass']);
        
        // update user info in database
        $q = "UPDATE users SET username='$nu', email='$ne', pass=SHA1('$np') WHERE username='$cu' AND email='$ce'";
        $r = @mysqli_query($dbc, $q);
        
		// Must match specific values (later get values from sql query)
		if (mysqli_affected_rows($dbc) == 1) {
            $info['result'] = 'CORRECT';
            echo json_encode($info);
            
            //store data in session
            //$_SESSION['user_id'] = $row['user_id'];
            //$_SESSION['username'] = $row['username'];
            //$_SESSION['email'] = $row['email'];

			mysqli_close($dbc);
		} else { // something went wrong
			$info['result'] = 'INCORRECT';
            echo json_encode($info);
		}
		
	} else { // Invalid email address!
		$info['result'] = 'INVALID_EMAIL';
        echo json_encode($info);
	}

} else { // Missing a variable
	$info['result'] = 'INCOMPLETE';
    echo json_encode($info);
}

?>