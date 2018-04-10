//validateForm
var ValidateForm = {
	input: null,
	error: function(err,sec,trd) {
		var Field = this.input.closest('.form__field'),
		ErrTip = Field.find('.form__error-tip');

		if (!err) {
			Field.removeClass('form__field_error');
		} else {
			Field.addClass('form__field_error');

			if (trd) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-third-error-text'));

			} else if (sec) {

				if (!ErrTip.attr('data-first-error-text')) {
					ErrTip.attr('data-first-error-text', ErrTip.html());
				}
				ErrTip.html(ErrTip.attr('data-second-error-text'));

			} else {

				if (ErrTip.attr('data-first-error-text')) {
					ErrTip.html(ErrTip.attr('data-first-error-text'));
				}

			}
		}

	},
	date: function() {
		var _ = this,
		err = false,
		validDate = function(val) {
			var _reg = new RegExp("^([0-9]{2}).([0-9]{2}).([0-9]{4})$"),
			matches = _reg.exec(val);
			if (!matches) {
				return false;
			}
			var now = new Date(),
			cDate = new Date(matches[3], (matches[2] - 1), matches[1]);
			return ((cDate.getMonth() == (matches[2] - 1)) && (cDate.getDate() == matches[1]) && (cDate.getFullYear() == matches[3]) && (cDate.valueOf() < now.valueOf()));
		};

		if (!validDate(_.input.val())) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	email: function() {
		var _ = this,
		err = false;
		if (!/^[a-z0-9]+[a-z0-9-\.]*@[a-z0-9-]{2,}\.[a-z]{2,6}$/i.test(_.input.val())) {
			_.error(true, true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	tel: function() {
		var _ = this,
		err = false;
		if (!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(_.input.val())) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	pass: function() {
		var _ = this,
		err = false,
		lng = _.input.attr('data-pass-length');

		if (_.input.val().length < 1) {
			_.error(true);
			err = true;
		} else if(lng && _.input.val().length < lng) {
			_.error(true, true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	select: function(inp) {
		var _ = this,
		err = false;
		_.input = inp;
		if (_.input.attr('data-required') && _.input.val().length < 1) {
			_.error(true);
			err = true;
		} else {
			_.error(false);
		}
		return err;
	},
	keyup: function(inp) {
		var _ = this;
		_.input = $(inp);
		var type = _.input.attr('data-type');
		if (_.input.hasClass('tested')) {
			_[type]();
		}
	},
	fUploaded: false,
	file: function(inp,e) {
		var _ = this;
		_.input = $(inp);
		var _imgBlock = _.input.closest('.form__field').find('.form__file-image'),
		file = e.target.files[0],
		fileName = file.name,
		fileSize = (file.size / 1024 / 1024).toFixed(2),
		ext = (function(fN){
			var nArr = fN.split('.');
			return nArr[nArr.length-1];
		})(fileName);

		if (_imgBlock.length) {
			if (!file.type.match('image.*')) {
				_.error(true);
				_.fUploaded = false;
			} else {
				var reader = new FileReader();
				reader.onload = function(e) {
					_imgBlock.html('<img src="'+ e.target.result +'">');
				};
				reader.readAsDataURL(file);
				_.error(false);
				_.fUploaded = true;
			}
		}
	},
	validate: function(form) {
		var _ = this,
		err = 0,
		_form = $(form);

		_form.find('.form__text-input, .form__textarea').each(function() {
			_.input = $(this);

			var type = _.input.attr('data-type'),
			hidden = _.input.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_.input.addClass('tested');

				if (_.input.attr('data-required') && _.input.val().length < 1) {
					_.error(true);
					err++;
				} else if (_.input.val().length > 0) {
					_.error(false);
					if (type && _[type]()) {
						err++;
					}
				} else {
					_.error(false);
				}

				if (type == 'pass' && _.pass()) {
					err++;
				}
			}

		});

		_form.find('.form__select-input').each(function() {
			var hidden = $(this).closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length && _.select($(this))) {
				err++;
			}
		});

		_form.find('.form__chbox-input').each(function() {
			var _inp = $(this),
			_chbox = _inp.closest('.form__chbox'),
			hidden = _inp.closest('.form__field_hidden, .form__fieldset_hidden');
			if (!hidden.length) {
				if(_inp.attr('data-required') && !_inp.prop('checked')){
					_chbox.addClass('form__chbox_error');
					err++;
				} else {
					_chbox.removeClass('form__chbox_error');
				}
			}
			
		});

		_form.find('.form__chbox-group').each(function() {
			var i = 0,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__chbox-input').each(function() {
					if ($(this).prop('checked')) {
						i++;
					}
				});

				if (i < _g.attr('data-min')) {
					_g.addClass('form__chbox-group_error');
					err++;
				} else {
					_g.removeClass('form__chbox-group_error');
				}
			}
		});

		_form.find('.form__radio-group').each(function() {
			var e = true,
			_g = $(this),
			hidden = _g.closest('.form__field_hidden, .form__fieldset_hidden');

			if (!hidden.length) {
				_g.find('.form__radio-input').each(function() {
					if ($(this).prop('checked')) {
						e = false;
					}
				});

				if (e) {
					_g.addClass('form__radio-group_error');
					err++;
				} else {
					_g.removeClass('form__radio-group_error');
				}
			}
		});

		if (_form.find('.form__file-input').length) {
			_.input = _form.find('.form__file-input');
			if (!_.fUploaded) {
				_.error(true);
				err++;
			} else {
				_.error(false);
			}
		}

		if (_form.find('.form__text-input[data-pass-compare]').length) {
			_form.find('.form__text-input[data-pass-compare]').each(function() {
				var gr = $(this).attr('data-pass-compare');
				_.input = _form.find('.form__text-input[data-pass-compare="'+ gr +'"]');
				if (!_.pass()) {
					if (_.input.eq(0).val() != _.input.eq(1).val()) {
						_.error(true, true, true);
					} else {
						_.error(false);
					}
				}
			});
		}

		if (!err) {
			_form.removeClass('form_error');
		} else {
			_form.addClass('form_error');
		}

		return !err;
	},
	step: function(el, fun) {
		if (this.validate(el)) {
			fun();
		}
	},
	submitButton: function(f, st) {
		var ValidateForm = $(f),
		Button = ValidateForm.find('button[type="submit"], input[type="submit"]');
		if (st) {
			Button.prop('disabled', false).removeClass('form__button_loading');
		} else {
			Button.prop('disabled', true).addClass('form__button_loading');
		}
	},
	clearForm: function(form, st) {
		var $form = $(form);
		if (st) {
			$form.find('.form__text-input, .form__textarea').val('');
			$form.find('.overlabel-apply').attr('style','');
			$form.find('.form__textarea-mirror').html('');
		}
	},
	submit: function(el, form) {
		var _ = this;
		$('body').on('change', '.form__file-input', function(e) {
			_.file(this, e);
		});
		$('body').on('keyup', '.form__text-input', function() {
			_.keyup(this);
		});
		$('body').on('submit', el, function() {
			var f = this;
			if (_.validate(f)) {
				_.submitButton(f, false);
				if (form !== undefined) {
					form(f, function(unlockBtn, clearForm) {
						_.submitButton(f, unlockBtn);
						_.clearForm(f, clearForm);
					});
				} else {
					return true;
				}
			}
			return false;
		});
	}
};