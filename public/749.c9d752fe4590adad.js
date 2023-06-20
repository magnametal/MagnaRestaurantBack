"use strict";(self.webpackChunkheroesApp=self.webpackChunkheroesApp||[]).push([[749],{6749:(W,Z,i)=>{i.r(Z),i.d(Z,{AuthModule:()=>q});var R=i(6895),m=i(7731),a=i(4006),C=i(5226),b=i.n(C),t=i(4650),S=i(2340),A=i(4004),y=i(262),I=i(8505),k=i(1005),O=i(9646);const p=S.N.baseUrl;class L{constructor(l,o,e,n,u,s,f,v){this.nombre=l,this.email=o,this.activo=e,this.password=n,this.img=u,this.google=s,this.role=f,this.uid=v}get imagenUrl(){return this.img?this.img?.includes("https")?this.img:this.img?`${p}/upload/usuarios/${this.img}`:`${p}/upload/usuarios/no-image`:`${p}/upload/usuarios/no-image`}}var F=i(529);const c=S.N.baseUrl;let U=(()=>{class r{constructor(o,e,n){this.http=o,this.router=e,this.ngZone=n}get token(){return localStorage.getItem("token")||""}get role(){return this.usuario?.role}get uid(){return this.usuario?.uid||""}get headers(){return{headers:{"x-token":this.token}}}validaToken(){return localStorage.getItem("token"),this.http.get(`${c}/login/renew`,{headers:{"x-token":this.token}}).pipe((0,A.U)(e=>{const{nombre:n,email:u,activo:s,img:f,google:v,role:w,uid:j}=e.usuario;return this.usuario=new L(n,u,s,"",f,v,w,j),this.getTokenYStatus(e.token,e.activo,e.menu),!0}),(0,y.K)(e=>(0,O.of)(!1)))}crearUsuario(o){return this.http.post(`${c}/usuarios`,o).pipe((0,I.b)(e=>{localStorage.setItem("token",e.token),localStorage.setItem("activo",e.usuario.activo)}))}login(o){return this.http.post(`${c}/login`,o).pipe((0,I.b)(e=>{this.getTokenYStatus(e.token,e.activo,e.menu)}))}logOut(){localStorage.removeItem("token"),localStorage.removeItem("menu"),google.accounts.id.revoke("luis.aponte80@gmail.com",()=>{this.router.navigateByUrl("/login")})}actualizarPerfil(o){return o={...o,role:this.usuario.role||""},this.http.put(`${c}/usuarios/${this.uid}`,o,this.headers)}cargarUsuarios(o=0){return this.http.get(`${c}/usuarios?desde=${o}`,this.headers).pipe((0,k.g)(1e3),(0,A.U)(n=>{const u=n.usuarios.map(s=>new L(s.nombre,s.email,s.activo,"",s.img,s.google,s.role,s.uid));return{total:n.total,usuarios:u}}))}eliminarUsuario(o){return console.log(o),console.log("Eliminando"),this.http.delete(`${c}/usuarios/${o.uid}`,this.headers)}guardarUsuario(o){return this.http.put(`${c}/usuarios/${o.uid}`,o,this.headers)}getTokenYStatus(o,e,n){localStorage.setItem("token",o),localStorage.setItem("activo",e),localStorage.setItem("menu",JSON.stringify(n))}}return r.\u0275fac=function(o){return new(o||r)(t.LFG(F.eN),t.LFG(m.F0),t.LFG(t.R0b))},r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();var x=i(5938),d=i(4463);let G=(()=>{class r{constructor(o){this.translate=o,this.idiomas=["br","en","es"],this.idiomaActual="",this.bandera="assets/banderas/cr.svg"}cambiarIdioma(){let o=this.translate.currentLang,e=this.idiomas.findIndex(u=>u===o);e++,e>2&&(e=0);let n=this.idiomas[e];this.idiomaActual=n,"es"===n&&(this.bandera="assets/banderas/cr.svg"),"en"===n&&(this.bandera="assets/banderas/us.svg"),"br"===n&&(this.bandera="assets/banderas/br.svg"),this.translate.use(n)}}return r.\u0275fac=function(o){return new(o||r)(t.LFG(d.sK))},r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();var M=i(3683),N=i(7392),E=i(4859),h=i(7676),T=i(4144),g=i(1576);const J=[{path:"",children:[{path:"login",component:(()=>{class r{constructor(o,e,n,u,s){this.router=o,this.usuarioService=e,this.fb=n,this.matDialog=u,this.idiomas=s,this.miFormulario=this.fb.group({email:["",[a.kI.required,a.kI.email]],password:["",[a.kI.required,a.kI.minLength(6)]]}),this.idiomaActual=""}login(){this.usuarioService.login(this.miFormulario.value).subscribe({next:o=>{!0===o.ok&&(!1===o.activo||this.router.navigateByUrl("/compatibilidad"),localStorage.setItem("email",this.miFormulario.value.email))},error:o=>{b().fire("Error",o.error.msg,"error")}})}cambiarIdioma(){this.idiomas.cambiarIdioma()}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(m.F0),t.Y36(U),t.Y36(a.QS),t.Y36(x.uw),t.Y36(G))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-login"]],decls:36,vars:17,consts:[[2,"margin","0","position","absolute"],[1,"boton_bandera",3,"click"],[3,"src"],[1,"contenedor"],["fxLayout","column","fxFlex","100","fxLayoutAlign","center center",1,"login"],["src","assets/logos/ambertraining.png","alt","",2,"width","100px","height","100px"],[1,"h1-main"],["autocomplete","off",1,"example-form",3,"formGroup","ngSubmit"],["appearance","fill",1,"example-full-width"],["matInput","","placeholder","Email","type","text","formControlName","email"],["matInput","","placeholder","password","type","password","formControlName","password"],["mat-raised-button","",3,"click"],["routerLink","/auth/registro",1,"link"],["src","assets/logos/oldschool.png","alt","",2,"width","80px","height","80px"]],template:function(o,e){1&o&&(t.TgZ(0,"p",0)(1,"mat-toolbar")(2,"button",1),t.NdJ("click",function(){return e.cambiarIdioma()}),t.TgZ(3,"mat-icon"),t._UZ(4,"img",2),t.qZA()()()(),t.TgZ(5,"div",3)(6,"div",4),t._UZ(7,"img",5),t.TgZ(8,"h3"),t._uU(9),t.ALo(10,"translate"),t.qZA(),t.TgZ(11,"h1",6),t._uU(12,"Compatibilidad App"),t.qZA(),t.TgZ(13,"form",7),t.NdJ("ngSubmit",function(){return e.login()}),t.TgZ(14,"mat-form-field",8)(15,"mat-label"),t._uU(16),t.ALo(17,"translate"),t.qZA(),t._UZ(18,"input",9),t.qZA(),t._UZ(19,"br"),t.TgZ(20,"mat-form-field",8)(21,"mat-label"),t._uU(22),t.ALo(23,"translate"),t.qZA(),t._UZ(24,"input",10),t.qZA()(),t.TgZ(25,"button",11),t.NdJ("click",function(){return e.login()}),t._uU(26,"Ingresar"),t.qZA(),t._UZ(27,"br"),t.TgZ(28,"p"),t._uU(29),t.ALo(30,"translate"),t.TgZ(31,"span")(32,"a",12),t._uU(33),t.ALo(34,"translate"),t.qZA()()(),t._UZ(35,"img",13),t.qZA()()),2&o&&(t.xp6(4),t.Q6J("src",e.idiomas.bandera,t.LSH),t.xp6(5),t.Oqu(t.lcZ(10,7,"LOGIN_WELCOME")),t.xp6(4),t.Q6J("formGroup",e.miFormulario),t.xp6(3),t.Oqu(t.lcZ(17,9,"LOGIN_USER")),t.xp6(6),t.Oqu(t.lcZ(23,11,"LOGIN_PASSWORD")),t.xp6(7),t.hij("",t.lcZ(30,13,"LOGIN_MESSAGE")," "),t.xp6(4),t.Oqu(t.lcZ(34,15,"LOGIN_HERE")))},dependencies:[m.yS,M.Ye,N.Hw,E.lW,h.KE,h.hX,T.Nt,g.xw,g.Wh,g.yH,a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u,d.X$],styles:[".contenedor[_ngcontent-%COMP%]{height:100%;background-color:#161616}.login[_ngcontent-%COMP%]{background-color:#161616;width:100%;color:#fff;text-align:center;align-items:center;margin-top:-50px}.link[_ngcontent-%COMP%]{color:orange;text-decoration:none}.link[_ngcontent-%COMP%]:hover{color:#fff}.boton_bandera[_ngcontent-%COMP%]{border:none;background:none;display:pointer;cursor:pointer}mat-toolbar[_ngcontent-%COMP%]{background:rgb(22,22,22)}"]}),r})()},{path:"registro",component:(()=>{class r{constructor(o,e,n,u){this.fb=o,this.router=e,this.usuarioService=n,this.matDialog=u,this.miFormulario=this.fb.group({nombre:["",[a.kI.required]],email:["",[a.kI.required,a.kI.email]],password:["",[a.kI.required,a.kI.minLength(6)]]}),this.formSubmitted=!1}registro(){this.formSubmitted=!0,!this.miFormulario.invalid&&this.usuarioService.crearUsuario(this.miFormulario.value).subscribe({next:o=>{localStorage.getItem("activo")},error:o=>{console.log(o),b().fire("Error",o.error.msg,"error")}})}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(a.QS),t.Y36(m.F0),t.Y36(U),t.Y36(x.uw))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-register"]],decls:39,vars:32,consts:[[1,"contenedor"],["fxLayout","column","fxFlex","100","fxLayoutAlign","center center",1,"login"],["autocomplete","off",1,"login100-form",3,"formGroup","ngSubmit"],["appearance","fill",1,"example-full-width"],["type","text","formControlName","nombre","matInput","",1,"input100",3,"placeholder"],[1,"focus-input100"],["type","email","formControlName","email","matInput","",1,"input100",3,"placeholder"],["type","password","formControlName","password","matInput","",1,"input100",3,"placeholder"],["mat-button","","type","submit",3,"disabled"],["routerLink","/auth/login",1,"link"]],template:function(o,e){1&o&&(t.TgZ(0,"div",0)(1,"div",1)(2,"form",2),t.NdJ("ngSubmit",function(){return e.registro()}),t.TgZ(3,"h1"),t._uU(4),t.ALo(5,"translate"),t.qZA(),t.TgZ(6,"mat-form-field",3)(7,"mat-label"),t._uU(8),t.ALo(9,"translate"),t.qZA(),t._UZ(10,"input",4),t.ALo(11,"translate"),t._UZ(12,"span",5),t.qZA(),t._UZ(13,"br"),t.TgZ(14,"mat-form-field",3)(15,"mat-label"),t._uU(16),t.ALo(17,"translate"),t.qZA(),t._UZ(18,"input",6),t.ALo(19,"translate"),t.qZA(),t._UZ(20,"br"),t.TgZ(21,"mat-form-field",3)(22,"mat-label"),t._uU(23),t.ALo(24,"translate"),t.qZA(),t._UZ(25,"input",7),t.ALo(26,"translate"),t.qZA(),t._UZ(27,"br"),t.TgZ(28,"button",8),t._uU(29),t.ALo(30,"translate"),t.qZA(),t._UZ(31,"br"),t.TgZ(32,"div")(33,"p"),t._uU(34),t.ALo(35,"translate"),t.qZA(),t.TgZ(36,"a",9),t._uU(37),t.ALo(38,"translate"),t.qZA()()()()()),2&o&&(t.xp6(2),t.Q6J("formGroup",e.miFormulario),t.xp6(2),t.Oqu(t.lcZ(5,12,"REGISTER_TITLE")),t.xp6(4),t.Oqu(t.lcZ(9,14,"REGISTER_NAME")),t.xp6(2),t.s9C("placeholder",t.lcZ(11,16,"REGISTER_TITLE")),t.xp6(6),t.Oqu(t.lcZ(17,18,"REGISTER_EMAIL")),t.xp6(2),t.s9C("placeholder",t.lcZ(19,20,"REGISTER_EMAIL")),t.xp6(5),t.Oqu(t.lcZ(24,22,"REGISTER_PASSWORD")),t.xp6(2),t.s9C("placeholder",t.lcZ(26,24,"REGISTER_PASSWORD")),t.xp6(3),t.Q6J("disabled",e.miFormulario.invalid),t.xp6(1),t.hij(" ",t.lcZ(30,26,"REGISTER_REGISTER")," "),t.xp6(5),t.hij(" ",t.lcZ(35,28,"REGISTER_MESSAGE")," "),t.xp6(3),t.hij(" ",t.lcZ(38,30,"REGISTER_HERE")," "))},dependencies:[m.yS,E.lW,h.KE,h.hX,T.Nt,g.xw,g.Wh,g.yH,a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u,d.X$],styles:[".contenedor[_ngcontent-%COMP%]{height:100%;background-color:#161616;padding-top:50px}.login[_ngcontent-%COMP%]{background-color:#161616;width:100%;color:#fff;text-align:center;align-items:center}.link[_ngcontent-%COMP%]{color:orange;text-decoration:none}.link[_ngcontent-%COMP%]:hover{color:#fff}"]}),r})()},{path:"**",redirectTo:"login"}]}];let Y=(()=>{class r{}return r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[m.Bz.forChild(J),m.Bz]}),r})();var $=i(4471),P=i(5823);let q=(()=>{class r{}return r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[R.ez,Y,$.q,P.o9,a.UX,d.aw]}),r})()}}]);