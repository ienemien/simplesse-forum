<?php #newtopic.php
require('includes/config.php');
require(MYSQL);

if (isset($_GET['email'], $_GET['forumid'], $_GET['subject'])) { //check if all info is received
	
	//set variables for sent info
    $trimmed = array_map('trim', $_GET); //trim sent info
    $e = mysqli_real_escape_string($dbc, $trimmed['email']);
    $s = mysqli_real_escape_string($dbc, $trimmed['subject']);
    $f = $trimmed['forumid'];
	
	//select user id from current user
    $q = "SELECT user_id FROM users WHERE email='$e'";
    $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
    $num = mysqli_num_rows($r);
    if($num == 1) { //if only one row was returned
        $row = mysqli_fetch_array($r, MYSQLI_ASSOC);
        $u = $row['user_id'];
        mysqli_free_result($r);
		
		//insert post into posts table
        $q = "INSERT INTO topics (topic_id , forum_id , user_id ,subject) VALUES ('' , '$f', '$u', '$s')";
        $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
		
		//if the topic was succesfully added to the database, select information for showing the topic
        if(mysqli_affected_rows($dbc) == 1) {
            $q = "SELECT topic_id FROM topics WHERE subject='$s' ORDER BY topic_id DESC LIMIT 0,1";
            $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
			
			//return user info with JSON
            $info = mysqli_fetch_array($r, MYSQLI_ASSOC);
            $info['result'] = 'CORRECT';
            echo json_encode($info);
        } else { //if message was not succesfully posted
           $info['result'] = 'INCORRECT';
            echo json_encode($info);
        }
    } else { //if no user info was selected
        $info['result'] = 'USER_UNKNOWN';
        echo json_encode($info);
    }
} else {//if not all necessary info was received
    $info['result'] = 'INCOMPLETE';
    echo json_encode($info);
}
mysqli_free_result($r);
mysqli_close($dbc);
?>