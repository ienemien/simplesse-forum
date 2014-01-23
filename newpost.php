<?php #newpost.php
require('includes/config.php');
require('mysqli_connect.php');

if (isset($_GET['email'], $_GET['topicid'], $_GET['message'])) {
    $trimmed = array_map('trim', $_GET);
    $e = mysqli_real_escape_string($dbc, $trimmed['email']);
    $m = mysqli_real_escape_string($dbc, $trimmed['message']);
    $t = $trimmed['topicid'];
    $q = "SELECT user_id FROM users WHERE email='$e'";
    $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
    $num = mysqli_num_rows($r);
    if($num == 1) {
        $row = mysqli_fetch_array($r);
        $u = $row['user_id'];
        mysqli_free_result($r);
        $q = "INSERT INTO posts (post_id , topic_id , user_id ,message , date_posted) VALUES ('' , '$t', '$u', '$m', NOW())";
        $r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
        if(mysqli_affected_rows($dbc) == 1) {
            echo 'CORRECT';
        } else {
            echo 'INCORRECT';
        }
    } else {
        echo 'USER_UNKNOWN';
    }
} else {
    echo 'INCOMPLETE';
}
mysqli_close($dbc);
?>