export default {

  /**
   * 验证用户是否有按钮操作权限
   * @param item
   */
  checkButton(item) {
    let perms = JSON.parse(localStorage.getItem("perms"));
    // console.log(perms)
    if (perms) {
      let index = perms.indexOf(item);
      if (index != -1) {
        return true;
      }
    }

    return false;
  },
  // 递归方法
  getTreeData(data) {
    // 循环遍历json数据
    for (let i = 0; i < data.length; i++) {
      if (!data[i].children || data[i].children.length <= 0) {
        // children若为空数组，则将children设为undefined  不然会多出一个空级选项
        data[i].children = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i].children);
      }
    }
    return data;
  },
  // 合伙人需要的递归方法
  getTreeData2(data) {
    // 循环遍历json数据
    for (let i = 0; i < data.length; i++) {
      let list = data[i].children;
      if (!list || list.length <= 0) {
        data[i].children = undefined;
        continue;
      }
      let arrNum = 0;
      for (let j = 0; j < list.length; j++) {
        let arr = list[j].children;
        if (!arr || arr.length <= 0) {
          data[i].children[j].children = undefined;
          continue;
        }
        let num = 0;
        for (let k = 0; k < arr.length; k++) {
          if (!arr[k].children || arr[k].children.length <= 0) {
            data[i].children[j].children[k].children = undefined;
          }
          if (arr[k].disabled) {
            num++;
          }
        }
        if (num == arr.length) {
          data[i].children[j].disabled = true;
        }
        if (data[i].children[j].disabled) {
          arrNum++;
        }
      }
      if (data[i].disabled) {
        arrNum++
      }
      if (arrNum == list.length) {
        data[i].disabled = true;
      }
    }
    return data;
  },
  ajax(obj) {
    // 对实参处理
    obj = obj || {};
    // 定义局部变量
    let xmlhttp, type, url, async, dataType, data;
    // 默认type为GET
    type = obj.type || 'GET';
    type = trim(type).toUpperCase();
    // 接口
    url = obj.url
    url = trim(url);
    // 默认为异步请求
    async = obj.async || true;
    // 设置跨域
    dataType = obj.dataType || 'HTML';
    dataType = trim(dataType).toUpperCase();
    // 发送参数
    data = obj.data || {};

    // 删除左右空格
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, "");
    };
    // 定义格式化参数函数
    let formatParams = function () {
      if (typeof(data) == "object") {
        let str = "";
        for (let pro in data) {
          str += pro + "=" + data[pro] + "&";
        }
        data = str.substr(0, str.length - 1);
      }
      if (type == 'GET' || dataType == 'JSONP') {
        if (url.lastIndexOf('?') == -1) {
          url += '?' + data;
        } else {
          url += '&' + data;
        }
      }
    }
    // 第一步，创建xmlhttprequest对象用来和服务器交换数据。
    if (window.XMLHttpRequest) {
      //Chrome || Firefox
      xmlhttp = new XMLHttpRequest();
    } else {
      //IE
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 跨域请求
    if (dataType == 'JSONP') {
      if (typeof(obj.beforeSend) == 'function') obj.beforeSend(xmlhttp);
      let callbackName = ('jsonp_' + Math.random()).replace(".", "");
      let oHead = document.getElementsByTagName('head')[0];
      data.callback = callbackName;
      let ele = document.createElement('script');
      ele.type = "text/javascript";
      ele.onerror = function () {
        console.log('failed');
        obj.error && obj.error("failed");
      };
      oHead.appendChild(ele);
      window[callbackName] = function (json) {
        oHead.removeChild(ele);
        window[callbackName] = null;
        obj.success && obj.success(json);
      };
      formatParams();
      ele.src = url;
      return;
    } else {
      formatParams();
      // 第二步，打开链接
      xmlhttp.open(type, url, async);
      // 设置响应头
      xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
      if (typeof(obj.beforeSend) == 'function') obj.beforeSend(xmlhttp);
      // 第三步，发送请求
      xmlhttp.send(data);
      // 第四步，响应处理
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status != 200) {
          console.log(xmlhttp.status + 'failed');
          obj.error && obj.error(xmlhttp.status + 'failed');
          return;
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          if (dataType == 'JSON') {
            try {
              res = JSON.parse(xmlhttp.responseText);
            } catch (e) {
              console.log('json格式错误');
              obj.error('json格式错误');
            }
          } else if (dataType == 'XML') {
            res = xmlhttp.responseXML;
          } else {
            res = xmlhttp.responseText;
          }
          obj.success && obj.success(res);
        }
      }
    }
  },
  jumpPageSetting(item) {
    if (item.jumpPage == 0 && item.linkAddress0) {
      item.linkAddress = item.linkAddress0;
      item.linkAddress1 = "";
      item.linkAddress2 = "";
      item.linkAddress3 = "";
      if (item.linkAddress0 == '0' && !item.keyword) {
        return false;
      }
      if (item.linkAddress0 != '0') {
        item.keyword = "";
      }
    } else if (item.jumpPage == 1 && item.linkAddress1) {
      item.linkAddress = item.linkAddress1;
      item.linkAddress0 = "";
      item.linkAddress2 = "";
      item.linkAddress3 = "";
      item.keyword = "";
    } else if (item.jumpPage == 2 && item.linkAddress2) { //选择商品时 linkAddress已经被赋值了
      // item.linkAddress = item.linkAddress2;
      item.linkAddress0 = "";
      item.linkAddress1 = "";
      item.linkAddress3 = "";
      item.keyword = "";
    } else if (item.jumpPage == 3 && item.linkAddress3) {
      item.linkAddress = item.linkAddress3;
      item.linkAddress0 = "";
      item.linkAddress1 = "";
      item.linkAddress2 = "";
      item.keyword = "";
    } else if (item.jumpPage == 4) {
      item.linkAddress = "";
      item.linkAddress0 = "";
      item.linkAddress1 = "";
      item.linkAddress2 = "";
      item.linkAddress3 = "";
      item.keyword = "";
    }
    return true;
  },
  /**
   *   输入框特殊符号正则
   * ？、。，.+￥%#@~*（）&*等不可输入   -_可以输入
   *
   */
  regSpecialChar(evt) {
    return evt.target.value.replace(/[\[\]\【\】\,\，\.\。\!\！\|\~\`\(\)\#\@\%\^\……\+\=\/\、\'\$\￥\%\^\&\*\{\}\:\：\;\；\"\L\<\>\?\？\\]/g, '')
  },
  // 排序
  priceSort(a,b){
    if(a.supplierPrice > b.supplierPrice) {
      return -1;
    } else if(a.supplierPrice < b.supplierPrice) {
      return 1;
    } else {
      return 0;
    }
  },
  priceSortDesc(a,b){
    if(a.supplierPrice > b.supplierPrice) {
      return 1;
    } else if(a.supplierPrice < b.supplierPrice) {
      return -1;
    } else {
      return 0;
    }
  },

}

