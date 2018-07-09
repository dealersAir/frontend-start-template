var FsScroll;

(function() {
	"use strict";

	FsScroll = {
		options: null,
		contElem: null,
		scrolling: false,
		delta: 0,

		current: function() {
			var midWinScrollTop = window.pageYOffset + window.innerHeight / 2,
			screenElements = this.contElem.querySelectorAll(this.options.screen);

			for (var i = 0; i < screenElements.length; i++) {
				screenElements[i].classList.remove('fsscroll__screen_current');
			}

			for (var i = 0; i < screenElements.length; i++) {
				var screenOffsetTop = screenElements[i].getBoundingClientRect().top + window.pageYOffset;

				if (screenOffsetTop <= midWinScrollTop && (screenOffsetTop + screenElements[i].offsetHeight) >= midWinScrollTop) {

					screenElements[i].classList.add('fsscroll__screen_current');
				}
			}
		},

		scroll: function(scrollTo, scroll) {
			console.log(this.delta);
			this.scrolling = true;
			
			var scrollTopStart = window.pageYOffset,
			duration = this.options.duration || 1000,
			easing = 'easeInOutQuad';

			if (scroll) {
				duration = 500;
				easing = 'easeInOutQuad';
			}

			animate(function(progress) {
				window.scrollTo(0, ((scrollTo * progress) + ((1 - progress) * scrollTopStart)));
			}, duration, easing, () => {
				setTimeout(() => {
					this.current();

					this.scrolling = false;
					this.delta = 0;
				}, 321);
			});
		},

		mouseScroll: function(delta) {
			var currentScreenElem = this.contElem.querySelector('.fsscroll__screen_current'),
			winScrollBottom = window.pageYOffset + window.innerHeight;

			if (delta > 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.nextElementSibling : null;

				if (currentScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_last')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((window.pageYOffset + 21) < currentScreenOffsetTop) {
							this.scroll(currentScreenOffsetTop);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && (winScrollBottom > nextScreenOffsetTop)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;

						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			} else if (delta < 0) {
				var nextScreenElem = (currentScreenElem) ? currentScreenElem.previousElementSibling : null;

				if (nextScreenElem && ((currentScreenElem.offsetHeight - 21) < window.innerHeight) && !currentScreenElem.classList.contains('fsscroll__screen_first')) {
					if (!this.scrolling) {
						var currentScreenOffsetTop = currentScreenElem.getBoundingClientRect().top + window.pageYOffset;

						if ((winScrollBottom - 21) > (currentScreenOffsetTop + currentScreenElem.offsetHeight)) {
							this.scroll(currentScreenOffsetTop + currentScreenElem.offsetHeight - window.innerHeight);
						} else {
							this.scroll(nextScreenElem.getBoundingClientRect().top + window.pageYOffset + nextScreenElem.offsetHeight - window.innerHeight);
						}
					}
				} else {
					var nextScreenOffsetTop = (nextScreenElem) ? nextScreenElem.getBoundingClientRect().top + window.pageYOffset : undefined;

					if (nextScreenElem && ((nextScreenOffsetTop + nextScreenElem.offsetHeight) > window.pageYOffset)) {
						if (!this.scrolling) {
							this.scroll(nextScreenOffsetTop);
						}
					} else {
						this.delta += delta / 3;
						this.scroll(window.pageYOffset + this.delta, true);
					}
				}
			}
		},

		init: function(options) {
			var contElem = document.querySelector(options.container);

			if (!contElem) {
				return;
			}

			this.options = options;
			this.contElem = contElem;

			var screenElements = contElem.querySelectorAll(options.screen);

			screenElements[0].classList.add('fsscroll__screen_first');
			screenElements[0].classList.add('fsscroll__screen_current');
			screenElements[screenElements.length - 1].classList.add('fsscroll__screen_last');

			if ('onwheel' in document) {
				document.addEventListener('wheel', (e) => {
					e.preventDefault();

					this.mouseScroll(e.deltaY);
				});
			}
			
			window.addEventListener('scroll', () => {
				if (!this.scrolling) {
					this.current();
				}
			});
		}
	};
}());



/*
var FsScroll = {
	winH: null,
	scrolling: false,
	factor: 0,
	scrChangedEv: null,
	beforeScrChangeEv: null,

	init: function() {
		var _ = this;
		_.winH =  window.innerHeight;

		$('.fsscroll__screen').removeClass('fsscroll__screen_scroll').css('height', 'auto');

		$('.fsscroll__screen').each(function() {
			var _item = $(this),
			itemH = _item.innerHeight();
			if (itemH <= _.winH) {
				_item.css('height', _.winH);
			} else {
				_item.addClass('fsscroll__screen_scroll');
			}
		});
		
		$('.fsscroll__screen').first().addClass('fsscroll__screen_first fsscroll__screen_current');
		$('.fsscroll__screen').last().addClass('fsscroll__screen_last');

		setTimeout(function() {
			_.current();
		}, 21);

		$(window).scroll(function() {
			if (!_.scrolling) {
				_.current();
			}
		});

		_.scrChangedEv = new CustomEvent('scrChanged');
		_.beforeScrChangeEv = new CustomEvent('beforeScrChange');

	},

	current: function() {
		var _ = this,
		midWinScrollTop = $(window).scrollTop() + _.winH / 2;

		$('.fsscroll__screen').removeClass('fsscroll__screen_current');

		$('.fsscroll__screen').each(function() {
			var $item = $(this),
			itemOfsTop = $item.offset().top,
			itemH = $item.innerHeight();

			if (itemOfsTop <= midWinScrollTop && (itemOfsTop + itemH) >= midWinScrollTop) {
				$item.addClass('fsscroll__screen_current');
				window.dispatchEvent(_.scrChangedEv);
			}

		});

	},
	
	move: function(moveTo, scroll) {
		var _ = this,
		duration = 1500,
		easing = 'easeInOutCubic';

		_.scrolling = true;

		if (scroll) {
			duration = 900;
			easing = 'easeInOutCubic';
		}

		window.dispatchEvent(_.beforeScrChangeEv);

		$('body, html').stop().animate({scrollTop: moveTo}, duration, easing, function() {
			setTimeout(function() {
				_.current();
				_.scrolling = false;
				_.factor = 0;
			}, 21);
		});
	},

	mouseScroll: function(delta, factor, fun) {
		var _ = this,
		$curScr = $('.fsscroll__screen_current'),
		winScrollTop = $(window).scrollTop(),
		winScrollBottom = winScrollTop + _.winH,
		$nextScr;

		if (delta < 0) {
			$nextScr = $curScr.next('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_last')) {
				if (!_.scrolling) {
					if ((winScrollTop + 21) < $curScr.offset().top) {
						_.move($curScr.offset().top);
					} else {
						_.move($nextScr.offset().top);
					}
				}
			} else {
				if ($nextScr.length && winScrollBottom > $nextScr.offset().top) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop + _.factor, true);
				}
			}
			
		} else if (delta > 0) {

			$nextScr = $curScr.prev('.fsscroll__screen');

			if ($curScr.length && !$curScr.hasClass('fsscroll__screen_scroll') && !$curScr.hasClass('fsscroll__screen_first')) {
				if (!_.scrolling) {
					if ((winScrollBottom - 21) > ($curScr.offset().top + $curScr.innerHeight())) {
						_.move($curScr.offset().top + $curScr.innerHeight() - _.winH);
					} else {
						_.move($nextScr.offset().top + $nextScr.innerHeight() - _.winH);
					}
				}
			} else {
				if ($nextScr.length && ($nextScr.offset().top + $nextScr.innerHeight()) > winScrollTop) {
					if (!_.scrolling) {
						_.move($nextScr.offset().top);
					}
				} else {
					_.factor = _.factor + factor / 2;
					_.move(winScrollTop - _.factor, true);
				}
			}
		}
		
	}

};


$(document).ready(function() {

	if ($('.fsscroll').length) {
		$('.fsscroll').attr('id', 'js-fsscroll');

		(function initFsS() {

			if (window.innerWidth > 1030) {

				FsScroll.init();

				$('#js-fsscroll').on('mousewheel', function(e) {
					e.preventDefault ? e.preventDefault() : (e.returnValue = false);
					FsScroll.mouseScroll(e.deltaY, e.deltaFactor);
				});

			} else {

				$('#js-fsscroll').off('mousewheel');

				if (window.innerWidth > 1000) {

					FsScroll.init();

					$('.wrapper_fsscroll').swipe({
						swipe: function(e, direct, factor) {
							var delta;
							switch (direct) {
								case 'down': delta = 1;
								break;
								case 'up': delta = -1;
								break;
								default: delta = 0;
								break;
							}

							FsScroll.mouseScroll(delta, factor);

						},
						allowPageScroll: 'none',
						excludedElements: '',
						threshold: 21,
					});

				}

			}

			$(window).on('winResized', initFsS);

		})();

	}

});*/