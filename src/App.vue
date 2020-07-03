<template>
<div id="app">
  <notifications position="top center"/>
  <div class="heading">
    <h4>If this is your first checkout upload you will need to confirm your Email address with AWS before receiving orders</h4>
  </div>
  <GoogleLogin v-show="logged !== true" :params="gparams" :renderParams="grenderParams" :onSuccess="onSuccess" :onCurrentUser="onCurrentUser"></GoogleLogin>
  <GoogleLogin v-show="logged === true" :params="gparams" :onSuccess="signOut" :logoutButton=true style="position:absolute; top:0; right:0;" >Sign Out</GoogleLogin>
  <div v-show="logged === true" id="generatecheckout">
    <div style="width: 30%; float: left;">
      <h3>Available Elements</h3>
      <draggable class="list-group" group="people" :list="available" @change="log"><button @click="addCustom">Add Custom</button>
        <div class="list-group-item" v-for="(element) in available" :key="element.name">
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <div style="width: 70%; float: right;">
      <h3>Form</h3>
      <draggable class="list-group" group="people" :list="form" @change="log">
        <div class="list-group-item" v-for="(element) in form" :key="element.name">
          {{ element.name }}
        </div>
      </draggable>
    </div>
  </div>
</div>
</template>

<script>
//import * as NanoCurrency from 'nanocurrency'
import GoogleLogin from 'vue-google-login'
import draggable from 'vuedraggable'

export default {
  name: 'App',
  data() {
    return {
      gparams: {
        client_id: "143179047265-2v5n2i9uvrscl6f7jtcbmdef9n1pcpb9.apps.googleusercontent.com"
      },
      grenderParams: {
        width: 250,
        height: 50,
        longtitle: true
      },
      loading: false,
      logged: false,
      googletoken: '',
      available: [
        { name: "email" },
        { name: "name" },
        { name: "address" }
      ],
      form: [
      ]
    }
  },
  components: {
    GoogleLogin,
    draggable
  },
  methods: {
    onSuccess(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      this.logged = true
      this.googletoken = token
      console.log(token)
    },
    onCurrentUser(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      this.logged = true
      this.googletoken = token
      console.log(token)
    },
    signOut() {
      console.log('User signed out.')
      this.logged = false
      this.googletoken = ''
    },
    log: function(evt) {
      window.console.log(evt);
    },
    addCustom() {
      this.available.push({ name: "custom" })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;700&display=swap');
// Body
$body-bg1: #4d5879;
$body-bg2: #26314e;
// Typography
$font-family-sans-serif: "Nunito", sans-serif;
$font-size-base: 16px;
$line-height-base: 1.6;
// Colors
$active: #0075c2;
$text: #a7b0ca;
$lighter-text: #959da0;
$highlight: #59c7f1;
$highlightsemi: #59c7f1bb;
$highlight2: #af73d2;
$highlight3: #e2ac39;
html, body {
    background: linear-gradient(to bottom, $body-bg1, $body-bg2);
    color: $text;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: $font-size-base;
    height: 100%;
    margin: 0;
}
.highlight {
    color: $highlight;
}
.container {
  padding: 10px 10px 10px 10px;
  max-width: 800px;
}
.heading {
  text-align: center;
}
@keyframes spinner {
  to { transform: rotate(360deg); }
}
.fa-spinner {
  animation: spinner 1s linear infinite;
}
</style>
