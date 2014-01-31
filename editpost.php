<?php #editpost.php
require('includes/config.php');
require(MYSQL);

if(isset($_GET['postid'], $_GET['email'], $_GET['newmessage'])) {
    $p = $_GET['postid'];
    $e = $_GET['email'];
	$m = mysqli_real_escape_string($dbc, trim($_GET['newmessage']));
	
	//get user_id from current user
    $q = "SELECT user_id FROM users WHERE email='$e'";
    $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
    $num = mysqli_num_rows($r);
    if($num == 1) {
        $row = mysqli_fetch_array($r);
        $u = $row['user_id'];
        mysqli_free_result($r);
        
        //update post
        $q = "UPDATE posts SET message = '$m' WHERE post_id = $p AND user_id = $u";
        $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
        echo 'CORRECT';
    } else {
        echo 'INCORRECT';
    }
} else {
    echo 'INCOMPLETE';
}
?>