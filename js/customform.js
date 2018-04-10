//Form CustomSelect
var CustomSelect = {
	_el: null,
	_field: null,
	_options: null,
	init: function() {
		$('select').each(function() {
			var $select = $(this),
			options = $select.find('option'),
			$parent = $select.parent(),
			sel_val = '';

			for (var i = 0; i < options.length; i++) {
				var $option = $(options[i]);
				sel_val += '<li><button type="button" class="custom-select__val" data-value="'+ $option.val() +'">'+ $option.html() +'</button></li>';
			}

			$parent.html('<div class="custom-select"><button type="button" class="custom-select__button">Выбор</button><ul class="custom-select__options">'+ sel_val +'</ul><input type="hidden" name="'+ $select.attr('name') +'" class="custom-select__input" value=""></div>');
			$select.remove();
		});
	},
	getField: function(el) {
		var _ = this;
		_._el = $(el);
		_._field = _._el.closest('.custom-select');
		_._options = _._field.find('.custom-select__options');
	},
	change: function(state) {
		var _ = this;
		if (state) {
			if (!_._field.hasClass('custom-select_autocomplete')) {
				$('.custom-select').removeClass('custom-select_opened');
				$('.custom-select__options').slideUp(221);
			}
			_._field.addClass('custom-select_opened');
			_._options.slideDown(221);
		} else {
			_._field.removeClass('custom-select_opened');
			_._options.slideUp(221);
		}
	},
	open: function(el) {
		var _ = this;
		_.getField(el);
		if (!_._field.hasClass('custom-select_opened')) {
			_.change(1);
		} else {
			_.change(0);
		}
		return false;
	},
	select: function(el) {
		var _ = this;
		_.getField(el);
		var _f = _._field,
		_button = _f.find('.custom-select__button'),
		_srcInput = (_f.find('.custom-select__input_autocomplete').length) ? _f.find('.custom-select__input_autocomplete') : _f.find('.form__textarea_autocomplete'),
		_input = _f.find('.custom-select__input');
		

		if (_f.hasClass('custom-select_multiple')) {

			if (!_._el.hasClass('custom-select__val_checked')) {
				_._el.addClass('custom-select__val_checked');
			} else {
				_._el.removeClass('custom-select__val_checked');
			}

			var toButtonValue = [],
			toInputValue = [];

			_._options.find('.custom-select__val_checked').each(function(i) {
				var el = $(this);
				toButtonValue[i] = el.html();
				toInputValue[i] = el.attr('data-value');
			});

			if (toButtonValue.length) {
				_button.html(toButtonValue.join(', '));
				_input.val(toInputValue.join('+'));
			} else {
				_.change(0);
				_button.html('Множественный выбор');
				_input.val('');
			}

		} else {
			var toButtonValue = _._el.html(),
			toInputValue = _._el.attr('data-value');

			_.change(0);

			_button.html(toButtonValue);
			_srcInput.val(toButtonValue);
			_input.val(toInputValue);
		}

		if (_._el.attr('data-show-hidden')) {
			var opt = _._el.attr('data-show-hidden'),
			_$ = $(opt);

			if (_$.hasClass('form__field')) {
				_$.closest('.form__field-wrap').find('.form__field').addClass('form__field_hidden');
				_$.removeClass('form__field_hidden');
			} else if (_$.hasClass('form__fieldset')) {
				_$.closest('.form__fieldset-wrap').find('.form__fieldset').addClass('form__fieldset_hidden');
				_$.removeClass('form__fieldset_hidden');
			}
		}

		if (_srcInput.hasClass('form__textarea_var-h')) {
			setTextareaHeight(_srcInput);
		}

		_f.addClass('custom-select_changed')

		ValidateForm.select(_input);

		return false;
	},
	autocomplete: function(el) {
		var _ = this;
		_.getField(el);
		var inputValue = _._el.val(),
		opt = '', 
		match = false;

		if (_._el.attr('data-opt')) {
			opt = _._el.attr('data-opt');
		}

		if(inputValue.length > 0){

			/*if (opt == 'search-with-highlight') {

				var inpVal = inputValue,
				reg = new RegExp(inpVal, 'gi');

				console.log(reg);

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).attr('data-original');

					if(srcVal.match(_reg)){
						var newStr = srcVal.replace(reg, '<span>$&</span>');
						$(this).html(newStr);
						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});

			} else*/ if (opt == 'search-by-name') {

				var inpVal = inputValue,
				reg = new RegExp(inpVal, 'gi');

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).html();

					if(srcVal.match(reg)){

						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});


			} else if (opt == 'search-by-search-string') {
				var reg = function(str) {
					var str = str.trim(),
					reg = str.replace(/\s/g,'|%');
					return '%'+reg;
				}(inputValue);

				var wordsCount = reg.split('|').length,
				_reg = new RegExp(reg, 'gi');

				_._options.find('.custom-select__val').each(function() {

					var srcVal = $(this).attr('data-search');

					if(srcVal.match(_reg) && srcVal.match(_reg).length >= wordsCount){
						$(this).parent().removeClass('hidden');
						match = true;
					} else {
						$(this).parent().addClass('hidden');
					}

				});
			}

			if (match) {
				_.change(1);
			} else {
				_.change(0);
			}

		} else {
			_.change(0);
		}
	}
};


$(document).ready(function() {

	CustomSelect.init();

	$('body').on('click', '.custom-select__button', function() { 
		CustomSelect.open(this); 
	});

	$('body').on('keyup', '.custom-select__input_autocomplete, .form__textarea_autocomplete', function() { 
		CustomSelect.autocomplete(this); 
	});

	$('body').on('click', '.custom-select__val', function() { 
		CustomSelect.select(this);
	});

	$(document).on('click', 'body', function(e) {
		if (!$(e.target).closest('.custom-select_opened').length) {
			$('.custom-select').removeClass('custom-select_opened');
			$('.custom-select__options').slideUp(221);
		}
	});

});