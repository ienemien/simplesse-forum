<?php #profilepic.php
require('includes/config.php');
require(MYSQL);

if($_SERVER['REQUEST_METHOD'] == 'POST') {
        if(isset($_FILES['file'])) {
			$e = $_POST['email'];
            $allowed = array('image/pjpeg',
            'image/jpeg', 'image/JPG', 'image/X-PNG', 'image/PNG', 'image/png', 'image/x-png');
			
			//check if filetype is allowed
            if(in_array($_FILES['file']['type'], $allowed)) {

				//create unique id to put in front of filename
				$n = uniqid('img_', true) . $_FILES['file']['name'];
				
				//move file to uploads folder
                if(move_uploaded_file($_FILES['file']['tmp_name'], "uploads/" . $n)){
					//store name in database of current user
					$q = "UPDATE users SET userpic = '$n' WHERE email = '$e'";
					$r = mysqli_query($dbc, $q) or trigger_error("Query: $q\n<br />MYSQL error: " . mysqli_error($dbc));
					if(mysqli_affected_rows($dbc) > 0){ //if filepath was added to database
						$data['success'] = 'File is uploaded!';
						$data['userpic'] = $n;
					} else {
						$data['error'] = 'Something went wrong, please try again!';
					}
                }// end of move
            } else {
                $data['error'] = 'Please upload a JPEG or PNG or GIF image-file of the right size.';
            }
        }// end of isset file upload
                
        if($_FILES['file']['error'] > 0){
            switch($_FILES['file']['error']){
                case 1:
					$data['error'] = 'The file exceeds the upload_max_filesize setting in php.ini.';
                    break;
                case 2:
					
                    $data['error'] = 'The file exceeds the max_file_size setting in the HTML form.';
                    break;
                case 3:
                    $data['error'] = 'The file was only partially uploaded.';
                    break;
                case 4:
                    $data['error'] = 'No file was uploaded.';
                    break;
                case 6:
                    $data['error'] = 'No temporary folder was available.';
                    break;
                case 7:
                    $data['error'] = 'Unable to write to disk.';
                    break;
                case 8:
                    $data['error'] = 'File upload stopped.';
                    break;
                default:
                    $data['error'] = 'A system error occurred.';
                    break;
            }//end of switch
        }// end of error if
        if(file_exists($_FILES['file']['tmp_name']) && is_file($_FILES['file']['tmp_name'])) {
            unlink($_FILES['file']['tmp_name']);
        }
	echo json_encode($data);
    }// end of submitted conditional
?>