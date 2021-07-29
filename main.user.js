// ==UserScript==
// @name         小说下载
// @namespace    https://www.xxbiquge.net/
// @version      3.2
// @description  下载小说
// @author       yyhhenry
// @match        https://www.xxbiquge.net/*
// @updateURL    https://yyhhenry.github.io/xbiquge6/main.user.js
// @downloadURL  https://yyhhenry.github.io/xbiquge6/main.user.js
// @supportURL   https://github.com/yyhhenry/xbiquge6
// ==/UserScript==


'use strict';
function createFileAndDownload(filename,content){
	let aTag=document.createElement('a');
	let blob=new Blob([content]);
	aTag.download=filename;
	aTag.href=URL.createObjectURL(blob);
	aTag.click();
}
function 下载单章(url,onfinish){
	$.get(url,{},function(v){
		let doc=document.createElement('div');
		doc.innerHTML=v;
		let 标题=doc.getElementsByClassName('bookname')[0].childNodes[1].innerText;
		let 正文=doc.getElementsByClassName('box_con')[0].childNodes[7].innerHTML;
		;
		onfinish(标题+'\n\n'+正文+'\n\n\n');
	},'html')
}
function 下载小说(url){
	let 下载结果=[];
	let 原有标题=document.title;
	document.title='正在连接 - '+原有标题;
	$.get(url,{},function(v){
		let doc=document.createElement('div');
		doc.innerHTML=v;
		let 书名=doc.childNodes[21].content;
		let 下载抬头='';
		下载抬头+='书名：《 '+书名+' 》<br><br>';
		下载抬头+='简介：'+doc.childNodes[23].content+'<br><br><br>';
		下载结果[0]=下载抬头;
		let list=doc.childNodes[51].childNodes[11].childNodes[1].childNodes[1].childNodes;
		let n=list.length-4;
		function 单章地址(i){
			return list[i+2].firstChild.href;
		}
		let cnt=0;
		for(let i=1;i<=n;i++){
			下载单章(单章地址(i),function(v){
				下载结果[i]=v;
				cnt++;
				document.title=Math.floor(cnt/n*100)+'%已下载 - '+原有标题;
				let 输出串='';
				for(let i=0;i<=n;i++){
					输出串+=下载结果[i];
				}
				if(cnt==n){
					document.title='已生成 - '+原有标题;
					输出串=输出串.split('<br>').join('\n').split('&nbsp;').join(' ');
					let 选中按钮=document.createElement('button');
					document.getElementById('info').childNodes[1].appendChild(选中按钮);
					选中按钮.innerText='点击生成文件';
					选中按钮.onclick=function(){
						createFileAndDownload(书名+'.txt',输出串);
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
//页面处理
let delcs=function(){
	let adbot=document.getElementById('cs_right_bottom');
	if(adbot==null){
		setTimeout(delcs,50);
	}else{
		adbot.style.display='none';
	}
}
delcs();
let albl=document.getElementsByTagName('a');
for(let i=0;i<albl.length;i++){
	if(albl[i].href.indexOf('app.xuxiyx.com')!=-1){
		albl[i].parentElement.style.display='none';
	}
}
if(isNovel(location.pathname)){
	let 下载按钮=document.createElement('button');
	document.getElementById('info').childNodes[1].appendChild(下载按钮);
	下载按钮.innerText='下载小说';
	下载按钮.onclick=function(){
		$(下载按钮).hide();
		下载小说(location.href);
	}
}