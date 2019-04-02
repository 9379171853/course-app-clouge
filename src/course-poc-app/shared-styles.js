/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const styleElement = document.createElement('dom-module');
styleElement.innerHTML = 
 `<template>
   <style>
   body{
     font-family:'Roboto', 'Noto', sans-serif;
   }
    .card {
        margin: 24px;
        padding: 16px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
     .logo{
        color:#0075b2;
        font-size:24px;
        margin: 16px 0;
        font-family:'Roboto', 'Noto', sans-serif;
      }
      paper-button{
        background-color:#1e88e5;
        color:#ffffff;
        font-size:16px;
        font-weight:bold;
        text-align:right;
        margin:10px 0;
        font-family:'Roboto', 'Noto', sans-serif;
        text-transform:uppercase;
      }
      paper-input, paper-textarea{
        padding:10px 0;
        font-family:'Roboto', 'Noto', sans-serif;
      }
   </style>
 </template>`;

styleElement.register('shared-styles');