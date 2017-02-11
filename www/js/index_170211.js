function ready() {
    var currentPage = 0, // å½“å‰?åˆ‡æ?¢é¡µé?¢ index
        bannerSwiper,
        $pages,
        menuTpl = $('#menu-template').html(),
        slideTpl = $('#slide-template').html(),
        itemTpl = $('#item-template').html();

    function init() {
        checkFirstTime();
        initEvents();
        initMenus();
    }

    // èŽ·å?–è?œå?•ä¿¡æ?¯
    function initMenus() {
        servers.getMenus(function (menus) {
            showMenus(menus);
            showPages(menus);
            initPages();
            initUser();
            Mobilebone.init();
        });
    }

    // èŽ·å?–ç”¨æˆ·
    function initUser() {
        servers.getUser(function (user) {
            defines.user = user;

            var $menus = $('.cbp-spmenu');

            if (defines.user) {
                $menus.find('.login_true').show();
                $menus.find('.login_false').hide();
				if (defines.user.avatar) {
					$menus.find('.userinfo img').attr('src', defines.baseSite +
						'/media/customer' + defines.user.avatar);
					}
                $menus.find('.userinfo span').text(defines.user.name);
            } else {
                $menus.find('.login_true').hide();
                $menus.find('.login_false').show();
            }
        });
    }

    // ç”¨æˆ·ç”¨æˆ·çŠ¶æ€?æ˜¾ç¤ºè?œå?•
    function showMenus(menus) {
		//è®¾ç½®cartçš„webæŒ‡å?‘
		$('#cartIcon').attr ('href','detail.html?title=My Shopping Cart&frameUrl=' + defines.baseWeb +'/checkout/cart/');
        $.each(menus, function (i, item) {
            item.url = '#c' + item.category_id;
        });
        // æ?’å…¥æ•°æ?®åˆ° menus ä¸­ï¼Œä»Žä½?ç½® 1 å¼€å§‹
        defines.menus.splice.apply(defines.menus, [1, 0].concat(menus));

        $('.cbp-spmenu-list').html(Handlebars.compile(menuTpl)({
            menus: defines.menus
        }));

        // è?œå?•é¡¹ç‚¹å‡»
        $(document).on('click', '.cbp-spmenu a', function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            // é€€å‡º
            if ($(this).parent().hasClass('exit')) {
                if (confirm('Are you sure to exit the Kikuu app?')) {
                    navigator.app.exitApp();
                }
            } else {
                toggleMenu();
                $('.menu-bottom').hide();
            }
        });

        // logout
        $(document).on('click', '.logout', function () {
            removeStorage("user_id");
            servers.logout(initUser);
        });
    }

    // æ ¹æ?® page é…?ç½®æž„é€  banner å’Œ åˆ‡æ?¢é¡µé?¢
    function showPages(res) {
        $.each(res, function (i, item) {
            defines.pages.push({
                id: 'c' + item.category_id,
                cmd: 'catalog&categoryid=' + item.category_id,
                title: item.name,
                pullRefresh: true,
                num: 1,
                total: 0
            });
        });
        $.each(defines.pages, function (i, page) {
            $('.swiper-container .swiper-wrapper').append(sprintf(
                '<a href="#%s" data-rel="auto" class="swiper-slide bullet-item">%s</a>',
                page.id, page.title));
        });
        bannerSwiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            centeredSlides: true,
            parallax: true
        });

        $pages = $('#pageScroller').html(Handlebars.compile(slideTpl)({
            menus: defines.pages
        })).find('.products-grid');
    }

    function initPages() {
        initPageScroll({
            pages: defines.pages,
            onRefresh: function (callback) {
                initItems($('.products-grid').eq(currentPage), 'html', callback);
            },
            onLoadMore: function (callback) {
                initItems($('.products-grid').eq(currentPage), 'append', callback);
            },
            onLeft: function (id, index) {
                if (index === 0) {
                    toggleMenu();
                } else {
                    Mobilebone.transition($('#' + defines.pages[index - 1].id)[0], $('#' + id)[0], true);
                }
            },
            onRight: function (id, index) {
                if (index + 1 < defines.pages.length) {
                    Mobilebone.transition($('#' + defines.pages[index + 1].id)[0], $('#' + id)[0], false);
                }
            }
        });
    }

    // å?•ä¸ªäº§å“?åˆ—è¡¨å¤„ç?†
    function initItems($el, func, callback) {
        var page = defines.pages[$el.parents('.page').index()],
            $page = $('#' + page.id),
            items = [];

        page.num = func === 'html' ? 1 : page.num + 1;

        servers.getProducts(page, function (list) {
            if ($.isArray(list)) {
                handleItems($el, func, list);
                $('img.lazy').slice(page.total).lazyload({
                    container: $page.find('.scroller'),
                    placeholder: 'images/loading.gif',
                    threshold : 200	//ç¦»åƒ?ç´ è¿˜æœ‰200pxæ—¶åŠ è½½
                });
                page.total = func === 'html' ? 0 : page.total + list.length;
            } else {
                $page.data('pullUp', $page.find('.pullUp').remove());
            }
            $page.data('scroll').refresh();
            if (callback) {
                callback();
            }
        });
    }

    function handleItems($el, func, list) {
        // å¤„ç?†è¿”å›žæ•°æ?®
        var items = $.map(list, function (item) {
            var fromDate = new Date(moment(item.special_from_date, 'YYYY-MM-DD HH:mm:ss')),
                toDate = new Date(moment(item.special_to_date, 'YYYY-MM-DD HH:mm:ss')),
                date = new Date();
            //if (+fromDate <= +date && +date <= +toDate) {
                item.price_percent = ~~(-100 * (item.regular_price_with_tax -
                    item.final_price_with_tax) / item.regular_price_with_tax);
                item.price_percent_class = '';
            //} else {
				if (item.final_price_with_tax == item.regular_price_with_tax)
	                item.price_percent_class = 'none';              
            //}
            item.final_price_with_tax = parseFloat(item.final_price_with_tax).toFixed(0);
            item.regular_price_with_tax = parseFloat(item.regular_price_with_tax).toFixed(0);
            return item;
        });
        $el[func](Handlebars.compile(itemTpl)({
            items: items,
			baseWeb: defines.baseWeb
        }));
        var $cb = $el.find('.cb');
        $cb = $cb.length ? $cb : $('<div class="cb"></div>');
        $el.append($cb);
    }

    // ç»Ÿä¸€å¤„ç?†é¡µé?¢è·³è½¬ç›¸å…³
    Mobilebone.callback = function (pageInto) {
       
        var $this = $(pageInto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out'),
            $page,
            query = utils.queryUrl();

        defines.state = $this.attr('class').match(/page-(\w+)/)[1];

	    // indexé¡µ
        if ($this.hasClass('page-index')) {
			initUser();	//æœ‰æ—¶åœ¨webä¸Šç™»å½•äº†ï¼Œå°±è¦?å†?çœ‹ä¸€ä¸‹menuä¸­è?œå?•çš„å?˜åŒ–æƒ…å†µï¼Œè¿™æ ·menuä¸­ä¸?ä¼šçª?ç„¶å?˜åŒ–
            currentPage = $this.index();
            bannerSwiper.slideTo(currentPage);
            $headerIndex.removeClass('out');
            $frame.removeClass('out');
            $(sprintf('a[href="#%s"', $this.attr('id'))).addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');

            $page = $pages.eq(currentPage);
            if (!$page.data('init')) {
                $('.page-loading').show();
                initItems($page, 'html', function () {
                    $('.page-loading').hide();
                });
                $page.data('init', true);
            }
            $this.data('scroll').refresh(); // åˆ·æ–° scroll
            return;
        }

        // loginé¡µ
        if ($this.hasClass('page-login')) {		
            //$this.find('[id="forgot_pass_link"]').attr('href',defines.baseWeb + '/customer/account/forgotpassword/');		
            $this.find('[name="login"]').off('click').click(function () {
                var username = $this.find('[name="username"]').val(),
                    password = $this.find('[name="password"]').val();

                servers.login(username, password, function (res) {
                    if (res) {
                         setStorage("user_id", res.id);
                        setStorage("user_name", res.name);
                        setStorage("user_email", res.email);
                        history.back();
                        //initUser(); æ”¹åœ¨ into indexé‡Œå¤„ç?†äº†
                    } else {
                        alert('Username or password error!');
                    }
                });
            });
        }
        // forgot passwordé¡µ
        if ($this.hasClass('page-forgot-password')) {			
			$this.find('[id="user_forgotpassword_form"]').attr('action',defines.baseWeb+'/customer/account/forgotpasswordpost/');
        }
		

	    // detailé¡µï¼Œproduct-frameé¡µå¤„ç?†
        if ($this.hasClass('page-detail')) {
            if (query.title == 'Register') {
				//$this.find('.detail-back').attr('href', '#');
				}
			else {
				//$this.find('.detail-back').attr('href', '');
				}
            if (query.frameUrl) {
				if (query.entity_id) {
					query.frameUrl = query.frameUrl + '?entity_id=' + query.entity_id;
				}
                $this.find('iframe').attr('src', query.frameUrl);
            }
            if (query.title) {
                $this.find('.title').text(query.title);
            }
            if (query.share) {
                $this.find('.share').show();
            }
            return;
        }

        // search
        if ($this.hasClass('page-search')) {
            $this.find('[name="q"]').off('keyup').keyup(function () {
                $this.find('[name="search"]').attr('href', 'searchResult.html?q=' + $(this).val());
            });
            return;
        }

        // search result
        if ($this.hasClass('page-search-result')) {
            servers.getProductsSearch(query.q, function (list) {
                handleItems($this.find('.products-grid'), 'html', list);
                $('img.lazy').lazyload({
                    container: $this.find('.content'),
                    placeholder: 'images/loading.gif',
                    threshold : 200	//ç¦»åƒ?ç´ è¿˜æœ‰200pxæ—¶åŠ è½½
                });
            });
        }
        return;
    };

    init();

    // å…¨å±€å‡½æ•°
    window.initUser = initUser;
}

$(document).ready(ready);