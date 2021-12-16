﻿var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
var Main = {
    setupId: "",
    yandexHttp: null,
    yandexReadyTimeout: null,
    XmlUrl: "",
    loadingPlaylist: false,
    preSelectedChannel: 0,
    selectedChannel: 0,
    selectedPage: 0,
    channelArrayIndex: 0,
    playSelectedChannel: 0,
    playSelectedPage: 0,
    playChannelArrayIndex: 0,
    playerMode: "",
    yandexTvMode: false,
    yandexAllDay: false,
    yandexBaseInfo: false,
    yandexFlagStep: 0,
    yandexFlagName: "",
    yandexProgramId: -1,
    tempEpgInfo: "",
    epgInfoStep: 0,
    epgT1: 0,
    epgT2: 0,
    yandexProgramInfoArray: [],
    yandexEpgInfoArray: [],
    tempYandexEpgInfoArray: [],
    yandexAuto: false,
    guide: false,
    blockInfo: false,
    write: false,
    lostDate: "",
    scrolling: 0,
    loadTimer: null,
    prevPlaylistArray: [],
    prevPlaylist: false,
    prevChannelArray: [],
    urlArray: [],
    favName: "",
    favNum: 1,
    favUrl: "",
    tempFavName: "",
    tempFavNum: 1,
    tempFavUrl: "",
    blockFav: false,
    playPrev: true,
    helpStep: 0,
    helpInfo: false,
    MAC: "",
    audioOutputDevice: "",
    hardware: "",
    hardwareType: "",
    channelNum: 0,
    name: "",
    url: "",
    playlistUrl: "",
    prePlaylistUrl: "",
    info: "",
    logo: "",
    screenSize: -1,
    audioNum: 0,
    buffer: 0,
    iBuffer: 0,
    timeshift: "",
    searchOn: "",
    region: "",
    parser: "",
    playlistName: "",
    Kill: "",
    nuber_p: 1,
    step_read_dir: 1,
    FAV: false,
    DEL: false,
    RED: false,
    ret: false,
    search: false,
    start: false,
    Foto: false,
    xxx: false,
    Emu: false,
    seriesC: false,
    seriesE: false,
    seriesD: false,
    FirstStart: true,
    Update_Page: false,
    SetZoom: false,
    Network: null,
    St: null,
    Audio: null,
    IntervalUpdateTime: null,
    SlideShowInterval: null,
    version: "",
    sort: false
};

Main.onLoad = function() {
    try {
        this.Network = getId("pluginNetwork");
        this.MAC = this.Network.GetMAC();
        this.St = getId("pluginStorage");
        this.Audio = getId("pluginAudio");
        this.audioOutputDevice = this.Audio.GetOutputDevice();
        var pluginTV = getId("pluginTV");
        this.hardwareType = pluginTV.GetProductType();
        this.hardware = pluginTV.GetProductCode(1);
        if (this.hardware == "LN40B650_KOR") {
            Main.Emu = true;
        } else {
            if (this.hardware.indexOf("C") > 1) {
                Main.seriesC = true;
            } else {
                if (this.hardware.indexOf("D") > 1) {
                    Main.seriesD = true;
                } else {
                    if (this.hardware.indexOf("E") > 1 || (this.hardware.indexOf("C") < 0 && this.hardware.indexOf("D") < 0)) {
                        Main.seriesE = true;
                    }
                }
            }
        }
        if (API.init() && Player.init()) {
            window.onShow = Main.onShowEventTVKey;
            widgetAPI.sendReadyEvent();
            Display.status("Загрузка!", 14000);
            Display.loadingshow();
            var src;
            if (Main.seriesC || Main.seriesD) {
                src = '$MANAGER_WIDGET/Common/IME/ime2.js';
            } else {
                src = '$MANAGER_WIDGET/Common/IME_XT9/ime.js';
            }
            var script = document.createElement('script');
            script.src = src;
            document.documentElement.children[0].appendChild(script);
            setTimeout(Main.Init(), 200);
        }
		
    } catch (b) {}
};

Main.Init = function() {
    Main.urlArray = [];
    if (API.star_url.indexOf("fav.dat") > 0) {
        Main.FAV = true;
        Main.opencommonFile(API.star_url);
    } else {
        if (API.star_url.indexOf("OpenFav") == 0) {
            if (API.fav_start_channels.length > 1) {
                Main.ReadPlArr("OpenFav", API.fav_start_channels);
            } else {
                Main.FAV = true;
                Main.opencommonFile(Main.favUrl);
            }
        } else {
            API.XML_URL = API.star_url;
            API.Request(API.star_url);
        }
    }
};
//key приходит кнопка
SetVolume = function(key) {
    if (Main.audioOutputDevice == 3 || Main.hardwareType == 2) {
        Display.status("Недоступно!");
    } else {
        Main.Audio.SetVolumeWithKey(key);
        var volume = Main.Audio.GetVolume();
        var symbol = "";
        var maxVolume = Math.round(0.44 + volume * (1 - volume / 360), 10);
        var strVolume = volume > 9 ? volume : ("0" + volume);
        for (var i = 0; i < maxVolume; i++) {
            symbol += "|";
        }
        Display.status("<b style='color:#55dd00;'>ГРОМКОСТЬ</b>  - " + strVolume + " - <b style='color:yellow;'>" + symbol + "</b>",3000);
    }
};
Main.onShowEventTVKey = function() {
    pluginAPI.setOffScreenSaver();
    pluginAPI.setOffIdleEvent();
    pluginAPI.SetBannerState(1);
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
    pluginAPI.registKey(tvKey.KEY_MENU);
    pluginAPI.registKey(tvKey.KEY_GUIDE);
    pluginAPI.registKey(tvKey.KEY_SOURCE);
    pluginAPI.unregistKey(203);
    pluginAPI.unregistKey(204);
    pluginAPI.registKey(613);
    pluginAPI.registKey(105);
    pluginAPI.registKey(106);
    pluginAPI.registKey(309);
    pluginAPI.registKey(612);
    pluginAPI.registKey(1118);
    pluginAPI.registKey(1219);
    pluginAPI.registKey(84);
    pluginAPI.registKey(655);
    pluginAPI.registKey(1089);
    pluginAPI.registKey(1057);
    pluginAPI.registKey(1083);
    pluginAPI.registKey(1078);
    pluginAPI.registKey(1080);
    pluginAPI.registKey(1086);
    pluginAPI.registKey(78);
    pluginAPI.registKey(1249);
};
curWidget.onWidgetEvent = function() {
    Main.onShowEventTVKey();
};
Main.registVOLTVKey = function() {
    pluginAPI.registKey(tvKey.KEY_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_PANEL_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_PANEL_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_MUTE);
};
Main.ResetSelectedPosition = function() {
    this.selectedChannel = 0;
    this.selectedPage = 0;
    this.channelArrayIndex = 0;
    if (!this.guide && !Main.helpInfo) {
        this.prevChannelArray = [];
    }
};
Main.SaveSelectedPosition = function() {
    this.playSelectedChannel = this.selectedChannel;
    this.playSelectedPage = this.selectedPage;
    this.playChannelArrayIndex = this.channelArrayIndex;
};
Main.SetSelectedPosition = function() {
    this.selectedChannel = this.playSelectedChannel;
    this.selectedPage = this.playSelectedPage;
    this.channelArrayIndex = this.playChannelArrayIndex;
};
Main.SetFavSelectedPosition = function() {
    Main.favNum = Main.tempFavNum;
    Main.favName = Main.tempFavName;
    Main.favUrl = Main.tempFavUrl;
};
Main.showCategorySelector = function() {
    getIdn("rightHalf");
    KeyHandler.setFocus(4);
    Selectbox.setBox("КАТЕГОРИИ", API.categories);
    getId("selectbox").style.top = "60px";
    getId("selectbox").style.left = "550px";
};
Main.showFavSelector = function() {
    getIdn("rightHalf");
    KeyHandler.setFocus(4);
    Selectbox.setBox("Выбор избранного", API.favorites);
    getId("selectbox").style.top = "60px";
    getId("selectbox").style.left = "550px";
};
Main.showSiseSelector = function() {
    KeyHandler.setFocus(4);
    Selectbox.setBox("Выбор качества", Main.urlArray);
    getId("selectbox").style.top = "120px";
    getId("selectbox").style.left = "330px";
};
Main.Menu = function() { //изменена автосинхронизация,Version,border
 /*   if (Main.FirstStart) {
        if ((API.Timemode == 0 || API.Timemode == 1)) {
            setTimeout("Display.status('Используется автосинхронизация времени!')");
        }
    }	*/
    setTimeout("Main.FirstStart=false;", 3000);
    clearTimeout(this.loadTimer);
    if (!Main.search && !Main.xxx) {
        Display.hidestatus();
    }
    getIdn("statusbar1");
    Display.hideplayer();
    Display.loadinghide();
    API.AsReqMode = true;
    this.FAV = false;
    this.xxx = false;
    this.helpInfo = false;
    this.blockInfo = false;
    this.loadingPlaylist = false;
    this.blockFav = false;
    this.SetZoom = false;
    this.prevPlaylist = true;
    this.prePlaylistUrl = API.XML_URL;
    getIdn("selectbox");
    getIdn("help_set_par");
    getIdb("rightHalf");
    getIdn("infoList");
    getIdn("ya_date");
    getIdn("ya_info");
    getIdn("ya_help");
	getId("rightHalf").style.border = "0px solid #CCCCCC";
	getId("version").style.opacity = "";
    Main.UpdateHelpBar();
    if (this.RED) {
        KeyHandler.setFocus(5);
    } else {
        if (Main.guide) {
            KeyHandler.setFocus(6);
        } else {
            KeyHandler.setFocus(0);
        }
    }
    Main.updatePage();
    getIdb("channelList");
    getIdb("main");
};
Main.UpdateHelpBar = function() { //изменена статус
    getIdn("0_help");
    getIdn("1_help");
    getIdb("2_help");
    getIdn("3_help");
    getIdn("3.1_help");
    getIdn("3.1_help");
    getIdn("3.2_help");
    getIdn("3.21_help");
    getIdn("3.3_help");
    getIdn("3.4_help");
    getIdb("4_help");
    getIdn("4.1_help");
    getIdb("5_help");
    getIdn("5.1_help");
    getIdb("6_help");
    getIdn("7_help");
    getIdn("8_help");
    getIdn("9_help");
    getIdn("10_help");
    getIdn("10.1_help");
    getIdn("11_help");
    getIdn("12_help");
    if (API.XML_URL.indexOf("fav.dat") > 0 && !Main.guide) {
        Main.FAV = true;
        Main.favUrl = API.XML_URL;
        if (!this.RED) {
            var title = "Избранное №" + Main.favNum + ' - "' + Main.favName + '"';
            if (API.favorites.length > 1) {
                getIdb("3.3_help");
            }
            getIdb("3.4_help");
        } else {
            title = "Редактирование. Избранное №" + Main.favNum + ' - "' + Main.favName + '"';
            getIdn("2_help");
            getIdb("3.2_help");
            if (API.favorites.length > 1) {
                getIdb("3.21_help");
            }
            getIdn("5_help");
            getIdn("6_help");
        }
		getId("version").style.opacity = "1";
    } else {
        if (API.XML_URL.indexOf("help") > 0) {
            Main.helpInfo = true;
            title = "СПРАВКА";
            getIdn("2_help");
            getIdb("10_help");
            getIdb("4.1_help");
			getId("version").style.opacity = "1";
        } else {
            if (Main.guide) {
                title = "Подробное описание передач v." + this.version;
                this.yandexTvMode = true;
                getIdn("2_help");
                getIdn("5_help");
                getIdn("6_help");
                getIdb("4.1_help");
                getIdb("10.1_help");
                if (!Main.yandexAllDay) {
                    this.selectedChannel = 1;
                }
				getId("version").style.opacity = "1";
            } else {
                if (API.XML_URL.indexOf("Open") < 0) {
                    getIdb("3.1_help");
                }
                if (API.categories.length > 2) {
                    getIdb("3_help");
                }
                if (API.XML_URL.indexOf("history.dat") > 0) {
                    title = "ИСТОРИЯ";
                    getIdb("5.1_help");
                } else {
                    title = "SmartPortal 5.1" + Main.version;
                }
            }
        }
    }
    if (Player.state != Player.STOPPED) {
        getIdb("1_help");
        if (Player.state == Player.PLAYING_VOD && !this.RED) {
            getIdb("8_help");
        }
        getId("background").style.backgroundImage = "url(img/bg.png)"
    } else {
        KeyHandler.guide_step = 0;
        getIdb("0_help");
        getId("background").style.backgroundImage = "url(img/us_bg.png)";
		getId("background2").style.backgroundImage = "url(img/us_bg2.png)";
        if (this.prevPlaylistArray.length > 0) {
            if (API.categories.length < 3 && !Main.FAV && !Main.guide && API.XML_URL.indexOf("history.dat") < 0) {
                getIdb("9_help");
            }
            if (API.XML_URL.indexOf("start.xml") == 0) {
                Display.status(API.XML_URL);
                if (Main.Kill != "") {
                    API.Xcode = Main.Kill;
                }
            }
        } else {
            if (API.XML_URL.indexOf("start.xml") != 0) {
                getIdn("6_help");
                if (!this.RED) {
                    getIdb("7_help");
                }
                if (API.categories.length < 3 && !Main.FAV && !Main.guide) {
                    getIdb("9_help");
                }
            } else {
                if (Main.Kill != "") {
                    API.Xcode = Main.Kill;
                }
                getIdn("6_help");
                getIdb("9_help");
            }
        }
    }
    if (Main.seriesE) {
        getId("widget_date").style.left = "520px";
        getId("widget_time").style.left = "700px";
    }
    getIdb("background");
    if (API.XML_URL.indexOf("OpenFav") == 0 || Main.helpInfo) {
        Main.blockFav = true;
    }
    widgetAPI.putInnerHTML(getId("version"), title)
};
//el - елемент, src - путь, flag - флаг
LogoStyle = function(el, src, flag) {  //изменена настройки
    var left, width;
    if (flag == 1 && (API.Forma == 1 || API.Forma == 3)) {
        left = "68px"; /*67*/
        width = "53px"; /*54*/	
    } else {
        if (flag == 1) {
            left = "76px"; /*75*/
            width = "38px";/*38*/
        } else {
            if (API.Forma == 1 || API.Forma == 3) {
                /*left = "80px";*/
                width = "44px";
            } else {
                /* left = "90px";*/			
                width = "30px";
            }
        }
    }
    getId(el).src = src;
    getId(el).style.left = left;
    getId(el).style.width = width;
};
Main.updatePage = function() {
    try {
        clearTimeout(this.loadTimer);
        this.Update_Page = false;
        this.ret = false;
        var channelCount = 10;
        this.selectedPage = (this.selectedPage > API.chan_pages - 1) ? 0 : (this.selectedPage < 0) ? API.chan_pages - 1 : this.selectedPage;
        for (var i = 0; i < 10; i++) {
            getIdb("ch" + i);
        }
        if (this.selectedPage == API.chan_pages - 1) {
            channelCount = API.last_page_channels_counter;
            for (var i = channelCount; i < 10; i++) {
                getIdn("ch" + i);
            }
            if (this.selectedChannel > API.last_page_channels_counter - 1) {
                this.selectedChannel = API.last_page_channels_counter - 1;
            }
        }
        Main.UpdateChannelBar();
        for (var i = 0; i < channelCount; i++) {
            var id = 10 * this.selectedPage + i;
            if (Main.guide) {
                widgetAPI.putInnerHTML(getId("number" + i), API.channels[id][10]);
            } else {
                widgetAPI.putInnerHTML(getId("number" + i), id + 1);
            }
            var src = (dPr(API.channels[id][2]) != "") ? getLogo1(dPr(API.channels[id][5]), dPr(API.channels[id][2])) : getLogo2(lrdPr(API.channels[id][0]), API.channels[id][3], dPr(API.channels[id][5]));
            LogoStyle("img" + i, src, 1);
            var message = (API.channels[id][0].toLowerCase().indexOf("установите оригинальную версию") >= 0) ? "Доступ заблокирован!" : API.channels[id][0];
            widgetAPI.putInnerHTML(getId("title" + i), message);
        }
        if ((API.prev_page_url == "") || (API.prev_page_text.indexOf("На  стр.") == 0 && API.next_page_text.indexOf("На 2 стр.") == 0)) {
            this.nuber_p = 1;
        }
        if (((API.prev_page_url != "" || API.next_page_url != "") && API.prev_page_text.indexOf("В Портал") == -1) && this.nuber_p > 0) {
            this.ret = true;
            var message = "";
            if (API.channels.length > 10) {
                message = '<b style="font-size:16px;"> (  Hа этой странице <font color=#55dd00>' + API.channels.length + "</font> позиций  )</b>";
            }
            widgetAPI.putInnerHTML(getId("version"), "<font color=#55dd00>" + this.nuber_p + "</font>-я страница " + message);
        }
        if (KeyHandler.Focus == 0 || KeyHandler.Focus == 5 || KeyHandler.Focus == 6) {
            Main.LoadTimer("Main.updateChannel();", 100);
        } else {
            Main.updateChannel();
        }
    } catch (f) {}
};
getLogo1 = function(url, src) { //изменена *.png
    var path = "logos/";
    if (src.indexOf(":") >= 0) {
        if (API.Forma == 0 || API.Forma == 1) {
            path = "";
        } else {
            //src = (url != "") ? "logos/open.png" : "logos/image.png";
			src = (url != "") ? "logos/open.png" : "logos/file.png";
        }
    }
    src = path + src;
    return src;
};
// title - имя листа, desc - описание листа, url - урл листа
getLogo2 = function(title, desc, url) { //изменена *.png
    title = lrdPr(title);
    var src = "";
    if (API.XML_URL.indexOf("help") > 0) {
        src = "logos/help.png";
    } else {
        if (url != "") {
            src = "logos/open.png";
        } else {
            if (API.Forma == 0 || API.Forma == 1) {
                if (Main.yandexAuto && !isNaN(desc) && desc > 0 && desc < 2000) {
                    src = Ya_icon_index_url_obj[desc];
                }
                if (Main.yandexAuto && lrdPr(title) != "" && (src == undefined || isNaN(desc) || desc < 1 || desc > 1999)) {
                    src = Ya_icon_name_url_obj[lrdPr(title).toLowerCase().replace(/\_/g, " ")];
                }
                if (src == undefined || !Main.yandexAuto) {
                    //src = (lrdPr(title) != "" && dPr(desc) != "") ? "logos/" + lrdPr(title) + ".png" : "logos/image.png";
					src = (lrdPr(title) != "" && dPr(desc) != "") ? "logos/" + lrdPr(title) + ".png" : "logos/file.png";
                }
            } else {
                //src = "logos/image.png";
				 src = "logos/file.png";
            }
        }
    }
    return src;
};

function roll() { //новая прокрутка player statusbar
	clearTimeout(Main.bannerid2);
	var obj = getId("ch_name");
	obj.style.marginLeft = '0px';
	var sdvig = obj.scrollWidth - 706;
	if (obj.scrollWidth > 706) Main.bannerid2 = setTimeout(function(){roll2("+",0,sdvig,obj)},100);
};
function roll1(DelayFirstStart,naprav,i,sdvig,obj) {   //новая прокрутка channel list
	if (DelayFirstStart != 0){
		Main.bannerid = setTimeout(function(){roll1(0,naprav,i,sdvig,obj)},DelayFirstStart);
	}else{
		if (naprav == "+"){ // вперед >>
			if (i >= -sdvig){
				var z = obj.style.marginLeft;
				if (z == "") {
					z = 0;
				}else{
					z = z.substring(0,z.indexOf('px'));
					z = parseInt(z,10);
				}
				z = z-1;
				obj.style.marginLeft = z + 'px';  
				i--;
				Main.bannerid = setTimeout(function(){roll1(0,naprav,i,sdvig,obj)},15);	//вперед
			} else {
				naprav = "-";
				Main.bannerid = setTimeout(function(){roll1(0,naprav,i,sdvig,obj)},800); // задержка в конечном положении и назад
			}
		}else{ // назад <<
			if (i <= 0){ 
				var z = obj.style.marginLeft;
				z = z.substring(0,z.indexOf('px'));
				z = parseInt(z,10);
				z = z+1;
				obj.style.marginLeft = z + 'px';  
				i++;
				Main.bannerid = setTimeout(function(){roll1(0,naprav,i,sdvig,obj)},15);	//назад
			}else {
				naprav = "+";
				Main.bannerid = setTimeout(function(){roll1(0,naprav,i,sdvig,obj)},2000); //задержка в начальном положении и назад	
			}		
		}	
	}
};
function roll2(naprav,i,sdvig,obj) {   //новая прокрутка player statusbar
	if (naprav == "+"){ // вперед >>
		if (i >= -sdvig){
			var z = obj.style.marginLeft;
			if (z == "") {
				z = 0;
			}else{
				z = z.substring(0,z.indexOf('px'));
				z = parseInt(z,10);
			}
			z = z-1;
			obj.style.marginLeft = z + 'px';  
			i--;
			Main.bannerid2 = setTimeout(function(){roll2(naprav,i,sdvig,obj)},15);	//вперед
		} else {
			naprav = "-";
			Main.bannerid2 = setTimeout(function(){roll2(naprav,i,sdvig,obj)},800); // задержка в конечном положении и назад
		}
	}else{ // назад <<
		if (i <= 0){ 
			var z = obj.style.marginLeft;
			z = z.substring(0,z.indexOf('px'));
			z = parseInt(z,10);
			z = z+1;
			obj.style.marginLeft = z + 'px';  
			i++;
			Main.bannerid2 = setTimeout(function(){roll2(naprav,i,sdvig,obj)},15);	//назад
		}else {
			naprav = "+";
			Main.bannerid2 = setTimeout(function(){roll2(naprav,i,sdvig,obj)},2000); //задержка в начальном положении и назад	
		}		
	}	
};

Main.UpdateChannelBar = function() {	//изменена прокрутка
	clearTimeout(Main.bannerid);
    getId("number" + this.preSelectedChannel).style.backgroundImage = "";
	getId("number" + this.preSelectedChannel).style.color = "#FFFFFF";
    getId("chan" + this.preSelectedChannel).style.backgroundImage = "";
    getId("title" + this.preSelectedChannel).style.color = "#FFFFFF";
	getId("title" + this.preSelectedChannel).style.fontSize = "19px";
	getId("number" + this.preSelectedChannel).style.fontSize = "24px";		
	getId("title" + this.preSelectedChannel).style.marginLeft = '0px'; //прокрутка	
	getId("number" + this.selectedChannel).style.backgroundImage = "url(img/number_bar.png)";
	getId("number" + this.selectedChannel).style.color = "#FFFF00";
    getId("chan" + this.selectedChannel).style.backgroundImage = "url(img/chan_bar.png)";
    getId("title" + this.selectedChannel).style.color = "#FFFF00";	
	getId("title" + this.selectedChannel).style.fontSize = "20px";		
	getId("number" + this.selectedChannel).style.fontSize = "25px";
	//-----прокрутка---
	var obj = getId("title" + this.selectedChannel);
	var sdvig = obj.scrollWidth - 320;
	if (obj.scrollWidth > 320) roll1(1500,"+",0,sdvig,obj);
	//-----------------						
	this.preSelectedChannel = this.selectedChannel;	
};
Main.updateChannel = function() {
    clearTimeout(this.loadTimer);
    if (KeyHandler.Focus == 0 || KeyHandler.Focus == 5 || KeyHandler.Focus == 6) {
        YaAbort();
        getIdn("infoList");
        getIdn("ya_date");
        getIdn("ya_info");
        Main.UpdateChannelBar();
    }
    Main.Update_Page = true;
    if (KeyHandler.Focus == 0 && !this.blockInfo) {
        Main.LoadTimer("Main.UpdateChannelInfo()", 200);
    } else {
        Main.UpdateChannelInfo();
    }
};
Main.UpdateChannelInfo = function() {
    Main.scrolling = 0;
    Main.yandexBaseInfo = false;
    this.channelArrayIndex = 10 * this.selectedPage + this.selectedChannel;
    this.channelNum = this.channelArrayIndex + 1;
    this.name = Ach(0);
    if (!Main.s_url) {
        this.url = Ach(1);
        this.playlistUrl = Ach(5);
    }
    this.logo = Ach(2);
    if (Player.state == Player.STOPPED) {
        this.screenSize = Ach(6);
        this.audioNum = Ach(7);
    }
    this.buffer = Ach(8);
    this.iBuffer = Ach(9);
    this.timeshift = Ach(10);
    this.region = Ach(11);
    this.parser = decLongUrl(Ach(12));
    this.searchOn = Ach(13);
    if (!Main.blockInfo && KeyHandler.Focus != 5 && KeyHandler.Focus != 1) {
        var yandexUrl = "";
        if (this.url != "") {
            yandexUrl = GetYindex();
        }
        if (yandexUrl != "") {
            Main.yandexTvMode = true;
            Main.yandexAllDay = false;
            T.delta = 0;
            Main.yandexFlagStep = 0;
            if (!Main.FirstStart) {
                YandexGetUrl(yandexUrl);
            } else {
                Main.LoadTimer("YandexGetUrl(GetYindex());", 1000);
            }
        } else {
            this.yandexTvMode = false;
            Main.showinfoList(Ach(3));
        }
    }
    this.blockInfo = false;
};
GetYindex = function() {
    var url = (Ach(3) != "" && Ach(3).indexOf("/m.tv.yandex.") > 0) ? Ach(3) : (!isNaN(Ach(3)) && Ach(3) > 0 && Ach(3) < 2000) ? Ach(3) : (Main.yandexAuto && Main.name != "") ? Ya_name_index_obj[Main.name.toLowerCase().replace(/\_/g, " ")] : "";
    if (url == undefined) {
        url = "";
    }
    return url;
};
Main.UpdatePlayerStatusbar = function() {
    widgetAPI.putInnerHTML(getId("ch_number"), this.channelNum);
    widgetAPI.putInnerHTML(getId("ch_name"), Main.name);
    var src = (Main.logo != "") ? getLogo1(Main.playlistUrl, Main.logo) : getLogo2(Main.name, Ach(3), Main.playlistUrl);
    LogoStyle("ch_img", src, 0);
};
Main.LoadTimer = function(b, a) {
    clearTimeout(this.loadTimer);
    this.loadTimer = setTimeout(b, a);
};
Main.showinfoList = function(b) {
    if (KeyHandler.Focus == 0 || KeyHandler.Focus == 6) {
        getIdn("infoList");
        getIdn("ya_date");
        getIdn("ya_info");
        widgetAPI.putInnerHTML(getId("infoList"), "");
        if (!this.yandexTvMode || Main.guide) {
            getIdn("ya_help");
            var a = "";
            var c = "";
            if (API.playlist_name != "") {
                c = '<table width="100%"></table>';
            }
            if (API.prev_page_text != "" && (API.prev_page_url != "" || (this.url == "" && API.prev_page_text.indexOf("В портал") == -1))) {
                a += "<td><img src='img/buttons/rew.png'></img></td><td>" + API.prev_page_text + "</td>";
            } else {
                if (API.prev_page_url != "") {
                    a += "<td><img src='img/buttons/rew.png'></img></td><td>Назад</td>";
                }
            }
            if (API.next_page_text != "" && (API.next_page_url != "" || (this.url == "" && API.next_page_text.indexOf("В портал") == -1))) {
                a += "<td><img src='img/buttons/ff.png'></img></td><td>" + API.next_page_text + "</td>";
            } else {
                if (API.next_page_url != "") {
                    a += "<td><img src='img/buttons/ff.png'></img></td><td>Вперёд</td>";
                }
            }
            if (API.next_page_url != "" || API.prev_page_url != "") {
                a += "<td><img src='img/buttons/blue.png'></img></td><td>В начало</td>";
            }
            if (a != "") {
                a = "<table><tr>" + a + "</tr></table>";
            }
            if (b == "" || b == 0) {
                a += "Дополнительной информации нет !";
                b = "";
            }
            a = '<div id="allInfo">' + c + a + b + "<div>";
            widgetAPI.putInnerHTML(getId("infoList"), a);
            if (API.playlist_name != "") {
                getId("allInfo").style.top = "5px";
            } else {
                getId("allInfo").style.top = "10px";
            }
            getIdb("infoList")
        } else {
            a = '<div id="allInfo">' + b + "<div>";
            widgetAPI.putInnerHTML(getId("ya_date"), "");
            widgetAPI.putInnerHTML(getId("ya_date"), Main.lostDate + Main.yandexFlagName);
            widgetAPI.putInnerHTML(getId("ya_info"), "");
            widgetAPI.putInnerHTML(getId("ya_info"), a);
            getId("allInfo").style.top = "0px";
            getIdb("ya_date");
            getIdb("ya_info");
            getIdb("ya_help");
        }
    }
};
Main.PlayPrevChannel = function() {
    var a = this.prevChannelArray.length - 1;
    if (a > 0) {
        var b = this.prevChannelArray[a - 1];
        this.selectedChannel = b[0];
        this.selectedPage = b[1];
        this.channelArrayIndex = b[2];
        Main.yandexTvMode = true;
        Main.UpdateChannelInfo();
        Main.PlayChannel();
        Display.status("Предыдущий канал");
    } else {
        Display.status("Стартовый канал");
    }
};
Main.SavePrevChannel = function() {
    if (this.playPrev) {
        var a = [this.selectedChannel, this.selectedPage, this.channelArrayIndex];
        this.prevChannelArray.push(a);
    }
};
Main.PlayPrevPlaylist = function() {
    if (KeyHandler.bl && this.prevPlaylistArray.length > this.nuber_p) {
        if (this.url != "" && (API.next_page_url == "" || API.prev_page_url == "")) {
            this.nuber_p++;
        }
        for (var f = 0; f < this.nuber_p - 1; f++) {
            this.prevPlaylistArray.pop();
        }
        this.nuber_p = 1;
    }
    var a = this.prevPlaylistArray.length - 1;
    if (a > -1) {
        var e = this.prevPlaylistArray[a];
        this.playlistUrl = e[0];
        this.selectedChannel = e[1];
        this.selectedPage = e[2];
        this.channelArrayIndex = e[3];
        this.nuber_p = e[4];
        this.favName = e[5];
        this.favNum = e[6];
        var d = [];
        var c = [];
        var b = [];
        d = e[7];
        b = e[8];
        c = e[9];
        this.prevPlaylistArray.pop();
        this.prevPlaylist = false;
        Main.DEL = true;
        KeyHandler.bl = false;
        Main.guide = false;
        Main.RED = false;
        API.search_on = "";
        if (this.playlistUrl.indexOf("help.xml") == -1) {
            this.helpInfo = false;
        }
        if (this.playlistUrl.indexOf(".dat") > 0) {
            Main.opencommonFile(this.playlistUrl);
        } else {
            if (d.length > 0) {
                Main.ReadPlArr(this.playlistUrl, d, b, c);
                API.playlist_name = e[10];
                API.prev_page_url = e[11];
                API.prev_page_text = e[12];
                API.next_page_url = e[13];
                API.next_page_text = e[14];
            } else {
                if (Main.name.indexOf("-=ПОИСК=-") == 0) {
                    Main.name = "";
                }
                this.searchOn = "";
                Main.playlist();
            }
        }
    } else {
        if (API.XML_URL.indexOf("start.xml") != 0) {
            this.start = true;
            Main.DEL = false;
            Main.playlist();
        } else {
            Display.status("Стартовый плейлист!");
        }
    }
};
Main.SavePrevPlaylist = function() {
    if (this.prevPlaylist) {
        var c = [];
        var b = [];
        if (API.channels.length < 500 && API.XML_URL.indexOf(".dat") < 0) {
            c = API.channels;
            if (API.categories.length > 2 && API.all_channels.length > API.channels.length) {
                b = API.all_channels;
            }
        }
        var a = [API.XML_URL, this.selectedChannel, this.selectedPage, this.channelArrayIndex, this.nuber_p, this.tempFavName, this.tempFavNum, c, b, API.categories, API.playlist_name, API.prev_page_url, API.prev_page_text, API.next_page_url, API.next_page_text];
        this.prevPlaylistArray.push(a);
        this.prevPlaylist = false;
    }
};
Main.selectNextChannel = function() {
    if (Main.Update_Page) {
        this.selectedChannel++;
        if (this.selectedChannel >= 10 || (this.selectedPage == API.chan_pages - 1 && this.selectedChannel == API.last_page_channels_counter)) {
            this.selectedChannel = 0;
            this.selectedPage++;
            Main.updatePage();
        } else {
            Main.updateChannel();
        }
    }
};
Main.selectPrevChannel = function() {
    if (Main.Update_Page) {
        this.selectedChannel--;
        if (this.selectedPage == 0 && this.selectedChannel < 0) {
            this.selectedChannel = API.last_page_channels_counter - 1;
            this.selectedPage = API.chan_pages - 1;
            Main.updatePage();
        } else {
            if (this.selectedChannel < 0) {
                this.selectedChannel = 9;
                this.selectedPage--;
                Main.updatePage();
            } else {
                Main.updateChannel();
            }
        }
    }
};

function ListNextPage() {
    if (API.next_page_url != "") {
        Main.playlistUrl = API.next_page_url;
        Main.SavePrevPlaylist();
        Main.nuber_p++;
        if (Main.playlistUrl != "") {
            Main.PlayChannel();
        }
    } else {
        Display.status("недоступно!");
    }
}
Main.selectNextPage = function() {
    if (API.next_page_url != "" && this.selectedPage == API.chan_pages - 1) {
        ListNextPage();
    } else {
        if (Main.Update_Page) {
            this.selectedPage++;
            Main.updatePage();
        }
    }
};

function ListPrevPage() {
    if (API.prev_page_url != "") {
        Main.prevPlaylist = false;
        Main.prevPlaylistArray.pop();
        Main.playlistUrl = API.prev_page_url;
        if (Main.nuber_p > 1) {
            Main.nuber_p--;
        }
        if (Main.playlistUrl != "") {
            Main.PlayChannel();
        }
    } else {
        Display.status("недоступно!");
    }
}
Main.selectPrevPage = function() {
    if (API.prev_page_url != "" && this.selectedPage == 0) {
        ListPrevPage();
    } else {
        if (Main.Update_Page) {
            this.selectedPage--;
            Main.updatePage();
        }
    }
};

Main.PlayChannel = function() {
    try {
        clearTimeout(this.loadTimer);
        if (this.playlistUrl != "" && this.playlistUrl.indexOf("stop") != 0) {
            Main.playlist();
        } else {
            if (this.url != "" && this.url.indexOf("stop") != 0) {
                if (Player.state != Player.STOPPED) {
                    if (Main.playerMode == "0") {
                        Main.stopFPlayer();
                    } else {
                        Player.stopV();
                    }
                }
                Main.UpdatePlayerStatusbar();
                Display.status1(this.channelNum);
                Main.urlArray = [];
                Main.url_selected = 0;
                Main.Foto = false;
                Main.screenSize = Ach(6);
                Main.audioNum = Ach(7);
                Main.SavePrevChannel();
                Main.SaveSelectedPosition();
                Main.XmlUrl = API.XML_URL;
                widgetAPI.putInnerHTML(getId("resolution"), "");
                getIdn("main");
                if (this.url.indexOf("rtmp://") >= 0) {
                    Main.playerMode = "0";
                    Main.PlayFlashStream();
                } else {
                    Main.playerMode = "1";
                    setTimeout("Main.PlayNoFlashStream()", 50);
                }
                pluginAPI.setOffScreenSaver();
            } else {
                if (this.url.indexOf("stop") == 0 || this.playlistUrl.indexOf("stop") == 0) {
                    alert("stop!");
                } else {
                    Display.status("Нет адреса!");
                }
                setTimeout("Main.Menu();", 500);
            }
        }
    } catch (a) {}
};
Main.playlist = function() { //изменена *.png
    try {
        this.playlistUrl = decLongUrl(this.playlistUrl);
        this.prePlaylistUrl = API.XML_URL;
        this.playlistName = Main.name;
        if (Main.start) {
            this.playlistUrl = "start.xml";
        }
        if (API.Xcode != 0 && !Main.guide && !Main.start && !Main.helpInfo && this.url == "") {
            var c = /[-="',&\/\?\s\_]xxx|porno|sex|erotica|секс|порно|эротика|aнал/i;
            if (c.exec(" " + Main.name) != null || c.exec(" " + API.playlist_name) != null || c.exec(" " + this.playlistUrl) != null) {
                this.xxx = true;
            }
        }
        if (!this.DEL && !Main.guide && this.prevPlaylist && Main.playlistUrl.indexOf("history.dat") < 0) {
            if (API.XML_URL.indexOf("fav.dat") > 0) {
                Main.tempFavNum = Main.favNum;
                Main.tempFavName = Main.favName;
            }
            Main.SavePrevPlaylist();
            if (Main.playlistUrl.indexOf("Open") != 0 && Main.playlistUrl.indexOf("history.dat") < 0 && API.XML_URL != "start.xml") {
                Main.saveHistory("pl_history.dat");
            }
        }
        this.start = false;
        this.search = false;
        if (Main.playlistUrl.indexOf("usb/") == 0) {
            var b = SearchPlToUSB();
            if (b != "") {
                API.XML_URL = b;
                API.Request(b);
            }
        } else {
            if (Main.playlistUrl.indexOf("ScanUSB") == 0) {
                ScanUsbPort();
            } else {
                if (Main.playlistUrl.indexOf("$USB_DIR") == 0) {
                    ReadUsbDirN();
                } else {
                    if (Main.playlistUrl == "OpenHistory") {
                        var a = [
                            ["IP-TV, WEB-TV КАНАЛЫ", "", "file.png", "IP-TV, WEB-TV КАНАЛЫ", "", "live_history.dat", "", "", "", "", "", "", "", ""],
                            ["ФИЛЬМЫ, ВИДЕО", "", "film.png", "ФИЛЬМЫ, ВИДЕО", "", "vod_history.dat", "", "", "", "", "", "", "", ""],
                            ["ПЛЕЙЛИСТЫ, CПИСКИ ФАЙЛОВ", "", "playlist.png", "ПЛЕЙЛИСТЫ, CПИСКИ ФАЙЛОВ", "", "pl_history.dat", "", "", "", "", "", "", "", ""]
                        ];
                        Main.ReadPlArr("OpenHistory", a);
                    } else {
                        if (Main.playlistUrl.indexOf("history.dat") >= 0) {
                            if (API.Xcode != 0) {
                                this.xxx = true;
                                setTimeout("SearchFormular()", 500);
                            } else {
                                Main.opencommonFile(Main.playlistUrl);
                            }
                        } else {
                            if (Main.playlistUrl.indexOf("OpenFav") == 0) {
                                if (API.fav_start_channels.length > 1) {
                                    Main.ReadPlArr("OpenFav", API.fav_start_channels)
                                } else {
                                    Main.FAV = true;
                                    Main.opencommonFile(Main.favUrl);
                                }
                            } else {
                                if (Main.playlistUrl.indexOf("fav.dat") > 0) {
                                    Main.favNum = Main.channelNum;
                                    Main.favName = Main.name;
                                    Main.FAV = true;
                                    Main.opencommonFile(Main.playlistUrl);
                                } else {
                                    if (this.xxx || Main.name.indexOf("-=ПОИСК=-") == 0 || this.searchOn != "") {
                                        if (!this.xxx) {
                                            Main.search = true;
                                        }
                                        setTimeout("SearchFormular()", 500);
                                    } else {
                                        API.XML_URL = this.playlistUrl;
                                        this.loadingPlaylist = true;
                                        Display.status("Загрузка ", 0);
                                        if (Main.parser != "" && Main.parser.indexOf("://") > 0 && Main.playlistUrl.indexOf("md5hash") >= 0) {
                                            API.AsReqMode = false;
                                            this.playlistUrl = decLongUrl(GetHash(Main.parser, this.playlistUrl, ""));
                                            API.AsReqMode = true;
                                            if (this.playlistUrl.indexOf("md5hash") >= 0) {
                                                setTimeout("API.Request(Main.playlistUrl);", 3000);
                                            } else {
                                                API.Request(Main.playlistUrl);
                                            }
                                        } else {
                                            setTimeout("API.Request(Main.playlistUrl);", 50);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (d) {}
};
StartSlideShow = function() {
    Main.blockInfo = true;
    Main.selectNextChannel();
    setTimeout("Main.PlayChannel()", 20);
};
StopSlideShow = function() {
    if (Main.SlideShowInterval !== null) {
        clearInterval(Main.SlideShowInterval);
        Main.SlideShowInterval = null;
    }
};
Main.PlayNoFlashStream = function() {
    Foto = /\.(gif|jpg|jpeg|bmp|tiff|raw )$/i;
    if (Foto.exec(this.url) != null) {
        Main.Foto = true;
    } else {
        StopSlideShow()
    }
    if (API.Ibuffer > 0 && API.Buffer == 0) {
        Main.buffer = "";
    } else {
        if (Main.Foto) {
            Main.buffer = 0.5;
        } else {
            if (Main.buffer != "") {
                Main.buffer = (Main.buffer > 20) ? 20 : (Main.buffer < 0.5) ? 0.5 : Main.buffer;
                if (Main.iBuffer > 0) {
                    Main.iBuffer = (Main.iBuffer > 50) ? 50 : (Main.iBuffer < 10) ? 10 : Main.iBuffer;
                }
            } else {
                if (API.Buffer > 0) {
                    Main.buffer = API.Buffer;
                    if (API.Ibuffer > 0) {
                        Main.iBuffer = API.Ibuffer;
                    }
                }
            }
        }
    }
    getIdb("screen_size");
    var a = this.url;
    a = a.replace("rtp://", "udp://");
    if (a.indexOf("udp://") >= 0) {
        if (dPr(API.Proxy) != "" && API.Proxy.indexOf(":") > 0) {
            a = "http://" + API.Proxy + "/udp/" + a.substr(7);
        }
    } else {
        if (!Main.Foto) {
            API.AsReqMode = false;
            try {
                a = Super_parser(a)
            } catch (b) {
                a = this.url;
            }
            API.AsReqMode = true;
        }
    }
    if (dPr(a) != "") {
        if (a.indexOf(".m3u8") > 0) {
            a = a + "|COMPONENT=HLS";
        }
        Player.play(a, 0)
    } else {
        Player.stopV();
        Display.status("Пустая ссылка!");
        this.prevChannelArray.pop();
        setTimeout("Main.Menu();", 2000);
    }
};
Main.PlayFlashStream = function() {
    Player.next = false;
    Player.state = Player.PLAYING_LIVE;
    Main.saveHistory("live_history.dat");
    KeyHandler.setFocus(2);
    getIdn("screen_size");
    getIdb("flashplayer");
    widgetAPI.putInnerHTML(getId("flashplayer"), "");
    var a = (this.url.indexOf(".flv") >= 0) ? ("flv=" + this.url) : ("file=" + this.url);
    var b = '<object type="application/x-shockwave-flash" id="rmtpplayerHD" width="960" height="540">';
    b += '<param name="movie" value="nflashplayer.swf" />';
    b += '<param name="FlashVars" value="' + a + '" /></object>';
    widgetAPI.putInnerHTML(getId("flashplayer"), b);
    setTimeout("Main.setPlayer();", 500);
};
Main.setPlayer = function() {
    Main.player = window.rmtpplayerHD;
};
Main.stopFPlayer = function() {
    delete Main.player;
    getIdn("flashplayer");
    Display.hidestatus();
    widgetAPI.putInnerHTML(getId("flashplayer"), "");
    Player.state = Player.STOPPED;
};
Main.readBase = function(d, e) {
    var c = new FileSystem();
    var b = c.openFile("base/" + e, "r");
    if (b) {
        while (1) {
            var a = b.readLine();
            if (a == null) {
                break;
            }
            d.push(a);
        }
    }
};
Main.readFile = function(d, e) {
    var c = new FileSystem();
    var b = c.openCommonFile(curWidget.id + "/" + e, "r");
    if (!b) {
        b = c.openCommonFile(e, "r");
    }
    if (b) {
        while (1) {
            var a = b.readLine();
            if (a == null) {
                break;
            }
            d.push(a);
        }
        c.closeCommonFile(b);
    }
};
Main.writeFile = function(d, e) {
    var c = new FileSystem();
    if (!c.isValidCommonPath(curWidget.id)) {
        c.createCommonDir(curWidget.id);
    }
    var b = c.openCommonFile(curWidget.id + "/" + e, "w");
    if (b) {
        for (var a = 0; a < d.length; a++) {
            b.writeLine(d[a]);
        }
        c.closeCommonFile(b);
    }
};
Main.saveHistory = function(d) {
    var c = [dSp(dI(Main.name) + "|" + dI(this.url) + "|" + dI(this.logo) + "|" + dI(Ach(3)) + "||" + dI(this.playlistUrl) + "|" + this.screenSize + "|" + this.audioNum + "|" + this.buffer + "|" + this.iBuffer + "|" + this.timeshift + "|" + this.region + "|" + dI(this.parser) + "|" + dI(this.searchOn))];
    Main.readFile(c, d);
    if (c.length > 50) {
        c.pop();
    }
    var a = (this.url != "") ? dI(this.url) : dI(this.playlistUrl);
    for (var b = 1; b < c.length; b++) {
        if (c[b].indexOf(a) > 0) {
            c.splice(b, 1);
            break;
        }
    }
    Main.writeFile(c, d);
};
Main.delHistory = function(a) {
    var b = [];
    Main.writeFile(b, a);
    Main.PlayPrevPlaylist();
};
Main.saveFavorites = function() {
    var a = [dSp(dI(Main.name) + "|" + dI(this.url) + "|" + dI(this.logo) + "|" + dI(Ach(3)) + "||" + dI(this.playlistUrl) + "|" + this.screenSize + "|" + this.audioNum + "|" + this.buffer + "|" + this.iBuffer + "|" + this.timeshift + "|" + this.region + "|" + dI(this.parser) + "|" + dI(this.searchOn))];
    Main.readFile(a, Main.favUrl);
    Main.writeFile(a, Main.favUrl);
    Display.status('<b style="color:green">Добавлено в избранное №' + Main.favNum + ' - "' + Main.favName + '"</b>');
};
Main.delFavorites = function() {
    var a = this.channelNum - 1;
    var b = [];
    Main.readFile(b, Main.favUrl);
    b.splice(a, 1);
    Main.writeFile(b, Main.favUrl);
    this.DEL = true;
    if (b.length == 0) {
        Display.status('<b style="color:yellow">В избранном №' + Main.favNum + ' - "' + Main.favName + '" -  ПУСТО !</b>');
        Main.FAV = false;
        Main.RED = false;
        if (Main.prevPlaylistArray.length == 0 && API.XML_URL.indexOf("start.xml") < 0) {
            API.XML_URL = "start.xml";
            setTimeout("API.Request(API.XML_URL)", 3000);
        } else {
            setTimeout("Main.PlayPrevPlaylist();", 3000);
        }
    } else {
        this.prevPlaylist = false;
        Main.opencommonFile(Main.favUrl);
    }
};
Main.moveFavorites = function(c) {
    var a = this.channelNum - 1;
    var d = [];
    Main.readFile(d, Main.favUrl);
    if (d.length > 1) {
        c = (a == 0 && c == 1) ? -d.length : (a == d.length - 1 && c == -1) ? d.length - 1 : c;
        this.DEL = true;
        var b = d.splice(a, 1);
        d.splice(a - c, 0, b.toString());
        Main.writeFile(d, Main.favUrl);
        this.prevPlaylist = false;
        Main.opencommonFile(Main.favUrl);
        if (c == -1 || c == d.length - 1) {
            Main.selectNextChannel();
        } else {
            Main.selectPrevChannel();
        }
    }
};
Main.opencommonFile = function(c) {
    var f = [];
    Main.readFile(f, c);
    if (f.length == 0) {
        if (c.indexOf("fav.dat") > 0) {
            if (Main.prevPlaylistArray.length == 0 && API.XML_URL.indexOf("start.xml") < 0) {
                Display.status('<b style="color:yellow">В вашем стартоавом избранном  -  ПУСТО !</b>');
                setTimeout("Display.status('Измените его адрес в настройках виджета')", 3500);
                API.XML_URL = "start.xml";
                setTimeout("API.Request(API.XML_URL)", 7000)
            } else {
                Display.status('<b style="color:yellow">В избранном №' + Main.favNum + " - " + Main.favName + " -  ПУСТО !</b>");
                if (API.XML_URL.indexOf("fav.dat") > 0) {
                    Main.SetFavSelectedPosition();
                    Main.readFile(f, API.XML_URL);
                } else {
                    if (Main.FAV) {
                        Main.FAV = false;
                    }
                }
                if (API.XML_URL.indexOf("OpenFav") >= 0) {
                    this.prevPlaylistArray.pop();
                    this.prevPlaylist = true;
                }
                Selectbox.selected = Selectbox.pre_selected;
                Selectbox.selected_page = Selectbox.pre_selected_page;
            }
        } else {
            Display.status("Пусто!");
        }
    } else {
        var d = [];
        for (var b = 0; b < f.length; b++) {
            var a = f[b];
            a = a.split("|");
            for (var e = 0; e < 14; e++) {
                if (a[e] == undefined) {
                    a[e] = "";
                }
            }
            d.push(a);
        }
        Main.ReadPlArr(c, d);
    }
};
Main.ReadPlArr = function(b, a, d, c) {
    Main.SavePrevPlaylist();
    API.ResetAll();
    API.channels = a;
    if (c != undefined && c.length > 2) {
        API.categories = c;
        if (d != undefined && d.length > 0) {
            API.all_channels = d;
        } else {
            API.all_channels = a;
        }
    }
    API.XML_URL = b;
    API.countPages();
    setTimeout("Main.Menu()", 500);
};

function ScanUsbPort() {
    Main.playlistName = "";
    var r = [];
    var s = '<font color="#55dd00">';
    var q = '<font color="#ffff99">';
    var n = Main.St.GetUSBListSize();
    if (n && n != -1) {
        for (var p = 0; p < n; p++) {
            var l = parseInt(Main.St.GetUSBDeviceID(p), 10);
            var k = Main.St.GetUSBVendorName(l);
            var j = parseInt(Main.St.GetUSBPartitionNum(l), 10);
            var i = Main.St.GetUSBModelName(l);
            for (var o = 0; o < j; o++) {
                var f = Main.St.GetUSBMountPath(l, o);
                var e = ReSize(Main.St.GetUSBAvailSize(l, o) * 1024);
                var d = ReSize(Main.St.GetUSBTotalSize(l, o) * 1024);
                var g = "<h3> Имя : " + q + k + "</font><br>  Модель : " + q + i + "</font><br>  Общий размер : " + q + d + "</font><br>  Свободный размер  : " + q + e + "</font><br>  Директория монтирования  : " + q + f + "</font><br>  № раздела диска  : " + q + j; + "</font></h3>";
                var b = "$USB_DIR/" + f;
                var c = s + k + " - " + i + "</font>";
                var a = [c, "", "usb_logo.png", g, "", b, "", "", "", "", "", "", "", ""];
                r.push(a);
            }
        }
        Main.ReadPlArr(Main.playlistUrl, r);
        API.playlist_name = "USB Накопители";
    } else {
        Display.status("Подключенных USB устройств не найдено!");
    }
}

function SearchPlToUSB() {
    var e = "";
    var i = Main.St.GetUSBListSize();
    if (i && i != -1) {
        for (var j = 0; j < i; j++) {
            var g = parseInt(Main.St.GetUSBDeviceID(j), 10);
            var f = parseInt(Main.St.GetUSBPartitionNum(g), 10);
            for (var k = 0; k < f; k++) {
                var d = Main.St.GetUSBMountPath(g, k);
                var a = "$USB_DIR/" + d;
                var l = new FileSystem();
                var c = l.readDir(a);
                if (c) {
                    for (var b = 0; b < c.length; b++) {
                        if (c[b]["name"] && Main.playlistUrl.substr(4) == c[b]["name"]) {
                            e = "/dtv/usb/" + d + "/" + Main.playlistUrl.substr(4);
                            j = i;
                            break;
                        }
                    }
                }
            }
        }
        if (e == "") {
            Display.status("Плейлист не найден!");
        }
    } else {
        Display.status("Подключенных USB устройств не найдено!");
    }
    return e;
}

function ReadUsbDirN() {
    var c = '<font color="#55dd00">';
    var b = '<font color="#ffffcc">';
    var k = '<font color="#ffff99">';
    var j = '<font color="#00cc99">';
    var i = [];
    var C = [];
    var B = [];
    var A = [];
    var y = [];
    var w = [];
    var u = [];
    var s = 0;
    Playlist = /\.(m3u|xml)$/i;
    Video = /\.(avi|asf|3gp|3g2|3gp2|3gpp|flv|mp4|mp4v|m4v|m2v|m2ts|m2t|mp2v|mov|mpg|mpe|mpeg|mkv|swf|mts|wm|wmv|vob|vro|f4v|ts|tts)$/i;
    Audio = /\.(mp3|mp4a|dts|ac3|wav|wma|flac)$/i;
    Foto = /\.(png|gif|jpg|jpeg|bmp|ico|tiff|mpo|raw)$/i;
    var q = function(H, F, E, D, G, I) {
        s++;
        i = [F, E, D, G, "", I, "", "", "", "", "", "", "", ""];
        H.push(i);
    };
    var z = Main.playlistUrl.indexOf("&page=");
    if (z != -1) {
        Main.step_read_dir = parseInt(Main.playlistUrl["substring"](z + 6), 10);
        Main.playlistUrl = Main.playlistUrl["substring"](0, z);
    }
    var d = new FileSystem();
    var n = d.readDir(Main.playlistUrl);
    if (n) {
        var x = "";
        var t = "";
        if (n.length > ((50 * Main.step_read_dir) + 2)) {
            if (Main.step_read_dir > 1) {
                t = Main.playlistUrl + "&page=" + (Main.step_read_dir - 1);
            }
            x = Main.playlistUrl + "&page=" + (Main.step_read_dir + 1);
            var r = 50 * (Main.step_read_dir - 1);
            var p = (50 * Main.step_read_dir) + 2;
        } else {
            if (Main.step_read_dir != 1) {
                x = Main.playlistUrl + "&page=" + (Main.step_read_dir - 1);
            }
            r = 50 * (Main.step_read_dir - 1);
            p = n.length;
            Main.step_read_dir = 1;
        }
        var f = "";
        for (var o = r + 2; o < p; o++) {
            var g = "";
            if (n[o]["name"]) {
                g = n[o]["name"];
            }
            if (g != "." && g != ".." && f != g) {
                var l = "<h3>Название : " + k + g + "</font>";
                if (!n[o]["isDir"]) {
                    l += "<br> Тип : " + j + "Файл </font>";
                    var e = n[o]["name"]["match"](/\.(\w+)$/i);
                    if (e != null) {
                        e = e[1].toLowerCase();
                        l += ' "' + k + e + '</font>"';
                    } else {
                        l += ' " Без расширения "';
                    }
                    if (n[o]["size"]) {
                        l += "<br> Размер : " + k + ReSize(n[o]["size"]) + "</font>";
                    }
                    var v = Main.playlistUrl.replace("$USB_DIR", "/dtv/usb");
                } else {
                    l += "<br> Тип : " + c + " Папка </font>";
                }
                if (n[o]["mtime"]) {
                    l += "<br> Дата создания : " + k + n[o]["mtime"] + "</font>";
                }
                if (!n[o]["isDir"] && Playlist.exec(g) != null) {
                    q(C, k + g + "</font>", "", "playlist.png", l + "</h3>", v + "/" + g);
                } else {
                    if (!n[o]["isDir"] && Video.exec(g) != null) {
                        q(B, k + g + "</font>", v + "/" + g, "film.png", l + "</h3>", "");
                    } else {
                        if (!n[o]["isDir"] && Audio.exec(g) != null) {
                            q(A, k + g + "</font>", v + "/" + g, "music.png", l + "</h3>", "");
                        } else {
                            if (!n[o]["isDir"] && Foto.exec(g) != null) {
                                q(y, k + g + "</font>", v + "/" + g, "foto.png", l + "</h3>", "");
                            } else {
                                if (!n[o]["isDir"]) {
                                    q(w, b + g + "</font>", v + "/" + g, "file.png", l + "</h3>", "");
                                } else {
                                    if (n[o]["isDir"]) {
                                        q(u, j + g + "</font>", "", "open.png", l + "</h3>", Main.playlistUrl + "/" + g);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            f = g;
        }
    }
    if (API.playlist_name == "USB Накопители") {
        Main.playlistName = Main.name;
    }
    if (s > 0) {
        var a = C.concat(B, A, y, w, u);
        Main.ReadPlArr(Main.playlistUrl, a);
        API.playlist_name = Main.playlistName;
        API.next_page_url = x;
        API.prev_page_url = t;
    } else {
        Display.status("Пустая папка!");
    }
}

function ReSize(b) {
    var a = (b >= 1073741824) ? (b / 1073741824)["toFixed"](2) + " ГБ" : (b >= 1048576) ? (b / 1048576)["toFixed"](2) + " МБ" : (b >= 1024) ? (b / 1024)["toFixed"](2) + " КБ" : (b >= 0) ? b + " Байт" : (b < 0) ? (2 + b / 1073741824)["toFixed"](2) + " ГБ" : "";
    return a;
}
Main.onUnload = function() {  //атозагрузка-кор.выход ????????????
    if (Main.playerMode == "0") {
        Main.stopFPlayer();
    }
    Player.deinit();
    alert("DEINIT");
	//getId("pluginObjectTVMW").SetSource(PL_TVMW_SOURCE_TV); //кор вых 
	//getId("pluginObjectWindow").GetCurrentChannel_Major();
};

function StartTime() {
    clearInterval(Main.IntervalUpdateTime);
    Main.IntervalUpdateTime = setInterval("SetTimeDate()", 1000);
    if (API.Timemode == 0) {
        SyncInetTime();
    }
}
var T = {
    s: 0,
    m: 0,
    h: 0,
    day: 0,
    date: 0,
    month: 0,
    year: 0,
    inetTime: 0,
    delta: 0,
    y_t_days: 0,
    Sync_step: 0,
    timezone: 0
};

function SyncInetTime() {
    var a = null;
    a = new XMLHttpRequest();
    a.onreadystatechange = function() {
        if (a.readyState == 4) {
            var b = Math.round(Number(a.responseText));
            if (!isNaN(b) && b > 0) {
                T.inetTime = b;
                clearInterval(Main.IntervalUpdateTime);
                Main.IntervalUpdateTime = setInterval("SetTimeDate();", 1000);
            } else {
                if (T.Sync_step < 3) {
                    T.Sync_step++;
                    setTimeout("SyncInetTime()", 60000);
                } else {
                    if (T.Sync_step == 3) {
                        T.Sync_step = 0;
                        setTimeout("SyncInetTime()", 30 * 60000);
                        Display.status("Нет связи с серв. синхр. времени!");
                    }
                }
            }
        }
    };
    a.open("GET", "http://wwp.greenwichmeantime.com/time/scripts/clock-8/x.php", true);
    a.setRequestHeader("User-Agent", "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
    a.send();
}

function getDT(b) {
    var a = new Date(b);
    T.year = a.getFullYear();
    T.date = a.getDate();
    T.month = a.getMonth();
    T.day = a.getDay();
    T.h = a.getHours();
    T.m = a.getMinutes();
    T.s = a.getSeconds();
}

function to(d, c, b, a) {
    return (d > 9 ? d : ("0" + d)) + ":" + (c > 9 ? c : ("0" + c)) + ((Player.state != Player.PLAYING_LIVE || a == 0) ? (":" + (b > 9 ? b : ("0" + b))) : "");
}

function SetTimeDate() {
    if (API.Timemode == 0 && T.inetTime > 0) {
        T.inetTime += 1000;
        var g = T.inetTime + API.Timefix * 3600000;
        T.y_t_days = parseInt(T.inetTime / 86400000);
        getDT(g);
    } else {
        if (API.Timemode == 0 || API.Timemode == 1) {
            g = Number(new Date()) + API.Timefix * 3600000;
            T.y_t_days = parseInt(new Date() / 86400000);
            getDT(g);
        } else {
            if (!Main.Emu) {
                var k = getId("pluginTime");
                g = parseInt(k.GetEpochTime() * 1000);
                T.y_t_days = parseInt(g / 86400000);
                getDT(g);
            }
        }
    }
    if (Main.yandexEpgInfoArray.length > 0 && Main.epgT1 <= Main.epgT2) {
        var j = parseInt((T.h * 3600 + T.m * 60 + T.s) * 1000);
        if (Main.epgT1 < 24 * 3600000 && Main.epgT1 > j) {
            j += 24 * 3600000;
        }
        if (Main.epgT1 < j && j <= Main.epgT2) {
            if (j == Main.epgT2) {
                Main.epgT2 = 0;
                Main.epgT1 = 0;
                GetEpgInfo();
            } else {
                var i = j - Main.epgT1;
                var f = Main.epgT2 - Main.epgT1;
                TimeInfo(i, f);
            }
        } else {
            if (j == Main.epgT2 + 1000) {
                Main.epgT2 = 0;
                Main.epgT1 = 0;
                GetEpgInfo();
            } else {
                if (Main.epgT2 < j) {
                    TimeInfo(1, 1);
                } else {
                    TimeInfo(0, 0);
                }
            }
        }
    }
    var g = to(T.h, T.m, T.s, 0);
    getId("widget_time").innerHTML = g;
    getId("time").innerHTML = g;
    var e = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    var d = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    var c = e[T.day];
    var b = d[T.month];
    var a = c + " " + T.date + " " + b;
    getId("widget_date").innerHTML = a;
}

function TimeInfo(e, d) {    //изменена
    if (e >= 0 && d >= e) {
        var c = (e > 0) ? parseInt((100 * e) / d) : 0;
        var b = Math.floor(c * 6.97); /*5.45 progressbar length */
        var a = "";
        getId("progressBar").style.width = b + "px";
        a = (c > 9 ? c : ("0" + c)) + "%  / " + msecToStr(e);
        a += " / " + msecToStr(d);
        getId("timeInfo").innerHTML = a;
    }
}
msecToStr = function(a, b) {
    a = Math.floor(a / 1000);
    m = Math.floor(a / 60);
    a = a % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    return to(h, m, a);
};
var API = { //изменена автостарт
    XML_URL: "start.xml",
    star_url: "start.xml",
    help_url: "help/help.xml",
    Proxy: "",
    Timefix: "0",
    Timemode: "0",
    Xcode: "0",
    Size: "",
    Ph: "100",
    Pw: "100",
    a_size1: "2",
    a_size2: "0",
    a_size3: "0",
    Forma: "0",
    CODE: "213",
    REG: "ru",
    Scode: "0",
    Login: "",
    Pasword: "",
    Surl: "",
    Buffer: "0",
    Ibuffer: "0",
    Timeshift: "0",
    Favname: "Разное|Deutsch|IP-TV|Фильмы|Сериалы|Мультфильмы|Концерты|Клипы|Телепередачи|ХХХ",
    Pstyle: "1",
    Mac: "1",
    Header: "0",
    Vquality: "480p",
    channels: [],
    all_channels: [],
    chan_pages: 0,
    last_page_channels_counter: 0,
    XHRObj: null,
    stReq_timeout: null,
    stReq_time: 50000,
    AsReqMode: true,
    categories: [],
    favorites: [],
    fav_start_channels: [],
    search_string: "",
    next_page_url: "",
    prev_page_url: "",
    playlist_name: "",
    search_on: "",
    next_page_text: "",
    prev_page_text: "",
    fn: "",
	AutoStart: "0",
	firstAutoStart: true,
	AutoStartReset: ""
};
API.init = function() { //изменена автостарт //автостарт возврат тикера
    try {
        Main.MAC = Main.Network.GetMAC();
        API.fn = parseInt(Main.MAC, 16) + "settings.dat";
        var d = [];
        Main.readFile(d, API.fn);
        if (d.length > 0) {
            API.star_url = (dPr(d[0]) != "") ? d[0] : API.star_url;
            API.Surl = (dPr(d[1]) != "") ? d[1] : "";
            API.Login = (dPr(d[2]) != "") ? d[2] : "";
            API.Pasword = (dPr(d[3]) != "") ? d[3] : "";
            API.Proxy = (dPr(d[4]) != "") ? d[4] : "";
            API.Xcode = (d[5] > 0 && d[5] < 10000) ? d[5] : "0";
            API.Scode = (d[6] < 10000 && d[6] > 0) ? d[6] : "0";
            API.Favname = (dPr(d[7]) != "") ? d[7] : API.Favname;
            API.CODE = (d[8] < 100000 && d[8] > 0) ? d[8] : "213";
            API.REG = d[9];
            API.Timeshift = d[10].replace("+", "");
            API.Timemode = d[11];
            API.Timefix = d[12].replace("+", "");
            API.Size = d[13];
            API.Ph = d[14];
            API.Pw = d[15];
            API.a_size1 = d[16];
            API.a_size2 = d[17];
            API.a_size3 = d[18];
            API.Forma = d[19];
            API.Buffer = d[20];
            API.Ibuffer = d[21];
            API.Pstyle = d[22];
            API.Mac = d[23];
            API.Header = d[24];
            API.Vquality = (d[25] == undefined) ? "480p" : d[25];
			API.AutoStart = d[26];
			if ((API.AutoStart == "1") && API.firstAutoStart){
				var tickerchangeyes = Ticker.PutTicker(false);
				if (tickerchangeyes){
					API.AutoStart = "0";
					var b = [API.star_url, API.Surl, API.Login, API.Pasword, API.Proxy, API.Xcode, API.Scode, API.Favname, API.CODE, API.REG, API.Timeshift, API.Timemode, API.Timefix, API.Size, API.Ph, API.Pw, API.a_size1, API.a_size2, API.a_size3, API.Forma, API.Buffer, API.Ibuffer, API.Pstyle, API.Mac, API.Header, API.Vquality, "0"];
					Main.writeFile(b, API.fn);
					setTimeout(function(){Display.status('<font style="color:green;">Автозапуск </font><font style="color:yellow;">ЗАПРЕЩЕН</font><font style="color:green;">. Перезагрузите телевизор.</font>',5000)},6000);
				}else{				
					setTimeout(function(){Display.status('<font style="color:red;">Ошибка!!! Автозапуск НЕ СБРОШЕН.</font>',5000)},6000);	
				}	
			}	
        }
		if (API.AutoStartReset == "1"){	
			setTimeout(function(){Display.status('<font style="color:green;">Автозапуск </font><font style="color:yellow;">ЗАПРЕЩЕН</font><font style="color:green;">. Перезагрузите телевизор и уберите автозапуск.</font>',5000)},4000);
		}
		if (API.AutoStartReset == "0"){
			setTimeout(function(){Display.status('<font style="color:red;">Ошибка!!! Автозапуск НЕ СБРОШЕН.</font>',5000)},4000);
		}
        API.favorites = [];
        API.fav_start_channels = [];
        var c = API.Favname.split("|");
        var i = (c.length > 10) ? 10 : c.length;
        for (var j = 0; j < i; j++) {
            var b = (j > 0) ? j : "";
            if (API.Scode != "" && parseInt(API.Scode, 10) > 0) {
                var a = API.Scode + b + "fav.dat";
            } else {
                a = parseInt(Main.MAC, 16).toString() + b + "fav.dat";
            }
            var f = [c[j], "", "open.png", c[j], "", a, "", "", "", "", "", "", "", ""];
            API.fav_start_channels["push"](f);
            var n = [j, c[j], a];
            API.favorites["push"](n);
        }
        Main.favNum = 1 + API.favorites[0][0];
        Main.favName = API.favorites[0][1];
        Main.favUrl = API.favorites[0][2];
        Main.tempFavNum = Main.favNum;
        Main.tempFavName = Main.favName;
        d = [];
        Main.yandexAuto = false;
        Main.readBase(d, API.CODE + "_ya_name_index_url.dat");
        if (d.length > 0) {
            Main.yandexAuto = true;
            var l = '<font style="color:#55dd00;font-weight:bolder">';
            for (var j = 0; j < d.length; j++) {
                var g = d[j];
                g = g.split("|");
                Ya_name_index_obj[g[0].toLowerCase()] = g[1];
                Ya_icon_index_url_obj[g[1]] = 'http://avatars.yandex.net/' + g[2];
                Ya_icon_name_url_obj[g[0].toLowerCase()] = 'http://avatars.yandex.net/' + g[2];
            }
        }
        setTimeout("StartTime()", 50);
    } catch (k) {
        return false;
    }
    return true;
};
GetYaBaseInfo = function() {
    tempArr = [];
    var c = "";
    Main.readBase(tempArr, API.CODE + "_ya_name_index_url.dat");
    if (tempArr.length > 0) {
        var e = '<font style="color:#55dd00;font-weight:bolder">';
        for (var d = 0; d < tempArr.length; d++) {
            var a = tempArr[d];
            a = a.split("|");
            c += "<br>" + (d + 1) + ") " + a[0] + " - " + e + a[1] + "</font>";
        }
        Main.yandexBaseInfo = true;
    }
    var b = "канала";
    if (parseInt(tempArr.length / 10) * 10 == tempArr.length) {
        b = "каналов";
    }
    c = "В базе для " + e + API.CODE + "</font> региона " + e + tempArr.length + " </font> " + b + " : " + c;
    Main.showinfoList(c);
};
API.loadComplete = function() {
    if (API.channels.length == 0) {
        Display.status('<b style="color:#FF6666">ОШИБКА В СТРУКТУРЕ ПЛЕЙЛИСТА!</b>');
        if (Main.prevPlaylistArray.length == 0 && API.XML_URL == "start.xml") {
            setTimeout("getIdb('main');SetupFormular()", 2000);
        } else {
            setTimeout("Main.PlayPrevPlaylist();", 500);
        }
    } else {
        Display.hidestatus();
        Main.Menu();
    }
};
API.Request = function(b) {
    try {
        Main.guide = false;
        if (API.AsReqMode && b.indexOf("://") > 0) {
            var a = "?";
            if (b.indexOf("?") > 1) {
                if ((b.length - 1) == b.indexOf("?")) {
                    a = "";
                } else {
                    a = "&";
                }
            }
            if (API.search_string != "" && Main.search) {
                b += a + "search=" + API.search_string;
                a = "&";
            }
            if (dPr(API.Surl) != "" && dPr(API.Login) != "" && dPr(API.Pasword) != "" && b.indexOf(API.Surl) >= 0) {
                b += a + API.Login + "&" + API.Pasword;
                a = "&";
            }
            if (API.Mac == "1") {
                b += a + "box_mac=" + Main.MAC.toLowerCase();
            }
            b = Super_Send(b);
            alert("xml_url 1 =" + b);
        }
        if (API.XHRObj != null) {
            API.XHRObj["destroy"]();
            API.XHRObj = null;
        }
        API.XHRObj = new XMLHttpRequest();
        if (API.AsReqMode) {
            KeyHandler.setFocus(1);
            API.stReq_timeout = setTimeout("API.stopRequest()", API.stReq_time);
            API.XHRObj.onreadystatechange = function() {
                if (API.XHRObj.readyState == 4) {
                    API.recieveData(b);
                }
            };
            if (Main.seriesE && API.XHRObj.overrideMimeType) {
                API.XHRObj.overrideMimeType("text/xml");
            }
        }
        API.XHRObj["open"]("GET", b, API.AsReqMode);
        if (!API.AsReqMode || API.Header == "1") {
            API.XHRObj.setRequestHeader("Accept-Encoding", "identity");
            API.XHRObj.setRequestHeader("Accept-Language", "en-us,en;q=0.5");
            API.XHRObj.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            API.XHRObj.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.6) Gecko/20100627 Firefox/3.6.6");
            API.XHRObj.setRequestHeader("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.7");
            API.XHRObj.setRequestHeader("Connection", "close");
        }
        API.XHRObj["send"](null);
        if (!API.AsReqMode) {
            if ((API.XHRObj.status == 302 || API.XHRObj.status == 303) && API.XHRObj.getResponseHeader("Location") != null) {
                b = API.XHRObj.getResponseHeader("Location");
                return API.Request(b);
            } else {
                if (API.XHRObj.readyState == 4 && API.XHRObj.status == 200) {
                    return API.XHRObj.responseText;
                } else {
                    return "";
                }
            }
        }
    } catch (c) {}
};

API.recieveData = function(a) {
    clearTimeout(API.stReq_timeout);
    if (API.XHRObj.status == 200) {
        if (a.toLowerCase().indexOf(".m3u") >= 0 && API.XHRObj.responseText != null && API.XHRObj.responseText != "") {
            API.getChannel_list(API.XHRObj.responseText)
        } else {
            if (API.XHRObj.responseXML != null && API.XHRObj.responseXML != "") {
                API.getChannel_list(API.XHRObj.responseXML)
            } else {
                API.channels = [];
                API.loadComplete();
            }
        }
    } else {
        Display.status('<b style="color:yellow">НЕПРАВИЛЬНЫЙ  АДРЕС ИЛИ ПЛЕЙЛИСТА НЕТ! </b>');
        if (Main.FirstStart) {
            if (API.XML_URL.indexOf("start.xml") < 0) {
                API.XML_URL = "start.xml";
                setTimeout("API.Request(API.XML_URL)", 3000);
            } else {
                setTimeout("getIdb('main');SetupFormular()", 3000);
            }
        } else {
            setTimeout("API.stopRequest()", 500);
        }
    }
};
API.stopRequest = function() {
    clearTimeout(API.stReq_timeout);
    if (API.XHRObj != null) {
        API.XHRObj["abort"]();
        API.XML_URL = Main.prePlaylistUrl;
        Main.prevPlaylistArray.pop();
        API.loadComplete();
    }
};
API.ResetAll = function() {
    API.chan_counter = 0;
    API.channels = [];
    API.all_channels = [];
    API.categories = [];
    if (!Main.FAV) {
        Selectbox.selected = 0;
        Selectbox.selected_page = 0;
    }
    API.playlist_name = "";
    API.next_page_url = "";
    API.prev_page_url = "";
    API.search_on = "";
    API.next_page_text = "";
    API.prev_page_text = "";
    if (!Main.DEL) {
        Main.ResetSelectedPosition();
    }
    Main.DEL = false;
};
API.getChannel_list = function(y) {
    var x = function(X, W, V) {
        try {
            var U = X.getElementsByTagName(W)[0].childNodes[0].nodeValue;
            if (U == null) {
                U = "";
            }
            if (V == 1) {
                return dPr(U, 1);
            } else {
                return lrdPr(U);
            }
        } catch (Y) {
            return "";
        }
    };
    var w = function(X, W, U) {
        try {
            var V = X.getElementsByTagName(W)[0]["getAttributeNode"](U).nodeValue;
            if (V == null) {
                V = "";
            }
            return lrdPr(V)
        } catch (Y) {
            return "";
        }
    };
    try {
        API.ResetAll();
        API.categories["push"](Array("", "Все категории"));
        var v = y;
        var u = "";
        var c = "";
        var b = "";
        var a = "";
        var S = "";
        var R = "";
        var Q = "";
        if (API.XML_URL.toLowerCase().indexOf(".m3u8") < 0) {
            if (API.XML_URL.toLowerCase().indexOf(".m3u") >= 0) {
                var N = {};
                var L = 1;
                var J = v.split("\x0A");
                for (var d = 0; d < J.length; d++) {
                    if ((J[d].indexOf("#EXTINF:") >= 0 && (J[d + 1].indexOf("://") > 0 || J[d + 2].indexOf("://") > 0 || J[d + 1].indexOf("/dtv") > -1 || J[d + 2].indexOf("/dtv") > -1)) || J[d].indexOf("#EXTM3U") >= 0) {
                        var H = "";
                        var f = "";
                        var n = "";
                        var p = "";
                        var P = "";
                        var l = "";
                        var k = "";
                        var j = "";
                        var o = "";
                        var i = "";
                        var g = "";
                        J[d] = J[d].replace(/'/g, '"');
                        g = parser(J[d], "cache=", " ").replace(/"/g, "");
                        g = (g >= 0.5 && g <= 20) ? g : (g >= 50 && g <= 2000) ? g / 100 : "";
                        f = lrdPr(parser(J[d], 'tvg-name="', '"').replace(/"/g, "")).replace(/_/g, " ");
                        if (f != "" && f.indexOf("/m.tv.yandex.") < 0 && f.indexOf("channel=") < 0 && isNaN(parseInt(f))) {
                            var O = Ya_name_index_obj[f.toLowerCase()];
                            f = (O != undefined) ? O : "";
                        }
                        n = parser(J[d], "tvg-shift=", " ").replace(/["\+]/g, "");
                        p = lrdPr(parser(J[d], 'tvg-logo="', '"').replace(/"/g, "")).replace(/_/g, " ");
                        P = parser(J[d], "aspect-ratio=", " ").replace(/"/g, "");
                        P = (P.indexOf("16:9") >= 0 || P.toLowerCase().indexOf("16x9") >= 0 || P.indexOf("0") == 0) ? "0" : (P.indexOf("14:9") >= 0 || P.toLowerCase().indexOf("14x9") >= 0 || P.indexOf("1") == 0) ? "1" : (P.toLowerCase().indexOf("4:3z2") >= 0 || P.toLowerCase().indexOf("4x3z2") >= 0 || P.indexOf("2") == 0) ? "2" : (P.toLowerCase().indexOf("4:3z1") >= 0 || P.toLowerCase().indexOf("4x3z1") >= 0 || P.indexOf("3") == 0) ? "3" : (P.indexOf("4:3") >= 0 || P.toLowerCase().indexOf("4x3") >= 0 || P.indexOf("4") == 0) ? "4" : (P.toLowerCase().indexOf("x-zoom") >= 0 || P.indexOf("5") == 0) ? "5" : "";
                        (P.toLowerCase().indexOf("auto") >= 0 || P.indexOf("6") == 0) ? "6" : "";
                        j = parser(J[d], "audio-track=", " ").replace(/"/g, "");
                        j = (j != "") ? (parseInt(j) + 1).toString() : "";
                        if (d == 0) {
                            c = (p != "") ? p : "";
                            b = (P != "") ? P : "";
                            a = (j != "") ? j : "";
                            S = (g != "") ? g : "";
                            u = (n != "") ? n : "";
                        } else {
                            k = lrdPr(parser(J[d], 'group-title="', '"').replace(/"/g, ""));
                            o = lrdPr(parser(J[d], ","));
                            var t = (J[d + 1].indexOf("://") > 0 || J[d + 1].indexOf("/dtv") > -1) ? J[d + 1] : J[d + 2];
                            t = lrdPr(t);
                            p = (p != "") ? p : c;
                            if (p != "" && p.indexOf("://") < 0 && p.indexOf(".png") < 0) {
                                var r = Ya_icon_name_url_obj[p.toLowerCase()];
                                p = (r != undefined) ? r : "";
                            }
                            if (t.indexOf(".m3u8") < 0) {
                                if (t.indexOf(".m3u") > -1 || t.indexOf(".xml") > -1) {
                                    p = (p == "") ? "open.png" : p;
                                    if (k != "") {
                                        f = "Категория : " + k
                                    }
                                    i = t;
                                    t = "";
                                }
                            }
                            if (t != "") {
                                P = (P != "") ? P : b;
                                j = (j != "") ? j : a;
                                n = (n != "") ? n : u;
                                g = (g != "") ? g : S;
                            }
                            if (k != "") {
                                l = N[k];
                                if (l == undefined) {
                                    N[k] = L;
                                    l = L;
                                    var M = [L, k];
                                    API.categories["push"](M);
                                    L++;
                                }
                            }
                            var q = [o, t, p, f, l, i, P, j, g, "", n, "", "", ""];
                            API.channels["push"](q);
                            d++;
                        }
                    }
                }
            } else {
                if (v) {
                    try {
                        API.playlist_name = x(v, "playlist_name");
                        API.playlist_name = (API.playlist_name == "") ? Main.playlistName : (API.playlist_name == "no_name") ? "" : API.playlist_name;
                        API.next_page_url = x(v, "next_page_url");
                        API.prev_page_url = x(v, "prev_page_url");
                        API.search_on = x(v, "search_on");
                        API.next_page_text = w(v, "next_page_url", "text");
                        API.prev_page_text = w(v, "prev_page_url", "text");
                        var K = v.getElementsByTagName("all_channels");
                        if (K.length > 0) {
                            c = x(K[0], "all_logo");
                            b = x(K[0], "all_size", 1);
                            a = x(K[0], "all_audiotrack_num", 1);
                            S = x(K[0], "all_buffer", 1);
                            u = x(K[0], "all_timeshift", 1);
                            R = x(K[0], "all_region", 1);
                            Q = x(K[0], "all_parser");
                        }
                        var I = v.getElementsByTagName("channel");
                        for (var D = 0; D < I.length; D++) {
                            o = x(I[D], "title");
                            t = x(I[D], "stream_url");
                            p = x(I[D], "logo_30x30");
                            var G = x(I[D], "logo");
                            f = x(I[D], "description");
                            var E = x(I[D], "parser");
                            E = (E != "") ? E : Q;
                            l = x(I[D], "category_id");
                            p = (p != "") ? p : (G != "") ? G : (c != "") ? c : "";
                            i = "";
                            var C = "";
                            P = "";
                            j = "";
                            g = "";
                            var B = "";
                            n = "";
                            var A = "";
                            if (t != "") {
                                P = x(I[D], "size", 1);
                                P = (P != "") ? P : b;
                                j = x(I[D], "audiotrack_num", 1);
                                j = (j != "") ? j : a;
                                g = x(I[D], "buffer", 1);
                                g = (g != "") ? g : S;
                                B = x(I[D], "ibuffer", 1);
                                n = x(I[D], "timeshift", 1);
                                n = (n != "") ? n : u;
                                A = x(I[D], "region", 1);
                                A = (A != "") ? A : R
                            } else {
                                i = x(I[D], "playlist_url");
                                C = x(I[D], "search_on");
                            }
                            q = [o, t, p, f, l, i, P, j, g, B, n, A, E, C];
                            API.channels["push"](q);
                        }
                        try {
                            var z = v.getElementsByTagName("category");
                            for (var s = 0; s < z.length; s++) {
                                var L = x(z[s], "category_id");
                                var k = x(z[s], "category_title");
                                if (L != "" && k != "") {
                                    var M = [L, k];
                                    API.categories["push"](M);
                                }
                            }
                        } catch (F) {
                            API.categories = [];
                        }
                    } catch (F) {
                        API.channels = [];
                    }
                }
            }
        }
    } catch (F) {
        API.channels = [];
    }
    API.countPages();
    if (API.categories.length > 2) {
        API.all_channels = API.channels;
    }
    API.loadComplete();
};
API.setCategory = function(c) {
    API.channels = [];
    Main.ResetSelectedPosition();
    for (var a = 0; a < API.all_channels.length; a++) {
        if (API.all_channels[a][4] == c && c != "") {
            API.channels["push"](API.all_channels[a]);
        } else {
            if (c == "") {
                API.channels["push"](API.all_channels[a]);
            }
        }
    }
    if (API.channels.length == 0) {
        var b = ["В этой категории ничего нет!", "stop", "", "В этой категории ничего нет!", "", "", "", "", "", "", "", "", "", ""];
        API.channels["push"](b);
    }
    API.countPages();
};
API.countPages = function() {
    if (API.channels.length > 0) {
        API.chan_pages = API.channels.length;
        API.last_page_channels_counter = API.channels.length % 10;
        if (API.last_page_channels_counter == 0) {
            API.last_page_channels_counter = 10;
        }
        API.chan_pages = (API.last_page_channels_counter > 0 && API.last_page_channels_counter < 5) ? Math.round(API.chan_pages / 10) + 1 : Math.round(API.chan_pages / 10);
    }
};
var Selectbox = {
    selected: 0,
    pre_selected: 0,
    url_selected: 0,
    select_list: [],
    title: "",
    selected_page: 0,
    pre_selected_page: 0,
    pages: 0,
    last_page_counter: 0
};
Selectbox.setBox = function(c, b) {
    try {
        if (this.title != c) {
            this.selected = 0;
            this.selectedPage = 0;
        }
        if (c == "Выбор качества") {
            this.selected = this.url_selected;
            this.selectedPage = 0;
        }
        this.title = c;
        this.pre_selected = this.selected;
        this.pre_selected_page = this.selectedPage;
        this.select_list = b;
        this.last_page_counter = b.length % 10;
        if (this.last_page_counter == 0) {
            this.last_page_counter = 10;
        }
        this.pages = Math.round(b.length / 10);
        if (this.last_page_counter > 0 && this.last_page_counter < 5) {
            this.pages++;
        }
        Selectbox.updateBox();
    } catch (a) {}
};
Selectbox.updateBox = function() {
    try {
        var f = 10;
        this.selectedPage = (this.selectedPage > this.pages - 1) ? 0 : (this.selectedPage < 0) ? this.pages - 1 : this.selectedPage;
        if (this.selectedPage == this.pages - 1) {
            f = this.last_page_counter;
            if (this.selected > this.last_page_counter - 1) {
                this.selected = this.last_page_counter - 1;
            }
        }
        if (this.selectedPage == this.pages && this.last_page_counter < f + 1) {
            f = this.last_page_counter;
        }
        var d = '<div><div style="text-align:center;width:100%;height:10px;padding:4px;font-size:20px;">' + this.title + "</div><br>";
        for (var a = 0; a < f; a++) {
            var c = 10 * this.selectedPage + a;
            var b = "";
            if (a == this.selected) {
                b = 'style="color:#FFFF00; border: 2px solid #D1FE00" ';
            }
            var i = (this.selectedPage > 0) ? this.selectedPage.toString() + (1 + a) + ") " : (1 + a) + ") ";
            if (this.select_list[c][1]) {
                d += "<li " + b + ">" + i + this.select_list[c][1] + "</li>";
            }
        }
        d += '<div style="height:25px;"><div id="navi_button"><img src="img/buttons/exit.png"></img></div><span id="navi_helpertext">Выход</span>';
        d += '<div id="navi_button"><img src="img/buttons/move.png"></img></div><span id="navi_helpertext">Листать</span>';
        d += '<div id="navi_button"><img src="img/buttons/enter.png"></img></div><span id="navi_helpertext">Выбрать</span></div></div>';
        widgetAPI.putInnerHTML(getId("selectbox"), d);
        getIdb("selectbox");
    } catch (g) {}
};
Selectbox.selectNextItem = function() {
    this.selected++;
    if (this.selected >= 10 || (this.selectedPage == this.pages - 1 && this.selected == this.last_page_counter)) {
        this.selected = 0;
        this.selectedPage++;
    }
    Selectbox.updateBox();
};
Selectbox.selectPrevItem = function() {
    this.selected--;
    if (this.selectedPage == 0 && this.selectedChannel < 0) {
        this.selected = this.last_page_counter - 1;
        this.selectedPage = this.pages - 1;
    }
    if (this.selected < 0) {
        this.selected = 10;
        this.selectedPage--;
    }
    Selectbox.updateBox();
};
Selectbox.selectNextPage = function() {
    this.selectedPage++;
    Selectbox.updateBox();
};
Selectbox.selectPrevPage = function() {
    this.selectedPage--;
    Selectbox.updateBox();
};
Selectbox.SelectCategory = function() {
    var a = this.select_list[10 * this.selectedPage + this.selected][0];
    getIdn("selectbox");
    Main.SavePrevPlaylist();
    API.setCategory(a);
    getIdb("rightHalf");
    Main.Menu();
};
Selectbox.SelectFav = function() {
    var a = this.select_list[10 * this.selectedPage + this.selected][0];
    Main.tempFavNum = Main.favNum;
    Main.favNum = 1 + parseInt(a);
    Main.tempFavName = Main.favName;
    Main.favName = this.select_list[10 * this.selectedPage + this.selected][1];
    Main.tempFavUrl = Main.favUrl;
    Main.favUrl = this.select_list[10 * this.selectedPage + this.selected][2];
    if (Main.FAV && !Main.RED) {
        Main.opencommonFile(Main.favUrl);
    } else {
        Main.saveFavorites();
    }
    if (Main.RED) {
        Main.SetFavSelectedPosition();
        Main.delFavorites();
        KeyHandler.setFocus(5)
    } else {
        KeyHandler.setFocus(0);
    }
    getIdn("selectbox");
    getIdb("rightHalf");
};
Selectbox.SelectSize = function() {
    this.url_selected = this.selected;
    var a = this.select_list[10 * this.selectedPage + this.selected][0];
    a = decLongUrl(a);
    getIdn("selectbox");
    Player.ch_t = Player.cur_time;
    Player.play(a, 0);
    Player.ch = true;
};
var Display = {
    status_timer: null,
    status1_timer: null,
    loadingshow_timer: null,
    index: 1,
    run: false
};
Display.loadingshow = function() {
    if (!this.run) {
        getIdb("loading");
        Display.loadingshowTimer();
        this.run = true;
        Display.loadingstep();
    }
};
Display.loadinghide = function() {
    this.run = false;
    clearTimeout(this.loadingshow_timer);
    getIdn("loading");
};
Display.loadingstep = function() {
    if (this.index < 10) {
        getId("imgAnim").src = "img/loading/loading_0" + this.index + ".png";
    } else {
        getId("imgAnim").src = "img/loading/loading_" + this.index + ".png";
    }
    this.index++;
    if (this.index > 8) {
        this.index = 1;
    }
    if (this.run) {
        setTimeout("Display.loadingstep();", 100); /*loading interval refresh */
    }
};
Display.loadingshowTimer = function() {
    this.loadingshow_timer = setTimeout("Player.ReturnMenu();", 60000);
};
Display.showplayer = function() {		//изменена прокрутка, шапка плеера
    if (KeyHandler.Focus != 0) {
        if (Player.state == Player.PLAYING_VOD || Player.state == Player.PAUSA_VOD) {
            Main.yandexEpgInfoArray = [];
            Main.epgT1 = 0;
            Main.epgT2 = 0;
            getIdn("help_navi_l_player");
            getIdn("p_epg_line");
            if (Main.seriesE) { 
                /*getId("progressBarBG").style.left = "0px";
                getId("timeInfo").style.left = "560px";
				getId("resolution").style.left = "725px";
				getId("time").style.left = "850px";*/
				//getId("progressBarBG").style.left = "9px";
				//getId("timeInfo").style.left = "760px";
				//getId("resolution").style.left = "5px";
                getId("time").style.left = "841px";
				getId("p_info_line").style.left = "130px";
				
				
            } else {
                /*getId("progressBarBG").style.left = "10px";
                getId("timeInfo").style.left = "580px";
				getId("resolution").style.left = "745px";
				getId("time").style.left = "860px";*/
				//getId("progressBarBG").style.left = "19px";
				//getId("timeInfo").style.left = "780px";
				//getId("resolution").style.left = "5px";
                getId("time").style.left = "851px";			//????
				getId("p_info_line").style.left = "140px"; //????
            }
            getIdb("p_info_line");
            getIdb("help_navi_vod_player");
            getId("statusbar").style.top = "68px";
            if (Player.state == Player.PAUSA_VOD) {
                getIdn("vod_pause");
                getIdb("vod_play");
                if (Main.seriesE) {
                    getId("help_navi_vod_player").style.left = "39px";
                } else {
                    getId("help_navi_vod_player").style.left = "48px";
                }
            } else {
                getIdb("vod_pause");
                getIdn("vod_play");
                if (Main.seriesE) {
                    getId("help_navi_vod_player").style.left = "30px"
                } else {
                    getId("help_navi_vod_player").style.left = "40px"
                }
                if (Player.repeat) {
                    Display.status("Режим повторного воспроизведения.");
                } else {
                    if (Player.next) {
                        Display.status("Режим последовательного воспроизведения");
                    }
                }
            }
        } else {
            if (Player.state == Player.PLAYING_LIVE) {
                getIdn("help_navi_vod_player");
                getIdn("p_info_line");
                getIdn("p_epg_line");
                if (Main.seriesE) {
                    if (Main.playerMode == "1") {
                        getId("help_navi_l_player").style.left = "70px";
                    } else {
                        getId("help_navi_l_player").style.left = "130px";
                    }
					/*getId("progressBarBG").style.left = "10px";
					getId("timeInfo").style.left = "595px";
					getId("resolution").style.left = "740px";
					getId("time").style.left = "850px";*/
                    //getId("progressBarBG").style.left = "9px";
					//getId("timeInfo").style.left = "760px";
					//getId("resolution").style.left = "5px";
                    getId("time").style.left = "841px";
					getId("p_info_line").style.left = "130px";
					
                } else {
                    if (Main.playerMode == "1") {
                        getId("help_navi_l_player").style.left = "80px";
                    } else {
                        getId("help_navi_l_player").style.left = "140px";
                    }
                    /*getId("progressBarBG").style.left = "20px";
                    getId("timeInfo").style.left = "605px";
					getId("resolution").style.left = "750px";
					getId("time").style.left = "860px";*/
					//getId("progressBarBG").style.left = "19px";
					//getId("timeInfo").style.left = "770px";
					//getId("resolution").style.left = "5px";
                    getId("time").style.left = "851px";			//???
					getId("p_info_line").style.left = "140px";	//???
                }
                getIdb("help_navi_l_player");
                if (Main.playerMode == "1") {
                    if (Main.yandexEpgInfoArray.length > 0 && Main.yandexProgramId == Main.channelArrayIndex) {
                        getIdb("p_info_line");
                        getIdb("p_epg_line");
                        var a = 302;
                        if (Main.seriesE) {
                            a = 280;
                        }
                        if (getId("epg_info").innerHTML.length > a) {
                            getId("statusbar").style.top = "120px";
                        } else {
                            getId("statusbar").style.top = "100px";
                        }
                    } else {
                        getId("statusbar").style.top = "70px";
                        setTimeout("Main.UpdateChannelInfo()", 400);
                    }
                }
            }
        }
        if (Main.playerMode == "1") {
            getIdb("resolution");
        } else {
            getIdn("resolution");
        }
        if (API.Pstyle == "1") {
            getIdb("p_second_line");
        } else {
            getIdn("p_second_line");
        }
        getIdn("statusbar1");
        getIdb("player");
        clearTimeout(this.infobar_timer);
        if (Player.state != Player.PAUSA_VOD) {
            Display.infobarTimer();
        }
    }
//-----прокрутка---
	setTimeout(function(){roll()},100);	
};
Display.hideplayer = function() {
    getIdn("player");
    getId("statusbar").style.top = "10px";
    if (Main.epgInfoStep != 0) {
        Main.epgInfoStep = 0;
        GetNextEpgInfo();
    }
};
Display.infobarTimer = function() {
    this.infobar_timer = setTimeout("Display.hideplayer()", 8000);
};
Display.status = function(b, a) {
    getIdn("version");
    getIdb("statusbar");
    widgetAPI.putInnerHTML(getId("status"), b);
    clearTimeout(this.status_timer);
    if (a == undefined) {
        Display.statusTimer(1000);
    } else {
        if (a != 0) {
            Display.statusTimer(a);
        }
    }
};
Display.status1 = function(a) {
    getIdb("statusbar1");
    widgetAPI.putInnerHTML(getId("status1"), a);
    clearTimeout(this.status1_timer);
    Display.status1Timer();
};
Display.hidestatus = function() {
    getIdn("statusbar");
    getIdb("version");
};
Display.statusTimer = function(a) {
    this.status_timer = setTimeout("Display.hidestatus()", a);
};
Display.status1Timer = function() {
    this.status1_timer = setTimeout('getIdn("statusbar1")', 3000);
};
var KeyHandler = {
    NumberEntered: "",
    ChSelectorTimeout: null,
    Menu: 0,
    Focus: 1,
    guide_step: 0,
    black_line: false,
    bl: false,
    send_Return: false
};

function ShowMenuTV() {
    if (KeyHandler.Menu == 0) {
        Main.registVOLTVKey();
        pluginAPI.ShowTools(1);
        if (Main.serieC || Player.state == Player.STOPPED) {
            KeyHandler.Menu = 1;
        }
    } else {
        Main.registVOLTVKey();
        pluginAPI.ShowTools(0);
        KeyHandler.Menu = 0;
    }
}

function SmartExit() { //изменена автостарт exit return ???;
    widgetAPI.blockNavigation(event);
    if (Player.state == Player.STOPPED) {
        if (KeyHandler.send_Return) {
		/*	if (API.AutoStart == "1") widgetAPI.sendExitEvent();
			else widgetAPI.sendReturnEvent(); */
			
			//var	Window = getId("pluginObjectWindow");
			//var TVMW = getId("pluginObjectTVMW");
			/*if (Main.seriesE) Window.SetSource(PL_TVMW_SOURCE_TV);
			else TVMW.SetSource(PL_TVMW_SOURCE_TV);*/
			//Main.OnUnload();
			//getId("pluginObjectTVMW").SetSource(PL_TVMW_SOURCE_TV);
			//getId("pluginObjectWindow").SetSource(PL_WINDOW_SOURCE_ATV);
			widgetAPI.sendReturnEvent();	
        }
        KeyHandler.send_Return = true;
        Display.status('<b style="color:#FF6666">Для выхода нажмите ещё раз EXIT!</b>', 2000);
        setTimeout("KeyHandler.send_Return=false;", 2000);
    } else {
        Player.ReturnMenu();
    }
};
KeyHandler.setFocus = function(a) {
    KeyHandler.Focus = a;
    switch (a) {
        case 0:
            getId("MainMenu_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.registKey(tvKey.KEY_TOOLS);
            }
            break;
        case 1:
            getId("LoadingPlayer_Anchor")["focus"]();
            break;
        case 2:
            getId("LivePlayer_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.unregistKey(tvKey.KEY_TOOLS);
            }
            break;
        case 3:
            getId("VODPlayer_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.unregistKey(tvKey.KEY_TOOLS);
            }
            break;
        case 4:
            getId("Selectbox_Anchor")["focus"]();
            break;
        case 5:
            getId("RedFav_Anchor")["focus"]();
            break;
        case 6:
            getId("Guide_Anchor")["focus"]();
            break;
        case 7:
            getId("Setap_Anchor")["focus"]();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.KanalSelector = function() {
    if (KeyHandler.NumberEntered > API.channels.length) {
        Display.status("ошибка ввода");
    } else {
        if (KeyHandler.NumberEntered > 0) {
            Main.selectedChannel = (KeyHandler.NumberEntered < 11) ? KeyHandler.NumberEntered - 1 : ((KeyHandler.NumberEntered % 10) > 0) ? (KeyHandler.NumberEntered % 10) - 1 : 9;
            Main.selectedPage = Math.round(KeyHandler.NumberEntered / 10);
            if (Main.selectedChannel > 3) {
                Main.selectedPage--;
            }
            Main.channelArrayIndex = parseInt(KeyHandler.NumberEntered - 1);
            if (Main.loadingPlaylist) {
                Player.ReturnMenu();
            } else {
                Main.blockInfo = true;
                Main.UpdateChannelInfo();
                setTimeout("Main.PlayChannel()", 20);
            }
        }
    }
    KeyHandler.NumberEntered = "";
};
KeyHandler.Keys10 = function(b) {
    var a = "";
    switch (b) {
        case tvKey.KEY_1:
            a = "1";
            break;
        case tvKey.KEY_2:
            a = "2";
            break;
        case tvKey.KEY_3:
            a = "3";
            break;
        case tvKey.KEY_4:
            a = "4";
            break;
        case tvKey.KEY_5:
            a = "5";
            break;
        case tvKey.KEY_6:
            a = "6";
            break;
        case tvKey.KEY_7:
            a = "7";
            break;
        case tvKey.KEY_8:
            a = "8";
            break;
        case tvKey.KEY_9:
            a = "9";
            break;
        case tvKey.KEY_0:
            a = "0";
            break;
        default:
            alert("Unhandled key");
            break;
    }
    KeyHandler.NumberEntered = KeyHandler.NumberEntered + a;
    if (KeyHandler.NumberEntered != "") {
        Display.hideplayer();
        if (Main.playerMode == "0" && Player.state != Player.STOPPED) {
            Main.player["info"](KeyHandler.NumberEntered);
        } else {
            Display.status1(KeyHandler.NumberEntered);
        }
        clearTimeout(this.ChSelectorTimeout);
        this.ChSelectorTimeout = setTimeout("KeyHandler.KanalSelector()", 2000);
    }
};
KeyHandler.RedFavKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case tvKey.KEY_RED:
            Main.delFavorites();
            break;
        case tvKey.KEY_GREEN:
            Main.moveFavorites(1);
            break;
        case tvKey.KEY_YELLOW:
            Main.moveFavorites(-1);
            break;
        case tvKey.KEY_BLUE:
            if (API.favorites.length > 1) {
                Main.showFavSelector()
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            Main.RED = false;
            Main.Menu();
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (Player.state != Player.STOPPED) {
                Player.stopV()
            }
            setTimeout("getIdn('main')", 100);
            Main.LoadTimer("ChannelSetupFormular()", 600);
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.GuideKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case 256:
        case 1057:
        case tvKey.KEY_RETURN:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            Main.PlayPrevPlaylist();
            if (Player.state == Player.PLAYING_LIVE) {
                this.guide_step = 1
            }
            break;
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case 68:
        case 1078:
            Scrol("allInfo", -28);
            break;
        case 65:
        case 1080:
            Scrol("allInfo", 28);
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.MainMenuKeyDown = function() {
    var b = event.keyCode;
    KeyHandler.Keys10(b);
    switch (b) {
        case tvKey.KEY_SOURCE:
            if (!Main.FirstStart) {
                Main.playlistUrl = "ScanUSB";
                Main.playlist();
            }
            break;
        case 1086:
        case 84:
            if (API.XML_URL.indexOf("start.xml") != 0) {
                Main.start = true;
                Main.playlist();
            } else {
                Main.PlayPrevPlaylist();
            }
            break;
        case 256:
        case 1057:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            if (Main.playChannelArrayIndex != Main.channelArrayIndex) {
                this.guide_step = 0;
            }
            if (Main.yandexTvMode && this.guide_step == 0 && Main.yandexProgramInfoArray.length > 0) {
                Main.guide = true;
                Main.ReadPlArr(API.XML_URL, Main.yandexProgramInfoArray);
            } else {
                if (Player.state == Player.PLAYING_LIVE && this.guide_step == 1) {
                    this.guide_step = 0;
                    Main.SetSelectedPosition();
                    getIdn("main");
                    Display.hidestatus();
                    KeyHandler.setFocus(2);
                    Display.showplayer();
                } else {
                    Display.status("Подробной программки нет!");
                }
            }
            break;
        case tvKey.KEY_INFO:
            if (API.channels.length < 1000) {
                if (Main.helpInfo) {
                    for (var a = 0; a < Main.helpStep; a++) {
                        Main.prevPlaylistArray.pop();
                    }
                    Main.helpStep = 0;
                    Main.PlayPrevPlaylist();
                } else {
                    Main.playlistUrl = API.help_url;
                    Main.helpInfo = true;
                    Main.playlist();
                }
            } else {
                Display.status("Недоступно!");
                setTimeout("Display.status('Большой плейлист!')");
            }
            break;
        case tvKey.KEY_TOOLS:
            if (!Main.FirstStart && !Main.helpInfo) {
                if (Player.state != Player.STOPPED) {
                    Player.stopV();
                    setTimeout("getIdn('main')", 700);
                    Main.LoadTimer("SetupFormular();", 1500);
                } else {
                    getIdn("main");
                    Main.LoadTimer("SetupFormular();", 600);
                }
            }
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case 78:
        case 259:
            if (!Main.helpInfo) {
                Main.PlayPrevChannel();
            }
            break;
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Player.state != Player.STOPPED && Main.XmlUrl == API.XML_URL) {
                this.guide_step = 0;
                Main.SetSelectedPosition();
                getIdn("main");
                Display.hidestatus();
                if (Player.state == Player.PLAYING_LIVE) {
                    KeyHandler.setFocus(2);
                } else {
                    KeyHandler.setFocus(3);
                }
                Display.showplayer();
            } else {
                Main.PlayPrevPlaylist();
            }
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case 612:
        case 309:
        case tvKey.KEY_ENTER:
            if (KeyHandler.NumberEntered != "") {
                clearTimeout(this.ChSelectorTimeout);
                KeyHandler.KanalSelector();
            } else {
                if (Main.helpInfo) {
                    Main.helpStep++;
                }
                Main.PlayChannel();
            }
            break;
        case tvKey.KEY_RED:
            if (!Main.helpInfo && !Main.FAV && API.categories.length > 2) {
                Main.showCategorySelector();
            } else {
                if (API.XML_URL.indexOf("history.dat") > 0) {
                    Main.delHistory(API.XML_URL);
                } else {
                    Display.status("Недоступно!");
                }
            }
            break;
        case tvKey.KEY_GREEN:
            if (!Main.FAV && !Main.blockFav && API.XML_URL.indexOf("Open") < 0) {
                if (API.favorites.length > 1) {
                    Main.showFavSelector();
                } else {
                    Main.saveFavorites();
                }
            } else {
                Display.status("Недоступно!");
            }
            break;
        case tvKey.KEY_YELLOW:
            if (!Main.blockFav && API.XML_URL.indexOf("Open") < 0) {
                if (API.favorites.length < 2 && !Main.FAV) {
                    Main.FAV = true;
                    Main.opencommonFile(Main.favUrl);
                } else {
                    if (API.favorites.length > 1) {
                        Main.FAV = true;
                        Main.showFavSelector();
                    }
                }
            } else {
                Display.status("Недоступно!");
            }
            break;
        case tvKey.KEY_BLUE:
            if (Main.FAV && !Main.blockFav) {
                Main.RED = true;
                Main.Menu();
            } else {
                if (Player.state == Player.STOPPED) {
                    if (Main.ret) {
                        this.bl = true;
                    }
                    Main.PlayPrevPlaylist();
                }
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            if (Main.yandexTvMode) {
                T.delta++;
                if (T.delta == 101) {
                    T.delta = 0;
                }
                YandexGetUrl(GetYindex());
            } else {
                ListNextPage();
            }
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Player.total_time != 0) {
                if (Player.state == Player.PAUSA_VOD) {
                    Player.resumeVideo();
                } else {
                    Player.pauseVideo();
                }
            } else {
                if (Main.yandexTvMode) {
                    Main.yandexFlagStep++;
                    YandexGetUrl(GetYindex());
                } else {
                    if (API.XML_URL.indexOf("start.xml") == 0) {
                        if (Main.yandexAuto && !Main.yandexBaseInfo) {
                            GetYaBaseInfo();
                        }
                    }
                }
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            if (Main.yandexTvMode) {
                T.delta--;
                if (T.delta == 99) {
                    T.delta = 0;
                }
                YandexGetUrl(GetYindex());
            } else {
                ListPrevPage();
            }
            break;
        case 68:
        case 1078:
            Scrol("allInfo", -31);
            break;
        case 65:
        case 1080:
            Scrol("allInfo", 31);
            break;
        case tvKey.KEY_PLAY:
            widgetAPI.blockNavigation(event);
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                if (Main.yandexTvMode) {
                    if (!Main.yandexAllDay) {
                        Main.yandexAllDay = true;
                    } else {
                        Main.yandexAllDay = false;
                    }
                    YandexGetUrl(GetYindex());
                } else {
                    if (Player.state == Player.STOPPED) {
                        Main.PlayChannel();
                    } else {
                        if (Player.total_time != 0) {
                            if (!Player.next && !Player.repeat) {
                                Player.next = true;
                                Display.status("Последовательное воспроизведение");
                            } else {
                                if (Player.next && !Player.repeat) {
                                    Player.repeat = true;
                                    Display.status("Повторное воспроизведение");
                                } else {
                                    if (Player.next && Player.repeat) {
                                        Player.next = false;
                                        Player.repeat = false;
                                        Display.status("Все режимы отключены !");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        case tvKey.KEY_REC:
            if (Main.sort == false) {
                API.channels.sort();
                Main.updatePage();
                Main.sort = true;
            } else if (Main.sort == true) {
                API.channels.reverse();
                Main.updatePage();
                Main.sort = false;
            } else {
                Main.sort = false;
            }
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (Main.FAV) {
                if (Player.state != Player.STOPPED) {
                    Player.stopV();
                }
                setTimeout("getIdn('main')", 100);
                Main.LoadTimer("ChannelSetupFormular()", 600);
            } else {
                if (!Main.helpInfo) {
                    if (Player.state != Player.STOPPED) {
                        Player.stopV();
                    }
                    setTimeout("getIdn('main')", 100);
                    Main.LoadTimer("SearchFormular()", 600);
                } else {
                    if (Player.state != Player.STOPPED) {
                        Player.ReturnMenu();
                    }
                }
            }
            break;
        case 1249:
        case 192:
            widgetAPI.blockNavigation(event);
            break;
        case 1236:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            Player.SEFSetNextAudioStream();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.LoadingPlayerKeyDown = function() {
    var a = event.keyCode;
    KeyHandler.Keys10(a);
    switch (a) {
        case tvKey.KEY_UP:
        case 105:
        case 68:
        case 1078:
            if (!Main.loadingPlaylist) {
                Main.blockInfo = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 50);
            }
            break;
        case tvKey.KEY_DOWN:
        case 106:
        case 65:
        case 1080:
            if (!Main.loadingPlaylist) {
                Main.blockInfo = true;
                Main.selectPrevChannel();
                setTimeout("Main.PlayChannel()", 50);
            }
            break;
        case 78:
        case 259:
            if (!Main.loadingPlaylist) {
                Main.PlayPrevChannel();
            }
            break;
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            if (!Main.loadingPlaylist) {
                Player.ReturnMenu();
            } else {
                API.stopRequest();
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (!Main.loadingPlaylist) {
                Player.ReturnMenu();
            }
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (!Main.loadingPlaylist) {
                Player.ReturnMenu();
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.SelectboxKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_DOWN:
            Selectbox.selectNextItem();
            break;
        case tvKey.KEY_UP:
            Selectbox.selectPrevItem();
            break;
        case tvKey.KEY_ENTER:
            if (Selectbox.title == "Выбор качества") {
                Selectbox.SelectSize();
            } else {
                if (Selectbox.title == "Выбор избранного") {
                    Selectbox.SelectFav();
                } else {
                    Selectbox.SelectCategory();
                }
            }
            break;
        case tvKey.KEY_LEFT:
            Selectbox.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Selectbox.selectNextPage();
            break;
        case tvKey.KEY_EXIT:
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (API.XML_URL != Main.favUrl) {
                Main.FAV = false;
            }
            getIdn("selectbox");
            getIdb("rightHalf");
            if (Selectbox.title == "Выбор качества") {
                KeyHandler.setFocus(3);
            } else {
                if (!Main.RED) {
                    KeyHandler.setFocus(0);
                } else {
                    KeyHandler.setFocus(5);
                }
            }
            break;
        case tvKey.KEY_GREEN:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        case tvKey.KEY_YELLOW:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        case tvKey.KEY_BLUE:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.LivePlayerKeyDown = function() {
    var a = event.keyCode;
    KeyHandler.Keys10(a);
    switch (a) {
        case 1086:
        case 84:
            if (Player.size == 5) {
                if (Main.SetZoom) {
                    Main.SetZoom = false;
                } else {
                    Main.SetZoom = true;
                    Display.status('<table><tr><td><img src="img/buttons/move_m.png"></img></td><td>- Изменить размеры</td></tr></table>', 0);
                }
            }
            break;
        case 1057:
        case 256:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            if (Main.yandexTvMode) {
                Display.hideplayer();
                Main.Menu();
            } else {
                Display.status("Программки НЕТ !");
            }
            break;
        case tvKey.KEY_TOOLS:
            if (Main.serieC) {
                widgetAPI.blockNavigation(event);
            }
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case tvKey.KEY_GREEN:
            if (Main.hardwareType == 0 || Main.hardwareType == 1) {
                Main.registVOLTVKey();
                pluginAPI.ShowTools(0);
            } else {
                Player.SEFSetNextAudioStream();
            }
            break;
        case tvKey.KEY_YELLOW:
            Main.registVOLTVKey();
            pluginAPI.ShowTools(1);
            break;
        case 78:
        case 259:
            Main.PlayPrevChannel();
            break;
        case tvKey.KEY_BLUE:
        case 653:
        case 1249:
        case 1083:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "1") {
                if (Player.size >= 6) {
                    Player.setSize(0, 1, 0);
                } else {
                    Player.setSize(Player.size + 1, 1, 0);
                }
                Main.SetZoom = false;
            } else {
                Display.status("недоступно!");
            }
            break;
        case 1219:
            if (Main.playerMode == "1") {
                if (Player.get3DMode() >= 2) {
                    Player.change3DMode(0);
                } else {
                    Player.change3DMode(Player.get3DMode() + 1);
                }
            } else {
                Display.status("недоступно!");
            }
            break;
        case tvKey.KEY_UP:
        case 105:
        case 68:
        case 1078:
            if (Main.SetZoom) {
                if (Player.Ph < 150) {
                    Player.Ph++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Main.blockInfo = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 20);
            }
            break;
        case tvKey.KEY_DOWN:
        case 106:
        case 65:
        case 1080:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Main.blockInfo = true;
                Main.selectPrevChannel();
                setTimeout("Main.PlayChannel()", 20);
            }
            break;
        case tvKey.KEY_RIGHT:
            if (Main.SetZoom) {
                if (Player.Pw < 150) {
                    Player.Pw++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                SetVolume(0);
            }
            break;
        case tvKey.KEY_LEFT:
            if (Main.SetZoom) {
                if (Player.Pw > 50) {
                    Player.Pw--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                SetVolume(1);
            }
            break;
        case tvKey.KEY_INFO:
        case tvKey.KEY_ENTER:
            if (KeyHandler.NumberEntered != "") {
                clearTimeout(this.ChSelectorTimeout);
                KeyHandler.KanalSelector();
            } else {
                if (Main.playerMode == "0") {
                    Main.player["info"]("Флеш-Плеер");
                }
                Display.showplayer();
            }
            break;
        case 612:
        case 309:
        case tvKey.KEY_STOP:
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "0") {
                Main.stopFPlayer();
                Main.Menu();
            } else {
                Player.ReturnMenu();
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "0") {
                Main.stopFPlayer();
            } else {
                Display.hideplayer();
            }
            Main.Menu();
            break;
        case tvKey.KEY_PLAY:
            if (Main.Foto) {
                if (Main.SlideShowInterval == null) {
                    Main.SlideShowInterval = setInterval("StartSlideShow();", 8000);
                    Display.status("Пуск слайдшоу", 0);
                } else {
                    Display.status("Стоп слайдшоу");
                    StopSlideShow();
                }
            } else {
                if (Main.playerMode == "1") {
                    Player.play(Player.url, 0);
                } else {
                    Display.status("недоступно!");
                }
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "1") {
                if (Main.epgInfoStep <= Main.yandexEpgInfoArray.length - 1) {
                    Main.epgInfoStep++;
                    GetNextEpgInfo();
                } else {
                    Display.status("Нет данных!");
                }
            } else {
                Display.status("недоступно!");
            }
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "1") {
                Main.epgInfoStep = 0;
                GetNextEpgInfo();
            } else {
                Display.status("недоступно!");
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "1") {
                if (Main.epgInfoStep > 0) {
                    Main.epgInfoStep--;
                    GetNextEpgInfo();
                } else {
                    Display.status("Нет данных!");
                }
            } else {
                Display.status("недоступно!");
            }
            break;
        case 192:
            if (this.black_line) {
                getIdn("black_line_top");
                this.black_line = false;
            } else {
                getIdb("black_line_top");
                this.black_line = true;
            }
            break;
        case 655:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            if (Main.playerMode == "1") {
                Player.SEFSetNextAudioStream();
            } else {
                Display.status("недоступно!");
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.VODPlayerKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_0:
            Player.PercentJump(0);
            Display.status("0%");
            break;
        case tvKey.KEY_1:
            Player.PercentJump(1);
            break;
        case tvKey.KEY_2:
            Player.PercentJump(2);
            break;
        case tvKey.KEY_3:
            Player.PercentJump(3);
            break;
        case tvKey.KEY_4:
            Player.PercentJump(4);
            break;
        case tvKey.KEY_5:
            Player.PercentJump(5);
            break;
        case tvKey.KEY_6:
            Player.PercentJump(6);
            break;
        case tvKey.KEY_7:
            Player.PercentJump(7);
            break;
        case tvKey.KEY_8:
            Player.PercentJump(8);
            break;
        case tvKey.KEY_9:
            Player.PercentJump(9);
            break;
        case 1086:
        case 84:
            if (Player.size == 5) {
                if (Main.SetZoom) {
                    Main.SetZoom = false;
                } else {
                    Main.SetZoom = true;
                    Display.status('<table><tr><td><img src="img/buttons/move_m.png"></img></td><td>- Изменить размеры</td></tr></table>', 0);
                }
            }
            break;
        case 78:
        case 259:
            Main.PlayPrevChannel();
            break;
        case 105:
        case 68:
        case 1078:
            Main.blockInfo = true;
            Main.selectNextChannel();
            setTimeout("Main.PlayChannel()", 20);
            break;
        case 106:
        case 65:
        case 1080:
            Main.blockInfo = true;
            Main.selectPrevChannel();
            setTimeout("Main.PlayChannel()", 20);
            break;
        case tvKey.KEY_TOOLS:
            if (Main.serieC) {
                widgetAPI.blockNavigation(event);
            }
            break;
        case tvKey.KEY_INFO:
            Display.showplayer();
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case tvKey.KEY_UP:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(2);
            }
            break;
        case tvKey.KEY_DOWN:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(-2);
            }
            break;
        case tvKey.KEY_LEFT:
            if (Main.SetZoom) {
                if (Player.Pw > 50) {
                    Player.Pw--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(-0.1);
            }
            break;
        case tvKey.KEY_RIGHT:
            if (Main.SetZoom) {
                if (Player.Pw < 150) {
                    Player.Pw++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(0.1);
            }
            break;
        case tvKey.KEY_BLUE:
        case 653:
        case 1249:
        case 1083:
            widgetAPI.blockNavigation(event);
            if (Main.playerMode == "1") {
                if (Player.size >= 6) {
                    Player.setSize(0, 1, 0);
                } else {
                    Player.setSize(Player.size + 1, 1, 0);
                }
                Main.SetZoom = false
            } else {
                Display.status("недоступно!");
            }
            break;
        case tvKey.KEY_ENTER:
            if (Player.save_time != 0) {
                Player.PlaySeveTime();
            } else {
                if (Player.state == Player.PAUSA_VOD) {
                    Player.resumeVideo();
                } else {
                    Player.pauseVideo();
                }
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Player.total_time == 0) {
                Player.stopV();
            }
            Main.Menu();
            break;
        case 612:
        case 309:
        case tvKey.KEY_STOP:
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            Player.ReturnMenu();
            break;
        case tvKey.KEY_RED:
            if (Main.urlArray.length > 1) {
                Main.showSiseSelector();
                Main.LoadTimer("getIdn('selectbox');getIdb('rightHalf');KeyHandler.setFocus(3);", 20000);
            } else {
                Display.status("Недоступно!");
            }
            break;
        case tvKey.KEY_GREEN:
            if (Main.hardwareType == 0 || Main.hardwareType == 1) {
                Main.registVOLTVKey();
                pluginAPI.ShowTools(0);
            } else {
                Player.SEFSetNextAudioStream();
            }
            break;
        case tvKey.KEY_YELLOW:
            Main.registVOLTVKey();
            pluginAPI.ShowTools(1);
            break;
        case 1219:
            if (Player.get3DMode() >= 2) {
                Player.change3DMode(0);
            } else {
                Player.change3DMode(Player.get3DMode() + 1);
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            Player.MinutesJump(0.5);
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                Player.pauseVideo();
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            Player.MinutesJump(-0.5);
            break;
        case 192:
            if (this.black_line) {
                getIdn("black_line_top");
                this.black_line = false;
            } else {
                getIdb("black_line_top");
                this.black_line = true;
            }
            break;
        case tvKey.KEY_PLAY:
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                if (!Player.next && !Player.repeat) {
                    Player.next = true;
                    Display.status("Последовательное воспроизведение");
                } else {
                    if (Player.next && !Player.repeat) {
                        Player.repeat = true;
                        Display.status("Повторное воспроизведение");
                    } else {
                        if (Player.next && Player.repeat) {
                            Player.next = false;
                            Player.repeat = false;
                            Display.status("Все режимы отключенны !");
                        }
                    }
                }
            }
            break;
        case 655:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            Player.SEFSetNextAudioStream();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
var Player = {
    plugin: null,
    Screen3Dplugin: null,
    SefPlugin: null,
    buffering_timer: null,
    state: -1,
    w: 0,
    h: 0,
    Pw: 100,
    Ph: 100,
    message: "",
    size: 0,
    STOPPED: 0,
    LOADING: 1,
    PLAYING_LIVE: 2,
    PLAYING_VOD: 3,
    PAUSA_VOD: 4,
    statusmessage: "",
    total_time: 0,
    cur_time: 0,
    save_time: 0,
    delta_time: 0,
    next: false,
    repeat: false,
    Sef: false,
    jump: false,
    long_pause: false,
    mode3D: 0,
    status3D: "",
    tnum: 0,
    url: "",
    h_url: "",
    serr: 0,
    eerr: "",
    ch: false,
    ch_t: 0
};
Player.init = function() { // поправлен "косяк С,D-серия эмуль2011"
    var b = true;
    this.state = this.STOPPED;
    var a = getId("pluginObjectNNavi");
    var d = a.GetFirmware();
	d = d.split("-");
    //if (d[1] && (d[1].indexOf("2011") != -1 || d[1].indexOf("2012") != -1 || d[1].indexOf("2013") != -1) || d[1].indexOf("2014") != -1) {
	if (d[1] && (d[1].indexOf("2011") != -1 || d[1].indexOf("2012") != -1 || d[1].indexOf("2013") != -1 || d[1].indexOf("2014") != -1)) {
        this.SefPlugin = getId("pluginObjectSef");
    }
    if (this.SefPlugin != null) {
        this.Sef = true;
    } else {
        this.plugin = getId("pluginPlayer");
    }
    var c = getId("pluginObjectTVMW");
    if ((this.plugin != null || this.Sef) && c != null) {
        this.Screen3Dplugin = getId("pluginObjectScreen3D");
        c.SetMediaSource();
        if (this.plugin) {
            this.plugin.OnConnectionFailed = "Player.OnConnectionFailed";
            this.plugin.OnNetworkDisconnected = "Player.OnNetworkDisconnected";
            this.plugin.OnStreamNotFound = "Player.OnStreamNotFound";
            this.plugin.OnRenderError = "Player.OnRenderError";
            this.plugin.OnBufferingStart = "Player.OnBufferingStart";
            this.plugin.OnBufferingProgress = "Player.OnBufferingProgress";
            this.plugin.OnBufferingComplete = "Player.OnBufferingComplete";
            this.plugin.OnCurrentPlayTime = "Player.OnCurrentPlayTime"
        }
    } else {
        b = false;
    }
    return b;
};
Player.get3DMode = function() {
    try {
        if (this.Screen3Dplugin != null) {
            if (1 == this.Screen3Dplugin.Flag3DEffectSupport() || this.Screen3Dplugin.Flag3DTVConnect() == 1) {
                return this.mode3D;
            } else {
                return 0;
            }
        }
    } catch (a) {
        return 0;
    }
};
Player.change3DMode = function(a) {
    if (this.Screen3Dplugin != null) {
        this.mode3D = a;
        this.status3D = "";
        if (1 == this.Screen3Dplugin.Flag3DEffectSupport() || this.Screen3Dplugin.Flag3DTVConnect() == 1) {
            switch (a) {
                case 0:
                    this.status3D = "3D OFF";
                    break;
                case 1:
                    this.status3D = "SIDE - BY - SIDE";
                    break;
                case 2:
                    this.status3D = "TOP - BOTTOM";
                    break;
            }
            if (Main.seriesC) {
                if (this.Screen3Dplugin.Check3DEffectMode(a) == 1) {
                    this.Screen3Dplugin.Set3DEffectMode(a);
                }
            } else {
                Player.play(Player.url, 0);
            }
        }
    }
};
Player.OnConnectionFailed = function() {
    Player.error(9);
};
Player.OnNetworkDisconnected = function() {
    Player.error(8);
};
Player.OnStreamNotFound = function() {
    Player.error(7);
};
Player.OnRenderError = function(a) {
    Player.error(a);
};
Player.error = function(a) {
    if (this.state != this.STOPPED && a >= 1) {
        this.eerr = (a == 1) ? "Неподдерживаемый контейнер" : (a == 2) ? "Неподдерживаемый видео кодек" : (a == 3) ? "Неподдерживаемый аудио кодек" : (a == 4) ? "Неподдерживаемое разрешение видео" : (a == 5) ? "Неправильная частота кадров" : (a == 6) ? "Поток повреждён !" : (a == 7) ? "Файл не найден" : (a == 8) ? "Обрыв сетевого соединения" : (a == 9) ? "Подключиться не удалось" : this.eerr;
        if (a < 7 && this.serr < 3) {
            this.serr++;
            if (a < 3 && a != 6) {
                Player.play(this.url, 0);
            }
        } else {
            if (this.eerr == "8") {
                try {
                    setTimeout('Player.play(this.url, 0)', 5000);
                } finally {
                    setTimeout("Player.ReturnMenu()", 500);
                }
            } else {
                Display.status(Player.eerr);
                setTimeout("Player.ReturnMenu()", 1000);
            }
        }
    }
};
Player.AutoReStart = function() {
    if (this.state != this.LOADING && this.total_time == 0) {
        var a = 10000;
        if (Main.serieC && this.url.indexOf("udp://") >= 0) {
            a = 15000;
        }
        Player.BufferingTimer("Player.play(Player.url,0)", a);
        Display.status("Авторестарт", 3000);
    }
};
Player.OnBufferingStart = function() {
    if (this.state != this.STOPPED) {
        Player.AutoReStart();
        if (!this.jump && !Main.Foto) {
            Display.status("Буфер : 1%");
        }
    }
};
Player.OnBufferingProgress = function(a) {
    if (this.state != this.STOPPED) {
        if (!this.jump && !Main.Foto) {
            Display.status("Буфер : " + a + "%", 5000);
        }
    }
};
Player.OnBufferingComplete = function() {
    clearTimeout(this.buffering_timer);
    if (this.state != this.STOPPED) {
        if (this.state == this.LOADING) {
            Player.message = "";
            getId("progressBar").style.width = "0px";
            try {
                this.total_time = parseInt((this.Sef) ? this.SefPlugin.Execute("GetDuration") : Player.plugin.GetDuration())
            } catch (a) {
                this.total_time = 0;
            }
            if ((this.total_time > 0 && this.url.indexOf("mms://") != 0 && this.url.indexOf(".m3u8") == -1) || this.url.indexOf(".mp4.m3u8") > 0 || this.url.indexOf(".mp3") > 0) {
                this.state = this.PLAYING_VOD;
                KeyHandler.setFocus(3);
                this.h_url = "vod_history.dat";
            } else {
                this.state = this.PLAYING_LIVE;
                KeyHandler.setFocus(2);
                this.h_url = "live_history.dat";
            }
            Player.GetResolution();
            setTimeout("Player.GetVideoSize();", 1000);
            if (!Main.Foto) {
                Player.GetAudioNum();
            }
            if (this.status3D != "") {
                Player.message = this.status3D;
            }
            if (Main.urlArray.length > 1) {
                Player.message += '<tr><table><tr><td><img src="img/buttons/red_m.png"></img></td><td>- Изменить качество</td></tr></table></tr>';
            }
            Main.LoadTimer('if(Player.message!="")Display.status("<table>"+Player.message+"</table>",6000);Main.saveHistory(Player.h_url);if(Player.state==Player.PLAYING_VOD)Player.getSaveTime();', 2000);
            setTimeout('Player.message="";', 3000);
            Display.loadinghide();
            Display.showplayer();
        }
        if (this.jump) {
            Display.showplayer();
            setTimeout("Display.hideplayer();", 1500);
            this.jump = false;
        }
        Display.hidestatus();
    }
};
Player.BufferingTimer = function(b, a) {
    clearTimeout(this.buffering_timer);
    this.buffering_timer = setTimeout(b, a);
};
Player.SetBuffer = function() {
    if (Main.buffer != "") {
        var a = parseInt((Main.buffer * 1048576), 10);
        var b = (Main.iBuffer > 0) ? parseInt((Main.buffer * a / 100), 10) : parseInt((a / 5), 10);
        if (this.Sef) {
            this.SefPlugin.Execute("SetTotalBufferSize", a);
            this.SefPlugin.Execute("SetInitialBuffer", b);
            this.SefPlugin.Execute("SetInitialTimeOut", 20);
            this.SefPlugin.Execute("SetPendingBuffer", b);
        } else {
            this.plugin.SetTotalBufferSize(a);
            this.plugin.SetInitialBuffer(b);
            this.plugin.SetInitialTimeOut(20);
            this.plugin.SetPendingBuffer(b);
        }
    }
};
Player.ReturnMenu = function() {
    Player.stopV();
    Main.Menu();
};
Player.deinit = function() {
    Player.stop();
    alert("Player deinit");
};
Player.stop = function() {
    clearTimeout(this.buffering_timer);
    this.message = "";
    this.eerr = "";
    this.w = 0;
    this.h = 0;
    this.Pw = parseInt(API.Pw);
    this.Ph = parseInt(API.Ph);
    this.serr = 0;
    this.tnum = 0;
    this.total_time = 0;
    this.cur_time = 0;
    this.save_time = 0;
    this.ch = false;
    this.jump = false;
    this.long_pause = false;
    if (this.state != this.STOPPED) {
        this.state = this.STOPPED;
        Player.SaveUrl();
        if (this.Sef) {
            this.SefPlugin.Execute("Stop");
            this.SefPlugin.Execute("ClearScreen");
            this.SefPlugin.Close();
        } else {
            if (this.plugin != null) {
                this.plugin.Stop();
                this.plugin.ClearScreen();
            }
        }
    }
};
Player.stopV = function() {
    Player.stop();
    this.repeat = false;
    this.ch_t = 0;
    this.mode3D = 0;
    this.status3D = "";
    Selectbox.url_selected = 0;
    Main.yandexEpgInfoArray = [];
    StopSlideShow();
    Display.loadinghide();
    Display.hideplayer();
    Display.hidestatus();
};
Player.play = function(a, b) {
    this.url = a;
    Player.stop();
    Player.state = Player.LOADING;
    KeyHandler.setFocus(1);
    if (!Main.Foto) {
        Display.loadingshow();
    }
    if (this.Sef) {
        this.SEFPlay(this.url, b)
    } else {
        if (this.url.indexOf(".mp3") > 0) {
            Main.buffer = 0.5;
        }
        Player.SetBuffer();
        Player.setSize(0, 0, 1);
        this.plugin.Play(this.url);
    }
};
Player.SaveUrl = function() {
    if (this.cur_time > 0) {
        var a = [this.url + "|" + this.cur_time];
        Main.readFile(a, "url.dat");
        if (a.length > 10) {
            a.pop();
        }
        for (var b = 1; b < a.length; b++) {
            if (a[b].indexOf(this.url) == 0) {
                a.splice(b, 1);
                break;
            }
        }
        Main.writeFile(a, "url.dat");
    }
};
Player.getSaveTime = function() {
    if (this.state == this.PLAYING_VOD) {
        if (this.ch_t > 0 && this.ch) {
            this.save_time = this.ch_t;
            Main.LoadTimer('Display.status(" Возобновить ?",5000);', 7000);
            setTimeout("Player.save_time=0", 15000);
        } else {
            var b = [];
            Main.readFile(b, "url.dat");
            for (var c = 0; c < b.length; c++) {
                if (b[c].indexOf(this.url) == 0) {
                    var a = b[c];
                    a = a.split("|");
                    this.save_time = a[1];
                    Main.LoadTimer('Display.status(" Возобновить ?",5000);', 7000);
                    setTimeout("Player.save_time=0", 20000);
                    break;
                }
            }
        }
    }
};
Player.PlaySeveTime = function() {
    if (this.state == this.PLAYING_VOD) {
        var a = (this.save_time - this.cur_time) / 1000;
        this.statusmessage = "Возобновляем!";
        if (a > 0 && !this.jump) {
            Player.JumpForward(a - 3);
        }
        Player.save_time = 0;
        Player.BufferingTimer('Display.status("Возобновить не удалось!",2000);Player.play(Player.url,0);', 10000);
    }
};
Player.GetResolution = function() {
    if (this.state != this.STOPPED) {
        if (this.url.indexOf(".mp3") < 0 && this.w == 0) {
            try {
                if (this.Sef) {
                    var b = this.SefPlugin.Execute("GetVideoResolution");
                    b = b.split("|");
                    if (b.length > 0) {
                        this.w = b[0];
                        this.h = b[1];
                    }
                } else {
                    this.h = this.plugin.GetVideoHeight();
                    this.w = this.plugin.GetVideoWidth();
                }
            } catch (c) {
                this.w = 0;
                this.h = 0;
            }
        }
        if (this.w == 5) {
            this.h = 432;
            this.w = 540;
        } else {
            if (this.w == 4) {
                this.h = 270;
                this.w = 480;
            } else {
                if (this.w == 3) {
                    this.h = 288;
                    this.w = 384;
                } else {
                    if (this.w < 128 || this.w == "") {
                        this.h = 0;
                        this.w = 0;
                    }
                }
            }
        }
        var a = this.w + "X" + this.h;
        if (this.url.indexOf(".mp3") > 0) {
            a = "- MP3 -";
        }
        widgetAPI.putInnerHTML(getId("resolution"), a);
    }
};
Player.GetVideoSize = function() {
    if (this.state != this.STOPPED) {
        if (this.w == 0 || this.w == "") {
            Player.GetResolution();
        }
        if (Player.mode3D == 0 && !Main.Foto) {
            Player.size = (Main.screenSize != "") ? parseInt(Main.screenSize) : (API.Size != "") ? parseInt(API.Size) : parseInt(this.size);
        } else {
            Player.size = 0;
        }
        if (this.url.indexOf(".mp3") < 0) {
            setTimeout("Player.setSize(Player.size,1,1);", 100);
        }
    }
};
Player.setSize = function(c, b, a) {
    if (this.state != this.STOPPED && this.state != this.PAUSA_VOD) {
        var d = this.w;
        var f = this.h;
        if (b > 0) {
            if (((d / f < 1.35 && API.a_size1 < 6) || (d / f < 1.79 && d / f >= 1.35 && API.a_size2 < 6) || (d / f >= 1.79 && API.a_size3 < 6)) && a == 0) {
                if (c > 5) {
                    c = 0;
                }
            }
            this.size = c;
            Main.screenSize = c.toString();
            if (this.w == 0 || this.w == "") {
                Player.GetResolution();
            }
        }
        var p, n, l, k, j, i, g, o, e;
        p = 0;
        n = 0;
        l = 960;
        k = 540;
        j = 0;
        i = 0;
        g = d;
        o = f;
        switch (c) {
            case 0:
                if (d / f < 1.79 || this.w == 0) {
                    e = "16x9 FULL";
                } else {
                    e = "ORIGINAL";
                    k = 960 * f / d;
                    n = (540 - k) / 2;
                }
                break;
            case 1:
                if (d == 0) {
                    e = "w/h=1.67";
                    p = 30;
                    l = 900;
                } else {
                    e = "14x9";
                    i = 0.0625 * f;
                    g = d;
                    o = 0.875 * f;
                }
                break;
            case 2:
                if (d == 0) {
                    e = "w/h=1.56";
                    p = 60;
                    l = 840;
                } else {
                    if (d / f < 1.35) {
                        e = "4x3 ZOOM 2";
                        i = 0.115 * f;
                        g = d;
                        o = 0.77 * f;
                    } else {
                        return Player.setSize(5, b, a);
                    }
                }
                break;
            case 3:
                if (d == 0) {
                    e = "w/h=1.45";
                    p = 90;
                    l = 780;
                } else {
                    if (d / f < 1.35) {
                        e = "4x3 ZOOM 1";
                        p = 60;
                        l = 840;
                        i = 0.0625 * f;
                        g = d;
                        o = 0.875 * f;
                    } else {
                        return Player.setSize(5, b, a);
                    }
                }
                break;
            case 4:
                if (d / f < 1.35 || this.w == 0) {
                    e = "4x3";
                    p = 120;
                    l = 720;
                } else {
                    return Player.setSize(5, b, a);
                }
                break;
            case 5:
                if (d == 0) {
                    e = "w/h=2";
                    n = 30;
                    k = 480;
                } else {
                    if (Player.Pw <= 100) {
                        l = 9.6 * Player.Pw;
                        p = (960 - l) / 2;
                    } else {
                        g = d * (2 - Player.Pw / 100);
                        j = d * (Player.Pw / 200 - 0.5)
                    }
                    if (Player.Ph <= 100) {
                        k = 5.4 * Player.Ph;
                        n = (540 - k) / 2;
                    } else {
                        o = f * (2 - Player.Ph / 100);
                        i = f * (Player.Ph / 200 - 0.5);
                    }
                    e = "X-ZOOM - изменить размеры вы можете нажав на CH LIST";
                    if (Main.SetZoom) {
                        e = "X-ZOOM ширина=" + Player.Pw + "%  высота=" + Player.Ph + "%";
                    }
                }
                break;
            case 6:
                if (d == 0) {
                    return Player.setSize(0, 0, a);
                } else {
                    if (d / f < 1.35) {
                        return Player.setSize(parseInt(API.a_size1), 0, a);
                    } else {
                        if (d / f < 1.79) {
                            return Player.setSize(parseInt(API.a_size2), 0, a);
                        } else {
                            return Player.setSize(parseInt(API.a_size3), 0, a);
                        }
                    }
                }
                break;
            case 7:
                if (d / f >= 1.79) {
                    e = "ORIGINAL ZOOM 1";
                    k = 960 * f / (d * 0.85);
                    n = (540 - k) / 2;
                    j = 0.075 * d;
                    g = 0.85 * d;
                } else {
                    e = "16x9 ZOOM 1";
                    j = 0.0625 * d;
                    i = 0.0625 * f;
                    g = 0.875 * d;
                    o = 0.875 * f;
                }
                break;
            case 8:
                if (d / f >= 1.79) {
                    e = "ORIGINAL ZOOM 2";
                    k = 960 * f / (d * 0.75);
                    n = (540 - k) / 2;
                    j = 0.125 * d;
                    g = 0.75 * d;
                } else {
                    e = "16x9 ZOOM 2";
                    j = 0.125 * d;
                    i = 0.125 * f;
                    g = 0.75 * d;
                    o = 0.75 * f;
                }
                break;
            default:
                alert("Не определён");
                e = "Не определён!";
                break;
        }
        if ((b == 1 || (this.size == 6 && b == 0)) && a == 1) {
            //Player.message = "<tr><center>" + e + "</center></tr>" + Player.message;
			Player.message = '<tr><table><tr><td><img src="img/buttons/blue_m.png"></img></td><td>- ' + e + '</td></tr></table></tr>' + Player.message;
        } else {
            if ((b > 0 || (this.size == 6 && b == 0 && a == 0)) && !Main.Foto) {
                Display.status(e);
            }
        }
        if (this.Sef) {
            this.SefPlugin.Execute("SetDisplayArea", p, n, l, k);
            this.SefPlugin.Execute("SetCropArea", j, i, g, o);
        } else {
            this.plugin.SetDisplayArea(p, n, l, k);
            this.plugin.SetCropArea(j, i, g, o);
        }
    }
};
Player.JumpForward = function(a) {
    if (this.state == this.PLAYING_VOD) {
        Display.status(this.statusmessage, 2000);
        this.jump = true;
        if (this.Sef) {
            this.SefPlugin.Execute("JumpForward", a);
        } else {
            this.plugin.JumpForward(a);
        }
        this.statusmessage = "";
    }
};
Player.JumpBackward = function(b) {
    if (this.state == this.PLAYING_VOD) {
        if (b > 3) {
            Display.status(this.statusmessage, 2000);
        }
        this.jump = true;
        if (this.Sef) {
            if (this.url.indexOf(".mp3") > 0) {
                var a = (this.cur_time / 1000) - b;
                Player.play(this.url, a);
            } else {
                this.SefPlugin.Execute("JumpBackward", b);
            }
        } else {
            this.plugin.JumpBackward(b);
        }
        this.statusmessage = "";
    }
};
Player.MinutesJump = function(d) {
    if (this.state == this.PLAYING_VOD && !this.jump) {
        var b = this.cur_time / 60000 * -1;
        var a = this.delta_time / 60000;
        this.statusmessage = d + " мин.";
        var c = "";
        if (d >= 0) {
            this.statusmessage = "+" + this.statusmessage;
            if (d < a) {
                Player.JumpForward(d * 60);
            } else {
                this.delta_time = 0;
                Player.TestTime();
            }
        } else {
            if (d > b) {
                Player.JumpBackward(d * 60 * -1);
            } else {
                this.delta_time = 0;
                Player.TestTime();
            }
        }
    }
};
Player.PercentJump = function(b) {
    if (this.state == this.PLAYING_VOD && !this.jump) {
        this.statusmessage = b * 10 + "%";
        var a = (this.total_time * b / 10 - this.cur_time) / 1000;
        if (a > 0) {
            Player.JumpForward(a);
        } else {
            if (a < 0) {
                Player.JumpBackward(a * -1);
            }
        }
    }
};
Player.resumeVideo = function() {
    if (this.state == this.PAUSA_VOD) {
        Display.status(" Воспроизведение ");
        if (this.Sef) {
            this.SefPlugin.Execute("Resume");
        } else {
            this.plugin.Resume();
        }
        this.state = this.PLAYING_VOD;
        if (this.url.indexOf("http://") >= 0 && Player.long_pause) {
            setTimeout("Player.MinutesJump(-0.05);", 100);
        }
        Display.hideplayer();
        clearTimeout(this.buffering_timer);
        this.long_pause = false;
    }
};
Player.pauseVideo = function() {
    if (this.state == this.PLAYING_VOD) {
        if (this.Sef) {
            this.SefPlugin.Execute("Pause");
        } else {
            this.plugin.Pause();
        }
        this.state = this.PAUSA_VOD;
        Display.showplayer();
        Display.status("Пауза", 0);
        Player.SaveUrl();
        Player.BufferingTimer("Player.long_pause=true;", 30000);
    }
};
Player.OnCurrentPlayTime = function(a) {
    if (this.total_time > 0) {
        this.cur_time = parseInt(a, 10);
        TimeInfo(this.cur_time, this.total_time);
        this.delta_time = this.total_time - this.cur_time;
        Player.TestTime();
    }
};
Player.TestTime = function() {
    if (this.delta_time == 0 && this.total_time != 0 && this.cur_time != 0) {
        if (this.repeat && this.next) {
            Player.play(this.url);
        } else {
            if (this.next) {
                Main.blockInfo = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 20);
            } else {
                Player.ReturnMenu();
            }
        }
    } else {
        if (this.delta_time == 0) {
            Player.ReturnMenu();
            Display.status("Сбой в сети!");
        }
    }
};
Player.SEFPlay = function(a, b) {
    this.SefPlugin.Open("Player", "1.000", "Player");
    this.SefPlugin.Execute("InitPlayer", a);
    this.SefPlugin.OnEvent = "Player.SefOnEvent";
    if (Player.get3DMode() != 0) {
        if (Main.buffer > 10) {
            Main.buffer = 10;
        }
        this.SefPlugin.Execute("SetPlayerProperty", "2", "3", Player.get3DMode())
    } else {
        if (this.url.indexOf(".mp3") > 0) {
            if (Main.buffer > 0.5) {
                Main.buffer = 0.5;
            }
            this.SefPlugin.Execute("SetPlayerProperty", "5", "0", "0");
        }
    }
    Player.SetBuffer();
    Player.setSize(0, 0, 1);
    this.SefPlugin.Execute("StartPlayback", b);
};
Player.SefOnEvent = function(a, b) {
    switch (a) {
        case 1:
            Player.OnConnectionFailed();
            break;
        case 3:
            Player.OnStreamNotFound();
            break;
        case 4:
            Player.OnNetworkDisconnected();
            break;
        case 6:
            Player.OnRenderError(b);
        case 11:
            Player.OnBufferingStart();
            break;
        case 13:
            Player.OnBufferingProgress(b);
            break;
        case 12:
            Player.OnBufferingComplete();
            break;
        case 14:
            Player.OnCurrentPlayTime(b);
            break;
    }
};
Player.SEFSetNextAudioStream = function() {
    if (this.state != this.STOPPED) {
        if (!this.Sef) {
            Display.status("Функция недоступна!");
        } else {
            if (this.tnum < 2) {
                Display.status("Только одна звуковая дорожка!");
            } else {
                var a = this.SefPlugin.Execute("GetCurrentStreamID", 1);
                if (a >= 0) {
                    a++;
                    if (a > (this.tnum - 1)) {
                        a = 0;
                    }
                    Player.SetAudioStream(a, 1);
                }
            }
        }
    }
};
Player.LangCodes = {
    6514793: "Китайская",
    6647399: "Английская",
    6713957: "Француская",
    6776178: "Немецкая",
    6911073: "Итальянская",
    6975598: "Японская",
    7040882: "Корейская",
    7368562: "Португальская",
    7501171: "Русская",
    7565409: "Испанская",
    8026747: "Украинская"
};
Player.SetAudioStream = function(d, b) {
    if (this.tnum > d) {
        Main.audioNum = (d + 1).toString();
        this.SefPlugin.Execute("SetStreamID", 1, d);
        var a = this.SefPlugin.Execute("GetStreamLanguageInfo", 1, d);
        var c = Player.LangCodes[a];
        c = (c == null) ? "Неизвестная" : c;
        if (b > 0) {
            Display.status(c.toString() + " звуковая дорожка №" + (d + 1).toString());
        } else {
            Player.message += "<tr><td>" + c.toString() + " звуковая дорожка №" + (d + 1).toString() + "</td></tr>";
        }
    } else {
        Player.message += "<tr><td>Не правильный № звукой дорожки!</td></tr>";
    }
};
Player.GetAudioNum = function() {
    if (this.Sef) {
        try {
            this.tnum = this.SefPlugin.Execute("GetTotalNumOfStreamID", 1);
        } catch (a) {
            this.tnum = 0;
        }
        if (this.tnum > 1) {
            if (Main.audioNum != "") {
                Player.SetAudioStream((parseInt(Main.audioNum) - 1), 0);
            } else {
                if (Main.hardwareType == 2) {
                    Player.message += '<tr><table><tr><td><img src="img/buttons/green_m.png"></img></td><td> - Изменить дорожку</td></tr></table></tr>';
                } else {
                    Player.message += '<tr><td>"AD/SUBT" - Изменить дорожку</td></tr>';
                }
            }
        }
    }
};

function HelpSet() {
    Main.scrolling = 0;
    Display.loadinghide();
    Main.yandexTvMode = false;
    Main.yandexEpgInfoArray = [];
    clearTimeout(Main.loadTimer);
    getIdb("0_help");
    getIdb("6_help");
    getIdn("1_help");
    getIdn("2_help");
    getIdn("3_help");
    getIdn("3.1_help");
    getIdn("3.2_help");
    getIdn("3.3_help");
    getIdn("3.4_help");
    getIdn("4.1_help");
    getIdn("5_help");
    getIdn("7_help");
    getIdn("8_help");
    getIdn("9_help");
    getIdn("10_help");
    getIdn("10.1_help");
    getIdn("ya_date");
    getIdn("ya_info");
    getIdn("ya_help");
    getIdn("background");
    getIdn("channelList");
    if (Main.seriesE) {
        getIdn("0_help");
        getIdn("6_help");
    }
    getIdb("infoList");
    getIdb("main");
    widgetAPI.putInnerHTML(getId("infoList"), "");
}
SearchFormular = function() { //изменена клава настрпоиск //изменена Version,border // seriesE
    var f = 5;//7
    var d = 27;//34
    var c = 35; //44
    if (Main.seriesE) {
        f = 5;  //6
        d = 27; //28
        c = 35; //36
    }
    if (API.search_on != "" && !Main.xxx) {
        Main.search = true;
    }
    HelpSet();
    if (!Main.seriesE) {
        getIdb("12_help");
    }
    getIdn("4_help");
    var g = "search";
    if (Main.search || Main.xxx) {
        g = "search_h";
    }
    var b = '<div id="allInput"><form>';
    if (Main.xxx) {
        widgetAPI.putInnerHTML(getId("version"), "Введите код доступа.");
        b += '<span id="text_form0">Код доступа к "XXX" (от 0 до 9999) : </span><input id="' + g + '" type="text" size="' + f + '" maxlength="4"></input>';
    } else {
        if (Main.search) {
            widgetAPI.putInnerHTML(getId("version"), "Введите искомое название.");
            b += '<span id="psearch"> Найти :  </span><input id="' + g + '" type="text" size="' + d + '" maxlength="200"></input>';
        } else {
            widgetAPI.putInnerHTML(getId("version"), "Введите адрес.");
            b += '<span id="psearch"> Адрес : </span><input id="' + g + '" type="text" size="' + c + '" maxlength="200"></input>';
        }
    }
    b += '</form><form><span>"ENTER" - подтвердить ввод.</span></form><form><span>"EXIT" и "RETURN" - вернуться назад.</span></form>';
    if (!Main.xxx && !Main.search) {
        b += '<h3 style="padding-top:150px;text-align:center;"> ВНИМАНИЕ !<br>Если вы прописываете адрес<br>плейлиста и в нём нет расширения <br>".xml" или ".m3u",<br>то перед адресом нужно<br>прописать "#".</h3>';
    }
    b += "</div>";
    widgetAPI.putInnerHTML(getId("infoList"), b);
	getId("rightHalf").style.border = "0px";
	getId("version").style.opacity = "1";
    var a = new IMEShell(g, ime_callback);
    if (Main.seriesC || Main.seriesD) {
        a.setKeypadPos(110, 75);
    } else {
        a.setKeypadPos(110, 75);
        a.setQWERTYPos(0, 50);
    }
    if (!Main.xxx) {
        var e = (Main.search) ? API.search_string : (Main.url != "") ? Main.url : Main.playlistUrl;
        a.setString(e);
    }
    a.setKeyFunc(tvKey.KEY_RETURN, function(i) {
        widgetAPI.blockNavigation(event);
        if (Main.xxx) {
            Main.prevPlaylistArray.pop();
        }
        Main.Menu();
        return false;
    });
    a.setKeyFunc(tvKey.KEY_EXIT, function(i) {
        widgetAPI.blockNavigation(event);
        if (Main.xxx) {
            Main.prevPlaylistArray.pop();
        }
        Main.Menu();
        return false;
    });
    a.setEnterFunc(Search_ok);
    getId(g)["focus"]();
};
Search_ok = function(b) {
    var b = "search";
    if (Main.search || Main.xxx) {
        b = "search_h";
    }
    var a = lrdPr(getId(b).value);
    if (a == "") {
        Main.Menu();
    } else {
        if (Main.xxx && API.Xcode != a) {
            Main.prevPlaylistArray.pop();
            Main.Menu();
            Display.status("Неправильный код !");
        } else {
            if (Main.search || Main.xxx) {
                if (Main.playlistUrl.indexOf("history.dat") > 0) {
                    setTimeout("Main.opencommonFile(Main.playlistUrl)", 1000);
                } else {
                    API.XML_URL = Main.playlistUrl;
                    Main.loadingPlaylist = true;
                    setTimeout("API.Request(API.XML_URL)");
                }
                if (Main.search && !Main.xxx) {
                    API.search_string = a;
                    Display.status('<b style="color:#55dd00">Подождите! Идёт поиск</b>', 0);
                } else {
                    Main.Kill = API.Xcode;
                    API.Xcode = "0";
                    Display.status('<b style="color:#55dd00">Код принят!</b>');
                }
                KeyHandler.setFocus(0);
            } else {
                if (a.toLowerCase().indexOf(".m3u") > 0 || a.toLowerCase().indexOf(".xml") > 0 || a.toLowerCase().indexOf("#") == 0) {
                    if (a.toLowerCase().indexOf("#") == 0) {
                        a = a.replace("#", "");
                    }
                    Main.playlistUrl = a;
                    Main.url = "";
                } else {
                    Main.url = a;
                    Main.playlistUrl = "";
                }
                API.playlist_name = "";
                Main.name = "";
                KeyHandler.setFocus(0);
                Main.PlayChannel();
            }
        }
    }
};

function RunImeS(e, c) { //изменена позиция клавы
    var b = (e == "0") ? e : (parseInt(e) - 1).toString();
    var a = (parseInt(e) + 1).toString();
    var d = new IMEShell(e, ime_callback);
    if (Main.seriesC || Main.seriesD) {
        d.setKeypadPos(110, 75);
    } else {
        d.setKeypadPos(110, 75);
        d.setQWERTYPos(0, 50); //0 75
    }
    getId(e)["focus"]();
    d.setKeyFunc(tvKey.KEY_UP, function(f) {
        if (e != "0") {
            SetStyle1(e);
            Scrol("allInput", c[parseInt(b)]);
            SetStyle2(b);
            getId(b)["focus"]();
        }
    });
    d.setKeyFunc(tvKey.KEY_DOWN, function(f) {
        if (c[parseInt(e)] != 0 || e == "0" || e == "1") {
            SetStyle1(e);
            Scrol("allInput", -c[parseInt(e)]);
            SetStyle2(a);
            RunImeS(a, c);
        }
    });
    d.setKeyFunc(tvKey.KEY_RETURN, function(f) {
        widgetAPI.blockNavigation(event);
        Main.Menu();
        return false;
    });
    d.setKeyFunc(tvKey.KEY_EXIT, function(f) {
        widgetAPI.blockNavigation(event);
        Main.Menu();
        return false;
    });
    d.setEnterFunc(SaveValue)
}
ChannelSetupFormular = function() { //изменена Version,border
    var i = 46;//52
    var g = 5 //6
    if (Main.seriesE) {
        i = 46;
        g = 5
    }
    HelpSet();
    if (!Main.seriesE) {
        getIdb("4_help");
        getIdb("11_help");
    } else {
        getIdn("4_help");
    }
    var f = Ach(3);
    if (f.length >= 1000) {
        f = "Редактировать не возможно! Слишком большой размер.";
    }
    var d = [];
    var k = parseInt(f.length / 100);
    for (var b = 0; b < k + 1; b++) {
        d[b] = f.substring(0, 100);
        f = f.replace(d[b], "");
    }
    var c = (Main.url == "") ? "плейлиста" : "стрима";
    widgetAPI.putInnerHTML(getId("version"), "Редактирование параметров " + c);
    var e = '<div id="allInput"><form><span>Название ' + c + ' : </span></form><form><input id="0" type="text" size="' + i + '" maxlength="200"/></form><form><span>URL адрес ' + c + ' : </span></form><form><input id="1" type="text" size="' + i + '" maxlength="200"/></form><form><span>Описание, дополнительная информация : </span></form>';
    for (var b = 2; b < k + 3; b++) {
        e += '<form><input id="' + b + '" type="text" size="' + i + '" maxlength="200"/></form>'
    }
    e += "<form><span>Адрес иконки " + c + ' : </span></form><form><input id="' + (k + 3) + '" type="text" size="' + i + '" maxlength="200"/></form>';
    if (Main.url != "") {
        e += '<form><span>Стартовая пропорция  размера видео :</span></form><form><span>"0"- 16X9 FULL или ORIGINAL , "1"- 14X9 ,</span></form><form><span>"2"- 4Х3 ZOOM 2 , "3"- 4Х3 ZOOM 1 ,"4"- 4Х3 , </span></form><form><span id="text_form0">"5"- X-ZOOM , "6"- АВТО . </span><input id="' + (k + 4) + '" type="text" size="' + g + '" maxlength="2"/></form><form><span id="text_form0">Номер звуковой дорожки ( 1, 2, 3 . . . ) : </span><input id="' + (k + 5) + '"  type="text" size="' + g + '" maxlength="2"/></form><form><span id="text_form0">Сдвиг времени в программке ( +/-12 ч.) : </span><input id="' + (k + 6) + '" type="text" size="' + g + '" maxlength="4"/></form><form><span>Общий размер буфера  0.5 - 20 ( Мб.).</span></form><form><span id="text_form0">Если не установлен, то "авто" : </span><input id="' + (k + 7) + '"  type="text" size="' + g + '" maxlength="3"/></form><form><span>Старт после прочтения  10 - 50 ( % ) буфера.</span></form><form><span id="text_form0">Если не установлен, то "авто" : </span><input id="' + (k + 8) + '"  type="text" size="' + g + '" maxlength="3"/></form><form><span id="text_form0"> Код региона Яндекс ( "213"- Москва ) : </span><input id="' + (k + 9) + '"  type="text" size="' + g + '" maxlength="6"/></form>';
    }
    e += "<form></form><form></form><form></form><form></form><form></form><form></form><form></form></div>";
    widgetAPI.putInnerHTML(getId("infoList"), e);
	getId("rightHalf").style.border = "0px";
	getId("version").style.opacity = "1";
    var a = [0, 0];
    SetString("0", Main.name, 1);
    var j = (Main.playlistUrl != "") ? Main.playlistUrl : (Main.url != "") ? Main.url : "";
    SetString("1", j, 1);
    if (k == 0) {
        SetString("2", d[0], 1);
        a[2] = 72;
    } else {
        SetString("2", d[0], 1);
        a[2] = 36;
        for (var b = 1; b < k; b++) {
            SetString(b + 2, d[b], 1);
            a[b + 2] = 36;
        }
        SetString(k + 2, d[k], 1);
        a[k + 2] = 72;
    }
    if (Main.url != "") {
        if (k == 0) {
            SetString("3", Main.logo, 1);
        } else {
            SetString(k + 3, Main.logo, 1);
        }
        a[k + 3] = 144;
        SetString(k + 4, Main.screenSize, 1);
        a[k + 4] = 36;
        SetString(k + 5, Main.audioNum, 1);
        a[k + 5] = 36;
        SetString(k + 6, Main.timeshift, 1);
        a[k + 6] = 72;
        SetString(k + 7, Main.buffer, 1);
        a[k + 7] = 72;
        SetString(k + 8, Main.iBuffer, 1);
        a[k + 8] = 36;
        SetString(k + 9, Main.region, 1);
        a[k + 9] = 0;
    } else {
        if (k == 0) {
            SetString("3", Main.logo, 1);
        } else {
            SetString(k + 3, Main.logo, 1);
        }
        a[k + 3] = 0;
    }
    RunImeS("0", a);
    SetStyle2("0");
};
SaveValue = function() {
    try {
        var l = lrdPr(getId("0").value);
        if (Main.url != "") {
            var t = lrdPr(getId("1").value);
            var s = "";
        } else {
            s = lrdPr(getId("1").value);
            t = "";
        }
        if (Ach(3).length < 1000) {
            var r = parseInt(Ach(3).length / 100);
            var b = "";
            for (var k = 0; k < r + 1; k++) {
                b += getId(2 + k).value;
            }
            b = lrdPr(b);
        } else {
            b = Ach(3);
            r = 0;
        }
        var a = lrdPr(getId(r + 3).value);
        if (Main.url != "") {
            var q = dPr(getId(r + 4).value);
            var g = dPr(getId(r + 5).value);
            var o = dPr(getId(r + 6).value);
            var c = dPr(getId(r + 7).value);
            var j = dPr(getId(r + 8).value);
            var f = dPr(getId(r + 9).value);
        } else {
            q = "";
            g = "";
            o = "";
            c = "";
            j = "";
        }
        var i = Main.channelNum - 1;
        var p = [];
        Main.readFile(p, Main.favUrl);
        if (p.length > 0) {
            var d = dSp(dI(l) + "|" + dI(t) + "|" + dI(a) + "|" + dI(b) + "||" + dI(s) + "|" + dI(q) + "|" + dI(g) + "|" + dI(c) + "|" + dI(j) + "|" + dI(o) + "|" + dI(f) + "|" + Main.parser + "|" + Main.searchOn);
            p.splice(i, 1, d);
            Main.writeFile(p, Main.favUrl);
            Main.prevPlaylist = false;
            Main.DEL = true;
            Main.FAV = true;
            Main.opencommonFile(Main.favUrl);
        }
        Main.Menu();
    } catch (n) {}
};
Scrol = function(b, a) {
    Main.scrolling = Main.scrolling + a;
    getId(b).style.margin = Main.scrolling + "px 0px 0px 0px ";
};
KeyHandler.SetapKeyDown = function() { //изменена автостарт
    var f = function() {
        var l = getId(Main.setupId).value;
        for (var k = 0; k < a.length; k++) {
            if (l == a[k]) {
                return k;
                break;
            }
        }
    };
    var a = [];
    var e = 0;
    var d = 0;
    var c = 0;
    switch (Main.setupId) {
        case "9":
            a = ["ru", "ua", "by"];
            d = 36;
            e = 36;
            break;
        case "10":
            a = ["-12", "-11", "-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+12"];
            d = 36;
            e = 36;
            break;
        case "11":
            a = ["авто-синхра", "авто-unix", "ручное из тв"];
            d = 36;
            e = 36;
            break;
        case "12":
            a = ["-12", "-11", "-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+12"];
            d = 36;
            e = 36;
            break;
        case "13":
            a = ["16X9", "14X9", "4X3-ZOOM 2", "4X3-ZOOM 1", "4X3", "X-ZOOM", "АВТО", "Не установлен"];
            d = 36;
            e = 36;
            break;
        case "14":
            for (var j = 0; j < 101; j++) {
                a[j] = (j + 50).toString();
            }
            d = 36;
            e = 36;
            break;
        case "15":
            for (var j = 0; j < 101; j++) {
                a[j] = (j + 50).toString();
            }
            d = 36;
            e = 36;
            break;
        case "16":
            a = ["4X3", "4X3 ZOOM 1", "4X3 ZOOM 2", "14X9", "X-ZOOM"];
            d = 36;
            e = 36;
            break;
        case "17":
            a = ["16X9", "16X9 ZOOM 1", "16X9 ZOOM 2", "14X9", "X-ZOOM"];
            d = 36;
            e = 36;
            break;
        case "18":
            a = ["ORIGINAL", "ORIG.ZOOM 1", "ORIG.ZOOM 2"];
            d = 36;
            e = 36;
            break;
        case "19":
            a = ["квадратная", "прямоугольная"];
            d = 36;
            e = 36;
            break;
        case "20":
            a = ["вкл", "выкл"];
            d = 72;
            e = 36;
            break;
        case "21":
            a = ["0", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
            d = 108;
            e = 72;
            break;
        case "22":
            a = ["0", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
            d = 36;
            e = 108;
            break;
        case "23":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "24":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "25":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "26":
            a = ["240p", "360p", "480p", "720p", "1080p"];
            d = 36;
            e = 36;
            break;
        case "27":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
		case "28":
            a = ["вкл", "выкл"];
            d = 0;					
            e = 36;
            break;	
    }
    var i = (parseInt(Main.setupId) - 1).toString();
    var g = (Main.setupId < 28) ? (parseInt(Main.setupId) + 1).toString() : Main.setupId;
    event.preventDefault();
    var b = event.keyCode;
    switch (b) {
        case tvKey.KEY_RETURN:
        case tvKey.KEY_EXIT:
            Return(0);
            break;
        case tvKey.KEY_ENTER:
            onEnter();
            break;
        case tvKey.KEY_RIGHT:
            c = f();
            if (c < a.length - 1) {
                c++;
            } else {
                c = 0;
            }
            SetString(Main.setupId, a[c]);
            break;
        case tvKey.KEY_LEFT:
            c = f();
            if (c > 0) {
                c--;
            } else {
                c = a.length - 1;
            }
            SetString(Main.setupId, a[c]);
            break;
        case tvKey.KEY_UP:
            SetStyle1(Main.setupId);
            Scrol("allInput", e);
            SetStyle2(i);
            if (Main.setupId == 9) {
                getId("8")["focus"]();
            } else {
                Main.setupId = i;
            }
            break;
        case tvKey.KEY_DOWN:
            if (Main.setupId < 28) {
                SetStyle1(Main.setupId);
                Scrol("allInput", -d);
                SetStyle2(g);
            }
            Main.setupId = g;
            break;
        default:
            alert("Unhandled key");
            break;
    }
    return false
};
ime_callback = function() {};
RunIme = function(e) {  //изменена позиция клавы
    var c = [0, 108, 72, 36, 36, 36, 36, 108, 36, 36];
    if (API.star_url == API.XML_URL) {
        c[1] = 72;
    }
    if (Main.playlistUrl == "") {
        c[2] = 36;
    }
    var b = (e == "0") ? e : (parseInt(e) - 1).toString();
    var a = (parseInt(e) + 1).toString();
    var d = new IMEShell(e, ime_callback, "en");
    if (Main.seriesC || Main.seriesD) {
        d.setKeypadPos(110, 75);
    } else {
        d.setKeypadPos(110, 75);
        d.setQWERTYPos(0, 50); //0 75
    }
    getId(e)["focus"]();
    d.setKeyFunc(tvKey.KEY_UP, function(f) {
        if (e != "0") {
            SetStyle1(e);
            Scrol("allInput", c[parseInt(e)]);
            SetStyle2(b);
            getId(b)["focus"]();
        }
    });
    d.setKeyFunc(tvKey.KEY_DOWN, function(f) {
        SetStyle1(e);
        Scrol("allInput", -c[parseInt(a)]);
        SetStyle2(a);
        if (e == "8") {
            Main.setupId = a;
            KeyHandler.setFocus(7);
        } else {
            RunIme(a);
        }
    });
    d.setKeyFunc(tvKey.KEY_YELLOW, function(g) {
        widgetAPI.blockNavigation(event);
        var f = getId(e).value;
        f = (e == "0") ? API.XML_URL : (e == "1" && Main.playlistUrl != "") ? Main.playlistUrl : f;
        d.setString(f);
        return false;
    });
    d.setKeyFunc(tvKey.KEY_RETURN, function(f) {
        Return(0);
        return false;
    });
    d.setKeyFunc(tvKey.KEY_EXIT, function(f) {
        widgetAPI.sendReturnEvent();
    });
    d.setEnterFunc(onEnter);
};
var SSize = {
    0: "16X9",
    1: "14X9",
    2: "4X3-ZOOM 2",
    3: "4X3-ZOOM 1",
    4: "4X3",
    5: "X-ZOOM",
    6: "АВТО",
    7: "Не установлен"
};
var ASize1 = {
    1: "14X9",
    5: "X-ZOOM",
    4: "4X3",
    3: "4X3 ZOOM 1",
    2: "4X3 ZOOM 2"
};
var ASize2 = {
    0: "16X9",
    1: "14X9",
    5: "X-ZOOM",
    7: "16X9 ZOOM 1",
    8: "16X9 ZOOM 2"
};
var ASize3 = {
    0: "ORIGINAL",
    7: "ORIG.ZOOM 1",
    8: "ORIG.ZOOM 2"
};
var STimemode = {
    0: "авто-синхра",
    1: "авто-unix",
    2: "ручное из тв"
};
SetupFormular = function() { //изменена настройки //изменена Version,border // seriesE
	var n = 43;//52 длинный input
    var l = 14;//22 средний input
    var k = 5;//6 короткий input
    var d = 48;//48 старт мал перенос строки
    var c = 48;//48 старт перенос строки
    if (Main.seriesE) {
        n = 43;//43
        l = 14;//14
        k = 5;//5
		d = 48;//48
		c = 48;//48
    }
    Main.FirstStart = true;
    HelpSet();
    if (!Main.seriesE) {
        getIdb("4_help");
        getIdb("11_help");
    } else {
        getIdn("4_help");
    }
    getIdb("help_set_par");
    widgetAPI.putInnerHTML(getId("version"), " Настройка параметров , MAC = " + Main.MAC);
    var f = '</span></form><form style="color:#55dd00;font-size:16px;"><span>';
    if (API.XML_URL.length < 200) {
        var b = API.XML_URL;
        var a = "";
        if (API.XML_URL.length > d) {
            b = API.XML_URL.substr(0, d);
            var j = API.XML_URL.substr(d);
            var p = parseInt(j.length / c);
            for (var g = 0; g < p + 1; g++) {
                var e = j.substring(0, c);
                j = j.replace(e, "");
                a += f + e;
            }
        }
    } else {
        b = "";
        a = '</span></form><form style="color:#55dd00;font-size:16px;"><span>Адрес слишком большой!';
    }
    var i = '<div id="allInput"><form><span> URL адрес текущего плейлиста :</span></form><form><span><font style="color:#55dd00;font-size:16px;">"' + b + "</font>" + a + '<font style="color:#55dd00;font-size:16px;">"</font></span></form><form><span> URL адрес стартового плейлиста : </span></form><form><input id="0" type="text" size="' + n + '" maxlength="200"></input></form>';
    if (API.star_url != API.XML_URL) {
        i += '<form><img src="img/buttons/yellow_m.png"></img><span> - заменить адрес стартового на текущий</span></form>';
    }
    i += '<form><span> URL адрес закрытого плейлиста : </span></form><form><input id="1" type="text" size="' + n + '" maxlength="200"></input></form>';
    if (Main.playlistUrl != "") {
        i += '<form><img src="img/buttons/yellow_m.png"></img><span> - заполнить адресом плейлиста в фокусе</span></form>';
    }
    i += '<form><span id="text_form3"> Логин для закр. плейлиста :</span><input id="2" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form3">Пароль для закр. плейлиста :</span><input id="3" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form3">UDP прокси ( IP : порт ) :</span><input id="4" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form0">Код доступа к "XXX" ( 0 - 9999 ) : </span><input id="5" type="text" size="' + k + '" maxlength="4"></input></form><form><span id="text_form0">Код названия избранного  ( 0 - 9999 ) :</span><input id="6" type="text" size="' + k + '" maxlength="4"></input></form><form><span>Названия избранных папок, любые, по порядку</span></form><form><span>( название 1 | название 2 | название 3 . . . ) : </span></form><form><input id="7" type="text" size="' + n + '" maxlength="200"></input></form><form><span id="text_form0"> Код региона Яндекс ( "213"- Москва ) : </span><input id="8" type="text" size="' + k + '" maxlength="7"></input></form><form><span id="text_form1">Программка с сайта "m.tv.yandex.</span><img src="img/buttons/lr_m.png"></img><div id="9"></div></form><form><span id="text_form1">Сдвиг время в программке (+/-12 ч.)</span><img src="img/buttons/lr_m.png"></img><div id="10"></div></form><form><span id="text_form2">Время в виджете : </span><img src="img/buttons/lr_m.png"></img><div id="11"></div></form><form><span id="text_form1">Часовой пояс для "авто". ( +/-12 ч.)</span><img src="img/buttons/lr_m.png"></img><div id="12"></div></form><form><span id="text_form2">Стартовый размер видео : </span><img src="img/buttons/lr_m.png"></img><div id="13"></div></form><form><span id="text_form1">Высота для "X-ZOOM" 50 - 150 ( % )</span><img src="img/buttons/lr_m.png"></img><div id="14"></div></form><form><span id="text_form1">Ширина для "X-ZOOM" 50 - 150 ( % ) </span><img src="img/buttons/lr_m.png"></img><div id="15"></div></form><form><span id="text_form2">ABTO для w/h<1.35 </span><img src="img/buttons/lr_m.png"></img><div id="16"></div></form><form><span id="text_form2">ABTO для 1.34 < w/h <1.79 </span><img src="img/buttons/lr_m.png"></img><div id="17"></div></form><form><span id="text_form2">ABTO для  w/h > 1.78 </span><img src="img/buttons/lr_m.png"></img><div id="18"></div></form><form><span id="text_form2">Форма иконок :</span><img src="img/buttons/lr_m.png"></img><div id="19"></div></form><form><span id="text_form1">Загрузка внешних иконок :</span><img src="img/buttons/lr_m.png"></img><div id="20"></div></form><form><span>Общий размер буфера плеера 0.5 - 20 ( Мб.).</span></form><form><span id="text_form1">"0"- авто. или значение из плейлиста :</span><img src="img/buttons/lr_m.png"></img><div id="21"></div></form><form><span>Начинать воспроизведение после прочтения </span></form><form><span> от 10 до 50 ( % ) от общего размера буфера.</span></form><form><span id="text_form1">"0"- авто. или значение из плейлиста :</span><img src="img/buttons/lr_m.png"></img><div id="22"></div></form><form><span id="text_form1">Нижняя панель подсказок плеера </span><img src="img/buttons/lr_m.png"></img><div id="23"></div></form><form><span id="text_form1">Посылка МАС адреса </span><img src="img/buttons/lr_m.png"></img><div id="24"></div></form><form><span id="text_form1">Маскировка ТВ под браузер </span><img src="img/buttons/lr_m.png"></img><div id="25"></div></form><form><span id="text_form1">Ограничить качество видео </span><img src="img/buttons/lr_m.png"></img><div id="26"></div></form><form><span id="text_form1">Автостарт виджета:</span><img src="img/buttons/lr_m.png"></img><div id="27"></div></form><form><span id="text_form1">Сброс настроек по умолчанию </span><img src="img/buttons/lr_m.png"></img><div id="28"></div></form><form></form><form></form><form></form><form></form><form></form><form></form></div>';
    widgetAPI.putInnerHTML(getId("infoList"), i);
	getId("rightHalf").style.border = "0px";
	getId("version").style.opacity = "1";
    SetString("0", API.star_url, 1);
    SetString("1", API.Surl, 1);
    SetString("2", API.Login, 1);
    SetString("3", API.Pasword, 1);
    SetString("4", API.Proxy, 1);
    var o = (API.Xcode == 0) ? "0" : (API.Xcode.length == 1) ? "#" : (API.Xcode.length == 2) ? "##" : (API.Xcode.length == 3) ? "###" : "####";
    SetString("5", o, 1);
    SetString("6", API.Scode, 1);
    SetString("7", API.Favname, 1);
    SetString("8", API.CODE, 1);
    SetString("9", API.REG, 2);
    o = (API.Timeshift.indexOf("-") < 0 && API.Timeshift != "0") ? "+" + API.Timeshift : API.Timeshift;
    SetString("10", o, 2);
    SetString("11", STimemode[parseInt(API.Timemode)], 3);
    o = (API.Timefix.indexOf("-") < 0 && API.Timefix != "0") ? "+" + API.Timefix : API.Timefix;
    SetString("12", o, 2);
    o = (API.Size == "") ? "7" : API.Size;
    SetString("13", SSize[parseInt(o)], 3);
    SetString("14", API.Ph, 2);
    SetString("15", API.Pw, 2);
    SetString("16", ASize1[parseInt(API.a_size1)], 3);
    SetString("17", ASize2[parseInt(API.a_size2)], 3);
    SetString("18", ASize3[parseInt(API.a_size3)], 3);
    o = (API.Forma == "0" || API.Forma == "2") ? "квадратная" : "прямоугольная";
    SetString("19", o, 3);
    o = (API.Forma == "0" || API.Forma == "1") ? "вкл" : "выкл";
    SetString("20", o, 2);
    SetString("21", API.Buffer, 2);
    SetString("22", API.Ibuffer, 2);
    o = (API.Pstyle == "1") ? "вкл" : "выкл";
    SetString("23", o, 2);
    o = (API.Mac == "1") ? "вкл" : "выкл";
    SetString("24", o, 2);
    o = (API.Header == "1") ? "вкл" : "выкл";
    SetString("25", o, 2);
    SetString("26", API.Vquality, 2);
	o = (API.AutoStart == "1") ? "вкл" : "выкл";
	SetString("27", o, 2);
	SetString("28", "выкл", 2);	
    RunIme("0");
    SetStyle2("0");
};
SetString = function(c, b, a) {
    if (b == "") {
        b = " ";
    }
    widgetAPI.putInnerHTML(getId(c), b);
    getId(c).value = b;
    if (a == 1) {
        SetStyle1(c);
    } else {
        if (a == 2) {
            SetStyle1(c);
            getId(c).style.width = "52px";
        } else {
            if (a == 3) {
                SetStyle1(c);
                getId(c).style.width = "120px";
            }
        }
    }
};
SetStyle1 = function(a) {
    getId(a).style.color = "black";
    getId(a).style.background = "#999999";
    getId(a).style.border = "2px solid #ffffff";
};
SetStyle2 = function(a) {
    getId(a).style.color = "blue";
    getId(a).style.background = "#eeeeee";
    getId(a).style.border = "2px solid #999999";
};
Return = function(a) {
    widgetAPI.blockNavigation(event);
    if (API.channels.length > 0 && API.XML_URL == Main.prePlaylistUrl && a == 0) {
        Main.Menu();
    } else {
        location.reload(true);
    }
};

var Ticker = { //новое автостарт
	CommonWidgetPath: "mtd_down/common/",
    ConfigPath: "config.xml",
	curWidgetID: curWidget.id,
	WidgetPath: "mtd_down/widgets/user/",
	FileSys: null,
	isOff: false
};	
Ticker.PutTicker = function (isOff) { //новая автостарт
    try {
		var WidgetPath = "/" + Ticker.WidgetPath + Ticker.curWidgetID + "/" + Ticker.ConfigPath;
        var CommonWidgetPath = Ticker.CommonWidgetPath + Ticker.curWidgetID + "/";
        var d = new FileSystem();
		var dchek = d.isValidCommonPath(CommonWidgetPath);
        if (!dchek){
			d.createCommonDir(CommonWidgetPath);
		}
        var FullCommonWidgetPath = "/" + CommonWidgetPath + Ticker.ConfigPath;
		FileSys = getId("pluginObjectFileSystem");		
        var r = FileSys.Copy(WidgetPath, FullCommonWidgetPath);
        if (r != 1) return false;		
        var ConfigFileStr = Ticker.MessageLoad(Ticker.ConfigPath);
        if (ConfigFileStr === null) return false;
        var i = "<ticker>n</ticker>";
        var j = "<ticker>y</ticker>";
        if (isOff) ConfigFileStr = ConfigFileStr.replace(i, j); // on
        else ConfigFileStr = ConfigFileStr.replace(j, i);      //off
        var f = Ticker.MessageSave(Ticker.ConfigPath, ConfigFileStr);
        if (!f) return false;
        r = FileSys.Copy(FullCommonWidgetPath, WidgetPath);
        var f = (r == 1);
        return f	
    } catch (e) {};  
    return false
};	
Ticker.MessageLoad = function (filename) { //новая автостарт
    var fs = new FileSystem();
    var fo = fs.openCommonFile(Ticker.curWidgetID + "/" + filename, 'r');
    if (fo == null) return null;
    txt = fo.readAll();
    fs.closeCommonFile(fo);
    return txt
};
Ticker.MessageSave = function (filename, txt) { //новая автостарт
    var fs = new FileSystem();
    var path = Ticker.curWidgetID + "/";
    if (!fs.isValidCommonPath(path)) fs.createCommonDir(path);
    var fo = fs.openCommonFile(path + filename, 'w');
    if (fo == null) return false;
    fo.writeAll(txt);
    fs.closeCommonFile(fo);
    return true
};

onEnter = function() { //изменена автостарт
    try {
		var autost1 = (API.AutoStart == "1") ? "1" : "0";
        var w = getId("28").value;		
        if (w == "вкл") {
			if (autost1 == "1"){
				var tickerchangeyes = Ticker.PutTicker(false);
				API.AutoStartReset = (tickerchangeyes) ? "1" : "0";
				if (tickerchangeyes){
					var b = ["start.xml", "", "", "", "", "0", "0", "Разное|Deutsch|IP-TV|Фильмы|Сериалы|Мультфильмы|Концерты|Клипы|Телепередачи|ХХХ", "213", "ru", "0", "0", "0", "", "100", "100", "2", "0", "0", "0", "0", "0", "1", "1", "0", "480p", "0"];
				}else{	
					var b = ["start.xml", "", "", "", "", "0", "0", "Разное|Deutsch|IP-TV|Фильмы|Сериалы|Мультфильмы|Концерты|Клипы|Телепередачи|ХХХ", "213", "ru", "0", "0", "0", "", "100", "100", "2", "0", "0", "0", "0", "0", "1", "1", "0", "480p", autost1];	
				}
			}else{
				var b = ["start.xml", "", "", "", "", "0", "0", "Разное|Deutsch|IP-TV|Фильмы|Сериалы|Мультфильмы|Концерты|Клипы|Телепередачи|ХХХ", "213", "ru", "0", "0", "0", "", "100", "100", "2", "0", "0", "0", "0", "0", "1", "1", "0", "480p", "0"];
			}	
        } else {
            var G = lrdPr(getId("0").value);
            var v = lrdPr(getId("2").value);
            var t = lrdPr(getId("3").value);
            var r = (dPr(v) != "" && dPr(t) != "") ? lrdPr(getId("1").value) : r = "";
            var q = lrdPr(getId("4").value);
            var o = dPr(getId("5").value);
            o = (API.Xcode != 0 && o == API.Xcode) ? "0" : (API.Xcode != 0) ? API.Xcode : o;
            var l = dPr(getId("6").value);
            var j = lrdPr(getId("7").value);
            var g = dPr(getId("8").value);
            var C = getId("9").value;
            var d = getId("10").value;
            var f = getId("11").value;
            for (var u in STimemode) {
                if (STimemode[u] == f) {
                    f = u.toString();
                    break;
                }
            }
            var s = getId("12").value;
            var c = getId("13").value;
            for (var u in SSize) {
                if (SSize[u] == c) {
                    c = u.toString();
                    break;
                }
            }
            c = (c == "7") ? "" : c;
            var p = getId("14").value;
            var n = getId("15").value;
            var k = getId("16").value;
            for (var u in ASize1) {
                if (ASize1[u] == k) {
                    k = u.toString();
                    break;
                }
            }
            var i = getId("17").value;
            for (var u in ASize2) {
                if (ASize2[u] == i) {
                    i = u.toString();
                    break;
                }
            }
            var F = getId("18").value;
            for (var u in ASize3) {
                if (ASize3[u] == F) {
                    F = u.toString();
                    break;
                }
            }
            var E = getId("19").value;
            var B = getId("20").value;
            E = (E == "квадратная" && B == "вкл") ? "0" : (E == "прямоугольная" && B == "вкл") ? "1" : (E == "квадратная" && B == "выкл") ? "2" : "3";
            var a = getId("21").value;
            var D = getId("22").value;
            var A = getId("23").value;
            A = (A == "вкл") ? "1" : "0";
            var z = getId("24").value;
            z = (z == "вкл") ? "1" : "0";
            var y = getId("25").value;
            y = (y == "вкл") ? "1" : "0";
            var x = getId("26").value;
			var x2 = getId("27").value;
			
			var autost = (API.AutoStart == "1") ? true : false;
			var autostartf = (x2 == "вкл") ? true : false;
			if (autost != autostartf) {
				var tickerchangeyes = Ticker.PutTicker(autostartf);
				if (tickerchangeyes){
					API.firstAutoStart = false;
					x2 = (autostartf) ? "1" : "0";	
					setTimeout(function(){Display.status('<font style="color:green;">Автозапуск </font>'+(autostartf ? '<font style="color:green;"><font style="color:yellow;">РАЗРЕШЕН</font>. Перезагрузите телевизор и настройте автозапуск.</font>' : '<font style="color:green;"><font style="color:red;">ЗАПРЕЩЕН</font>. Перезагрузите телевизор и уберите автозапуск.</font>'),3000)},3000);
				}else{
					x2 = (autost) ? "1" : "0";
					setTimeout(function(){Display.status('<font style="color:red;">Ошибка!!! Автозапуск НЕ ИЗМЕНЕН.</font>',5000)},3000);
				}	
			}else x2 = (autost) ? "1" : "0";
            b = [G, r, v, t, q, o, l, j, g, C, d, f, s, c, p, n, k, i, F, E, a, D, A, z, y, x, x2];			
        }
        Main.writeFile(b, API.fn);
        API.init();
        if (C != API.REG) {
            Return(1);
        } else {
            Return(0);
        }
    } catch (H) {}
};

function getIdb(a) {
    try {
        return getId(a).style.display = "block";
    } catch (b) {
        return "";
    }
}

function getIdn(a) {
    try {
        return getId(a).style.display = "none";
    } catch (b) {
        return "";
    }
}

function getId(a) {
    try {
        return document.getElementById(a);
    } catch (b) {
        return "";
    }
}

function getTN(a) {
    try {
        return document.getElementsByTagName(a);
    } catch (b) {
        return "";
    }
}

function getCl(a) {
    try {
        return document.getElementsByClassName(a);
    } catch (b) {
        return "";
    }
}

function Ach(a) {
    try {
        return API.channels[Main.channelArrayIndex][a];
    } catch (b) {
        return "";
    }
}

function dI(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/\|/g, "") : "";
    return a;
}

function dTg(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/<\/?[^>]+>/g, "") : "";
    return a;
}

function dSp(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/[\n\r\t]/g, "") : "";
    return a;
}

function lrdPr(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/(^\s*)|(\s*)$/g, "").replace(/[\n\r\t]/g, "") : "";
    return a;
}

function dPr(b, c) {
    var a = (typeof b == "string" && b != "") ? b.replace(/\s/g, "") : "";
    if (c == 1) {
        a = (!isNaN(a)) ? a : "";
    }
    return a;
}

function getYoutubeUrl(n) {
    var j = ["&el=embedded", "&el=detailpage", "&el=vevo", ""];
    var f = "";
    var o = "";
    var flag = false;
    for (var i = 0; i < j.length; i++) {
        var e = j[i];
        var d = "http://www.youtube.com/get_video_info?&video_id=" + n + e + "&ps=default&eurl=&gl=US&hl=en";
        API.AsReqMode = false;
        var f = API.Request(d);
        f = f.match(/url_encoded_fmt_stream_map=(.*?)&/);
        if (f != null) {
            if (f[1].indexOf("itag") >= 0) {
                var a = f[1].split("%2C");
                if (decLongUrl(a[0]).indexOf('itag=43') > -1) {
                    a.splice(0, 1);
                }
                if (decLongUrl(a[1]).indexOf('itag=43') > -1) {
                    a.splice(1, 1);
                }
                for (var g = 0; g < a.length; g++) {
                    a[g] = decLongUrl(a[g]);
                    var l = parser(a[g], "itag=", "&");
                    if (l != "") {
                        var k = "";
                        var b = [];
                        switch (l) {
                            case "22":
                                k = "720p";
                                break;
                            case "18":
                                k = "480p";
                                break;
                            case "5":
                                k = "360p";
                                break;
                            case "36":
                                k = "240p";
                                break;
                        }
                        if (k != "") {
                            a[g] = a[g].replace("itag=" + l + "&", "");
                            if (a[g].indexOf("&url=") > 0) {
                                var c = a[g].split("&url=");
                                a[g] = c[1];
                            } else {
                                a[g] = a[g].replace("url=", "");
                            }
                            b = [a[g], k];
                            Main.urlArray["push"](b);
                            if (k.indexOf(API.Vquality) > -1) {
                                flag = true;
                                o = a[g];
                                Selectbox.url_selected = Main.urlArray.length - 1;
                            }
                            if (flag == false) {
                                if (k.indexOf(API.Vquality) < 0) {
                                    o = a[g];
                                    flag = true;
                                }
                            }
                        }
                        if (k == "240p") {
                            break;
                        }
                    }
                }
                if (Main.urlArray.length > 0 && o == "") {
                    o = Main.urlArray[1][1];
                }
            }
            break;
        }
    }
    return o;
}

function getVkUrl(j) {
    var i = "";
    var d = "";
    var a = [];
    var flag = false;
    j = j.replace("vkontakte.ru", "vk.com");
    d = API.Request(j);
    if (d.indexOf('www.youtube.com') + 1) {
        var f = d.split('ajax.preload');
        var q = f[1].match(/http:(.*?)?autoplay/);
        var c = q[1].replace(/\\/g, '');
        c = c.replace("?", '');
        c = c.replace("//www.youtube.com/embed/", '');
        return getYoutubeUrl(c);
    } else {
        var qual240 = 0;
        var qual360 = 0;
        var qual480 = 0;
        var qual720 = 0;
        if (d.indexOf('url240') + 1) qual240 = 1;
        if (d.indexOf('url360') + 1) qual360 = 1;
        if (d.indexOf('url480') + 1) qual480 = 1;
        if (d.indexOf('url720') + 1) qual720 = 1;
        count = qual240 + qual360 + qual480 + qual720;
        var f = d.split('url240');
        var q = f[1].match(/http:(.*?)?extra/);
        if (q != null) {
            var c = q[1].replace(/\\\\\\/g, '');
            c = c.replace("?", '');
            c = c.split("videos")
            c[0] = c[0].replace("//", '');
            c[1] = c[1].replace("240.mp4", '');
            for (var e = 0; e < count; e++) {
                switch (e) {
                    case 0:
                        var b = "240.mp4";
                        var g = "240p";
                        break;
                    case 1:
                        b = "360.mp4";
                        g = "360p";
                        break;
                    case 2:
                        b = "480.mp4";
                        g = "480p";
                        break;
                    case 3:
                        b = "720.mp4";
                        g = "720p";
                        break;
                }
                a = ["http://" + c[0] + "videos" + c[1] + b, g];
                Main.urlArray["push"](a);
                if (g.indexOf(API.Vquality) > -1) {
                    flag = true;
                    i = "http://" + c[0] + "videos" + c[1] + b;
                    Selectbox.url_selected = Main.urlArray.length - 1;
                }
                if (flag == false) {
                    if (g.indexOf(API.Vquality) < 0) {
                        i = "http://" + c[0] + "videos" + c[1] + b;
                        flag = true;
                    }
                }
            }
            if (Main.urlArray.length > 0 && i == "") {
                i = Main.urlArray[0][0];
            }
        }
        return i;
    }
}

function getRuTubeUrl(j) {
    var i = "";
    var d = "";
    var a = [];
    var flag = false;
    d = API.Request('http://rutube.ru/api/oembed/?url=' + j + '&format=xml');
    j = d.match(/embed\/(.*?)"/);
    d = API.Request('http://rutube.ru/play/embed/' + j[1]);
    d = d.split('"m3u8":');
    j = d[1].match(/"(.*?)"},/);
    d = API.Request(j[1]);
    f = d.match(/http:\/\/(.*?)\n/g);
    f.reverse();
    for (var e = 0; e < f.length; e++) {
        switch (e) {
            case 0:
                v = f[0];
                g = "720p";
                break;
            case 1:
                v = f[1];
                g = "480p";
                break;
            case 2:
                v = f[2];
                g = "360p";
                break;
            case 3:
                v = f[3];
                g = "240p";
                break;
        }
        a = [v + '|COMPONENT=HLS', g];
        Main.urlArray["push"](a);
        if (g.indexOf(API.Vquality) > -1) {
            flag = true;
            i = v + '|COMPONENT=HLS';
            Selectbox.url_selected = Main.urlArray.length - 1;
        }
        if (flag == false) {
            if (g.indexOf(API.Vquality) < 0) {
                i = v + '|COMPONENT=HLS';
                flag = true;
            }
        }
    }
    if (Main.urlArray.length > 0 && i == "") {
        i = Main.urlArray[0][0];
    }
    return i;
}
YandexGetUrl = function(a) {
    var e = "";
    if (Main.yandexFlagStep > 0 && Main.yandexFlagStep < 5) {
        var f = ["", "5", "4", "3", "7"];
        e = "&flag=" + f[Main.yandexFlagStep];
    } else {
        Main.yandexFlagStep = 0
    }
    if (a.indexOf("/m.tv.yandex.") > 0 && a.indexOf("/program/") > 0) {
        var b = a;
    } else {
        if (a.indexOf("/m.tv.yandex.") > 0 && a.indexOf("channel=") > 0) {
            a = a.substr(a.indexOf("http:"));
            a = a.substr(22);
            var c = a.substr(0, a.indexOf("/"));
            a = a.substr(a.indexOf("channel="));
            var d = (a.indexOf("&") < 0) ? a.length : a.indexOf("&");
            a = a.substring(8, d);
        } else {
            c = (Main.region != "") ? Main.region : API.CODE;
        }
        b = "http://m.tv.yandex." + API.REG + "/" + c + "/?channel=" + a + "&when=2&day=";
        Main.yandexProgramInfoArray = [];
    }
    Main.tempYandexEpgInfoArray = [];
    if (e == "" && T.delta == 0) {
        Main.lostDate = "pегион - <font color='#00ccff'>" + c + "</font>, индекс - <font color='#00ccff'>" + a + "</font>";
    }
    YandexParsing(b, c, a, e);
};

function YaAbort() {
    clearTimeout(Main.yandexReadyTimeout);
    if (Main.yandexHttp != null) {
        Main.yandexHttp["abort"]();
        Main.yandexHttp = null;
    }
}

function Err() {
    YaAbort();
    Main.yandexTvMode = false;
    Main.showinfoList("Ничего не найдено!");
}

var servArr = ["http://wilhelm2005.besaba.com/yandex.php?url=", "http://maleevgrodno.esy.es/yandex.php?url="]; 

function getRandomServ() {
    ind = Math.floor(Math.random() * servArr.length);
	return servArr[ind];
}

function YandexParsing(b, c, f, e) {
    var a = "";
    if (T.delta < -6) {
        T.delta = 0;
    }
    var d = parseInt(T.y_t_days + T.delta);
    if (!Main.guide) {
        b = b + d;
    }
    YaAbort();
    Main.yandexReadyTimeout = setTimeout("Err();", 3000);
    Main.yandexHttp = new XMLHttpRequest();
    Main.yandexHttp.onreadystatechange = function() {
        if (Main.yandexHttp.readyState == 4 && (Main.yandexHttp.status == 301 || Main.yandexHttp.status == 302)) {
            Main.yandexHttp["open"]("GET", Main.yandexHttp.getResponseHeader("Location"), true);
            Main.yandexHttp["setRequestHeader"]("User-Agent", "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
            Main.yandexHttp["send"](null);
        } else {
            if (Main.yandexHttp.readyState == 4 && Main.yandexHttp.status == 200) {
                clearTimeout(Main.yandexReadyTimeout);
                a = Main.yandexHttp.responseText;
                a = a.replace(/amp;/g, "");
                a = a.replace(/<br\/>/g, "<br />");
                if (!Main.guide) {
                    var t = ["", "Фильмы", "Сериалы", "Детям", "Спорт"];
                    Main.yandexFlagName = '<font style="color:#ff3300;padding-left:15px;font-size:17px;">' + t[Main.yandexFlagStep] + "</font>";
                    a = a.split('<body>');
                    a = a[1].split('<div class="b-direct">');
                    a = a[0];
                    var r = '</div><div class="b-select">';
                    var p = a.indexOf(r);
                    if (p < 0) {
                        Err();
                        return;
                    }
                    var n = '<div class="b-banner">';
                    var l = a.indexOf(n);
                    if (l > 0 && l < p) {
                        p = l;
                    }
                    n = '<div class="b-text">';
                    l = a.indexOf(n);
                    if (l > 0) {
                        r = a.indexOf('</div></div><div class="b-select">');
                        if (r < 0) {
                            Err();
                            return;
                        } else {
                            var l = a.substring(l + n.length, r);
                            if (l != "") {
                                if (e == "" && T.delta != 0) {
                                    T.delta = 100;
                                }
                                Main.showinfoList(l);
                            } else {
                                T.delta = 0;
                                YandexGetUrl();
                            }
                        }
                    } else {
                        n = '<a href="/' + c + "/?day=" + d + "&when=2" + e + "&channel=" + f + '">';
                        l = a.indexOf(n);
                        if (l < 0) {
                            Err();
                            return;
                        }
                        a = a.substring(l + n.length, p);
                        var j = a.substr(0, 2);
                        a = a.replace(j, "");
                        r = '</a><br /><a href="/' + c + "/?day=" + d + "&when=2" + e + "&channel=" + f + '" class="day">';
                        p = a.indexOf(r);
                        if (p < 0) {
                            Err();
                            return;
                        }
                        a = a.replace(r, "");
                        var x = a.substr(0, 2);
                        var v = parser(a, '<th class="channel">', "</th></tr>");
                        if (v == "") {
                            Err();
                            return;
                        }
                        a = a.substr(a.indexOf("</th></tr>") + 10);
                        var u = "";
                        var s = '<table><td style="vertical-align:top;color:#00ccff;font-weight:bolder;padding-right:8px"><u>';
                        var k = 1;
                        var q = "";
                        var o = "";
                        var P = "";
                        var O = "";
                        var M = "";
                        Main.yandexProgramInfoArray = [];
                        var i = (Main.timeshift != "") ? Main.timeshift : (API.Timeshift != "") ? API.Timeshift : 0;
                        var K = a.split("</td></tr>");
                        for (var A = 0; A < K.length; A++) {
                            a = K[A];
                            var I = a.indexOf('<tr class="gone">');
                            var G = parser(a, '<td class="time"><a href="/' + c + "/program/", '">');
                            var E = "http://m.tv.yandex." + API.REG + "/" + c + "/program/" + G.replace("<tr>", "");
                            var y = parser(a, G + '">', "</a>");
                            var w = parser(a, "</a></td><td>");
                            if (G == "" || y == "" || w == "") {
                                break;
                            }
                            var D = y.split(":");
                            if (D.length == 2) {
                                var g = parseInt(D[0]) + parseInt(i);
                                D[0] = ((g > 23) ? (g - 24) : (g < 0) ? (g + 24) : g).toString();
                                if (D[0].length == 1) {
                                    D[0] = "0" + D[0];
                                }
                                y = D.join(":");
                            }
                            k++;
                            var C = false;
                            var B = "<font>";
                            var L = "</u></td><td>" + B;
                            if (I > -1) {
                                C = true;
                                k = 1;
                                B = '<font style="color:#999999">';
                                L = "</u></td><td>" + B;
                                o = s + y + L + w + "</font></td></table>";
                                P = B + w + "</font>";
                                O = E;
                                M = y;
                            }
                            if (k == 2 && T.delta == 0) {
                                B = '<font style="color:#ffff99;font-weight:bold;">';
                                L = "</u></td><td>" + B;
                            }
                            if (k == 2 && T.delta == 0 && !Main.yandexAllDay) {
                                u = o + s + y + L + w + "</font></td></table>";
                                q = B + w + "</font>";
                            } else {
                                if ((Main.yandexAllDay && C) || T.delta < 0) {
                                    u += s + y + L + w + "</font></td></table>";
                                    q = B + w + "</font>";
                                } else {
                                    if (!C) {
                                        u += s + y + L + w + "</font></td></table>";
                                        q = B + w + "</font>";
                                    }
                                }
                            }
                            if (q != "") {
                                if (KeyHandler.Focus == 0) {
                                    if (k == 2 && T.delta == 0 && !Main.yandexAllDay && P != "") {
                                        var J = '<font style="position:absolute;left:9px;padding-top:1px;font-size:22px;color:#00ccff;text-align:center;">' + M + "</font>";
                                        var z = [P, "stop", "0.png", O, "", "", "", "", "", "", J, "", "", ""];
                                        Main.yandexProgramInfoArray["push"](z);
                                    }
                                    J = '<font style="position:absolute;left:9px;padding-top:1px;font-size:22px;color:#00ccff;text-align:center;">' + y + "</font>";
                                    z = [q, "stop", "0.png", E, "", "", "", "", "", "", J, "", "", ""];
                                    Main.yandexProgramInfoArray["push"](z);
                                }
                                if (T.delta == 0 && e == "") {
                                    var N = dSp(q + "|" + y);
                                    Main.tempYandexEpgInfoArray["push"](N);
                                }
                            }
                        }
                        if (Main.tempYandexEpgInfoArray.length > 0) {
                            if (Player.state == Player.STOPPED || (Player.state == Player.PLAYING_LIVE && Main.playChannelArrayIndex == Main.channelArrayIndex)) {
                                Main.yandexProgramId = Main.channelArrayIndex;
                                Main.yandexEpgInfoArray = Main.tempYandexEpgInfoArray;
                                GetEpgInfo();
                            }
                        }
                        if (KeyHandler.Focus == 0 && Main.yandexTvMode) {
                            if (j != "" && x != "") {
                                Main.lostDate = '<font style="color:#00cc99; padding-left:5px;">' + j + ".- " + x + "</font>";
                            }
                            if (v != "") {
                                Main.lostDate += '<font style="color:#00ccff;padding-left:15px;">' + v + "</font>";
                            }
                            u = u.replace("<br>", "");
                            Main.showinfoList(u);
                        }
                    }
                } else {
                    var H = parser(a, '<div class="b-broadcast__time">', '</div></div><div class="b-pager">');
                    if (H == "") {
                        Err();
                        return;
                    }
                    H = parser(H, '&when=2">');
                    if (H != "") {
                        H = H.replace("</a>", "").replace('</div><div class="b-broadcast__info">', "</h3></td></tr></table>");
                        var F = parser(a, '<div class="b-broadcast">', '<div class="b-broadcast__time">');
                    }
                    if (F != "") {
                        F = F.replace('class="b-broadcast__img" alt="" title=""', "");
                    }
                    if (H != "" && Main.yandexTvMode) {
                        Main.showinfoList('<table style="font-size:20px;"><table><tr><td style="vertical-align:top;padding-right:8px;">' + F + '</td><td style="color:#00ccff;"><h3>' + H + "</table>");
                    } else {
                        Main.showinfoList("Подробного описания нет!");
                    }
                }
            }
        }
    };
    if (Main.seriesC || Main.seriesD || Main.seriesE) {
        Main.yandexHttp["open"]("GET", getRandomServ() + encodeURIComponent(b + e), true);	
    } else {
        Main.yandexHttp["open"]("GET", b + e, true);
    }
    Main.yandexHttp["setRequestHeader"]("User-Agent", "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
    Main.yandexHttp["send"](null);
}
var Ya_name_index_obj = {};
var Ya_icon_index_url_obj = {};
var Ya_icon_name_url_obj = {};

GetEpgInfo = function() {
    if (Main.yandexEpgInfoArray.length > 0) {
        var a = Main.yandexEpgInfoArray[0].split("|");
        var e = a[0];
        var d = a[1];
        a = d.split(":");
        Main.epgT1 = parseInt((a[0] * 60 * 60 + a[1] * 60) * 1000);
        if (Main.yandexEpgInfoArray.length > 1) {
            a = Main.yandexEpgInfoArray[1].split("|");
            var c = a[1];
            a = c.split(":");
            Main.epgT2 = parseInt((a[0] * 60 * 60 + a[1] * 60) * 1000);
            Main.yandexEpgInfoArray["splice"](0, 1);
        } else {
            Main.epgT2 = Main.epgT1;
            c = "Неизвестно";
        }
        if (Main.epgT1 > Main.epgT2) {
            Main.epgT2 += 24 * 60 * 60 * 1000;
        }
        var b = "";
        if (dPr(e) != "") {
            b = "<font style='color:#ffff99;font-weight:bold;'>" + e + "</font><font style='color:#00ccff;font-weight:bolder;padding-left:10px;'>" + d + " - " + c + "</font>";
        }
        widgetAPI.putInnerHTML(getId("epg_info"), b);
        Display.showplayer();
    }
};
GetNextEpgInfo = function() {
    if (Main.yandexEpgInfoArray.length > 0) {
        if (Main.epgInfoStep == 1 && Main.tempEpgInfo == "") {
            Main.tempEpgInfo = getId("epg_info").innerHTML;
        }
        if (Main.epgInfoStep > 0 && Main.epgInfoStep <= Main.yandexEpgInfoArray.length) {
            var a = Main.yandexEpgInfoArray[Main.epgInfoStep - 1].split("|");
            var d = a[0];
            var c = a[1];
            if (dPr(d) != "" && dPr(c) != "") {
                var b = d + "<font style='color:#00ccff;font-weight:bolder;padding-left:10px;'>" + c + "</font>";
            }
        } else {
            if (Main.tempEpgInfo != "") {
                b = Main.tempEpgInfo;
                Main.tempEpgInfo = "";
            }
        }
        widgetAPI.putInnerHTML(getId("epg_info"), b);
        if (Main.epgInfoStep > 0) {
            Display.showplayer();
        }
    }
};

function Super_Send(a) {
    if (a.indexOf("http://germet.net") >= 0 && API.search_string != "" && Main.search) {
        a = a.replace("search=", "q=");
    }
    return a;
}

function GetHash(c, b, f) {
    var a = "";
    if (f != "") {
        var e = decLongUrl(API.Request(c + "action=get_test_url&s_key=" + f + "&url=" + b));
    } else {
        e = c;
    }
    e = e.split("|");
    if (e[0] != "") {
        var d = API.Request(e[0]);
        d = parser(d, e[1], e[2]);
        if (f != "") {
            a = API.Request(c + "action=get_result_url_hash&s_key=" + f + "&hash=" + d + "&url=" + b);
        } else {
            a = b.replace("md5hash", d);
        }
    } else {
        a = b;
    }
    return a;
}

function parser(e, c, b) {
    var a = "";
    if (dPr(e) != "" && c != undefined) {
        var d = e.indexOf(c);
        if (d >= 0) {
            e = e.substr(d + c.length);
            if (b == undefined) {
                return e;
            }
            d = e.indexOf(b);
            if (d >= 0) {
                a = e.substr(0, d);
            }
        }
    }
    return a;
}

function decLongUrl(a) {
    if (dPr(a) != "" && a.indexOf("%") >= 0) {
        while (a.indexOf("%") >= 0) {
            a = decodeURIComponent(a);
        }
    }
    return a;
}

function getFsToVideo(url) {
    var urlBrb = url.replace('cxz.to', 'brb.to');
    var response = API.Request(urlBrb);
    var video_url;
    if (response != undefined) {
        response = response.split('is_first: 1,');
        video_url = response[1].match(/download_url: '(.*?)',/);
        video_url = 'http://brb.to' + video_url[1];
    } else {
        response = API.Request(url);
        response = response.split('is_first: 1,');
        video_url = response[1].match(/download_url: '(.*?)',/);
        video_url = 'http://cxz.to' + video_url[1];
    }
    return video_url;
}

function Super_parser(e) {
    var c = e;
    if (e.indexOf("#germetJSParser") >= 0) {
        e = e.replace("#germetJSParser", "")
    }
    if (Main.parser != "" && Main.parser.indexOf("://") > 0) {
        e = decLongUrl(e);
        var g = parser(e, "s_key=");
        c = decLongUrl(GetHash(Main.parser, e, g));
    } else {
        if (e.indexOf("cxz.to") > 0) {
            c = getFsToVideo(decLongUrl(e));
        } else {
            if (e.indexOf("vk.com") > 0 || e.indexOf("vk.com/video_") > 0) {
                c = getVkUrl(e);
            } else {
                if (e.indexOf("youtube.com/watch?v=") > 0) {
                    var i = e.substr(e.indexOf("=") + 1);
                    c = lrdPr(getYoutubeUrl(i));
                } else {
                    if (e.indexOf("rutube.ru/video/") > 0) {
                        c = getRuTubeUrl(e);
                    } else {
                        if (e.indexOf("//kino-v-online.ru/kino/md5") > 0 || e.indexOf("//kino-v-online.ru/serial/md5") > 0) {
                            var b = API.Request("http://kino-v-online.ru/2796-materik-online-film.html");
                            c = e.replace("md5hash", parser(b, "/kino/", "/"));
                        } else {
                            if (e.indexOf("kinoprosmotr.net/") > 0) {
                                var b = API.Request(e);
                                c = dSp(parser(b, ";file=", ".flv").replace(/\x5cn/, "") + ".flv");
                            } else {
                                if (e.indexOf("//vtraxe.com/") > 0) {
                                    var b = API.Request(e);
                                    b = parser(b, "3Fv=", "&");
                                    c = API.Request("http://gegen-abzocke.com/xml/nstrim/uletno/code.php?code_url=" + b);
                                } else {
                                    if (e.indexOf("kino-dom.tv/s/md5") > 0) {
                                        var b = API.Request("http://kino-dom.tv/drama/1110-taynyy-krug-the-sesret-sirsle-1-sezon-1-seriya-eng-onlayn.html");
                                        c = e.replace("md5hash", parser(b, "file=http://kino-dom.tv/", "/play/"));
                                    } else {
                                        if (e.indexOf("linecinema.org/s/md5") > 0) {
                                            var b = API.Request("http://www.linecinema.org/newsz/boevyk-online/508954-bliznecy-drakony-twin-dragons-1992-dvdrip-onlayn.html");
                                            c = e.replace("md5hash", parser(b, "linecinema.org/s/", "/"));
                                        } else {
                                            if (e.indexOf(".igru-film.net/") > 0) {
                                                var b = parser(e, "xyss", "xys");
                                                e = parser(e, "ssa", "xyss");
                                                b = API.Request("http://fepcom.net/" + b);
                                                b = parser(b, ";file=", "&");
                                                b = API.Request("http://gegen-abzocke.com/xml/nstrim/fepcom/code.php?code_url=" + b);
                                                c = e.replace("md5hash", b);
                                            } else {
                                                if (e.indexOf("kinoylei.ru/video/") > 0) {
                                                    var b = API.Request("http://kinoylei.ru/load/zhanry/boevik/otstavnik_2/38-1-0-2280");
                                                    b = parser(b, '"myvideo" src="', '">');
                                                    b = API.Request(b);
                                                    b = parser(b, "--", '"');
                                                    c = e.replace("md5hash", b);
                                                } else {
                                                    if (e.indexOf("nowfilms.ru/video/md5hash") > 0) {
                                                        var b = parser(e, "xyss", "xys");
                                                        e = parser(e, "ssa", "xyss");
                                                        b = API.Request("http://" + b);
                                                        var a = parser(b, ";pl=", '"');
                                                        if (a.indexOf("/tmp/") > 0) {
                                                            b = API.Request(a);
                                                            a = parser(e, "/md5hash/", "xys");
                                                            if (b.indexOf(a) > 0) {
                                                                var f = b.substr(b.indexOf(a) - 23, 22);
                                                                c = e.replace("md5hash", f);
                                                            }
                                                        } else {
                                                            c = parser(b, ";file=", '"');
                                                        }
                                                    } else {
                                                        if (e.indexOf("//77.120.119") > 0) {
                                                            e = API.Request(e);
                                                            e = parser(e, 'file":"', '"');
                                                            c = API.Request("http://gegen-abzocke.com/xml/nstrim/liveonline/code.php?code_url=" + e);
                                                        } else {
                                                            if (e.indexOf("uletno.info/") > 0) {
                                                                e = API.Request(e);
                                                                e = parser(e, 'file":"', '"');
                                                                c = API.Request("http://gegen-abzocke.com/xml/nstrim/uletno/code.php?code_url=" + e);
                                                            } else {
                                                                if (e.indexOf("//kinostok.tv/video/") > 0) {
                                                                    e = API.Request(e);
                                                                    e = parser(e, 'file: "', '"');
                                                                    c = API.Request("http://gegen-abzocke.com/xml/nstrim/kinostok/code.php?code_url=" + e);
                                                                } else {
                                                                    if (e.indexOf("/streaming.video.") > 0) {
                                                                        var b = parser(e, "get-location/", "/m");
                                                                        b = API.Request("http://static.video.yandex.ru/get-token/" + b + "?nc=0.50940609164536");
                                                                        b = parser(b, "token>", "</token>");
                                                                        b = API.Request(e.replace("md5hash", b));
                                                                        c = parser(b, "video-location>", "</video-location>").replace("&amp;", "&");
                                                                    } else {
                                                                        if (e.indexOf("/video.sibnet.ru") > 0) {
                                                                            var b = API.Request(e);
                                                                            b = b.replace("&amp;", "&");
                                                                            c = parser(b, "<file>", "</file>");
                                                                        } else {
                                                                            if (e.indexOf("filmix.net/s/md5hash") > 0 || e.indexOf("filevideosvc.org/s/md5hash") > 0) {
                                                                                var b = API.Request("http://filmix.net/semejnyj/36974-tor-legenda-vikingov-legends-of-valhalla-thor-2011.html");
                                                                                b = parser(b, ";file=", ";vast_preroll").replace("&amp", "");
                                                                                b = API.Request("http://gegen-abzocke.com/xml/nstrim/filmix/code.php?code_url=" + b);
                                                                                c = e.replace("md5hash", b);
                                                                            } else {
                                                                                if (e.indexOf("http://streaming2.video.yandex.ru") >= 0) {
                                                                                    c = e.replace("streaming2", "streaming");
                                                                                } else {
                                                                                    if (e.indexOf("bigcinema.tv") > 0) {
                                                                                        var b = API.Request("http://bigcinema.tv/movie/prometey---prometheus.html");
                                                                                        b = parser(b, 'file:"', '"');
                                                                                        b = API.Request("http://gegen-abzocke.com/xml/nstrim/bigcinema/code.php?code_url=" + b);
                                                                                        c = e.replace("md5hash", b);
                                                                                    } else {
                                                                                        if (e.indexOf("allserials.tv/s/md5") > 0) {
                                                                                            var b = API.Request("http://allserials.tv/serial-2166-osennie-cvety-1-sezon.html");
                                                                                            c = e.replace("md5hash", parser(b, ".tv/pl/", "/"));
                                                                                        } else {
                                                                                            if (e.indexOf("kinopod.org/get/md5") > 0) {
                                                                                                var b = API.Request("http://kinopod.ru/video.html?id=22110");
                                                                                                c = e.replace("md5hash", parser(b, "/get/", "/"));
                                                                                            } else {
                                                                                                if (e.indexOf("allinspace.com/") > 0) {
                                                                                                    e = parser(e, "&", "&&");
                                                                                                    e = API.Request(e);
                                                                                                    c = parser(e, "<td width=80px ><a href='", "' > Download </a>");
                                                                                                } else {
                                                                                                    if (e.indexOf("77.91.77") > 0) {
                                                                                                        var b = API.Request("http://inetcom.tv/channel/russia_1");
                                                                                                        c = e + "?sid=" + parser(b, "?sid=", "'");
                                                                                                    } else {
                                                                                                        if (e.indexOf("watchcinema.ru") > 0) {
                                                                                                            e = API.Request(e);
                                                                                                            e = parser(e, '<iframe src="', '"');
                                                                                                            e = e.replace("&amp;", "&").replace("//vkontakte.ru/", "//vk.com/");
                                                                                                            e = API.Request(e);
                                                                                                            e = parser(e, 'src="http://www.youtube.com/embed/', "?");
                                                                                                            c = getYoutubeUrl(e);
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return c;
}