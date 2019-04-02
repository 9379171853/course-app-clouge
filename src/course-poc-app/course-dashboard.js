import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './shared-styles.js';


/**
 * @customElement
 * @polymer
 */
class CourseDashboard extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        super.ready();
    }
    
    connectedCallback(){
        super.connectedCallback();
        this._generateAjaxCall('http://localhost:3000/course/rest/getAllCourse','GET',null);

        this.$.addCourseForm.addEventListener('iron-form-submit', function(event) {         
                    this.ajaxFlag = 'addCourse';
                    let ajaxData = {'courseName':event.detail.courseName, 'courseTitle':event.detail.courseTitle, 'link':event.detail.link,'topic':this.topicValues};
                    this._generateAjaxCall('http://localhost:3000/course/rest/addNewCourse','POST',ajaxData);
        }.bind(this));
        //this.updateItemsFromPage(1);

    }
    static get template(){
        return html`
    <iron-ajax id="ajaxCourseCall" on-response="_handleResponse"  loading="{{loadingCourse}}"  handle-as="json" content-type="application/json"></iron-ajax>
     
    <style is="custom-style"></style>
      <style include="shared-styles">
        paper-button{
            background: blue;
            color: white;
            height: 100%;
            border-radius: 5px; 
         }
         .courseTitle, .courseTitle a{
             color:#0075b2;
         }
        paper-tab {
          color: #fff;
          font-size:14px;
          background-color: #1e88e5;
          font-family:'Roboto', 'Noto', sans-serif;
        }
        paper-tabs{
            width:450px;
        }
        paper-tab.iron-selected {
          color: #0075b2;
          background-color: #eee;
        }
        .selectedTopics{
            backgroudn-color:#ccc;display: inline-block;padding: 5px;background-color: #ccc;border-radius: 3px;
        }
        .flex-horizontal {
            @apply --layout-horizontal;      
            @apply --layout-justified;
        }
        .firstchild {
            @apply --layout-self-start;
        }
        .secondchild {
        @apply --layout-self-end;
        }
        #notifyCourseMessage{
            background:#099013;
        }
        .prevBtns{
            content: "<";
            display:inline-block;
        }
        .nextBtns{
            content: ">";
            display:inline-block;
        }
        paper-progress{
            width:100%;
        }
        .enrollBtn{
            background-color:#099013; 
            height:30px;
        }
        #addCourseDialog{
            width:600px;
            padding:10px;
        }
        #courseTitleDialog{
            width:400px; 
            max-height:auto;
        }

         #pages {
            display: flex;
            flex-wrap: wrap;
            margin: 20px;
          }
          #pages > button {
            user-select: none;
            padding: 5px;
            margin: 0 5px;
            border-radius: 10%;
            border: 0;
            background: transparent;
            font: inherit;
            outline: none;
            cursor: pointer;
          }
          #pages > button:not([disabled]):hover,
          #pages > button:focus {
            color: #ccc;
            background-color: #eee;
          }
          #pages > button[selected] {
            font-weight: bold;
            color: white;
            background-color: #0075b2;
          }
          #pages > button[disabled] {
            opacity: 0.5;
            cursor: default;
          }
      </style>     
      <div class="card">
<div class="container flex-horizontal">
  <div class="firstChild">
  <paper-tabs selected="{{selectedTab}}">
                <paper-tab  on-tap="_loadAllCourses">ALL COURSES</paper-tab>
                <template is="dom-if" if="[[loggedUser]]">
                <paper-tab on-tap="_loadRecCourses" style="border-left:1px #ccc solid;">RECOMMENDED COURSES</paper-tab>
                </template>
              </paper-tabs></div>
              <template is="dom-if" if="[[loggedUser]]">
  <div class="secondChild"><paper-button id="addCourse" on-click="_openAddCourse">ADD COURSE</paper-button></div>
  </template>
</div>
              
      <h2>[[dashboardHeading]]</h2>
   
    <template is="dom-if" if="{{loadingCourse}}">
    <paper-progress value="10" indeterminate="true"></paper-progress>
    </template>

      <vaadin-grid theme="row-dividers" id="courseGrid" column-reordering-allowed multi-sort items="[[courseList]]">
        <template class="row-details">
        <div class="details">
        <template is="dom-repeat" items="{{item.title}}" sort="_sortCourseTitle">
  <p class="courseTitle"><a href="[[item.link]]" target="_blank">[[item.courseTitle]]</span>  
  </a><paper-icon-button icon="info" on-click="_openTitleDialog" title="View Topics" dataVal="{{item.title.topic}}"></paper-icon-button></p>
</template>
        </div>
      </template>

        <vaadin-grid-sort-column width="9em" header="COURSE ID" path="courseId"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" header="COURSE NAME" path="courseName"></vaadin-grid-sort-column>
        <vaadin-grid-column width="2em">        
        <template class="header">ACTION</template>
        <template>
          <vaadin-checkbox aria-label$="Show Details for [[item.courseName]]" checked="{{detailsOpened}}">Show Details</vaadin-checkbox>          
        </template>
      </vaadin-grid-column>
      <template is="dom-if" if="[[loggedUser]]">
      <vaadin-grid-column width="100px">
      <template>
      <paper-button class="enrollBtn" on-click="_enrollCourse">
  <iron-icon icon="check-circle"></iron-icon>Enroll
  </paper-button></template>
      </vaadin-grid-column>
      </template>
    </vaadin-grid>

<div id="pages"></div>


      </div>

  <paper-dialog id="addCourseDialog" no-cancel-on-outside-click with-backdrop>
  <h2>ADD COURSE</h2>
  <paper-dialog-scrollable>
        <iron-form id="addCourseForm">
            <form>
                <paper-input type="text" name="courseName" auto-validate required label="Course Name"" error-message="Enter Course Name" min="2" allowed-pattern="[a-zA-Z ]"></paper-input>
                <paper-input type="text" name="courseTitle" auto-validate required label="Course Title" error-message="Enter Course Title"></paper-input>
                <paper-input type="text" name="link" auto-validate required label="Link" error-message="Enter Link"></paper-input>
                <paper-input type="text" name="topic" auto-validate required label="Topic" value={{topicInput}} error-message="Add Topic" invalid$="[[invalidField]]"></paper-input>
                <paper-icon-button icon="add-circle" on-click="_addTopics" title="Add Topic" dataVal="{{item.title.topic}}"></paper-icon-button>
                
                <template is="dom-repeat" items="{{topicValues}}">

                <span class="selectedTopics">[[item.topicName]]<iron-icon icon="clear" slot="item-icon"></iron-icon></span>
                
                </template>
                <div id="topicList">
                </div>
                <br />
                <div id="addCourseError"></div>
                <paper-button name="Submit" autofocus id="addCourseButton" raised on-click="_addCourse">ADD COURSE</paper-button>
                <paper-button on-click="_resetAddCourseForm">RESET</paper-button>                
                <paper-button dialog-dismiss>CANCEL</paper-button>
            </form>
        </iron-form>
        </paper-dialog-scrollable> 
 
</paper-dialog>

<paper-dialog id="courseTitleDialog">
  <p style="color:#0075b2;">COURSE TOPICS</p>
  <paper-dialog-scrollable>
<template is="dom-repeat" items="{{courseTopics}}">
<p>
<paper-icon-item>
  <iron-icon icon="label" slot="item-icon"></iron-icon>
  {{item.topicName}}
</paper-icon-item>
</p>
</template>
    <paper-button dialog-dismiss>OK</paper-button>

    </paper-dialog-scrollable>
</paper-dialog>
       <paper-toast id="notifyCourseMessage" text="{{notifyMessage}}" opened$="[[openNotify]]" horizontal-align="right"></paper-toast> 
        `;
    }
    static get properties(){
        return {
            courseList:{
                type: Array,
                value: []
            },
            selectedTab:{
                type: Boolean,
                value: 0,
                notify:true
            },
            courseTopics:{
                type: Array,
                value:[]
            },
            ajaxFlag:{
                type:String,
                value:"all"
            },
            loadingCourse: {
                type: Boolean,
                notify: true,
                value: false
            },
            loggedUser:{
                type: Boolean
            },
            topicValues:{
                type:Array,
                value:[],
                notify:true
            },
            topicInput:{
                type:String,
                value:'',
                notify:true
            },
            invalidField:{
                type:Boolean,
                value:false
            },
            notifyMessage:{
                type:String
            },
            openNotify:{
                type:Boolean,
                value:false
            },
            dashboardHeading:{
                type: String,
                value: 'ALL COURSES'
            },
            pages:{
                type:Number
            }
        }
    }
    _openAddCourse(){
        this.$.addCourseForm.reset();
        this.openNotify = false;
        this.$.addCourseDialog.open();
    }
    _generateAjaxCall(url,method,data){
        this.loadingCourse = true;
        let ajaxEle = this.$.ajaxCourseCall;
        ajaxEle.url = url;
        if(method == 'POST'){
            ajaxEle.contentType='application/json';
            ajaxEle.body= JSON.stringify(data);
        }
        ajaxEle.method = method;
        ajaxEle.generateRequest();
    }
    _loadRecCourses(){
        this.ajaxFlag = 'recCourse';
        this.dashboardHeading = 'RECOMMENDED COURSES';
        let userName = JSON.parse(localStorage.userData).userName;
        let ajaxData = {"emailId":userName};
        this._generateAjaxCall('http://localhost:3000/course/rest/recomendedCourses','POST',ajaxData);  
    }
    _loadAllCourses(){        
        this.dashboardHeading = 'ALL COURSES';
        this._generateAjaxCall('http://localhost:3000/course/rest/getAllCourse','GET',null);       
    }
    _handleResponse(event){
        let ajaxEleId = this.ajaxFlag;
        switch(ajaxEleId){
            case 'all':
                this.courseList = event.detail.response;
                this.updateItemsFromPage(1);
                this.ajaxFlag ='all';
                break;
            case 'addCourse':
                this.$.addCourseDialog.toggle();
                this.ajaxFlag = 'all'; 
                this.notifyMessage = 'Course Added Successfully.';
                this.openNotify = true;   
                this._generateAjaxCall('http://localhost:3000/course/rest/getAllCourse','GET',null);
                break;
            case 'enrolCourse':
                this.ajaxFlag = 'all';
                this.$.addCourseDialog.close();
                break;
            case 'recCourse':
                this.courseList = event.detail.response;
                this.ajaxFlag ='all';
                break;
        }
        /*if(ajaxEleId == 'all'){
            this.courseList = event.detail.response;
            this.ajaxFlag ='all';
        }else if(ajaxEleId == 'addCourse'){            
            this.$.addCourseDialog.toggle();
            this.ajaxFlag = 'all'; 
            this.notifyMessage = 'Course Added Successfully.';
            this.openNotify = true;   
            this._generateAjaxCall('http://localhost:3000/course/rest/getAllCourse','GET',null);
        }else if(ajaxEleId == 'enrolCourse'){                  
            this.ajaxFlag = 'all';
            this.$.addCourseDialog.close();
        }else if(ajaxEleId == 'recCourse'){            
            this.courseList = event.detail.response;
            this.ajaxFlag ='all';
        }*/
        this.loadingCourse =false;
        
    }
    _addCourse(){
        if(this.$.addCourseForm.validate()){ 
            if(this.topicValues.length > 0){                
                this.$.addCourseForm.submit();
            }else{
                this.invalidField = true;
            }           
        }
    }
    _resetAddCourseForm(){
        this.$.addCourseForm.reset();
    }
    _openTitleDialog(event){
        this.$.courseTitleDialog.positionTarget = event.target;
        let topicArr = event.model.__data.item.topic;
        this.courseTopics = topicArr;
        this.$.courseTitleDialog.open();
    }
    _enrollCourse(event){        
        this.ajaxFlag = 'enrollCourse';
        let courseId = event.model.__data.item.courseId;
        let courseName = event.model.__data.item.courseId;
        let userName = JSON.parse(localStorage.userData).userName;
        let ajaxData = {"courseId":courseId,"courseName":courseName, "emailId":userName};
        this._generateAjaxCall('http://localhost:3000/course/rest/enroleUser','POST',ajaxData);        
   }
   _addTopics(event){
       this.invalidField = (this.topicInput == '')?true:false;
       if(this.invalidField == false){           
        this.push('topicValues',{"topicName": this.topicInput});
       }
       
   }
   updateItemsFromPage(page) {
       const grid = this.$.courseGrid;
            const pagesControl = this.$.pages;
              if (page === undefined) {
                return;
              }
              if (!this.pages) {
                this.pages = Array.apply(null, {length: Math.ceil(this.courseList.length / grid.pageSize)}).map(function(item, index) {
                  return index + 1;
                });
                const prevBtn = window.document.createElement('button');
                prevBtn.textContent = '<';
                prevBtn.addEventListener('click', function() {
                  const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
                  this.updateItemsFromPage(selectedPage - 1);
                }.bind(this));
                pagesControl.appendChild(prevBtn);
                
                var self = this;
                this.pages.forEach(function(pageNumber) {
                  const pageBtn = window.document.createElement('button');
                  pageBtn.textContent = pageNumber;
                  pageBtn.addEventListener('click', function(e) {
                    self.updateItemsFromPage(parseInt(e.target.textContent));
                  }.bind(self));
                  if (pageNumber === page) {
                    pageBtn.setAttribute('selected', true);
                  }
                  pagesControl.appendChild(pageBtn);
                });
                const nextBtn = window.document.createElement('button');
                nextBtn.textContent = '>';
                nextBtn.addEventListener('click', function(e) {
                  const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
                  this.updateItemsFromPage(selectedPage + 1);
                }.bind(this));
                pagesControl.appendChild(nextBtn);
              }
              const buttons = Array.from(pagesControl.children);
              var self = this;
              buttons.forEach(function(btn, index) {
                if (parseInt(btn.textContent) === page) {
                  btn.setAttribute('selected', true);
                } else {
                  btn.removeAttribute('selected');
                }
                if (index === 0) {
                  if (page === 1) {
                    btn.setAttribute('disabled', '');
                  } else {
                    btn.removeAttribute('disabled');
                  }
                }
                if (index === buttons.length - 1) {
                  if (page ===  self.pages.length) {
                    btn.setAttribute('disabled', '');
                  } else {
                    btn.removeAttribute('disabled');
                  }
                }
              });
              var start = (page - 1) * grid.pageSize;
              var end = page * grid.pageSize;
              grid.items = this.courseList.slice(start, end);
            }
}

customElements.define('course-dashboard',CourseDashboard);