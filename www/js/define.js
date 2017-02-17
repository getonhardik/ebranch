/**
 * Define 类，对全局�?��?和常�?进行定义
 * 使用例如：
 * defines.
 */

(function (window) {

    var baseSite = 'http://pr.veba.co/~shubantech/ebranch',
		baseLang = 'default',
		appView = 'm',
		//baseUrl = baseSite + '/' +baseLang,	//这个�?�将废除，用baseApi�?�
		//baseApi = baseSite + '/' +baseLang,	//这是默认Api地�?�
		//baseWeb = baseSite + '/' +appView,
		baseUrl = baseSite ,	//这个�?�将废除，用baseApi�?�
		baseApi = baseSite ,	//这是默认Api地�?�
		baseWeb = baseSite + '/' +appView,
		
		cur_entity_id = '';	//当�?查看产�?id，�?�能没用，留�?�
	
    window.defines = {
		baseSite: baseSite,
		baseLang: baseLang,
        baseUrl: baseUrl,
        baseApi: baseApi,
		baseWeb: baseWeb,
        cur_entity_id: cur_entity_id,
        user: null,
        state: 'index',
        productsLimit: 50, // 产�?页�?次请求时�?�的商�?
		
        menus: [{
            name: 'Home',
            class_name: 'active',
            url: 'home.html'
        }, {
            name: 'Other Option',
            class_name: 'login_true table-view-divider',
            url: '#'
        },{
            name: 'My Account',
            url: 'detail.html?title=My Account&frameUrl=' + baseWeb + '/customer/account',
            class_name: 'login_true'
        }, {
            name: 'My Wishlist',
            url: 'detail.html?title=My Shopping Cart&frameUrl=' + baseWeb + '/checkout/cart/',
            class_name: 'login_true'
        },  {
            name: 'Logout',
            url: '#',
            class_name: 'login_true logout'
        },
        ],
        pages: [
            {
            id: 'home',
            cmd: 'daily_sale',
            title: 'Home',
            pullRefresh: true,
            num: 1,
            total: 0
        },{
            id: 'dailySale',
            cmd: 'daily_sale',
            title: 'Daily Sale',
            pullRefresh: true,
            num: 1,
            total: 0
        },
        {
            id: 'bestSeller',
            cmd: 'best_seller',
			title: 'New Arrival',	//使用新�?new arrival
            pullRefresh: true,
            num: 1,
            total: 0
        }
		/* �?��?new，而coming soon 因接�?�问题，�?�用
			{
            id: 'bestSeller',
            cmd: 'best_seller',
            title: 'Best Seller'
            pullRefresh: true,
            num: 1,
            total: 0
        }
		, {
            id: 'comingSoon',
            cmd: 'coming_soon',
            title: 'Coming Soon',
            pullRefresh: true,
            num: 1,
            total: 0
        }*/
		]
    };
	//此次定义为动�?价格实现，先�?处�?�
	window.opConfig = {};
	opConfig.reloadPrice = function ()	{
		};
		
})(window);