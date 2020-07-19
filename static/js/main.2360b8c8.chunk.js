(this["webpackJsonpada-widget-file-upload"]=this["webpackJsonpada-widget-file-upload"]||[]).push([[0],{2:function(e,t,a){e.exports={wrapper:"App_wrapper__RCHjb",fileUploadBtn:"App_fileUploadBtn__1KiJb",loadingSpinner:"App_loadingSpinner__mDfBX",disabledFileUploadBtn:"App_disabledFileUploadBtn__12Cq9 App_fileUploadBtn__1KiJb",loadingFileUploadBtn:"App_loadingFileUploadBtn__1ws4A App_disabledFileUploadBtn__12Cq9 App_fileUploadBtn__1KiJb",btnText:"App_btnText__-PJRh",errorsWrapper:"App_errorsWrapper__3VnvC",msg:"App_msg__jRWrr",error:"App_error__1LS0k App_msg__jRWrr",success:"App_success__3gLML App_msg__jRWrr"}},21:function(e,t,a){e.exports=a(46)},26:function(e,t,a){},46:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(16),s=a.n(r),o=(a(26),a(6)),l=a(3),c=a.n(l),d=a(4),p=a(17),u=a(18),v=a(20),m=a(19),_=a(5),f=a.n(_),h="https://hidden-everglades-39585.herokuapp.com",g=function(e){return e.split(".").pop()},A=a(2),x=a.n(A),b=new(a(45)),y=function(e){Object(v.a)(a,e);var t=Object(m.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={isLoading:!1,isActive:!1,s3AccessKeyId:"",s3UrlExpire:86400,s3SecretAccessKey:"",bucketName:"",errorMsgs:{initialized:"ADA SDK could not be initialized",upload:"File upload error"},errors:[],validationErrors:[],maxFileSize:10,allowedFileExtensions:[],uploadPath:"",uploaded:void 0},e.isFileValid=function(t){var a=e.state,n=a.maxFileSize,i=a.allowedFileExtensions,r=[];t.size>1048576*n&&r.push("maxFileSize");var s=g(t.name);return s&&i.length&&!i.includes(s)&&r.push("allowedFileExtensions"),r.length?(e.setState({validationErrors:r}),!1):(e.setState({validationErrors:[]}),!0)},e.onChangeHandler=function(){var t=Object(d.a)(c.a.mark((function t(a){var n,i,r,s;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.state,i=n.isLoading,r=n.isActive,a.preventDefault(),!i&&r&&b.widgetIsActive){t.next=4;break}return t.abrupt("return");case 4:if(!(s=a.currentTarget.files&&a.currentTarget.files[0])||!e.isFileValid(s)){t.next=8;break}return t.next=8,e.uploadFile(s);case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.createGetUrl=function(){var t=Object(d.a)(c.a.mark((function t(a,n){var i,r,s,o,l,d,p,u,v,m;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=e.state,r=i.s3AccessKeyId,s=i.s3UrlExpire,o=i.s3SecretAccessKey,l=i.bucketName,d=i.uploadPath,p={params:{BucketName:l,Key:"".concat(d,"/").concat(a),s3Key:n,s3UrlExpire:s},headers:{"X-S3-P-Key":r,"X-S3-S-Key":o}},u="",t.next=5,f.a.get("".concat(h,"/presigned-url-get-object"),p);case 5:return v=t.sent,(m=v.data).url&&(u=m.url),t.abrupt("return",u);case 9:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}(),e.uploadFile=function(){var t=Object(d.a)(c.a.mark((function t(a){var n,i,r,s,o,l,d,p,u,v,m,_,g,A;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.state,i=n.s3AccessKeyId,r=n.s3UrlExpire,s=n.s3SecretAccessKey,o=n.bucketName,l=n.uploadPath,d=a.name,p=a.type,u={params:{BucketName:o,Key:"".concat(l,"/").concat(d),ContentType:p,s3UrlExpire:r},headers:{"Content-Type":p,"X-S3-P-Key":i,"X-S3-S-Key":s}},e.setState({isLoading:!0}),t.prev=5,t.next=8,f.a.get("".concat(h,"/presigned-url-put-object"),u);case 8:return v=t.sent,m=v.data,t.prev=10,t.next=13,f.a.put(m.url,a,u);case 13:return _=t.sent,g=_.headers,t.next=17,e.createGetUrl(d,g["x-amz-version-id"]);case 17:A=t.sent,e.sendDataToADA(a,g["x-amz-version-id"],A),t.next=25;break;case 21:t.prev=21,t.t0=t.catch(10),console.error(t.t0),e.setState({isActive:!1,isLoading:!1});case 25:t.next=31;break;case 27:t.prev=27,t.t1=t.catch(5),console.error(t.t1),e.setState({isActive:!1,isLoading:!1});case 31:case"end":return t.stop()}}),t,null,[[5,27],[10,21]])})));return function(e){return t.apply(this,arguments)}}(),e.sendDataToADA=function(t,a,n){b.widgetIsActive&&b.sendUserData({fileName:t.name,fileType:t.type,fileSize:t.size,s3Key:a,presignedDownloadUrl:n},(function(t){"SEND_USER_DATA_SUCCESS"===t.type?e.setState({uploaded:!0}):e.setState({errors:["upload"]}),e.setState({isLoading:!1,isActive:!1})}))},e}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this,t=this.state.errorMsgs;try{b.init((function(a){var n,i,r,s,l,c,d,p,u,v,m,_,f;"WIDGET_INITIALIZED"===a.type&&e.setState({isActive:!0,uploaded:!1,s3AccessKeyId:null===(n=a.metaData)||void 0===n?void 0:n.s3_access_key_id,s3UrlExpire:+(null===(i=a.metaData)||void 0===i?void 0:i.s3_url_expire)||86400,s3SecretAccessKey:null===(r=a.metaData)||void 0===r?void 0:r.s3_secret_access_key,bucketName:null===(s=a.metaData)||void 0===s?void 0:s.bucket_name,uploadPath:(null===(l=a.metaData)||void 0===l?void 0:l.upload_path)||(null===(c=a.metaData)||void 0===c?void 0:c.chatterToken)||"uploads",maxFileSize:+(null===(d=a.metaData)||void 0===d?void 0:d.max_file_size)||10,allowedFileExtensions:(null===(p=a.metaData)||void 0===p||null===(u=p.allowed_file_extensions)||void 0===u?void 0:u.split(", "))||[],errorMsgs:Object(o.a)(Object(o.a)({},t),{},{maxFileSize:(null===(v=a.metaData)||void 0===v?void 0:v.max_file_size_msg)||"File size should be less than ".concat(+(null===(m=a.metaData)||void 0===m?void 0:m.max_file_size)||10," Mb"),allowedFileExtensions:(null===(_=a.metaData)||void 0===_?void 0:_.allowed_file_extensions_msg)||"File extension should be one of the list: ".concat(null===(f=a.metaData)||void 0===f?void 0:f.allowed_file_extensions)})});"WIDGET_INITIALIZATION_FAILED"===a.type&&e.setState({isActive:!1,uploaded:!0})}))}catch(a){this.setState({errors:["initialized"]})}}},{key:"componentDidUpdate",value:function(e,t){!b.widgetIsActive&&t.isActive&&this.setState({isActive:!1,uploaded:!0})}},{key:"render",value:function(){var e=this.state,t=e.isLoading,a=e.isActive,n=e.errorMsgs,r=e.errors,s=e.validationErrors,o=e.uploaded,l=x.a.disabledFileUploadBtn;return a&&(l=x.a.fileUploadBtn),t&&(l=x.a.loadingFileUploadBtn),i.a.createElement("div",{className:x.a.wrapper},!0===o&&i.a.createElement("div",{className:x.a.msg},"File is uploaded"),!1===o&&i.a.createElement("label",{htmlFor:"file",className:l},i.a.createElement("input",{type:"file",name:"file",id:"file",onChange:this.onChangeHandler,disabled:t||!a}),i.a.createElement("span",{className:x.a.btnText},"Upload File"),t&&i.a.createElement("div",{className:x.a.loadingSpinner})),i.a.createElement("div",{className:x.a.errorsWrapper},r.map((function(e){return i.a.createElement("div",{key:e,className:x.a.error},n[e])})),s.map((function(e){return i.a.createElement("div",{key:e,className:x.a.error},n[e])}))))}}]),a}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[21,1,2]]]);
//# sourceMappingURL=main.2360b8c8.chunk.js.map