$(function () {
	var listContainer = $("#questCont");
	var paginationcont = $("#qstat-template").html();
	
	const elemlevel = $("#elem");
	const highschool = $("#highschool");
	const college = $("#college");
	const public_sec = $("#public");
	const classification = $('.classification');

	function getData(url) {
		var tmp = null;
		$.ajax({
			url:url,
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

	function displayQuestion(results) {
		$.each(results, function (i, result) {
			var disagree_div = "disagree" + result.question_num;
			var agree_div = "agree" + result.question_num;
			var progAgree = "agreeprog" + result.question_num;
			var progDisagree = "disagreeprog" + result.question_num;
			var data = {
				qnum: result.question_num,
				question: result.question,
				agree_img: result.agree_image,
				agree_title: "찬성",
				agree_desc: result.agree_desc,
				disagree_img: result.disagree_image,
				disagree_title: "반대",
				disagree_desc: result.disagree_desc,
				agreediv: agree_div,
				disagreediv: disagree_div,
				agreeval: 80,
				disagreeval: 20,
				agreeprog: progAgree,
				disagreeprog: progDisagree,
			};

			listContainer.append(Mustache.render(paginationcont, data));
		});
	}

	function searchResult(question,$stat){
		let num = 1;
		$.each(question, function (i, result) {
			var progAgree = "agreeprog" + result.question_num;
			var progDisagree = "disagreeprog" + result.question_num;

			$.each($stat, function (i, data) {
				if(result.question_num === i)
				{
					let tanswer = data[0] + data[1];
					let valagree = (data[0]/tanswer)*100;
					let valdisagree = (data[1]/tanswer)*100;
					var tagree = valagree.toFixed() !== 'NaN' ? valagree.toFixed() + "%" : "0%";
					var tdisagree = valagree.toFixed() !== 'NaN' ? valdisagree.toFixed() + "%" : "0%";

					$("#" + progAgree).css("width", tagree);
					$("#" + progDisagree).css("width", tdisagree);
				}
			});
			num++;
		});
	}

	function getShowList(school) {
		if (school === "초등학생") {
			elemlevel.show();
			highschool.hide();
			college.hide();
			public_sec.hide();
			classification.removeClass('d-none');
		} else if (school === "중학생") {
			highschool.show();
			elemlevel.hide();
			college.hide();
			public_sec.hide();
			classification.removeClass('d-none');
		} else if (school === "고등학생") {
			highschool.show();
			elemlevel.hide();
			college.hide();
			public_sec.hide();
			classification.removeClass('d-none');
		} else if (school === "대학") {
			college.show();
			elemlevel.hide();
			highschool.hide();
			public_sec.hide();
			classification.removeClass('d-none');
		} else if (school === "일반인") {
			public_sec.show();
			elemlevel.hide();
			highschool.hide();
			college.hide();
			classification.removeClass('d-none');
		} else {
			elemlevel.hide();
			highschool.hide();
			college.hide();
			public_sec.hide();
			classification.addClass('d-none');
		}
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

	
	
	let displayUrl = '/page/fetchquestion';
	let resultUrl = '/page/fetchDefaultData';
	displayQuestion(getData(displayUrl));

	let defaultdata = getData(resultUrl).data;
	searchResult(getData(displayUrl),defaultdata);
	console.log(defaultdata);

	var data = document.getElementById("school_level").value;
	getShowList(data);

	$("#school_level").change(function () {
		var data = document.getElementById("school_level").value;
		getShowList(data);
	});

	$("#search").on("click", function () {
		var url = "/page/lookUpQuestionStat";
		var data = $("#searchform").serialize();
		$.ajax({
			type:'ajax',
			method: 'post',
			url: url,
			data: data,
			async: false,
			dataType: 'json',
			success: function(response){
				if(response.status === true){	
					searchResult(getData(displayUrl),response.data)
				}else{
					var title = '앗 미안 해요!!!';
					var message = response.error;
					var type = 'error';
					modal(title,message,type);
				}
			},
			error: function(xhr, status, error){
				var title = '앗 미안 해요!!!';
				var message = error;
				var type = 'error query';
				modal(title,message,type);
			}
		});			
	});

	validatesession() === true && validateanswer() === true ? resetSurvey(): false;


});