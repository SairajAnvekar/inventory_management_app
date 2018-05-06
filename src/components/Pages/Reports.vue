<template>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container >  
          <v-toolbar class="elevation-0 transparent" height=30 floating dense flat >
             <v-toolbar-items  >
                    <v-btn-toggle  mandatory  v-model="toggleStart" >
                        <v-btn flat class="" onclick="" @click.native="handleNavigationMenu(1)">Customer Reports</v-btn>
                        <v-btn flat  @click.native="handleNavigationMenu(2)" class="">Purchase Reports</v-btn>
                        <v-btn flat  @click.native="handleNavigationMenu(3)">Sales Reports</v-btn>
                        <v-btn flat  @click.native="handleNavigationMenu(4)">All Reports</v-btn>
                    </v-btn-toggle>
                </v-toolbar-items>
            </v-toolbar>
               
           <!-- <v-list > -->
             <v-layout row wrap header v-if="isCustomerView" >
                  <v-spacer></v-spacer>
               <v-btn color="info" class="" onclick="" @click.native="exportCustomer">Export</v-btn>
             <v-flex xs12 >       
            <v-data-table
            :headers="headersCustomer"
            :items="customerData"           
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
          <!-- </v-list>                  -->
          <v-layout row wrap header v-if="isPurchaseView" >
            <v-spacer></v-spacer>
            <v-btn color="info" class="" onclick="" @click.native="exportPurchase">Export</v-btn>
            <v-flex xs12 >       
              <v-data-table
              :headers="headersPurchase"
              :items="purchaseData"           
              item-key="text"
              class="elevation-1 purchase_table">
              <template slot="items" slot-scope="props" >
                  <td>{{ props.item.date_of_order }}</td>
                  <td>{{ props.item.purchase_order_number }}</td>
                  <td>{{ props.item.supplierName }}</td>       
                  <td>{{ props.item.total_amount }}</td>     
                  <td>{{ props.item.balanceAmount }}</td>       
              </template>
              </v-data-table>  
            </v-flex>           
          </v-layout> 

          <v-layout row wrap header v-if="isSalesView" >
              <v-spacer></v-spacer>
              <v-btn color="info" class="" onclick="" @click.native="exportSales">Export</v-btn>
              <v-flex xs12 >       
                <v-data-table
                :headers="headersSales"
                :items="salesData"           
                item-key="text"
                class="elevation-1 sales_table">
                <template slot="items" slot-scope="props" >
                    <td>{{ props.item.date_of_sale }}</td>
                    <td>{{ props.item.invoice_number }}</td>
                    <td>{{ props.item.customerName }}</td>       
                    <td>{{ props.item.salesPersonName }}</td>       
                    <td>{{ props.item.netAmount }}</td>     
                    <td>{{ props.item.taxAmount }}</td>       
                    <td>{{ props.item.total_amount }}</td>       
                </template>
                </v-data-table>  
              </v-flex>           
            </v-layout> 

            <v-layout row wrap header v-if="isAllView" >
                <v-spacer></v-spacer>
                <v-btn color="info" class="" onclick="" @click.native="exportAll">Export</v-btn>
                <v-flex xs12 >       
                  <v-data-table
                  :headers="headersAll"
                  :items="allTransactionData"           
                  item-key="text"
                  class="elevation-1 all_table">
                  <template slot="items" slot-scope="props" >
                      <td>{{ props.item.date }}</td>
                      <td>{{ props.item.type }}</td>
                      <td>{{ props.item.dcNumber }}</td>
                      <td>{{ props.item.name }}</td>       
                      <td>{{ props.item.netAmount }}</td>     
                      <td>{{ props.item.taxAmount }}</td>       
                      <td>{{ props.item.total_amount }}</td>       
                      <td>{{ props.item.debit }}</td>       
                      <td>{{ props.item.credit }}</td>       
                  </template>
                  </v-data-table>  
                </v-flex>           
              </v-layout> 

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
      isCustomerView : true,
      isPurchaseView : false,
      isSalesView : false,
      toggleStart : 0,
      customerData:[],
      purchaseData : [],
      isAllView : false,
      allTransactionData : [],
      allTotalDebit : 0,
      allTotalCredit : 0,
      salesData : [],
      companyTaxList : [],
      headersCustomer :[
                { text: 'Name',align: 'left',value: 'name'},
                { text: 'Email',align: 'left',value: 'percentage'},
                {text : 'Phone',"value" : 'address'},
                {text : 'Address',"value" : 'actions'},
                {text : 'Pending Amount',"value" : 'actions'}
            ] ,     
          headersPurchase : [
                { text: 'Date',align: 'left',value: 'date'},
                {text : 'Dc No',value : 'dcNumber'},
                { text: 'Supplier',align: 'left',value: 'supplier'},
                {text : 'Debit',value : 'debit'},
                {text : 'Balance ',value : 'balace'}

          ],
          headersSales : [
                { text: 'Date',align: 'left',value: 'date'},
                {text : 'Dc No',value : 'dcNumber'},
                { text: 'Customer',align: 'left',value: 'customer'},
                { text: 'Sold By',align: 'left',value: 'soldBy'},
                {text : 'Net Amount',value : 'netAmount'},
                {text : 'Tax Amount',value : 'taxAmount'},
                {text : 'Total Amount ',value : 'totalAmount'}

          ],
          headersAll : [
                { text: 'Date',align: 'left',value: 'date'},
                {text : 'Type',value : 'type'},
                {text : 'Dc No',value : 'dcNumber'},
                { text: 'Particulars',align: 'left',value: 'particular'},
                {text : 'Net Amount',value : 'netAmount'},
                {text : 'Tax Amount',value : 'taxAmount'},
                {text : 'Total Amount ',value : 'totalAmount'},
                {text : 'Debit',value : 'debit'},
                {text : 'Credit',value : 'credit'}

          ],

    }
  }, 
  mounted () {
    this.getAllCustomers();
    this.getAllPurchaseOrders();
    this.getAllInvoices();
    this.getAllcompanyTaxList();
    this.getAllTransactions();
  
  },
  methods: {
    exportCustomer(){
      const table  = document.querySelector('.customer_table table tbody').innerHTML;      
      var exportToExcel = new ExportToExcel(table,this.headersCustomer);
      exportToExcel.generate(),
      exportToExcel.download()  
    },
    exportPurchase(){
      const table  = document.querySelector('.purchase_table table tbody').innerHTML;      
      var exportToExcel = new ExportToExcel(table,this.headersPurchase);
      exportToExcel.generate(),
      exportToExcel.download();
    },
    exportSales(){
      const table  = document.querySelector('.sales_table table tbody').innerHTML;      
      var exportToExcel = new ExportToExcel(table,this.headersSales);
      exportToExcel.generate(),
      exportToExcel.download();
    },
    exportAll(){
      const table  = document.querySelector('.all_table table tbody').innerHTML;      
      var exportToExcel = new ExportToExcel(table,this.headersAll);
      exportToExcel.generate(),
      exportToExcel.download();
    },
    getAllCustomers (context) {
      Axios.get(`${apiURL}/api/v1/customer/`, {
      headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
      }
      }).then(({data}) => ( this.customerData= data))
    },
    getAllPurchaseOrders(){
                Axios.get(`${apiURL}/api/v1/purchaseOrder/Supplier`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handlePurchaseOrderGet(data)))
    },
    getAllInvoices(){
        Axios.get(`${apiURL}/api/v1/invoice/all`, {
        headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
        }
        }).then(({data}) => (this.handleInvoiceResponse(data)))
    },
    getAllTransactions(){
      var self = this;
      Axios.get(`${apiURL}/api/v1/purchaseOrder/Supplier`, {
      headers: {
        'Authorization': Authentication.getAuthenticationHeader(this)
      }
      }).then(function(purData){
          Axios.get(`${apiURL}/api/v1/invoice/all`, {
          headers: {
              'Authorization': Authentication.getAuthenticationHeader(self)
          }
          }).then(function(invoiceData){
            self.handleAllTransaction(purData.data,invoiceData.data);
          })
      })

    },
    handleAllTransaction(purData,invoiceData){
        var self = this;
        var totalCredit = 0;
        self.allTransactionData = [];
        invoiceData.forEach(function(sObj){
          var myObj = {};
          myObj.date = new Date(sObj.date_of_sale).toLocaleDateString()
          var taxPercent = 0;
          myObj.name = sObj.customerName
          myObj.dcNumber = sObj.invoice_number
          myObj.type = "Sale";
          myObj.total_amount = sObj.total_amount;
          if(sObj.is_gst){
            self.companyTaxList.forEach(function(taxObj){
              if(sObj.taxList.indexOf(taxObj._id) > -1){
                taxPercent += taxObj.value;
              }
            })
            myObj.taxAmount = ((sObj.total_amount * taxPercent)/100);
            myObj.netAmount = sObj.total_amount - myObj.taxAmount;
          }else{
            myObj.taxAmount = 0;
            myObj.netAmount = sObj.total_amount;
          }
          self.allTransactionData.push(myObj);
        })

          purData.forEach(function(pObj){
            var myObj = {};
            myObj.date = new Date(pObj.date_of_order).toLocaleDateString()
            var taxPercent = 0;
            if(!pObj.supplierName){
              myObj.name = "N/A"
            }
            myObj.name = pObj.supplierName
            myObj.dcNumber = pObj.purchase_order_number
            myObj.type = "Receipt";
            myObj.taxAmount = 0;
            myObj.netAmount = pObj.total_amount;
            myObj.total_amount = 0;
            self.allTransactionData.push(myObj);
          });
        self.allTransactionData.sort(function(a, b){
            var x = Date.parse(new Date(a.date));
            var y = Date.parse(new Date(b.date));
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        })
        var totalAmount = 0;
        self.allTransactionData.forEach(function(mOBj){
          totalAmount += mOBj.total_amount;
          mOBj.debit = totalAmount;
          if(mOBj.type == "Receipt"){
            totalCredit += mOBj.netAmount;
            mOBj.credit = totalCredit;
          }
        })
        self.allTotalDebit = totalAmount;
        self.allTotalCredit = totalCredit;
    },
    getAllcompanyTaxList (context) {
        Axios.get(`${apiURL}/api/v1/companyTax/`, {
        headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
        }
        }).then(({data}) => (
          this.companyTaxList = data
        ))
    },
    handleInvoiceResponse(data){
        var self = this;
        data.forEach(function(sObj){
          sObj.date_of_sale = new Date(sObj.date_of_sale).toLocaleDateString()
          var taxPercent = 0;
          if(sObj.is_gst){
            self.companyTaxList.forEach(function(taxObj){
              if(sObj.taxList.indexOf(taxObj._id) > -1){
                taxPercent += taxObj.value;
              }
            })
            sObj.taxAmount = ((sObj.total_amount * taxPercent)/100);
            sObj.netAmount = sObj.total_amount - sObj.taxAmount;
          }else{
            sObj.taxAmount = 0;
            sObj.netAmount = sObj.total_amount;
          }
        })
        this.salesData = data;
      },
    handlePurchaseOrderGet(data){
      var totalAmountPurchase = 0;
        data.forEach(function(obj){
          if(!obj.supplierName){
              obj.supplierName = "N/A"
          }

          totalAmountPurchase += obj.total_amount;
          obj.balanceAmount = totalAmountPurchase; 
          obj.date_of_order = new Date(obj.date_of_order).toLocaleDateString()
          obj.date_recieved = new Date(obj.date_recieved).toLocaleDateString()
        });
        this.purchaseData = data;
    },
    handleNavigationMenu(visibleFlag){
        this.isCustomerView = this.isPurchaseView = this.isSalesView = this.isAllView = false
        switch(visibleFlag){
            case 1: this.isCustomerView = true; break;
            case 2 : this.isPurchaseView = true; break;
            case 3 : this.isSalesView = true; break;
            case 4 : this.isAllView = true; break;
        }
    }
  }
}
</script>