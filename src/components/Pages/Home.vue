<template>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container >     
           <v-list >
             <v-layout row wrap header >
              <h1>Welcome To Vision Gallery</h1>               
             <v-flex v-if="role == 'admin'">
             </v-flex>
            </v-layout>              
          </v-list>                 
        </v-container>
  <app-footer></app-footer>
</v-layout>
</v-content>
</template>
<script>
import Axios from 'axios'
import moment from 'moment'
import Authentication from '@/components/pages/Authentication'
import APIurlConfig from '../../apiConfig'
const apiURL =  APIurlConfig.API_URL // 'http://localhost:3001'
export default {
  data () {
    return {
      validated : 1,
      loginPage : false,      
      role: this.$cookie.get('role')
    }
  }, 
  mounted () {
  },
  methods: {
   
  }
}
</script>