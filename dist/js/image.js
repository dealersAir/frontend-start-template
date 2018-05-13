function flexImg() {
	$('.flex-img').each(function() {
		var Img = $(this),
		data = Img.attr('data-images'),
		images,
		newImg;

		if (data) {
			images = data.split(',');

			for (var i = 0; i < images.length; i++) {
				var imgSpl = images[i].split(':');

				if (winW < imgSpl[0]) {
					if (imgSpl[1] == 'http' || imgSpl[1] == 'https') {
						newImg = imgSpl[1]+ ':'+ imgSpl[2];
					} else {
						newImg = imgSpl[1];
					}
				}

			}

		}

		if (newImg) {
			Img.attr('src', newImg);
		}
		
	});
}

function coverImg(cnt) {

	var cnt = (cnt) ? cnt +' ' : '';
	
	$(cnt +'.cover-img, '+ cnt +'.cover-img-wrap').each(function() {

		var _$ = $(this);

		if (_$.hasClass('cover-img-wrap')) {
			var Img = _$.find('img'),
			Block = _$;
			Img.addClass('cover-img');
		} else if (_$.hasClass('cover-img')) {
			var Img = _$,
			Block = Img.parent();
			Block.addClass('cover-img-wrap');
		}

		Img.removeClass('cover-img_w cover-img_h').css({marginTop: '', marginLeft: ''});

		var imgProp = Img.width()/Img.height(),
		blockProp = Block.width()/Block.height();

		if (blockProp != Infinity && blockProp < 21) {
			if (imgProp <= blockProp) {
				var marg = Math.round(-(Block.width()/imgProp-Block.height())/2);
				Img.addClass('cover-img_w').css('margin-top', marg);
			} else {
				var marg = Math.round(-(Block.height()*imgProp-Block.width())/2);
				Img.addClass('cover-img_h').css('margin-left', marg);
			}
		} else {
			Img.addClass('cover-img_w');
		}

	});
}