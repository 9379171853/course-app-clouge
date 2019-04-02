import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import './shared-styles.js';

setRootPath(MyAppGlobals.rootPath);
/**
 * @customElement
 * @polymer
 */
class CoursePocApp extends PolymerElement {
  constructor(){
    super();
  }
  ready(){
    super.ready();
  }
  connectedCallback(){
    super.connectedCallback();
    document.querySelector('course-poc-app').addEventListener('checkUserLogin', function (e) {
      this.loggedUser = true; 
  })
   this.checkUser();
  }
static get template() {
    return html`
      <style  include="shared-styles">
        :host {
          display: block;
        }
        app-header{
            border-bottom:1px #eee solid;
        }
        app-header a{
          color:#0075b2;
          text-decoration:none;
          text-transform:uppercase;
          font-family:'Roboto', 'Noto', sans-serif;
        }
        app-header .menu:after{
          content:"|"; 
          padding:0 10px;         
        }
        .loginPage{
          margin:0 auto;
          width:720px;          
        }
        paper-tab {
          color: #fff;
          font-size:14px;
          background-color: #1e88e5;
          font-family:'Roboto', 'Noto', sans-serif;
        }
        paper-tab.iron-selected {
          color: #0075b2;
          background-color: #eee;
        }
      </style>
      <app-location route="{{route}}"  url-space-regex="^[[rootPath]]"></app-location>
      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}"></app-route> 
      <app-localstorage-document id="userData" key="id" data="{{userData}}" storage="window.localStorage"></app-localstorage-document>
             
      <app-header-layout>
            <app-header slot="header">
                <app-toolbar>
                  <div main-title class="logo">COURSE POC</div> 
                  <iron-selector selected="[[page]]" attr-for-selected="name">
                    <a name="home" href="[[rootPath]]home" class="menu">Home</a>
                    <template is="dom-if" if="{{!loggedUser}}">
                      <a name="login" href="[[rootPath]]login" tabindex="-1"  class="menu">Login</a>
                      <a name="register" href="[[rootPath]]register" tabindex="-1">Register</a>                    
                    </template>
                    <template is="dom-if" if="{{loggedUser}}">
                      <a name="myCourse" href="[[rootPath]]myCourse" tabindex="-1"  class="menu">My Courses</a>
                      <a name="logout" on-tap="_logout" href="javascript:void(0);" tabindex="-1">Logout</a>
                    </template>
                  </iron-selector>               
                </app-toolbar>
            </app-header>
        </app-header-layout>
        <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
          <course-login loggedUser={{loggedUser}} name="login"></course-login>
          <course-register name="register"></course-register>
          <course-dashboard logged-user={{loggedUser}} name="home"></course-dashboard>
          <course-user loggedUser={{loggedUser}} name="myCourse"></course-user>
        </iron-pages>
    `;
  }
      
  static get properties() {
    return {
      page: {
          type:String,
          reflectToAttribute:true,
          observer:"_pageChanged"
      },
      routeData: Object,
      selectedTab:{
        type:Number,
        value: 0
      },
      loggedUser:{
        type:Boolean,
        notify:true
      }
    };
  }
static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }
  
  _routePageChanged(page) {
    if (!page) {
      this.page = 'home';
    }else if(page == 'logout'){
        this.page = 'login';
        this.set('route.path','/login');
    } else if (['login', 'register','home','myCourse'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'notFound';
    }
  }

  checkUser(){
    if(localStorage.getItem('userData') != 'null' && localStorage.getItem('userData') != null){
      this.loggedUser = true;
    }else{
      localStorage.userData = null;
      this.loggedUser = false;
    }
  }

  _logout(){
	  this.set('route.path','/home');
    localStorage.userData = null;
    this.loggedUser = false;
  }

  _pageChanged(page) {
    this.checkUser();
    switch (page) {
      case 'login':
        import('./course-login.js');
        break;
      case 'register':
        import('./course-register.js');
        break;
      case 'home':
        import('./course-dashboard.js');
        break;
      case 'myCourse':
        import('./course-user.js');
        break;
      case 'notFound':
        import('./course-not-found.js');
        break;
    }
  }
  
}
window.customElements.define('course-poc-app', CoursePocApp);
