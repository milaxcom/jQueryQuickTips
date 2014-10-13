/**
 * jQueryQuickTips v1.0
 *
 * Copyright 2013 Milax
 * http://www.milax.com/
 *
 * Author
 * Maksim Gusakov
 */

var QuickTips = function ($objects, option) {

	$objects 		= $objects || false;
	option 			= option || {};
	objectTypeof 	= typeof $objects;

	switch (objectTypeof) {

		case 'object': 
			$objects.on("mouseenter.quicktips", function () {
				QuickTips.show.call( this, option );
			} );
		
		break

		case 'string': 
			$(document).on("mouseenter.quicktips", $objects, function () {
				QuickTips.show.call( this, option );
			} );
		
		break

		default: 
			QuickTips(".quick-tips");

	}

};

QuickTips.defaultOptions = {
	"color" 				: "#eeeeee",
	"background-color"		: "#000000",
	"text-align"			: "center",
	"font-size"				: "12px",
	"background-opacity"	: 0.7,
	"padding"				: "5px",
	"space" 				: 2,
	"width"					: 140,
	"content-from" 			: "attr",
	"check-frame" 			: true,
	"duration" 				: 60,
	before					: function () {},
	after 					: function () {},
	hide 					: function () {}
};

QuickTips.style 		= function ( option ) {
	
	var style 		= {
		"element" 	: {
			"z-index"				: 999999999,
			"position"				: "absolute",
			"width"					: option["width"]
		},
		"box"					: {
			"width"					: "100%",
			"overflow"				: "hidden",
			"border-radius"			: "4px",
			"position"				: "relative",
			"z-index"				: 4,
			"text-align"			: "center",
			"box-shadow" 			: "0px 4px 10px 0px rgba(0, 0, 0, 0.5)"
		},
		"content" 				: {
			"text-align"			: option["text-align"],
			"margin"				: "0 auto",
			"position"				: "relative",
			"z-index"				: 3,
			"font-size"				: option["font-size"],
			"color"					: option["color"],
			"padding"				: option["padding"]
		},
		"bg"					: {
			"position"				: "absolute",
			"z-index"				: 2,
			"top"					: 0,
			"left"					: 0,
			"width"					: "100%",
			"height"				: "999px",
			"background-color" 		: option["background-color"],
			"opacity"				: option["background-opacity"]
		},
		"arrow"					: {
			"position"				: "absolute",
			"width"					: "11px", // размер с преувеличением из-за rotate
			"height"				: "4px",
			"margin-left"			: "-3px",
			"overflow"				: "hidden"
		},
		"arrow-in" 				: {
			"position"				: "absolute",
			"top"					: "2px", // смещение из-за rotate
			"left"					: "2px", // смещение из-за rotate
			"width"					: "10px",
			"height"				: "10px",
			"background-color" 		: option["background-color"],
			"opacity"				: option["background-opacity"],
			"transform"				: "rotate(45deg)"
		}
	};

	return style;

};

QuickTips.show = function ( option ) {

	/* Подготавливаем опции */
	option 				= QuickTips.read.call( this, option );

	/* Удаляем со страницы сообщения, если они есть */
	$(".quick-tips-window").remove();

	/* Получаем готовый jquery-объект элемента */
	tips 				= QuickTips.build.call( this, option );
	$("body").prepend( tips.$element );

	/* Позиционируем */
	tips 				= QuickTips.position.call( this, tips );

	tips.option.before.call( tips.$element, tips );

	tips.$element.css({
		"top" 			: "+=6",
		"opacity"		: 0
	}).animate({"top" : "-=6", "opacity" : 1}, tips.option.duration, function () {
		tips.option.after.call( tips.$element, tips );
	});

	/* Событие на скрытие */
	QuickTips.hideOnLeave = $(this).on("mouseleave.quicktips", function ( ) {
		var $mlElement = $(this);
		tips.$element.animate({"top" : "+=6", "opacity" : 0}, tips.option.duration, function () {
			$mlElement.off( "mouseleave.quicktips" );
			$(this).remove();
			tips.option.hide();
		});
	});

};

QuickTips.build = function ( option ) {

	var tips = {};

	var styles = QuickTips.style( option );

	tips.$element 		= $('<div class="quick-tips-window"><div class="quick-tips-window-arrow"><div></div></div><div class="quick-tips-window-content-box"><div class="quick-tips-window-content"></div><div class="quick-tips-window-bg"></div></div></div>').css( styles["element"] );
	tips.$arrow 		= $(".quick-tips-window-arrow", tips.$element).css( styles["arrow"] );
	tips.$arrowIn 		= $("div", tips.$arrow).css( styles["arrow-in"] );
	tips.$box 			= $(".quick-tips-window-content-box", tips.$element).css( styles["box"] );
	tips.$content 		= $(".quick-tips-window-content", tips.$box).css( styles["content"] );
	tips.$bg 			= $(".quick-tips-window-bg", tips.$box).css( styles["bg"] );

	tips.option 		= option;

	tips.$content.prepend( tips.option.content );

	return tips;

};

QuickTips.position = function ( tips ) {

	/* Позиция и размеры элемента-источника */
	tips.ps 			= {};
	/* Позиция и размеры окна-сообщения */
	tips.pt 			= {};
	/* Позиция стрелки */
	tips.pa 			= {};

	var offset 			= $(this).offset();
	tips.ps.top 		= offset.top;
	tips.ps.left 		= offset.left;
	tips.ps.width 		= $(this).outerWidth();
	tips.ps.height 		= $(this).outerHeight();

	tips.pt.width 		= tips.option.width;
	//tips.pt.height 	= tips.$element.outerHeight();
	tips.pt.top 		= tips.ps.top + tips.ps.height + tips.option.space;

	tips 				= QuickTips.position.leftAndArrow( tips );

	tips.$element.css({
		"left"			: tips.pt.left,
		"top"			: tips.pt.top
	});

	tips.$arrow.css({
		"left"			: tips.pa.left,
		"top"			: tips.pa.top
	});

	return tips;

};

	QuickTips.position.leftAndArrow = function ( tips ) {

		var arrow = {
			width 					: 8,
			height 					: 4,
			fromCorner 				: 6
		};

		/* Увеличиваем отступ от верха на величину стрелки */
		tips.pt.top 		= tips.pt.top + arrow.height;

		/* Сдвигаем стрелку */
		tips.pa.top 		= (-1) * arrow.height;

		/* Если tips из центра  */
		tips.pt.left 		= tips.ps.left + Math.round( tips.ps.width / 2 ) - Math.round( tips.pt.width / 2 );
		tips.pa.left 		= Math.round( tips.pt.width / 2 ) - Math.round( arrow.width / 2 );

		/* Если установлена проверка на границы страницы HTML */
		if ( tips.option["check-frame"] ) {

			var screenWidth 	= $(document).width();

			/* Выравнивание по левому краю */
			if ( tips.pt.left < 0 ) {
				tips.pt.left 		= tips.ps.left;
				tips.pa.left 		= arrow.fromCorner;
			}

			/* По правому краю */
			if ( (tips.pt.left + tips.pt.width) > screenWidth ) {
				tips.pt.left 		= tips.ps.left + tips.ps.width - tips.pt.width;
				tips.pa.left 		= tips.pt.width - arrow.width - arrow.fromCorner;
			}
		}

		return tips;

	};


/* Получаем готовый список опций */
QuickTips.read = function ( option ) {

	var fromel 			= {};
	var attr 			= "";

	/* Перебор атрибутов */
	for( var key in QuickTips.defaultOptions ) {
		attr = $(this).attr( "quick-tips-" + key );
		if ( typeof attr != "undefined" ) {
			if ( typeof QuickTips.defaultOptions[key] == "function" )
				fromel[ key ] = window[attr];
			else
				fromel[ key ] = attr;
		}
	}

	/* Создаем готовый объект */
	option 				= $.extend( {}, QuickTips.defaultOptions, option, fromel );

	/* Получаем контент */
	switch ( option["content-from"] ) {
		case "html":
			option["content"] = $(this).html();
		break
		default:
			option["content"] = $(this).attr( "quick-tips" );
	}

	return option;

};

$( QuickTips );

/* END */