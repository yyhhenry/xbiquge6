// ==UserScript==
// @name         小说下载
// @namespace    https://www.xsbiquge.com/
// @version      2.0.1
// @description  下载小说
// @author       yyhhenry
// @match        https://www.xsbiquge.com/*
// @updateURL    https://yyhhenry.github.io/xbiquge6/main.user.js
// @downloadURL  https://yyhhenry.github.io/xbiquge6/main.user.js
// @supportURL   https://github.com/yyhhenry/xbiquge6
// ==/UserScript==


'use strict';
function selectText(text) {
	if (document.body.createTextRange) {
		let range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		let selection = window.getSelection();
		let range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	} else {
		alert("浏览器不支持选择");
	}
}
let 下载结果=document.createElement('div');
document.body.appendChild(下载结果);
function 下载单章(url,onfinish){
	let ans=document.createElement('div');
	下载结果.appendChild(ans);
	$.get(url,{},function(v){
		let doc=document.createElement('div');
		doc.innerHTML=v;
		let 标题=doc.getElementsByClassName('bookname')[0].childNodes[1].innerText;
		let 正文=doc.getElementsByClassName('box_con')[0].childNodes[7].innerHTML;
		ans.innerHTML=标题+'<br><br>'+正文+'<br><br><br>';
		onfinish();
	},'html');
}
function 下载小说(url){
	下载结果.innerHTML='';
	下载结果.style.height='1px';
	下载结果.style.overflow='hidden';
	let 原有标题=document.title;
	document.title='正在连接 - '+原有标题;
	$.get(url,{},function(v){
		let doc=document.createElement('div');
		doc.innerHTML=v;
		下载结果.innerHTML+='书名：《 '+doc.childNodes[21].content+' 》<br><br>';
		下载结果.innerHTML+='简介：'+doc.childNodes[23].content+'<br><br><br>';
		let list=doc.childNodes[51].childNodes[11].childNodes[1].childNodes[1].childNodes;
		let n=list.length-4;
		function 单章地址(i){
			return list[i+2].firstChild.href;
		}
		let cnt=0;
		for(let i=1;i<=n;i++){
			下载单章(单章地址(i),function(){
				cnt++;
				document.title=Math.floor(cnt/n*100)+'%已下载 - '+原有标题;
				if(cnt==n){
					document.title='正在生成 - '+原有标题;
					selectText(下载结果);
					alert('下载已完成，直接按Ctrl+C复制');
					document.title='已生成 - '+原有标题;
					
					let 选中按钮=document.createElement('button');
					document.getElementById('info').childNodes[1].appendChild(选中按钮);
					选中按钮.innerText='下载小说';
					选中按钮.onclick=function(){
						alert('下载已完成，直接按Ctrl+C复制');
						selectText(下载结果);
					}
				}
			});
		}
	},'html');
}
function isInt(x){
	return parseInt(x).toString()==x;
}
function isNovel(x){
	let v=x.substring(1,location.pathname.length-1);
	if(v.lastIndexOf('/')!=-1)return false;
	let y=v.split('_');
	return isInt(y[0])&&isInt(y[1]);
}
window.onload=function(){
	(function(){
		//页面处理
		let albl=document.getElementsByTagName('a');
		for(let i=0;i<albl.length;i++){
			if(albl[i].href.indexOf('d.taohunbao.com')!=-1){
				albl[i].parentElement.style.display='none';
			}
		}
		let delcs=function(){
			let adbot=document.getElementById('cs_right_bottom');
			if(adbot==null){
				setTimeout(delcs,50);
			}else{
				adbot.style.display='none';
			}
		}
		delcs();
	})();
	if(isNovel(location.pathname)){
		let 下载按钮=document.createElement('button');
		document.getElementById('info').childNodes[1].appendChild(下载按钮);
		下载按钮.innerText='下载小说';
		下载按钮.onclick=function(){
			$(下载按钮).hide();
			下载小说(location.href);
		}
	}
}