import{a as U,b as ie,c as ne}from"./chunk-NONDKU7S.js";import{$ as X,L,M as V,N as $,O as k,P as W,Q as q,R as z,S as B,T as J,U as K,V as P,Z as Q,aa as Y,ba as Z,ca as ee,ea as te,fa as C,p as h,s as H,t as j,u as A,v as G,w as N}from"./chunk-36TXZI5T.js";import{Bb as I,Eb as w,Gb as D,Hc as R,Jb as O,Qb as E,Rb as r,Sb as _,Ta as l,Tb as T,Ua as x,W as p,Yb as F,Zb as g,ac as b,da as M,ea as u,ib as s,ma as v,mb as m,na as S,vb as i,wb as o,xb as c,yb as d,zb as f}from"./chunk-3SPXI7PS.js";import"./chunk-RNMDN42R.js";var oe=()=>["index","name","signalrId"];function me(e,a){if(e&1){let t=I();i(0,"div",5)(1,"div",6)(2,"mat-card",7)(3,"mat-card-header")(4,"mat-card-title"),r(5),o()(),c(6,"mat-divider"),i(7,"mat-card-content",8)(8,"div"),r(9,"Connection ID:"),o(),i(10,"mat-icon",9),w("mouseenter",function(){return v(t),S(!0)})("mouseleave",function(){return v(t),S(!1)}),r(11," visibility "),o()()()()()}if(e&2){let t=D();l(5),T("Welcome, ",t.signalrService.userData.name,""),l(5),O("matTooltip",t.signalrService.userData.signalrId)}}function ce(e,a){e&1&&(i(0,"th",18),r(1,"\u2116"),o())}function pe(e,a){if(e&1&&(i(0,"td",19),r(1),o()),e&2){let t=a.index;l(),_(t+1)}}function ue(e,a){e&1&&(i(0,"th",18),r(1,"User Name"),o())}function de(e,a){if(e&1&&(i(0,"td",19),r(1),o()),e&2){let t=a.$implicit;l(),_(t==null?null:t.name)}}function fe(e,a){e&1&&(i(0,"th",18),r(1,"Connection ID"),o())}function _e(e,a){if(e&1&&(i(0,"td",19),r(1),o()),e&2){let t=a.$implicit;l(),_(t==null?null:t.signalrId)}}function Ce(e,a){e&1&&c(0,"tr",20)}function ve(e,a){e&1&&c(0,"tr",21)}function Se(e,a){if(e&1&&(i(0,"div")(1,"table",10),d(2,11),s(3,ce,2,0,"th",12)(4,pe,2,1,"td",13),f(),d(5,14),s(6,ue,2,0,"th",12)(7,de,2,1,"td",13),f(),d(8,15),s(9,fe,2,0,"th",12)(10,_e,2,1,"td",13),f(),s(11,Ce,1,0,"tr",16)(12,ve,1,0,"tr",17),o()()),e&2){let t=D();l(),m("dataSource",t.usersOnline),l(10),m("matHeaderRowDef",g(3,oe)),l(),m("matRowDefColumns",g(4,oe))}}function xe(e,a){e&1&&(i(0,"p"),r(1,"No users are currently online."),o())}var re=(()=>{class e{signalrService;apiAuthService;usersOnline=new Array;constructor(t,n){this.signalrService=t,this.apiAuthService=n}ngOnInit(){this.userOnline(),this.userOffline(),this.getOnlineUsers(),this.signalrService.hubConnection.state==ie.Connected?this.getOnlineUsersInv():this.signalrService.signalrSubject$.subscribe(t=>{t.type=="HubConnectionStarted"&&this.getOnlineUsersInv()})}userOnline(){try{this.signalrService.hubConnection.on("User_Online",t=>{this.usersOnline.push(t)})}catch(t){console.log(t)}}userOffline(){try{this.signalrService.hubConnection.on("User_Offline",t=>{this.usersOnline=this.usersOnline.filter(n=>n.id!=t)})}catch(t){console.log(t)}}getOnlineUsersInv(){this.signalrService.hubConnection.invoke("GetOnlineUsers").catch(t=>console.error(t))}getOnlineUsers(){this.signalrService.hubConnection.on("GetOnlineUsers_Response",t=>{this.usersOnline=[...t]})}static \u0275fac=function(n){return new(n||e)(x(ne),x(U))};static \u0275cmp=M({type:e,selectors:[["app-display-connection-status"]],standalone:!0,features:[F],decls:11,vars:3,consts:[["noUsers",""],["fxLayout","column","fxFlexFill",""],["color","primary",4,"ngIf"],[2,"margin-top","16px"],[4,"ngIf","ngIfElse"],["color","primary"],["fxFlex","100%","fxLayoutGap","20px"],[2,"padding","5px 10px"],["fxFlex","","fxLayout","row","fxFlexAlign","start center","fxLayoutGap","10px",2,"margin-top","10px"],[2,"cursor","pointer",3,"mouseenter","mouseleave","matTooltip"],["mat-table","",3,"dataSource"],["matColumnDef","index"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","name"],["matColumnDef","signalrId"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["mat-header-cell",""],["mat-cell",""],["mat-header-row",""],["mat-row",""]],template:function(n,y){if(n&1&&(i(0,"div",1),s(1,me,12,2,"div",2),i(2,"mat-card",3)(3,"mat-card-header")(4,"mat-card-title"),r(5,"Online Users"),o()(),c(6,"mat-divider"),i(7,"mat-card-content"),s(8,Se,13,5,"div",4)(9,xe,2,0,"ng-template",null,0,b),o()()()),n&2){let se=E(10);l(),m("ngIf",y.signalrService.userData),l(7),m("ngIf",y.usersOnline.length>0)("ngIfElse",se)}},dependencies:[C,R,H,j,N,G,A,L,$,z,k,V,B,W,q,J,K,P,X,Z,ee,Y,te,Q]})}return e})();var De=[{path:"",component:re}],le=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=p({imports:[h.forChild(De),h]})}return e})();var Ne=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=p({imports:[C,le]})}return e})();export{Ne as DisplayConnectionStatusModule};
