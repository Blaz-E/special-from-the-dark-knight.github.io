var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var offsetX, offsetY;

$(function () {
    var $loveHeart = $("#loveHeart");
    $garden = $("#garden");
    gardenCanvas = $garden[0];
	offsetX = gardenCanvas.width / 2;
    offsetY = gardenCanvas.height / 2 - 55;
    gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);


    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);

    adjustContentPosition();
});

function startEverything() {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					// Jika bertemu tag HTML (seperti <br>), langsung ambil sampai tutupnya '>'
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				
				// Logika kursor: hanya tampilkan jika belum selesai
				var cursor = (progress < str.length && (progress & 1)) ? '_' : '';
				
				$ele.html(str.substring(0, progress) + cursor);
				
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 65);
		});
		return this;
	};

    var audio = $('audio.song')[0];
    if (audio) {
        audio.play().catch(e => console.log("Audio block:", e));
    }

    $("#content").css("display", "flex");
 
    loop();

    $("#code").typewriter();

    var birthDate = new Date();
    birthDate.setFullYear(2006, 11, 6);
    birthDate.setHours(0, 0, 0, 0);
    
    setInterval(function () {
        timeElapse(birthDate);
    }, 1000);

    setTimeout(function() {
        startHeartAnimation();
    }, 33500);
}

$(document).ready(function() {
    $("#klik").on('click touchstart', function() {
        $("#klik").fadeOut(1000, function() {
            $(this).remove();
        });
        setTimeout(function() {
            startEverything();
        }, 1000);
    });
});


function adjustContentPosition() {
    var $content = $("#content");
    var top = ($window.height() - $content.height()) / 2;
    var left = ($window.width() - $content.width()) / 2;
    $content.css({
        "margin-top": Math.max(top, 10),
        "margin-left": Math.max(left, 10)
    });
}

function timeElapse(date){
    var current = new Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) hours = "0" + hours;
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) minutes = "0" + minutes;
    seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;
    var result =
		"<span class='digit'>" + days + "</span> <span class='label'>days</span> " +
		"<span class='digit'>" + hours + "</span> <span class='label'>hours</span> " +
		"<span class='digit'>" + minutes + "</span> <span class='label'>minutes</span> " +
		"<span class='digit'>" + seconds + "</span> <span class='label'>seconds</span> ";


    $("#elapseClock").html(result);
}

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    var interval = 65;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.15;
        }
    }, interval);
}

function showMessages() {
    $('#messages').css("opacity", 1);
    setTimeout(function() {
        $('#loveu').css("opacity", 1);
    }, 3000);
}