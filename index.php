<?php   
    //session_start();
    require('includes/config.php');
    require('mysqli_connect.php');
    //header
    include('includes/header.html');
    //include('includes/fakecontent.html');

    //get all forum subjects from database
    $q = "SELECT f.forum_id, f.forum_name, COUNT(t.topic_id) AS topicnr FROM forums AS f LEFT JOIN topics AS t USING(forum_id) GROUP BY(forum_id) ORDER BY(forum_id)";
    $r = mysqli_query($dbc, $q);

    //get forum info
    if(mysqli_num_rows($r) > 0) {
        $forums = array();
        while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)) {
            $forums[] = array(
                'forum_id' => $row['forum_id'],
                'forum_name' => $row['forum_name'],
                'topicnr' => $row['topicnr']
            );
        } //end of while loop   
        mysqli_free_result($r);
    }//end of forum IF

    //get topic info
    $q = "SELECT t.forum_id, t.topic_id, t.subject, MAX(p.date_posted) AS last_post, COUNT(p.post_id) AS postnr FROM topics AS t LEFT JOIN posts AS p USING (topic_id) GROUP BY topic_id ORDER BY last_post DESC";
    $r = mysqli_query($dbc, $q);
    if(mysqli_num_rows($r) > 0) {
        $topics = array();
        while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)) {
            $topics[] = array(
                'forum_id' => $row['forum_id'],
                'topic_id' => $row['topic_id'],
                'subject' => $row['subject'],
                'last_post' => $row['last_post'],
                'postnr' => $row['postnr']
            );
        }//end of while loop
        mysqli_free_result($r);
    }//end of if */

    //get post info
    $q = "SELECT p.post_id, p.topic_id, p.message, p.date_posted, u.username FROM posts AS p LEFT JOIN users AS u USING(user_id) GROUP BY(post_id) ORDER BY date_posted DESC";
    $r = mysqli_query($dbc, $q);
    if(mysqli_num_rows($r) > 0) {
        $posts = array();
        while($row = mysqli_fetch_array($r, MYSQLI_ASSOC)) {
            $posts[] = array(
                'post_id' => $row['post_id'],
                'topic_id' => $row['topic_id'],
                'message' => $row['message'],
                'date_posted' => $row['date_posted'],
                'username' => $row['username']
            );
        }//end of while loop
        mysqli_free_result($r);
        mysqli_close($dbc);
    }//end of if
    

        // show forums
    foreach($forums as $frow => $finfo) {
        echo '<section class="forum-subject">
                    <div class="forum-bar">
                        <div class="forum-info-left">
                            <img class="forum-icn forum-arrow" src="img/forum-arrow.png" alt="forum arrow" />
                            <h3>' . $finfo['forum_name'] . '</h3>
                            </div>
                            <div class="forum-info-right">
                                <img class="forum-icn" src="img/topics.png" alt="topic icon" />
                                <h3>' . $finfo['topicnr'] . '</h3>
                                <img class="forum-icn" src="img/newtopic.png" alt="new topic" />
                            </div>
                        </div>';
        foreach($topics as $trow => $tinfo) {
            if($tinfo['forum_id'] == $finfo['forum_id']) {
                echo '<section class="topic-subject">
                <div class="topic-bar">
                    <div class="topic-info-left">
                        <img class="topic-icn topic-arrow" src="img/topic-arrow.png" alt="new message" />' . $tinfo['subject'] . '</div>
                    <div class="topic-info-right">
                        <img class="topic-icn" src="img/new-icn.png" alt="new message" />
                        <img class="topic-icn" src="img/message-icn.png" alt ="message icon" />' . $tinfo['postnr'] . '
                        <img class="topic-icn" src="img/reply-btn.png" alt="reply button" />
                    </div>
                </div>
                <div class="posts-container">
                    <div class="new-post">
                        <form class="post-form">
                            <textarea id="message" name="message" cols="80" rows="10"></textarea>
                            <input type="hidden" id="topicid" name="topicid" value="' . $tinfo['topic_id'] . '">
                            <input class="submit-btn" type="submit" value="Submit" />
                            <span class="post-results"></span>
                        </form>
                    </div>';
                foreach($posts as $prow => $pinfo) {
                    if($pinfo['topic_id'] == $tinfo['topic_id']){
                        echo '<div class="post">
                                <div class="user-info">
                                    <img class="user-pic" src="img/user.png" alt="userpic" />
                                    <ul>
                                        <li><img class="user-icn" src="img/user-icn.png" alt="user icon" />' . $pinfo['username'] .     '</li>
                                        <li><img class="user-icn" src="img/message-icn.png" alt="user icon" /> 15</li>
                                    </ul>
                                </div>
                                <h4 class="post-header">Sent on '. $pinfo['date_posted'] . '</h4>
                                <hr />
                                <p class="post-text">'. $pinfo['message'] . '</p>
                            </div>';
                    }
                }
                echo '</div></section>';
            }
        }
    echo '</section>';
    } //end of main foreach

    

    //footer
    include('includes/footer.html');
?>