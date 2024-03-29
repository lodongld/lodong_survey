$(function(){
    
    var listContainer = $("#questCont");
    var paginationcont = $('#data-template').html();

    function getData() {
		var tmp = null;
		$.ajax({
			url: "/page/fetchquestion",
			async: false,
			dataType: "json",
			success: function (results) {
				$.each(results, function (i, result) {
					tmp = results;
				});
			},
			error: function () {
				console.log("error");
			},
		});
		return tmp;
	}

    function displayQuestionStat(dataresult)
    {
        $.each(dataresult,function(i,result){
            var data = {
                'qnum': result.question_num,
                'question': result.question,
                'agree_img': result.agree_image,
                'agree_title':'찬성',
                'agree_desc': result.agree_desc,
                'disagree_img':result.disagree_image,
                'disagree_title':'반대',
                'disagree_desc':result.disagree_desc,
				'link1': result.reference1_link,
				'link2': result.reference2_link,
				'link3': result.reference3_link,
				'text1':result.reference1_text,
				'text2':result.reference2_text,
				'text3':result.reference3_text,
            }
            listContainer.append(Mustache.render(paginationcont, data)); 
        });
    }

    function getResult(){
        // get result for 9 q
    }

    function lookupsearch(){
        // get data or result based on the look up search
    }

    function modal(title,message,type){
		$("#alertModal").modal("show");
		$('#alertModal').find('.modal-title').text(title);
		if(type === "success") 
		{
			$('.alert-success').html(message).fadeIn();
			$('.alert-danger').hide();
		} else
		{
			$('.alert-success').hide();
			$('.alert-danger').html(message).fadeIn();
		}
	}
	function confirmModal(title,message){
		$("#confirmModal").modal("show");
		$('#confirmModal').find('.modal-title').text(title);
		$('.alert-secondary').html(message);
	}

    displayQuestionStat(getData());

	validatesession() === true && validateanswer() === true ? resetSurvey(): false;
});