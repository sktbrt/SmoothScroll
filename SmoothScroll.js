(function($) {
	'use strict';
	var SmoothScroll = function() {
		this.overlapMenuWithBox = false;
		this.scrollSpeed = 500;
		this.menuSelector = 'header';
		this.menuItemSelector = '.g_nav a[href^="#"]';
		this.classNameForCurrentMenu = 'current';
		this.menuItems = $('.g_nav a[href^="#"]');
		this.menuList = {};
		this.menuArea = {};
		this.currentMenu = {};
		this.visibilityArea = {};
		this.options = {
			scrollstart: function(){},
			scrollEnd: function(){},
		};
		this.scrollTarget = this.getScrollTarget();
		this.init();
	};
	var SmtProp = SmoothScroll.prototype;
	SmtProp.init = function() {
		this.initMenuListAndBox();
		this.initClickMenuAction();
		this.initIntervalAction();
	};
	SmtProp.getScrollTarget = function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0) { //IE
			return 'html';
		}else if(ua.indexOf('webkit/') > 0) { // Safari, Chrome系
			return 'body';
		}else if(ua.indexOf('gecko/') > 0) {  // Firefox系
			return 'html';
		}else if(ua.indexOf('Presto/') > 0) { // Opera系
			return 'body';
		}
		return 'body';
	};
	SmtProp.initMenuListAndBox = function() {
		var _this = this;
		_this.menuItems.each(function() {
			var key = $(this).attr('href');
			if(key === '#') return true;
			if(!_this.menuList[key]) _this.menuList[key] = {menu: [], box: null};
			_this.menuList[key]['menu'].push($(this));
			_this.menuList[key]['box'] = _this.menuList[key]['box'] || $(key)[0] || null;
		});
	};
	SmtProp.initClickMenuAction = function() {
		var _this = this;
		var smoothScrolling = function() {
			var boxId = $(this).attr('href');
			if(!_this.menuList[boxId]['box']) return false;
			var toScrollLine =  _this.getScrollLine(boxId);
			$(_this.scrollTarget).animate({scrollTop: toScrollLine}, _this.scrollSpeed, 'swing', _this.options.scrollEnd);
			_this.setClassToCurrentMenu(_this.menuList[boxId]['menu']);
			return false;
		};
		$(_this.menuItemSelector).on('click', smoothScrolling);
	};
	SmtProp.initIntervalAction = function() {
		var _this = this;
		var action = function() {
			_this.intervalActionForsetMenuArea();
		};
		action();
		setInterval(action, 300);
	};
	SmtProp.intervalActionForsetMenuArea = function() {
		if(!$(this.scrollTarget).is(':animated')) {
			this.setMenuArea();
			this.setVisibilityArea();
			this.intervalActionForCurrentMenu();
		}
	};
	SmtProp.intervalActionForCurrentMenu = function() {
		var _this = this;
		var _currentMenu = '';
		$.each(_this.menuList, function() {
			var boxId = '#' + this['box'].id;
			var scrollLine = _this.getScrollLine(boxId);
			var visibilityLine = Math.ceil(_this.visibilityArea.y);
			if(scrollLine <= visibilityLine) _currentMenu = this;
		});
		if(_this.currentMenu === _currentMenu) return false;
		_this.currentMenu = _currentMenu;
		_this.setClassToCurrentMenu(_currentMenu['menu']);
	};
	SmtProp.getScrollLine = function(boxId) {
		var _this = this;
		var boxTopLine = $(_this.menuList[boxId]['box']).offset().top;
		var toScrollLine;
		if(_this.overlapMenuWithBox) {
			toScrollLine = boxTopLine;
		} else {
			toScrollLine = boxTopLine -  _this.menuArea.height;
		}
		return Math.floor(toScrollLine);
	};
	SmtProp.setClassToCurrentMenu = function(currentMenuItems) {
		var _this = this;
		$(_this.menuItems).removeClass(_this.classNameForCurrentMenu);
		$.each(currentMenuItems, function() {
			$(this).addClass(_this.classNameForCurrentMenu);
		});
	};
	SmtProp.setMenuArea = function() {
		var _this = this;
		var element = $(_this.menuSelector)
		_this.menuArea = {
			height: Math.ceil(element.outerHeight()),
			width: Math.ceil(element.outerWidth()),
			y: Math.ceil(element.scrollTop()),
			x: Math.ceil(element.scrollLeft()) 
		};
	};
	SmtProp.setVisibilityArea = function() {
		var _this = this;
		var element = $(window);
		_this.visibilityArea = {
			height: Math.ceil(element.height()),
			width: Math.ceil(element.width()),
			y: Math.ceil(element.scrollTop()),
			x: Math.ceil(element.scrollLeft()) 
		};
	};
	window.SmoothScroll = SmoothScroll;
})(jQuery);