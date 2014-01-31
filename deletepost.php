<?php #deletepost.php
require('includes/config.php');
require(MYSQL);

//check if all info was received
if(isset($_GET['postid'], $_GET['email'])) {
	//store sent data
    $p = $_GET['postid'];
    $e = $_GET['email'];
	//get user id of current user
    $q = "SELECT user_id FROM users WHERE email='$e'";
    $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
    $num = mysqli_num_rows($r);
    if($num == 1) {
        $row = mysqli_fetch_array($r);
        $u = $row['user_id'];
        mysqli_free_result($r);
        
        //delete post
        $q = "DELETE FROM posts WHERE post_id = $p and user_id = $u";
        $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
		if(mysqli_affected_rows($dbc) == 1){
        echo 'CORRECT';
		} else {
			echo 'INCORRECT';
		}
    } else {
        echo 'UNKNOWN_USER';
    }
} else {
    echo 'INCOMPLETE';
}
?>