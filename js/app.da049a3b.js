(function(e){function t(t){for(var a,n,i=t[0],c=t[1],l=t[2],d=0,m=[];d<i.length;d++)n=i[d],Object.prototype.hasOwnProperty.call(r,n)&&r[n]&&m.push(r[n][0]),r[n]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);u&&u(t);while(m.length)m.shift()();return s.push.apply(s,l||[]),o()}function o(){for(var e,t=0;t<s.length;t++){for(var o=s[t],a=!0,i=1;i<o.length;i++){var c=o[i];0!==r[c]&&(a=!1)}a&&(s.splice(t--,1),e=n(n.s=o[0]))}return e}var a={},r={app:0},s=[];function n(t){if(a[t])return a[t].exports;var o=a[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=a,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=c;s.push([2,"chunk-vendors"]),o()})({0:function(e,t){},1:function(e,t){},2:function(e,t,o){e.exports=o("56d7")},3:function(e,t){},4:function(e,t){},"56d7":function(e,t,o){"use strict";o.r(t);o("e260"),o("e6cf"),o("cca6"),o("a79d");var a=o("2b0e"),r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app"}},[o("notifications",{attrs:{position:"top center"}}),o("div",{staticClass:"heading"},[o("h4",[e._v("If this is your first checkout upload you will need to confirm your Email address with AWS before receiving orders")]),o("div",{directives:[{name:"show",rawName:"v-show",value:!0===e.logged,expression:"logged === true"}]},[e._v(e._s(e.output))])]),o("GoogleLogin",{directives:[{name:"show",rawName:"v-show",value:!0!==e.logged,expression:"logged !== true"}],staticClass:"googlelogin",attrs:{params:e.gparams,renderParams:e.grenderParams,onSuccess:e.onSuccess,onCurrentUser:e.onCurrentUser}}),o("GoogleLogin",{directives:[{name:"show",rawName:"v-show",value:!0===e.logged,expression:"logged === true"}],staticClass:"signout",attrs:{params:e.gparams,onSuccess:e.signOut,logoutButton:!0}},[e._v("Sign Out")]),o("div",{directives:[{name:"show",rawName:"v-show",value:!0===e.logged,expression:"logged === true"}],staticClass:"container",attrs:{id:"generatecheckout"}},[o("div",{staticClass:"required"},[o("h3",[e._v("Transaction Values (Required)")]),o("label",{attrs:{for:"productname"}},[e._v("Product Name:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.productname,expression:"productname"}],staticClass:"corevalues",attrs:{type:"text",id:"productname",name:"productname",Placeholder:"My Product"},domProps:{value:e.productname},on:{input:function(t){t.target.composing||(e.productname=t.target.value)}}}),o("label",{attrs:{for:"productid"}},[e._v("Product ID:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.productid,expression:"productid"}],staticClass:"corevalues",attrs:{type:"text",id:"productid",name:"productid",Placeholder:"173648092"},domProps:{value:e.productid},on:{input:function(t){t.target.composing||(e.productid=t.target.value)}}}),o("label",{attrs:{for:"price"}},[e._v("Price:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.price,expression:"price"}],staticClass:"corevalues",attrs:{type:"text",id:"price",name:"price",Placeholder:"10.74"},domProps:{value:e.price},on:{input:function(t){t.target.composing||(e.price=t.target.value)}}}),o("label",{attrs:{for:"destination"}},[e._v("Destination:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.destination,expression:"destination"}],staticClass:"corevalues",attrs:{type:"text",id:"destination",name:"destination",Placeholder:"nano_xxxxxx"},domProps:{value:e.destination},on:{input:function(t){t.target.composing||(e.destination=t.target.value)}}}),o("label",{attrs:{for:"net"}},[e._v("Network:")]),o("select",{directives:[{name:"model",rawName:"v-model",value:e.net,expression:"net"}],staticClass:"corevalues",attrs:{name:"net",id:"net"},on:{change:function(t){var o=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.net=t.target.multiple?o:o[0]}}},[o("option",[e._v("live")]),o("option",[e._v("lsio")])])]),o("hr"),o("div",{staticClass:"form-elements"},[o("div",{staticClass:"items"},[o("h3",[e._v("Available Elements")]),o("p",[e._v('Drag from "Available Elements" onto the "Form Preview". Min one custom or preset element.')]),o("draggable",{attrs:{list:e.available,group:"formelements"}},e._l(e.available,(function(t){return o("div",{key:t.name},[o("div",{staticClass:"dragbox boxshadow"},[o("div",{staticClass:"line"},[o("i",{staticClass:"fas fa-grip-vertical"}),e._v(" "+e._s(t.name)+" ")])])])})),0),o("button",{staticClass:"customelement",on:{click:function(t){e.custom=!0}}},[e._m(0),e._v(" Add custom element")]),o("div",{directives:[{name:"show",rawName:"v-show",value:!0===e.custom,expression:"custom===true"}],staticClass:"custom"},[o("label",{attrs:{for:"customname"}},[e._v("Name:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.customname,expression:"customname"}],attrs:{type:"text",id:"customname",name:"customname"},domProps:{value:e.customname},on:{input:function(t){t.target.composing||(e.customname=t.target.value)}}}),o("label",{attrs:{for:"customformlabel"}},[e._v("Form Label:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.customformlabel,expression:"customformlabel"}],attrs:{type:"text",id:"customformlabel",name:"customformlabel"},domProps:{value:e.customformlabel},on:{input:function(t){t.target.composing||(e.customformlabel=t.target.value)}}}),o("label",{attrs:{for:"customplaceholder"}},[e._v("Placeholder:")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.customplaceholder,expression:"customplaceholder"}],attrs:{type:"text",id:"customplaceholder",name:"customplaceholder"},domProps:{value:e.customplaceholder},on:{input:function(t){t.target.composing||(e.customplaceholder=t.target.value)}}}),o("label",{attrs:{for:"customrequired"}},[e._v(" Required")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.customrequired,expression:"customrequired"}],attrs:{type:"checkbox",id:"customrequired",name:"customrequired"},domProps:{checked:Array.isArray(e.customrequired)?e._i(e.customrequired,null)>-1:e.customrequired},on:{change:function(t){var o=e.customrequired,a=t.target,r=!!a.checked;if(Array.isArray(o)){var s=null,n=e._i(o,s);a.checked?n<0&&(e.customrequired=o.concat([s])):n>-1&&(e.customrequired=o.slice(0,n).concat(o.slice(n+1)))}else e.customrequired=r}}}),o("hr"),o("div",{staticClass:"buttonlist"},[o("button",{on:{click:e.addCustom}},[e._v("Save")]),o("a",{attrs:{href:"#"},on:{click:function(t){t.preventDefault(),e.custom=!1}}},[e._v("Cancel")])])])],1),o("div",{staticClass:"form"},[o("h3",[e._v("Form Preview")]),o("div",{staticClass:"preview"},[o("h4",[e._v("This will send "+e._s(e.price)+" Nano to "+e._s(e.destination)+" for "+e._s(e.productname)+" ,please save your receipt from this order it will help you verify your order if something goes wrong")]),o("draggable",{staticStyle:{"min-height":"300px"},attrs:{list:e.form,group:"formelements"}},e._l(e.form,(function(t){return o("div",{key:t.name},["email"===t.name?o("div",{staticClass:"dragbox boxshadow"},[o("label",{attrs:{for:"email"}},[e._v("Email:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"email",name:"email",Placeholder:"user@email.com"}})]):"name"===t.name?o("div",{staticClass:"dragbox boxshadow"},[o("label",{attrs:{for:"name"}},[e._v("Name:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"name",name:"name",Placeholder:"First and Last Name"}})]):"address"===t.name?o("div",{staticClass:"dragbox boxshadow"},[o("label",{attrs:{for:"address1"}},[e._v("Address:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"address1",name:"address1",placeholder:"Street Address"}}),o("label",{attrs:{for:"address2"}},[e._v("Address 2:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"address2",name:"address2",placeholder:"Apt or Box #"}}),o("label",{attrs:{for:"country"}},[e._v("Country:")]),o("country-select",{staticClass:"checkout",attrs:{id:"country",name:"country",country:e.country,topCountry:"US"},model:{value:e.country,callback:function(t){e.country=t},expression:"country"}}),o("label",{attrs:{for:"region"}},[e._v("Region:")]),o("region-select",{staticClass:"checkout",attrs:{id:"region",name:"region",country:e.country,region:e.region},model:{value:e.region,callback:function(t){e.region=t},expression:"region"}}),o("label",{attrs:{for:"city"}},[e._v("City:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"city",name:"city",placeholder:"Local City"}}),o("label",{attrs:{for:"zip"}},[e._v("Postal Code:")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:"zip",name:"zip",placeholder:"Local Postal Code"}})],1):o("div",{staticClass:"dragbox boxshadow"},[o("label",{attrs:{for:t.name}},[e._v(e._s(t.label)+":")]),o("input",{staticClass:"checkout",attrs:{type:"text",id:t.name,name:t.name,placeholder:t.placeholder,required:t.required}})])])})),0)],1)])]),o("hr"),o("button",{directives:[{name:"show",rawName:"v-show",value:!0===e.logged,expression:"logged === true"}],staticClass:"upload",on:{click:e.sendForm}},[e._v("Upload Form")])])],1)},s=[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"icon"},[o("i",{staticClass:"fas fa-plus"})])}],n=(o("b0c0"),o("d3b7"),o("b85c")),i=(o("96cf"),o("1da1")),c=o("174c"),l=o("e571"),u=o.n(l),d=o("310e"),m=o.n(d),p=o("8f3c"),v=o.n(p),f={name:"App",data:function(){return{apiurl:"https://api.nanocheckout.com/yaml",gparams:{client_id:"143179047265-2v5n2i9uvrscl6f7jtcbmdef9n1pcpb9.apps.googleusercontent.com"},grenderParams:{width:250,height:50,longtitle:!0},loading:!1,logged:!1,googletoken:"",available:[{name:"email"},{name:"name"},{name:"address"}],form:[],custom:!1,customname:"",customformlabel:"",customplaceholder:"",customrequired:!1,country:"",region:"",productname:"",destination:"",price:"",net:"live",productid:"",output:""}},components:{GoogleLogin:u.a,draggable:m.a},methods:{onSuccess:function(e){var t=e.getAuthResponse().id_token;this.logged=!0,this.googletoken=t,console.log(t)},onCurrentUser:function(e){var t=e.getAuthResponse().id_token;this.logged=!0,this.googletoken=t,console.log(t)},signOut:function(){console.log("User signed out."),this.logged=!1,this.googletoken=""},addCustom:function(){this.available.push({name:this.customname,label:this.customformlabel,placeholder:this.customplaceholder,required:this.customrequired}),this.customname="",this.customformlabel="",this.customplaceholder="",this.customrequired=!1,this.custom=!1},sendForm:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var o,a,r,s,i,l,u,d,m,p;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.productname&&e.productid&&e.price&&c["a"](e.destination)&&0!=e.form.length){t.next=3;break}return e.$notify({title:"Error",text:"Input Required",type:"error"}),t.abrupt("return",!1);case 3:o={},o["product"]=e.productname,o["productid"]=e.productid,o["price"]=e.price,o["destination"]=e.destination,o["net"]=e.net,o["inputs"]=[],a=[],r=Object(n["a"])(e.form);try{for(r.s();!(s=r.n()).done;)i=s.value,"email"==i.name?o.inputs.push({type:"email",placeholder:"user@email.com",required:!0}):"name"==i.name?o.inputs.push({type:"name",placeholder:"First and Last Name",required:!0}):"address"==i.name?o.inputs.push({type:"address",required:!0}):(i["type"]="custom",o.inputs.push(i))}catch(f){r.e(f)}finally{r.f()}return a.length>0&&o.inputs.push({custom:a}),l=v.a.stringify(o),console.log(l),u={method:"POST",body:l},d=e.apiurl+"?type=upload&token="+e.googletoken,t.next=20,fetch(d,u);case 20:return m=t.sent,t.next=23,m.json();case 23:p=t.sent,e.output="upload: "+JSON.stringify(p);case 25:case"end":return t.stop()}}),t)})))()}}},g=f,h=(o("5c0b"),o("2877")),b=Object(h["a"])(g,r,s,!1,null,null,null),y=b.exports,x=o("ee98"),_=o.n(x),w=o("ecee"),C=o("c074"),k=o("ad3d"),P=o("d21d"),q=o.n(P);a["default"].use(_.a),a["default"].use(q.a),w["c"].add(C["a"],C["b"]),a["default"].component("font-awesome-icon",k["a"]),a["default"].config.productionTip=!1,new a["default"]({render:function(e){return e(y)}}).$mount("#app")},"5c0b":function(e,t,o){"use strict";var a=o("9c0c"),r=o.n(a);r.a},"9c0c":function(e,t,o){}});
//# sourceMappingURL=app.da049a3b.js.map