<template>
<div id="app">
  <notifications position="top center"/>
  <div class="heading">
    <h4>If this is your first checkout upload you will need to confirm your Email address with AWS before receiving orders</h4>
    <div v-show="logged === true">{{ output }}</div>
  </div>
  <button v-show="logged === true" @click="sendForm" style="position:absolute; top:0; left:0;">Upload Form</button>
  <GoogleLogin v-show="logged !== true" :params="gparams" :renderParams="grenderParams" :onSuccess="onSuccess" :onCurrentUser="onCurrentUser"></GoogleLogin>
  <GoogleLogin v-show="logged === true" :params="gparams" :onSuccess="signOut" :logoutButton=true style="position:absolute; top:0; right:0;" >Sign Out</GoogleLogin>
  <div v-show="logged === true" id="generatecheckout">
    <div style="width: 30%; float: left;">
      <h3>Transaction Values</h3>
      <label for="productname">Product Name:</label>
      <input type="text" v-model="productname" id="productname" name="productname" class="corevalues" Placeholder="My Product"><br>
      <label for="productid">Product ID:</label>
      <input type="text" v-model="productid" id="productid" name="productid" class="corevalues" Placeholder="173648092"><br>
      <label for="price">Price:</label>
      <input type="text" v-model="price" id="price" name="price" class="corevalues" Placeholder="10.74"><br>
      <label for="destination">Destination:</label>
      <input type="text" v-model="destination" id="destination" name="destination" class="corevalues" Placeholder="nano_xxxxxx"><br>
      <label for="net" >Network:</label>
      <select name="net" id="net" class="corevalues" v-model="net">
        <option>live</option>
        <option>lsio</option>
      </select>
      <h3>Available</h3>
      <draggable :list="available" group="formelements">
        <div v-for="(element) in available" :key="element.name" >
          {{ element.name }}
        </div>
      </draggable>
      <h3>Custom Elements <button @click="addCustom">Add Custom</button><button @click="resetCustom">Reset</button></h3>
      <label for="customname">Name:</label>
      <input type="text" v-model="customname" id="customname" name="customname"><br>
      <label for="customformlabel">Form Label:</label>
      <input type="text" v-model="customformlabel" id="customformlabel" name="customformlabel"><br>
      <label for="customplaceholder">Placeholder:</label>
      <input type="text" v-model="customplaceholder" id="customplaceholder" name="customplaceholder"><br>
      <label for="customrequired"> Required</label>
      <input type="checkbox" v-model="customrequired" id="customrequired" name="customrequired"><br>
      <draggable :list="custom" group="formelements">
        <div v-for="(element) in custom" :key="element.name">
          {{ element.items }}
        </div>
      </draggable>
    </div>
    <div style="width: 70%; float: right;">
      <h3>Form</h3>
      <h4>This will send {{ price }} Nano to {{ destination }} for {{ productname }} ,please save your receipt from this order it will help you verify your order if something goes wrong</h4>
      <draggable :list="form" group="formelements">
        <div v-for="(element) in form" :key="element.name">
          <div v-if="element.name === 'email'">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" class="checkout" Placeholder="user@email.com">
          </div>
          <div v-if="element.name === 'name'">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" class="checkout" Placeholder="First and Last Name">
          </div>
          <div v-if="element.name === 'address'">
            <label for="address1">Address:</label>
            <input type="text" id="address1" name="address1" class="checkout" placeholder="Street Address">
            <label for="address2">Address 2:</label>
            <input type="text" id="address2" name="address2" class="checkout" placeholder="Apt or Box #">
            <label for="country">Country:</label>
            <country-select v-model="country" id="country" name="country" :country="country" topCountry="US" class="checkout"/>
            <label for="region">Region:</label>
            <region-select v-model="region" id="region" name="region" :country="country" :region="region" class="checkout"/>
            <label for="city">City:</label>
            <input type="text" id="city" name="city" class="checkout" placeholder="Local City">
            <label for="zip">Postal Code:</label>
            <input type="text" id="zip" name="zip" class="checkout" placeholder="Local Postal Code">
          </div>
          <div v-if="element.name === 'custom'">
            <div v-for="(item) in element.items" :key="item.customname">
              <label :for="item.customname">{{ item.customformlabel }}:</label>
              <input type="text" :id="item.customname" :name="item.customname" class="customcheckout" :placeholder="item.customplaceholder" :required="item.customrequired"><br>
            </div>
          </div>
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
import YAML from 'yaml'

export default {
  name: 'App',
  data() {
    return {
      apiurl: 'https://api.nanocheckout.com/yaml',
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
      ],
      custom: [
        { name: "custom", items: [] }
      ],
      customname: '',
      customformlabel: '',
      customplaceholder: '',
      customrequired: false,
      country: '',
      region: '',
      productname: '',
      destination: '',
      price: '',
      net: 'live',
      productid: '',
      output: ''
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
    addCustom() {
      this.custom[0].items.push({
        customname: this.customname,
        customformlabel: this.customformlabel,
        customplaceholder: this.customplaceholder,
        customrequired: this.customrequired
      })
      this.customname = ''
      this.customformlabel = ''
      this.customplaceholder = ''
      this.customrequired = false
    },
    resetCustom() {
      this.custom[0].items = []
      this.customname = ''
      this.customformlabel = ''
      this.customplaceholder = ''
      this.customrequired = false
    },
    async sendForm () {
      let formobj = {}
      formobj['product'] = this.productname
      formobj['productid'] = this.productid
      formobj['price'] = this.price
      formobj['destination'] = this.destination
      formobj['net'] = this.net
      formobj['inputs'] = []
      let custom = []
      for (let input of this.form) {
        if (input.name == 'email') {
          formobj.inputs.push({type:"email",placeholder:"user@email.com",required:true})
        }
        if (input.name == 'name') {
          formobj.inputs.push({type:"name",placeholder:"First and Last Name",required:true})
        }
        if (input.name == 'address') {
          formobj.inputs.push({type:"address",required:true})
        }
        if (input.name == 'custom' && input.items.length > 0) {
          for (let custominput of input.items) {
            let customform = {}
            customform['name'] = custominput.customname
            customform['label'] = custominput.customformlabel
            customform['placeholder'] = custominput.customplaceholder
            customform['required'] = custominput.customrequired
            custom.push(customform)
          }
        }
      }
      if (custom.length > 0) {
        formobj.inputs.push({custom: custom})
      }
      const formyaml = YAML.stringify(formobj)
      console.log(formyaml)
      let Init = { method:'POST',body: formyaml}
      let url = this.apiurl + '?type=upload&token=' + this.googletoken
      const res = await fetch(url,Init)
      const data = await res.json()
      this.output = 'upload: ' + JSON.stringify(data)
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
