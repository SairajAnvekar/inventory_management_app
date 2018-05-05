<template>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container >  

             <v-toolbar-items  >
                    <v-btn-toggle  mandatory  >
                        <v-btn flat class="" onclick="" @click.native="">Customer Reports</v-btn>
                        <v-btn flat  @click.native="" class="">View Invoices</v-btn>
                        <v-btn flat  @click.native="">Customer Invoices</v-btn>
                    </v-btn-toggle>
                </v-toolbar-items>
            </v-toolbar>
               
           <v-list >
             <v-layout row wrap header >
                  <v-spacer></v-spacer>
               <v-btn color="info" class="" onclick="" @click.native="exportCustomer">Export</v-btn>
             <v-flex xs12 >       
            <v-data-table
            :headers="headersCustomer"
            :items="constomerData"           
            item-key="text"
            class="elevation-1 customer_table">
                <template slot="items" slot-scope="props" >
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.telephone_number }}</td>       
                    <td>{{ props.item.address }}</td>       
                    <td>{{ props.item.pending_amount }}</td>     
                </template>
            </v-data-table>  
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
import ExportToExcel from '../../libary/exportToExcel'
import APIurlConfig from '../../apiConfig'
const apiURL =  APIurlConfig.API_URL // 'http://localhost:3001'
export default {
  data () {
    return {
      validated : 1,
      loginPage : false, 
      constomerData:[],
        headersCustomer :[
                { text: 'Name',align: 'left',value: 'name'},
                { text: 'Email',align: 'left',value: 'percentage'},
                {text : 'Phone',"value" : 'address'},
                {text : 'Address',"value" : 'actions'},
                {text : 'Pending Amount',"value" : 'actions'}
            ] ,     
    }
  }, 
  mounted () {
    this.getAllCustomers();
  
  },
  methods: {
    exportCustomer(){
      const table  = document.querySelector('.customer_table table tbody').innerHTML;      
      var exportToExcel = new ExportToExcel(table,this.headersCustomer);
      exportToExcel.generate(),
      exportToExcel.download()  
    },
    getAllCustomers (context) {
      Axios.get(`${apiURL}/api/v1/customer/`, {
      headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
      }
      }).then(({data}) => ( this.constomerData= data))
    },   
  }
}
</script>