<?php #deletepost.php
	require('includes/config.php');
	require(MYSQL);
	
	if(isset($_GET['topicid'], $_GET['email'])) {
		$t = $_GET['topicid'];
		$e = $_GET['email'];
		
		//get user id from current user
		$q = "SELECT user_id FROM users WHERE email='$e'";
		$r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
		$num = mysqli_num_rows($r);
		if($num == 1) {
			//store user id from current user
			$row = mysqli_fetch_array($r);
			$u1 = $row['user_id'];
			mysqli_free_result($r);
			
			//get user id from topic user
			$q = "SELECT user_id FROM topics WHERE topic_id='$t'";
			$r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
			
			//store user id from topic
			$row = mysqli_fetch_array($r);
			$u2 = $row['user_id'];
			mysqli_free_result($r);
			if($u1 == $u2) { //if current user is the same as the one who made the topic
				//delete post
				$q = "DELETE FROM topics WHERE topic_id = $t AND user_id = $u1";
				$r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
				if(mysqli_affected_rows($dbc) == 1){ //if topic was deleted
					echo 'CORRECT';
				} else { //if nothing happened
					echo 'INCORRECT';
				}
			} else { //if the two users aren't the same
			echo 'WRONG_USER';
			}
		} else { //if user is not logged in
			echo 'UNKNOWN_USER';
		}
	} else { //if not all info was received
		echo 'INCOMPLETE';
	}
mysqli_close($dbc);
?>