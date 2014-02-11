$(document).ready(function() {
	
	//show upload pic form when clicking 'edit' button
	$('#edit-pic-icn').click(function() {
		$('#uploadPic').show();
		$('#footer').animate({height: "200px"}, 300);
	});
	
	//handle upload pic form
	$('#uploadPic input[type=submit]').on("click", function(event) {
		event.stopPropagation(); // Stop stuff happening
		event.preventDefault(); // Totally stop stuff happening
		
		//store file from form
		var data = new FormData();    
		data.append('file', $('#uploadPic input[type="file"]')[0].files[0]);
		data.append('email', $('#current-user-info #mailadd').text());

		//validate input
		
		//send file to php script
		$.ajax({
			url: 'uploadpic.php',
			type: 'POST',
			data: data,
			//cache: false,
			//dataType: 'json',
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			success: function(response){
				var info = JSON.parse(response);
				if(info['success']){
					//show success message
					$('#result', '#user-pic-block').text(info['success']);
					$('#result', '#user-pic-block').removeClass('error');
					$('#result', '#user-pic-block').addClass('success');
					
					//replace userpic
					$('.user-pic', '#user-pic-block').replaceWith('<img class="user-pic" src="uploads/' + info['userpic'] + '" alt="userpic" />');
					
					//replace pics of this user in post
					var usermail = $('#mailadd').text();
					$('.post').each(function() {
						var str = $('#postmail', $(this)).attr("href");
						var postmail = str.substring(7);
						if(usermail == postmail){
							$('.user-pic', $(this)).replaceWith('<img class="user-pic" src="uploads/' + info['userpic'] + '" alt="userpic" />');
						}
					});
					
					//hide upload pic form
					$('#uploadPic').hide();
					$('#footer').animate({height: "100px"}, 300);
				}else if(info['error']){
					$('#result', '#user-pic-block').text(info['error']);
					$('#result', '#user-pic-block').addClass('error');
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				// Handle errors here
				console.log('ERRORS: ' + textStatus);
			}
		});//end of AJAX call
	});
});