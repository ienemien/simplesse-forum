$(function() {
	
    //hide logout button
    $('#logout').hide();
    
    //hide content
    $('#content').hide();
    $('#show-user').hide();
    $('#edit-user').hide();
    $('#register').hide();
	
    //show registration form when clicking button
    $('#register-btn').click(function() {
        $('#login').hide();
        $('#register-btn').hide();
        $('#footer').height(200);
        $('#register').show();
        $('#register-form').show();
    });
    
    //handle registration form
    $('#register-form').submit(function() {
        
        //validate email (create functions to do this)
        //validate length passfields
        //validate username
        
        if($('#regpass1').val() == $('#regpass2').val()){
            
            //set the variables
            var newname = $('#regname').val();
            var newmail = $('#regmail').val();
            var newpass = $('#regpass1').val();
        
            // Create an object for the form data:
			var data = new Object();
            data.newname = newname;
            data.newmail = newmail;
            data.newpass = newpass;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#register').hide();
                    $('#register-form').hide();
                    $('#footer').height(100);
                    
                    //set user info variables
                    var username = info['newname'];
                    var email = info['newmail'];
                    
                    //show success message
                    $('#edit-success').text('Thank you ' + username + ' for registering! You will receive an email on ' + email + ' with a link to activate your account.');
					$('#edit-success').addClass('success');
				} else if (info['result'] == 'INCORRECT') {
					$('#reg-results').text('Could not register, please try again later!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#reg-results').text('Please enter all fields!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#reg-results').text('Please provide a valid email address!');
					$('#reg-results').addClass('error');
                } else if (info['result'] == 'INVALID_USER') {					
					$('#reg-results').text('Please provide a valid username!');
					$('#reg-results').addClass('error');
                } else if (info['result'] == 'INVALID_PASS') {					
					$('#reg-results').text('Please provide a valid password!');
					$('#reg-results').addClass('error');
				} else if (info['result'] == 'NOT_UNIQUE') {
                    $('#reg-results').text('Email Address is already registered!');
					$('#reg-results').addClass('error');
                } else {
                    $('#reg-results').text('An unknown error occured, please try again later!');
					$('#reg-results').addClass('error');
                }
			} // End of success.
			options.url = 'register.php';

			// Perform the request:
			$.ajax(options);
		
		} else { 
            $('#reg-results').text('Passwords do not match!');
            $('#reg-results').addClass('error');
        } // End of pass1 and pass2 IF
		
		// Return false to prevent an actual form submission:
		return false;
        
    });//end of registration form
    
	// login
	$('#login').submit(function() {
		
		// Initialize some variables:
		var email, password;
		
		// Validate the email address:
		if ($('#email').val().length >= 6) {
			// Get the email address:
			email = $('#email').val();
			$('#email').removeClass('error').addClass('success');
		} else { // Invalid email address!
			$('#email').removeClass('success').addClass('error');
			$('#results').text('Please enter your email address!');
            $('#result-bar').addClass('error');
		}
		
		// Validate the password:
		if ($('#password').val().length > 0) {
			password = $('#password').val();
			$('#password').removeClass('error').addClass('success');
		} else {
			$('#password').addClass('error');
            $('#result-bar').addClass('error');
			$('#results').text('Please enter your password!');
		}
				
		// If appropriate, perform the Ajax request:
		if (email && password) {
	
			// Create an object for the form data:
			var data = new Object();
			data.email = email;
			data.password = password;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#login').hide();
                    
                    //show logout button:
                    $('#logout').show();
                    
                    //show content and footer
                    $('#content').slideDown();
                    $('#footer').slideDown();
                    $('#show-user').show();
                    $('#edit-user').hide();
                    $('#edit-user-form').hide();
                    $('#register-btn').hide();
	
					// Show a welcome message
                    $('#result-bar').show();
					$('#result-bar').removeClass('error').addClass('success');
                    $('#results').text('You are now logged in!');
                    
                    //set user info variables
                    var username = info['username'];
                    var email = info['email'];
					
                    //update user info with the info from php
                    $('#username').text(username);
                    $('#mailadd').text(email);
                    
				} else if (info['result'] == 'INCORRECT') {
					$('#results').text('The submitted credentials do not match those on file!');
					$('#results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#results').text('Please provide an email address and a password!');
					$('#results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#results').text('Please provide your email address!');
					$('#results').addClass('error');
				}
				
			}; // End of success.
			options.url = 'login.php';

			// Perform the request:
			$.ajax(options);
		
		} // End of email && password IF.
		
		// Return false to prevent an actual form submission:
		return false;
		
	}); // End of login submission
    
    // Log out function
    $('#logout').submit(function() {
        
        //hide content
        $('#content').hide();
        $('#show-user').hide();
        
        //hide logout button
        $('#logout').hide();
        
        //show login form
        $('#login').show();
        $('#register-btn').show();
        
        //show loggedout message
        $('#results').addClass('success').text('You are now logged out!');
        
        // Return false to prevent an actual form submission:
		return false;
    }); //end of logout function
    
    //show edit user info
    $('#edit-user-btn').click(function() {
        
        //hide current user info
        $('#show-user').hide();
        
        //show edit user info form
        $('#edit-user').show();
        $('#edit-user-form').show();
        $('#footer').height(300);
    });
    
    //edit user info form: add validations!!
    $('#edit-user-form').submit(function() {
        
        //check if both passwords are the same
        if($('#pass1').val() == $('#pass2').val()){
            
            //set the variables
            var curname = $('#username').text();
            var curmail = $('#mailadd').text();
            var newname = $('#newname').val();
            var newmail = $('#newmail').val();
            var newpass = $('#pass1').val();
            
            // Create an object for the form data:
			var data = new Object();
            data.curname = curname;
			data.curmail = curmail;
            data.newname = newname;
            data.newmail = newmail;
            data.newpass = newpass;
			
			// Create an object of Ajax options:
			var options = new Object();

			// Establish each setting:
			options.data = data;
			options.dataType = 'text';
			options.type = 'get';
			options.success = function(response) {
				
                //decode json response
                var info = JSON.parse(response);
                
				// Worked:
				if (info['result'] == 'CORRECT') {
	
					// Hide the form:
					$('#edit-user').hide();
                    $('#edit-user-form').hide();
                    $('#footer').height(100);
                    
                    //show user info
                    $('#show-user').show();
                    
                    //set user info variables
                    var username = newname;
                    var email = newmail;
					
                    //update user info with the new info
                    $('#username').text(username);
                    $('#mailadd').text(email);
                    
                    //show success message
                    $('#edit-success').text('User info updated!');
					$('#edit-success').addClass('success');
                    
				} else if (info['result'] == 'INCORRECT') {
					$('#edit-results').text('Could not change user info, try again!');
					$('#edit-results').addClass('error');
				} else if (info['result'] == 'INCOMPLETE') {
					$('#edit-results').text('Please enter all fields!');
					$('#edit-results').addClass('error');
				} else if (info['result'] == 'INVALID_EMAIL') {					
					$('#edit-results').text('Please provide a valid email address!');
					$('#edit-results').addClass('error');
				} else {
                    $('#edit-results').text('An unknown error occured, please try again later!');
					$('#edit-results').addClass('error');
                }
			} // End of success.
			options.url = 'edituser.php';

			// Perform the request:
			$.ajax(options);
		
		} else { 
            $('#edit-results').text('Passwords do not match!');
            $('#edit-results').addClass('error');
        } // End of pass1 and pass2 IF
		
		// Return false to prevent an actual form submission:
		return false;
		
	}); // End of form submission.
    
    //handle the form on submission
    $('.new-post').each(function() {
        var hier = $(this);
        $('.post-form', $(this)).submit(function() {
            if($('#message', $(this)).val().length > 0){
                
                //set variables
                var message = $('#message', $(this)).val();
                var email = $('#mailadd').text();
                var topicid = $('#topicid', $(this)).val();
                var username = $('#username').text();
    
                // Create an object for the form data:
                var data = new Object();
                data.message = message;
                data.email = email;
                data.topicid = topicid;
                
                // Create an object of Ajax options:
                var options = new Object();
    
                // Establish each setting:
                options.data = data;
                options.dataType = 'text';
                options.type = 'get';
                options.success = function(response) {
                    
                    // Worked:
                    if (response == 'CORRECT') {
                       
                        //add message to posts
                        var now = new Date();
                        var day = now.getDate();
                        var month = now.getMonth()+1;
                        var year = now.getFullYear();
                        var hours = now.getHours();
                        var minutes = now.getMinutes();
                        var seconds = now.getSeconds();
                        var date = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
                        hier.after("<div class='post'><div class='user-info'><img class='user-pic' src='img/user.png' alt='userpic' /><ul><li><img class='user-icn' src='img/user-icn.png' alt='user icon' /></li>" + username + "<li><img class='user-icn' src='img/message-icn.png' alt='user icon' /> 15</li></ul></div><h4 class='post-header'>Sent on " + date + "</h4><hr /><p class='post-text'>" + message + "</p></div>");
                        
                        
                        //show success message
                        $('.post-results', $(this)).text('Your message has been posted!');
                        $('.post-results', $(this)).addClass('success');
                        
                    } else if (response == 'INCORRECT') {
                        $('#post-results').text('Could not post your message, please try again!');
                        $('#post-results').addClass('error');
                    } else if (response == 'INCOMPLETE') {
                        $('#post-results').text('Please enter all fields!');
                        $('#post-results').addClass('error');
                    } else if (response == 'UNKNOWN_USER') {					
                        $('#post-results').text('User not known, please log in first!');
                        $('#post-results').addClass('error');
                    } else {
                        $('#post-results').text('Something went wrong, please try again!');
                        $('#post-results').addClass('error');
                    }
                }
                options.url = 'newpost.php';
    
                // Perform the request:
                $.ajax(options);
            
            } else { 
                $('#post-results', $(this)).text('Please enter a message!');
                $('#post-results', $(this)).addClass('error');
            } // end of main IF
            
            // Return false to prevent an actual form submission:
            return false;
        });
    });//end of post form submission
}); // End of document ready.