<br/>
<br/>
<div align="center">
	<img src="./images/clock.PNG" style="zoom:80%"/>
</div>
<br/>
<br/>

# Contents
- [English](#Description)
- [繁體中文](#描述)

# **Description**
Clock is a plug-in that can display clock faces; you can choose the city time zone and even switch between a digital or an analog clock face.

# **Features**
* Code in Javascript
* Cross-platform (macOS, Windows)
* Drop-down menu to select the city time you want and change the clock type (digital or analog)
* Tap the screen to change the clock type

# **Instruction**
There are three main roles in this application.
1. Creator Central
2. Widget（Controller）
3. Property

This application demo shows how to implement a clock widget using Javascript.
When Creator Central starts Widget (Controller), Creator Central will send two parameters to Widget (Controller), namely Widget UUID and port, which communicate through WebSocket.
All the follow-up commands need to include the Widget UUID information for identification, and the relevant definitions such as the packet format are further explained in [The Overview of Creator Central SDK](https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK).

The production of Clock is mainly created by using Canvas. The clock drawing is then converted to Base64 String through toDataURL() and sent to Creator Central.

Adjust the time zone and clock type.
|  key   | value  |
|  ----  | ----  |
| country  | Taipei / New_York / California |
| type  | analog / digital |

The current demo provides three cities and two clock types to choose from. You can modify the time zone or clock type by using Property, and then send the parameters to Widget (Controller), and Widget (Controller) draws a new screen based on the received parameters.
It is displayed in Creator Central, and at the same time, the configuration file of Creator Central is also updated to ensure that it will be in the last operation state when the application is opened next time.

You can see a list of all time zones at this URL [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

# **Application File Description**
|  File Name  |  Content Description  |
|  ----  | ----  |
| [common_widget.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/common_widget.js)  | WebSocket for widgets, including objects, connecting, disconnecting, sending data, receiving data, etc., manages the entire process |
| [common_property.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/common_property.js)  | WebSocket for property, including objects, connection, disconnection, sending data, receiving data, etc., manages the entire process |
| [widget.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/widget.js)  | Draw digital and analog clocks, and convert images to base64 strings |
| [property_main.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/property_main.js)  | Get the option of the drop-down menu and pass the value to widget.js for drawing |
| [localization.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/localization.js)  | Multi-language setting |

Note: Creator Central only supports String data type. If a Data type packet is sent, Creator Central will not take any action.

# **Installation**
Integrate the compiled executable file into the Widget directory (Clock_js.widget/)
* [WinOS] Place the Widget directory to "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/", then open the Creator Central machine to see it.
* [MacOS] Place the Widget directory to "~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/", then open the Creator Central machine to see it.

# **Uninstallation**
* [WinOS] Close Creator Central, and go to "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/", delete the com.avermedia.widget.js.clock folder, and then open Creator Central again.
* [MacOS] Close Creator Central, and go to "~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/", delete the com.avermedia.widget.js.clock folder, and then open Creator Central again.

# **Troubleshooting for running failure**
* [WinOS]
1. Make sure the Widget directory is placed under folder "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/".
2. In the WidgetConfig.json file in the Widget directory, check whether the Win Target name is the name of the executable file: index.html.
* [MacOS]
1. Make sure the Widget directory is placed under folder "~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/".
2. In the WidgetConfig.json file in the Widget directory, check whether the Mac Target name is the name of the executable file: index.html.

- - -

# **描述**
時鐘是一個可以顯示時鐘的插件，你可以選擇你想要的城市時區，甚至你還可以變換數位時鐘或是類比時鐘。

# **特徵**
* 用Javascript編寫代碼
* 跨平台（macOS, Windows）
* 下拉式選單選擇你想要的城市時間及改變時鐘的類型（數位或是類比）
* 點擊螢幕即可更換時鐘類型

# **說明**
整個應用主要有三個角色
1. Creator Central
2. Widget（Controller）
3. Property

而本範例程式展示的是使用Js如何實作一個時鐘的Widget。
當Creator Central啟動Widget（Controller）時，Creator Central會派發兩個參數給Widget（Controller），分別是Widget UUID以及port，兩者間透過WebSocket進行溝通
後續的指令溝通都需要包含Widget UUID這資訊用以識別，封包格式等相關定義在[The Overview of Creator Central SDK](https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK)有更進一步的說明。

時鐘的製作主要是使用canvas繪製，將畫布透過toDataURL()轉換成Base64 String傳送至Creator Central。

調整時區和時鐘的類型
|  key   | value  |
|  ----  | ----  |
| country  | taipei / new_york / california |
| type  | analog / digital |

目前範例程式中提供了三個城市和兩種時鐘類型做選擇，透過操作Property修改時區或時鐘的類型，然後將參數傳送至Widget（Controller），Widget（Controller）根據收到的參數繪製新的畫面在Creator Central顯示出來，與此同時也一併更新Creator Central的設定檔，確保下次開啟應用程式時，會是上次最後的操作記錄。

在這個網址可以看到所有的時區列表[https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

# **程式檔案說明**
|  檔案名稱  | 內容描述  |
|  ----  | ----  |
| [common_widget.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/common_widget.js)  | 針對widget的WebSocket，包含物件，連線、斷線、送出資料、接收資料等，管理整個流程 |
| [common_property.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/common_property.js)  | 針對property的WebSocket，包含物件，連線、斷線、送出資料、接收資料等，管理整個流程 |
| [widget.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/widget.js)  | 繪製數位、類比時鐘，並把圖像轉換base64 字串 |
| [property_main.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/property_main.js)  | 取得下拉式選單的option，並把值傳給widget.js做繪圖 |
| [localization.js](https://github.com/AVerMedia-Technologies-Inc/WidgetJSSample/blob/main/Sources/Clock_js.widget/property/js/localization.js)  | 多國語系的設定 |


注意：Creator Central 只支援 String 資料型別. 如果發送 Data 資料型別的封包的話， Creator Central 將不會有任何動作。

# **安裝**
將編譯後執行檔整合進 Widget 目錄 （com.avermedia.widget.js.clock/)
* [WinOS] 將 Widget 目錄放置到 "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/" ，接著打開 Creator Central 機器即可看到。
* [MacOS] 將 Widget 目錄放置到 "~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/" ，接著打開 Creator Central 機器即可看到。

# **反安裝**
* [WinOS] 關掉 Creator Central ，到 "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/" 目錄下把 com.avermedia.widget.js.clock 資料夾刪掉，再次打開 Creator Central 即可。
* [MacOS] 關掉 Creator Central ，到 "~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/" 目錄下把 com.avermedia.widget.js.clock 資料夾刪掉，再次打開 Creator Central 即可。

# **無法執行時的問題排除措施說明**
* [WinOS]
1. 確認 Widget 目錄是否有確實放置到 "C:/Users/＜YourName＞/AppData/Roaming/AVerMedia Creator Central/widgets/＜PackageName＞/" 資料夾之下
2. 檢查 Widget 目錄裡的 WidgetConfig.json 檔案中， Win 的 Target 名稱是否是執行檔的名稱 （index.html）
* [MacOS]
1. 確認 Widget 目錄是否有確實放置到 ~/Applications Support/AVerMedia Creator Central/widgets/＜PackageName＞/ 資料夾之下
2. 檢查 Widget 目錄裡的 WidgetConfig.json 檔案中， Mac 的 Target 名稱是否是執行檔的名稱 （index.html）
