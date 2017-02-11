/**
 * Server 类，对 rest 接�?�进行�?装
 * 使用例如：
 * servers.getUser(function () {
 *
 * });
 */
document.addEventListener("deviceready", onDeviceReady, true);

function onDeviceReady() {
    setTimeout(function () {
        navigator.splashscreen.hide();
    }, 3000);

    //setStorage('device_id', 'e3kI:APA91bGNX6z6xWj6P3mD-bBsUsxqtR87Lxzmvssb6DiZ4lhmuQpF_Zkp10g5GPKD5Lam-iR7Gi_ZF75mH-siTeDxxkW6_yIdNOtu9E6A1_s7tQ90e4YovY5RxPgsOOafnLW9BjDii5yi');
    //setStorage('device_platform', 'Android');
    if (!empty(krms_config.pushNotificationSenderid)) {
        console.log("sender id :" + krms_config.pushNotificationSenderid);
        var push = PushNotification.init({
            "android": {
                "senderID": krms_config.pushNotificationSenderid
            },
            "ios": {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            },
            "windows": {}
        });
        push.on('registration', function (data) {
            console.log("registration:" + data);
            var oldDeviceId = getStorage('device_id');
            setStorage("device_id", data.registrationId);
            setStorage("device_platform", device.platform);
            var params = "device_id=" + data.registrationId;
            params += "&device_platform=" + device.platform;
            params += "&user_id=" + getStorage("user_id");
            params += "&old_device_id=" + oldDeviceId;
            callAjax("registerMobile", params);
            //callAjax("getMyagenda", params);
        });
        push.on('notification', function (data) {

            console.log("registration:" + data);
            showNotification(data.title, data.message);

            push.finish(function () {
                console.log("finish successfully called:");
                //alert('finish successfully called');
            });
        });
        push.on('error', function (e) {
            console.log("Push erorr:" + e);
        });
    }
}
(function (window) {

    var url = {
        user: defines.baseApi + '/restconnect/customer/statusData' + '?___store=' + defines.baseLang,
        login: defines.baseApi + '/restconnect/customer/login' + '?___store=' + defines.baseLang,
        register: defines.baseApi + '/restconnect/customer/register' + '?___store=' + defines.baseLang,
        logout: defines.baseApi + '/customer/account/logout' + '?___store=' + defines.baseLang,
        menus: defines.baseApi + '/restconnect/?cmd=menu' + '&___store=' + defines.baseLang,
        products: defines.baseApi + '/restconnect/?cmd=%s&limit=%s&page=%s' + '&___store=' + defines.baseLang,
        products_search: defines.baseApi + '/restconnect/search/?q=%s' + '&___store=' + defines.baseLang,
        product_detail: defines.baseWeb + '/catalog/product/view/id/%s' + '&___store=' + defines.baseLang, //这个是直接详情页�?�
        product_rest: defines.baseApi + '/restconnect/products/getproductdetail/productid/%s' + '?___store=' + defines.baseLang,
        product_img: defines.baseSite + '/api/rest/products/%s/images/' + '?___store=' + defines.baseLang,
        product_attr: defines.baseApi + '/restconnect/products/getcustomeattr/productid/%s' + '?___store=' + defines.baseLang, //开�?�中
        product_option: defines.baseApi + '/restconnect/products/getcustomoption/productid/%s' + '?___store=' + defines.baseLang,
        cart_add: defines.baseApi + '/restconnect/cart/add/' + '?___store=' + defines.baseLang, //直接post到这个接�?�就返回�?�数
        cart_get_qty: defines.baseApi + '/restconnect/cart/getQty' + '?___store=' + defines.baseLang, //直接post到这个接�?�就返回�?�数
    };

    window.servers = {};

    servers.getUser = function (callback) {
       var user_id=  getStorage("user_id");
        $.getJSON(url.user, {
            user_id: user_id
        }).done(callback).fail(error);
    };

    servers.login = function (username, password, callback) {
       //alert(username);
        $.getJSON(url.login, {
            username: username,
            password: password
        }, callback).fail(function () {
            alert('Please check the Username or Password!');
        });	
              /*  .success(function (responce) {
                    //alert(responce);
                    setStorage("user_id", responce.id);
                    setStorage("user_name", responce.name);
                    setStorage("user_email", responce.email);
                    //alert(getStorage("user_id"));
                    console.log(responce);
                    window.location.assign("");
                });
*/
    };
    servers.register = function (middlename, email,firstname, lastname, gender ,password, callback) {
        //alert(password);
        //alert(email);
        $.getJSON(url.register, {
            middlename : middlename,
            email : email,
            firstname : firstname,
            lastname : lastname,
            gender : gender,
            password: password
        }, callback).fail(function () {
            alert('Please check the Username or Password!');
        });
    };

    servers.logout = function (callback) {
        $.get(url.logout, callback).fail(error);
    };

    servers.getMenus = function (callback) {
        $.getJSON(url.menus, callback).fail(error);
    };

    servers.getProducts = function (page, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products, page.cmd, defines.productsLimit, page.num),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsSearch = function (q, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_search, q),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductDetail = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.product_detail, id),
            contentType: 'application/json',
            dataType: 'jsonp',
            success: callback,
            error: error
        });
    };

    servers.getProductRest = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.product_rest, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductImg = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.product_img, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductAttr = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.product_attr, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductOption = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.product_option, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.cartAdd = function (para, callback) {
        $.ajax({
            type: 'POST',
            url: sprintf(url.cart_add),
            data: para,
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.cartGetQty = function (callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.cart_get_qty),
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    // 统一处�?� API 请求错误
    function error(err) {
        console.log(err);
    }
})(window);

function setStorage(key, value) {
    localStorage.setItem(key, value);
}

function getStorage(key) {
    return localStorage.getItem(key);
}

function removeStorage(key) {
    localStorage.removeItem(key);
}

function explode(sep, string) {
    var res = string.split(sep);
    return res;
}

function urlencode(data) {
    return encodeURIComponent(data);
}

function isLogin() {
    if (!empty(getStorage("user_id"))) {
        return true;
    }
    return false;
}

function logout() {
    //removeStorage("client_token");
    removeStorage("user_id");
    window.location.assign("");
}
document.addEventListener("pageinit", function (e) {
    dump("pageinit");
    //alert(123);
}, false);