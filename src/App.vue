<template>
<div id="app">
  <modal :width=300 :height=480 :adaptive="true" :clickToClose="false" name="finished">
    <div class="modalcontent">
      <div class="heading">
        Form Uploaded
      </div>
      <vue-qrcode :width=260 :value="output" />
      <div class="formelements"><a :href="output" target="_blank">{{ output }}</a></div>
      <div class="pad"><button @click="closeoutput" class="close">Close</button></div>
    </div>
  </modal>
  <notifications position="top center"/>
  <div class="heading">
    <h4>If this is your first checkout upload you will need to confirm your Email address with AWS before receiving orders</h4>
  </div>
  <GoogleLogin v-show="logged !== true" :params="gparams" class="googlelogin" :renderParams="grenderParams" :onSuccess="onSuccess" :onCurrentUser="onCurrentUser"></GoogleLogin>
  <div v-show="logged !== true" class="pageinfo" >
    <p>Nano Checkout is a non custodial checkout system designed to securely send your customer&#39;s order information to you in a cryptographically verifiable manner. Instead of using &quot;middle men&quot; or custodial wallets outside of your control we leverage <a href="https://www.nanometadata.com/" target="_blank">https://www.nanometadata.com/</a> and act as a message broker with supported Nano wallets. The customer sends funds directly to your wallet, hashes and signs the order information data payload using private/pubkey verification, and sends the payload to us to verify and send to you.<br><br>You will receive orders as an email with all the order information along with links to the verifiable metadata and Nano transaction information. Gmail is specifically used for this service due to their secure oauth system and incredibly powerful <a href="https://developers.google.com/gmail/api" target="_blank">API</a> allowing orders to be programatically ingested if needed. (examples <a href="https://github.com/linuxserver/docker-gmail-order-bot" target="_blank">here</a> )<br><br>To get started simply login with Gmail above and build your first order form, the resulting QR code and form URL can be used in the following Nano wallets:<br><ul><li>LSIO Nano Wallet - <a href="https://wallet.linuxserver.io" target="_blank">https://wallet.linuxserver.io</a></li></ul>This form&#39;s URL and QR code can be embedded in static sites and shared in any manner you see fit. Your customer sends you Nano and you get an email with the information you requested, it really is that simple.<br><br></p>
  </div>
  <GoogleLogin v-show="logged === true" :params="gparams" :onSuccess="signOut" :logoutButton=true class="signout" >Sign Out</GoogleLogin>
  <div v-show="logged === true" class="container" id="generatecheckout">
    <div class="required">
      <h3>Transaction Values (Required)</h3>
      <label for="productname">Product Name:</label>
      <input type="text" v-model="productname" id="productname" name="productname" class="corevalues" Placeholder="My Product">
      <label for="productid">Product ID:</label>
      <input type="text" v-model="productid" id="productid" name="productid" class="corevalues" Placeholder="173648092">
      <label for="price">Price:</label>
      <input type="text" v-model="price" id="price" name="price" class="corevalues" Placeholder="10.74">
      <label for="destination">Destination:</label>
      <input type="text" v-model="destination" id="destination" name="destination" class="corevalues" Placeholder="nano_xxxxxx">
      <label for="net" >Network:</label>
      <select name="net" id="net" class="corevalues" v-model="net">
        <option>live</option>
        <option>lsio</option>
      </select>
    </div>
    <hr />
    <div class="form-elements">
      <div class="items">
        <h3>Available Elements</h3>
        <p>Drag from "Available Elements" onto the "Form Preview". Min one custom or preset element.</p>
        <draggable :list="available" group="formelements" class="formelements">
          <div v-for="(element) in available" :key="element.name" >
            <div class="dragbox boxshadow">
              <div class="line">
              <i class="fas fa-grip-vertical"></i> {{ element.name }}
              </div>
            </div>
          </div>
        </draggable>
        <button class="customelement" @click="custom=true"><div class="icon"><i class="fas fa-plus"></i></div> Add custom element</button>
        <div v-show="custom===true" class="custom">
          <label for="customname">Name:</label>
          <input type="text" v-model="customname" id="customname" name="customname">
          <label for="customformlabel">Form Label:</label>
          <input type="text" v-model="customformlabel" id="customformlabel" name="customformlabel">
          <label for="customplaceholder">Placeholder:</label>
          <input type="text" v-model="customplaceholder" id="customplaceholder" name="customplaceholder">
          <label for="customrequired"> Required</label>
          <input type="checkbox" v-model="customrequired" id="customrequired" name="customrequired">
          <hr />
          <div class="buttonlist">
            <button @click="addCustom">Save</button><a href="#" @click.prevent="custom=false">Cancel</a>
          </div>
        </div>
      </div>
      <div class="form">
        <h3>Form Preview (What the client sees)</h3>
        <div class="preview">
        <h4>This will send {{ price }} Nano to {{ destination }} for {{ productname }} ,please save your receipt from this order it will help you verify your order if something goes wrong</h4>
        <draggable :list="form" group="formelements" style="min-height: 300px;">
          <div v-for="(element) in form" :key="element.name">
            <div v-if="element.name === 'email'" class="dragbox boxshadow">
              <label for="email">Email:</label>
              <input type="text" id="email" name="email" class="checkout" Placeholder="user@email.com">
            </div>
            <div v-else-if="element.name === 'name'" class="dragbox boxshadow">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" class="checkout" Placeholder="First and Last Name">
            </div>
            <div v-else-if="element.name === 'address'" class="dragbox boxshadow">
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
            <div v-else class="dragbox boxshadow">
              <label :for="element.name">{{ element.label }}:</label>
              <input type="text" :id="element.name" :name="element.name" class="checkout" :placeholder="element.placeholder" :required="element.required">
            </div>
          </div>
        </draggable>
        </div>
      </div>
    </div>
    <hr />
    <button v-show="logged === true" @click="sendForm" class="upload">Upload Form</button>
  </div>
</div>
</template>

<script>
import * as NanoCurrency from 'nanocurrency'
import GoogleLogin from 'vue-google-login'
import draggable from 'vuedraggable'
import YAML from 'yaml'
import VueQrcode from 'vue-qrcode'

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
      custom: false,
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
      output: null
    }
  },
  components: {
    GoogleLogin,
    draggable,
    VueQrcode
  },
  props: {
    formurl: String
  },
  methods: {
    onSuccess(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      this.logged = true
      this.googletoken = token
    },
    onCurrentUser(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      this.logged = true
      this.googletoken = token
    },
    signOut() {
      console.log('User signed out.')
      this.logged = false
      this.googletoken = ''
    },
    addCustom() {
      this.available.push({
        name: this.customname,
        label: this.customformlabel,
        placeholder: this.customplaceholder,
        required: this.customrequired
      })
      this.customname = ''
      this.customformlabel = ''
      this.customplaceholder = ''
      this.customrequired = false
      this.custom = false
    },
    async sendForm () {
      if (! this.productname || ! this.productid || ! this.price || ! NanoCurrency.checkAddress(this.destination) || this.form.length == 0) {
        this.$notify({
          title: 'Error',
          text: 'Input Required',
          type: 'error'
        })
        return false
      }
      let formobj = {}
      formobj['product'] = this.productname
      formobj['productid'] = this.productid
      if (this.price.startsWith('.')){
        formobj['price'] = '0' + this.price
      } else {
        formobj['price'] = this.price
      }
      formobj['destination'] = this.destination
      formobj['net'] = this.net
      formobj['inputs'] = []
      for (let input of this.form) {
        if (input.name == 'email') {
          formobj.inputs.push({type:"email",placeholder:"user@email.com",required:true})
        } else if (input.name == 'name') {
          formobj.inputs.push({type:"name",placeholder:"First and Last Name",required:true})
        } else if (input.name == 'address') {
          formobj.inputs.push({type:"address",required:true})
        } else {
          input['type'] = 'custom'
          formobj.inputs.push(input)
        }
      }
      const formyaml = YAML.stringify(formobj)
      console.log(formyaml)
      let Init = { method:'POST',body: formyaml}
      let url = this.apiurl + '?type=upload&token=' + this.googletoken
      const res = await fetch(url,Init)
      const data = await res.json()
      if (data.action === 'success') {
        this.output = 'https://www.nanocheckout.com/templates/' + data.message
        this.$modal.show('finished')
        return true
      } else {
        this.$notify({
          title: 'Error',
          text: data.message,
          type: 'error'
        })
        return false
      }
    },
    closeoutput() {
      this.$modal.hide('finished')
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;700&display=swap');
// Body
$body-bg1: #f3f3f3;
$body-bg2: #26314e;
// Typography
$font-family-sans-serif: "Nunito", sans-serif;
$font-size-base: 16px;
$line-height-base: 1.6;
// Colors
$active: #0075c2;
$text: #495c5f;
$lighter-text: #959da0;
$highlight: #59c7f1;
$highlightsemi: #59c7f1bb;
$highlight2: #af73d2;
$highlight3: #e2ac39;
html, body {
    background: $body-bg1;
    color: $text;
    font-family: 'Nunito', sans-serif;
    font-weight: 400;
    font-size: $font-size-base;
    height: 100%;
    margin: 0;
}
* {
  box-sizing: border-box;
}
.highlight {
    color: $highlight;
}
.preview {
  border: 1px solid #d4d4d4;
  padding: 10px 20px;
  box-shadow: 0 0 10px #7d7d7d1f;
  background: #fbfbfb;
  margin-top: 15px;
  word-break: break-word;
}
.form-elements {
  display: flex;
  @media all and (max-width: 800px) {
    flex-direction: column;
  }
  .items {
    flex: 0 0 240px;
    margin-right: 40px;
    @media all and (max-width: 800px) {
      margin-right: 0;
      margin-bottom: 40px;
    }
  }
  h3 {
    margin: 0px;
  }
  p {
    margin: 0 0 15px;
    font-size: 12px;
  }
}
.signout {
  position: absolute;
  right: 10px;
  top: 7px;
  background: darken($highlight, 20%);
  border: none;
  color: #95e2ff;
  padding: 5px 14px;
  cursor: pointer;
  @media all and (max-width: 1020px) {
    float: right;
    position: unset;
    padding: 10px 15px;
  }
}
.customelement {
  margin: 5px 0;
  background: #fbfbfb;
  border: 1px solid #c5c5c5;
  width: 100%;
  padding: 14px;
  padding-left: 70px;
  overflow: hidden;
  display: flex;
  position: relative;
  font-weight: 700;
  color: $text;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  .icon {
    background: #ffffff;
    padding: 14px 18px;
    position: absolute;
    top: 0;
    left: 0;
    border-right: 1px solid #c5c5c5;
  }
}

.custom {
  background: #fbfbfb;
  border: 1px solid #ccc;
  padding: 20px;
  input[type="text"] {
    width: 100%;
  }
}
.buttonlist {
  display: flex;
  align-items: center;
  button {
    flex: 1;
    padding: 10px;
  }
  a {
    flex: 1;
    text-align: center;
    text-decoration: none;
    color: $text;
  }
}

hr {
  height: 0;
  border-style: none;
  border-top:1px solid #fff;
  margin: 40px 5px;
  position: relative;
  overflow: visible;
  &:after {
    content: "";
    border-bottom: 1px solid #dedede;
    position: absolute;
    top:-2px;
    width: 100%;
    left: 0;
  }
}
.upload {
  padding: 20px;
  width: 100%;
  background: #35444a;
  color: white;
  border-radius: 6px;
  font-size: 18px;
  text-transform: uppercase;
  border: none;
  margin-bottom: 40px;
}
.close {
  width: 50%;
  padding: 10px;
  background: #35444a;
  color: white;
  border-radius: 6px;
  font-size: 18px;
  border: none;
}
input[type=text], select {
  display: inline-block;
  padding: 10px 13px;
  border: 1px solid #ccc;
  width: calc(100% - 150px);
  &::placeholder {
    color: #1c1c1c;
  }
}
.required {
  input[type=text], select {
    width: calc(100% - 150px);
  }
}
.container {
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
}
.heading {
  text-align: center;
  background: $highlight;
  padding: 10px;
  color: white;
  h4 {
    margin: 0;
    font-weight: 400;
    text-shadow: 0 0 5px #14455859;
  }
}
@keyframes spinner {
  to { transform: rotate(360deg); }
}
.fa-spinner {
  animation: spinner 1s linear infinite;
}
.googlelogin {
  display: flex;
  padding-top: 20px;
  justify-content: center;
  align-items: center;
}
.pageinfo {
  margin: auto;
  padding: 20px;
  max-width: 800px;
}
.boxshadow 
{
  padding: 10px 15px 10px 21px;
}
.dragbox
{  
  margin: 0 0 10px;
  border: 1px solid #c5c5c5;
  display: flex;
  cursor: grab;
  font-weight: 700;
  position: relative;
  flex-direction: column;
  .line {
    display: flex;
    align-items: center;
  }
  label {
    padding-top: 0;
    padding-bottom: 8px;
    font-size: 14px;
    padding-left: 2px;
  }
  input[type=text], select {
    width: 100%;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 5px;
    }
  }
  &:before {
    position: absolute;
    content: "";
    top:0;
    left:0;
    bottom: 0;
    width: 6px;
    background: $highlight;
  }
  svg {
    margin-right: 20px;
  }
}
label {
  padding: 12px 0;
  display: inline-block;
  width:150px;
  text-align: left;
}
.formelements {
  min-height: 100px;
  border: 1px solid #d4d4d4;
  padding: 12px 5px 0px;
  box-shadow: 0 0 10px #7d7d7d1f;
  background: #fbfbfb;
}
.modalcontent {
  align-items: center;
  text-align: center;
}
.pad {
  padding: 10px;
}
</style>
