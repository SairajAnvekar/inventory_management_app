<template>
        <v-content>
         <v-layout>
            <app-header></app-header>
            <v-container>
            <v-toolbar  class="elevation-0 transparent" floating dense >
                    <v-menu offset-y>
                            <v-btn color="primary" dark slot="activator">Actions</v-btn>
                            <v-list>
                              <v-list-tile @click.native="handleNavigationMenu(1)">
                                <v-list-tile-title>Create Invoice</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(2)">
                                    <v-list-tile-title>View Invoices</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(3)">
                                <v-list-tile-title>Customer Invoices</v-list-tile-title>
                          </v-list-tile>
                            </v-list>
                    </v-menu>
            </v-toolbar>
            
            <v-container v-if="isInvoiceView">
                    <v-subheader class="text-xs-center headline mb-0">View Invoices </v-subheader>
                    <v-spacer></v-spacer>
                <v-layout row wrap >
                <v-flex d-flex xs12 sm12 md12> 
                    <v-card>
                    <v-data-table
                    :headers="headers"
                    :items="invoiceList"
                    :pagination.sync="pagination"
                    item-key="name"
                    class="elevation-2">
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.invoice_number }}</td>
                    <td class="text-xs-left">{{ props.item.salesPerson }}</td>
                    <td class="text-xs-left">{{ props.item.customerName}}</td>
                    <td class="text-xs-left">{{ props.item.date_of_sale }}</td>
                    <td class="text-xs-left">{{ props.item.total_amount }}</td>
                    <td class="text-xs-left">{{ props.item.status }}</td>
                    <td class="">
                        <!-- <v-btn icon class="mx-0" @click="deleteInvoice(props.item._id)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn> -->
                        <v-btn v-if="props.item.isPending" icon class="mx-0" @click="updatePendingInvoice(props.item._id)">
                            <v-icon color="pink">update</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="viewInvoice(props.item)">
                                <v-icon color="pink">info</v-icon>
                            </v-btn>
                    </td>
                    </template>
                    </v-data-table>
                    </v-card>    
                </v-flex>
                </v-layout>

                <v-dialog v-model="viewDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
                <v-card>
                    <v-toolbar card dark color="primary">
                    <v-btn icon @click.native="viewDialog = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>View Invoice</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="print()">Print</v-btn>
                        <v-btn dark flat>Download</v-btn>
                    </v-toolbar-items>
                    </v-toolbar>
                    <div class="print-area">
                    <table class="profile-header" style="width:100%">
                        <tr>
                        <td class="logo" rowspan='4'>                            
                            <img class="logo" src="@/assets/image/VSlogo.png">
                        </td>
                        <td colspan="4">
                            <h1 class="text-align-center">{{profile.display_name}}</h1>
                        </td>
                        <td rowspan='2'></td>
                        </tr>
                        <tr>
                        <td class="address text-align-center">
                            <div>{{profile.address}}</div>
                        </td>
                        </tr>
                        <tr>
                        <td class="text-align-center"> GSTIN : {{profile.gstin}} </td>
                        <td class="text-align-center"> Phone: {{profile.phone}}</td>
                        </tr>
                        <tr>
                        <td class="text-align-center"> TIN: {{profile.tin}} </td>
                        </tr>
                    </table>

                    <table class="branch-profile-header" style="width:100%">

                        <tr>
                        <td>Name : {{customerDetails.text}}</td>
                        <td>DC No: {{invoice.invoiceNumber}}</td>
                        </tr>

                        <tr>
                        <td class="address">Address : {{customerDetails.address}}</td>
                        <td>DC Date: {{invoiceDetails.date_of_sale}}</td>
                        </tr>
                        <tr>
                        <td>GSTIN : {{customerDetails.gstin}}</td>
                        <td>C.Ord No:</td>
                        </tr>
                    </table>



                    <v-data-table :headers="viewInvoiceHeaders" :items="viewInvoiceItems" hide-actions class="elevation-1 condensed-data-table">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.index + 1 }}</td>
                        <td>{{productMap[props.item.productId].name }}</td>
                        <td>{{props.item.batchNumber }}</td>
                        <td>{{ props.item.quantity }}</td>
                        <td v-for="(item,i) in subCategories" class="" >
                                {{props.item[item]}}
                        </td>
                        <td>{{ props.item.sellingPrice }}</td>
                        <td>{{ props.item.amount }}</td>
                        </template>
                    </v-data-table>
                    
                    <v-flex class="margin-top-2percent" xs4 offset-xs9>
                        <table>
                                <tr><td>Net Amount :</td><td> {{invoiceDetails.netAmount}}</td></tr>
                                <tr v-for="(item,i) in invoiceDetails.taxListView"><td>{{item.name}}</td><td>{{item.value}}</td></tr>
                                <tr v-if="invoiceDetails.isPending"><td>Paid Amount :<td>{{invoiceDetails.amountPaid}}</td></tr>
                                <tr v-if="invoiceDetails.isPending"><td>Pending Amount : </td><td> {{invoiceDetails.total_amount - invoiceDetails.amountPaid}}</td></tr>
                                <tr><td> Grand Total :</td><td>{{invoiceDetails.total_amount}}</td></tr>
                        </table>
                            
                    </v-flex>
                    <!-- <v-flex xs2 v-for="(item,i) in invoiceDetails.taxListView" offset-xs9> {{item}}</v-flex> 
                    <v-flex xs2  offset-xs9 v-if="invoiceDetails.isPending">Paid Amount :  {{invoiceDetails.amountPaid}}</v-flex> 
                    <v-flex xs2  offset-xs9 v-if="invoiceDetails.isPending">Pending Amount :  {{invoiceDetails.total_amount - invoiceDetails.amountPaid}}</v-flex> 
                    <v-flex xs2 offset-xs9>
                      Grand Total : {{invoiceDetails.total_amount}}
                    </v-flex> -->
                    </div>
                </v-card>

                </v-dialog>

            </v-container> 

            <v-container v-if="isCustomerInvoiceView">
                    <v-subheader class="text-xs-center headline mb-0">Customer Invoices </v-subheader>
                    <v-spacer></v-spacer>
                    <v-layout row justify-space-around > 
                        <v-flex xs2 offset-xs0>
                            <v-select
                            label="Customers"
                            :items="customers"
                            @input="activeCustomerSearch()"
                            v-model="searchCustomer"
                            item-value="_id"
                            single-line></v-select>      
                        </v-flex>
                        <v-flex xs2 offset-xs1>
                        <v-select 
                            label="Status"
                            :items="invoiceStatus"
                            @input="activeCustomerStatus()"
                            v-model="searchInvoiceStatus"
                            item-value="value"
                            single-line></v-select> 
                        </v-flex>  
                        <v-flex xs2 offset-xs1 >  
                                Pending Amount : {{searchCustomerPendingAmount}}
                        </v-flex>    
                        <v-flex xs2 offset-xs>
                            <v-btn v-if="isCustomerSelected"  class="mx-0" @click="updatePendingInvoiceBulk()">
                                Bulk Update
                            </v-btn>     
                         </v-flex>
                        
                    </v-layout>
                <v-layout row wrap >
                <v-flex d-flex xs12 sm12 md12> 
                    <v-card>
                    <v-data-table
                    :headers="headers"
                    :items="invoiceListCustomer"
                    :pagination.sync="pagination"
                    item-key="name"
                    class="elevation-2">
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.invoice_number }}</td>
                    <td class="text-xs-left">{{ props.item.salesPerson }}</td>
                    <td class="text-xs-left">{{ props.item.customerName}}</td>
                    <td class="text-xs-left">{{ props.item.date_of_sale }}</td>
                    <td class="text-xs-left">{{ props.item.total_amount }}</td>
                    <td class="text-xs-left">{{ props.item.status }}</td>
                    <td class="">
                        <!-- <v-btn icon class="mx-0" @click="deleteInvoice(props.item._id)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn> -->
                        <v-btn v-if="props.item.isPending" icon class="mx-0" @click="updatePendingInvoice(props.item._id)">
                            <v-icon color="pink">update</v-icon>
                        </v-btn>
                    </td>
                    </template>
                    </v-data-table>
                    </v-card>    
                </v-flex>
                </v-layout>
                </v-container>

            <v-container  fluid  v-if="isInvoiceCreate">
                    <v-subheader class="text-xs-center headline mb-0">Create Invoice </v-subheader>
                    <v-spacer></v-spacer>
                    <v-layout row wrap v-if="">
                        <v-flex d-flex xs8 sm12 md10 lg12>    
                                <v-form ref="form"> 
                                <v-layout row> 
                                    <v-flex xs2 >
                                        <v-text-field
                                        label="Invoice Number"
                                        v-model="invoice.invoiceNumber"
                                        readonly
                                        single-line></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row> 
                                <v-flex xs3>        
                                        <v-select
                                        v-model="selectedTaxList"
                                        label="Select Tax"
                                        chips
                                        @input="activeSelectTaxTag()"
                                        tags
                                        :items="companySelectList"
                                        >
                                        <template slot="selection" slot-scope="data">
                                            <v-chip
                                                  @input="data.parent.selectItem(data.name)"
                                                  class="chip--select-multi"
                                                  :key="JSON.stringify(data.name)"
                                                >
                                                {{data.item}}
                                            </v-chip>
                                        </template>
                                    </v-select>
                                    </v-flex>
                                   </v-layout> 
                                <v-layout row justify-space-around> 
                                    <v-flex xs2>
                                        <v-select
                                        label="Customers"
                                        :items="customers"
                                        @input="activeCustomer()"
                                        v-model="invoice.customerId"
                                        item-value="_id"
                                        single-line></v-select>        
                                    </v-flex>
                                    <v-flex xs2> 
                                        <v-select
                                        :items="categories"
                                        v-model="categoryId"
                                        item-value="_id"
                                        @input="activeCategory()"
                                        label="Category"
                                        single-line></v-select>
                                    </v-flex>
                                    <v-flex xs2>
                                            <v-select
                                            label="Sales Person"
                                            @input="activeSalesPerson()"
                                            :items="salesPersons"
                                            v-model="invoice.salesPersonId"
                                            item-value="_id"
                                            single-line></v-select>        
                                        </v-flex>
                                    <v-flex xs2>

                                            <v-menu
                                            ref="menu1" lazy
                                            :close-on-content-click="false"
                                            v-model="menu1"
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            :nudge-right="40"
                                            min-width="290px"
                                            :return-value.sync="invoice.dateOfSale"
                                          >
                                            <v-text-field
                                              slot="activator"
                                              label="Date Of Sale"
                                              v-model="invoice.dateOfSale"
                                              :rules="rules"
                                              required

                                              prepend-icon="event"
                                              readonly
                                            ></v-text-field>
                                            <v-date-picker v-model="invoice.dateOfSale"  @change="saveDate1" no-title scrollable>
                                            </v-date-picker>
                                          </v-menu>
                                    </v-flex>     
                                    
                                    <v-flex xs3>        
                                    <!-- <v-btn  color="orange" dark small  fab @click="addNewInvoiceItemEntry()">
                                            <v-icon>add</v-icon>
                                    </v-btn>  -->
                                    <v-btn icon class="mx-1" @click="addNewInvoiceItemEntry()">
                                            <v-icon color="pink">add</v-icon>
                                    </v-btn>
                                    </v-flex>
                                    </v-layout>
                                    <v-layout>
                                    <v-flex d-flex xs8 sm8 md8 lg9>     
                                        <v-card>
                                        <v-data-table
                                        :headers="invoiceHeaders"
                                        :items="invoiceItems"
                                        
                                        hide-actions
                                        item-key="name"
                                        class="elevation-1">
                                        <template slot="items" slot-scope="props">
                                        <tr :active="props.selected" @click="activeInvoiceItem(props.item)">
                                        <td >
                                            <v-select 
                                            @input="activeProduct(props.item)"
                                            :items="products"
                                            v-model="props.item.productId"
                                            item-value="_id"
                                            autocomplete
                                            single-line></v-select>        

                                        </td>
                                        <td class="text-xs-left">
                                            <v-select 
                                            :items="props.item.currentBatchList"
                                            @input="activeBatch(props.item)"
                                            v-model="props.item.batchNumber"
                                            item-value="text"
                                            single-line></v-select>   
                                        </td>
                                        <td class="text-xs-left">
                                                <v-text-field 
                                                v-model="props.item.quantity"
                                                @input="validateQuantity(props.item)"
                                                :rules="rules"
                                                required>
                                                </v-text-field>
                                        </td>
                                        <td v-for="(item,i) in categoryItems" >
                                            <!-- {{item}} <input type="text" id="" class="subCategories" /> -->
                                            <v-text-field :label="item" :ref="'fields_'+i" v-model="props.item[item]"></v-text-field>
                                        </td> 
                                        <td class="text-xs-left">
                                            <v-text-field 
                                            v-model="props.item.sellingPrice"
                                            @input="validateSellingPrice(props.item)"
                                            :rules="rules"
                                            required>
                                            </v-text-field>
                                        </td>
                                        <td class="text-xs-left">
                                                <v-text-field 
                                                v-model="props.item.amount"
                                                :rules="rules" disabled>
                                                </v-text-field>
                                            </td>
                                        <td class="">
                                            <v-btn icon class="mx-0" @click="deleteListItem(props.item.index)">
                                                    <v-icon color="pink">delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </tr>
                                        </template>
                                        </v-data-table>
                                        <div class="text-xs-center pt-2">
                                                <table style="width:100%">
                                                        <tr>
                                                            <td colspan=3>
                                                               
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                                <td>    
                                                                        <v-flex xs4>GST</v-flex>
                                                                            <v-checkbox
                                                                            @change="activeGSTBox()"
                                                                            v-model="invoice.isGST"
                                                                            ></v-checkbox>
                                                                    </td>
                                                                    <td > 
                                                                        <v-flex xs6>Pending Invoice</v-flex>
                                                                        <v-checkbox
                                                                        @change="activeIsPaid()"
                                                                        v-model="isPending"
                                                                        ></v-checkbox>
                                                                    </td>
                                                            <td >
                                                                    <v-flex v-if="invoice.isGST" xs4  offset-xs6 v-for="(item,i) in invoiceTaxList">{{item}}</v-flex>
                                                                    <v-flex xs4 offset-xs7>
                                                                            <v-text-field v-if="isPending" 
                                                                            label="Paid Amount"
                                                                            @change="validatePendingAmount()"
                                                                            v-model="paidAmount">
                                                                            </v-text-field>
                                                                            </v-flex>
                                                                    <v-flex xs4 offset-xs7>
                                                                    <v-text-field 
                                                                    label="Total Amount"
                                                                    v-model="invoice.totalAmount"
                                                                    readonly >
                                                                    </v-text-field>
                                                                    </v-flex>
                                                            </td>
                                                        </tr>
                                                    </table> 
                                        </div>
                                        </v-card>
                                        </v-flex>
                                        </v-layout>
                                    <v-layout row wrap align-end >   
                                    <v-flex xs4 >       
                                            <v-btn color="primary" @click.native="addInvoice()">add</v-btn>
                                            <v-btn @click="clearStockEntries">clear</v-btn>
                                            
                                         <!--<download-excel
                                            class   = "btn btn-default"
                                            :data   = "invoiceJSONData"
                                            :fields = "invoiceJSONFields"
                                            name    = "myinvoice.xls">
                                            download
                                        </download-excel> -->
                                        </v-flex>                                      
                                  
                                    
                                    </v-layout>                                          
                                </v-form>
                        </v-flex>
                      </v-layout>
                    </v-container>

        <v-snackbar bottom="bottom" color="messageColor lighten-1" v-model="snackbar">
        {{ message }}
        </v-snackbar>
        </v-container>
        <app-footer></app-footer>
      </v-layout>
      </v-content>
      </template>
      <script>
      import Vue from 'vue'
      import Axios from 'axios'
      import moment from 'moment'
      import JsonExcel from 'vue-json-excel'
      import Authentication from '@/components/pages/Authentication'
      import StockItem from '@/components/Partials/InvoiceListItem'
      Vue.component('downloadExcel', JsonExcel)
      const apiURL = 'http://localhost:3001'// 'https://focus-budget-manager-api.herokuapp.com'
      var myInvoceItem = {
        productId : "",
        quantity: 0,
        batchNumber : "",
        sellingPrice : 0,
        amount : 0,
        currentBatchList : [],
        quantityLimit : 0,
      };
      export default {
        data () {
          return {
            menu1: false,
            menu2: false,
            snackbar: false,
            validated : 0,
            isInvoiceView : false,
            isInvoiceCreate : true,
            isPurchaseView : false,
            invoiceStatus : [{text:"Pending",value:true},{text:"Paid",value:false}],
            searchCustomerPendingAmount : 0,
            searchInvoiceStatus : false,
            searchStatusSelected : false,
            isCustomerInvoiceView : false,
            categoryField : '',
            categoryFields : '',
            selectedTaxList : [],
            invoiceTaxList : [],
            taxPercentage : 0,
            categoryItems : [],
            purchaseList : [],
            messageColor : 'red',
            customers : [],
            salesPersons : [],
            productStock : [],
            backupStock : [],
            currentBatchList : [],
            currentCustomerName : "",
            currentSalesPersonName : "",
            currentDateOfSale : "",
            currentCategory : "",
            categoryId : '',
            message : '',
            categoryDetailsData : {},
            rules: [ (value) => !!value || 'This field is required' ],
            pagination: {
                sortBy: 'date'
            },
            currentStockItem : {},
            currentQty : 0,
            currentPrice : 0,
            currentAmount : 0,
            currentProduct : "",
            backupTotalAmount : 0,
            isPending : false,
            paidAmount : 0,
            invoiceList : [],
            invoiceListCustomer : [],
            searchCustomer : "",
            isCustomerSelected : false,
            invoice :{
                category_id : '',
                supplierId: '',
                dateOfSale : null,
                totalAmount : 0,
                subCategories : [],
                salesPersonId : "",
                customerId : "",            
                items : [],
                isGST : false,
                taxList : []
            },
            viewDialog: false,
            products: [],
            invoiceItems:[],
            categories: [],
            headers: [
                {
                    text: 'Invoice Number',
                    value: 'invoiceNumber'
                },
                { text: 'Sold By', value: 'salesPerson' },
                {text : 'Sold To',"value" : 'customer'},
                {text : 'Date Of Sale',"value" : 'dateOfSale'},
                {text : 'Total Amount',"value" : 'totalAmount'},
                {text : 'Payment Status',"value" : 'status'},
                {text : 'Action',"value" : 'action'},
                ],
            purchaseHeaders: [
                {
                    text: 'Supplier Name',
                    value: 'supplierName'
                },
                { text: 'Date Of Order', value: 'dateOfOrder' },
                { text: 'Date Of delivery', value: 'dateRecived' },
                {text : 'Order Status',"value" : 'orderStatus'},
                {text : 'Total Amount',"value" : 'totalAmount'},
                {text : 'Action',"value" : 'action'}
                ],
            invoiceHeaderPrefix : [
                { text: 'Name', value: 'name'},
                { text: 'Batch Number', value: 'batchNumber' },
                { text: 'Quantity', value: 'quantity' }
                
            ],   
            invoiceHeaderPostfix :[
               {text : 'Selling Price',"value" : 'sellingPrice'},
               {text : 'Amount',"value" : 'amount'},
               {text : 'Action',"value" : 'action'}
            ],
            invoiceHeaders : [],
            invoiceJSONData : [],
            companyTaxList : [],
            companySelectList : [],
            invoiceJSONFields : {},
            viewInvoiceHeaders:[],// view invoice move to new component
            viewInvoiceItems:[],
            subCategories:[],
            profile:[],
            invoiceCount : 0,
            productMap:{},
            invoiceDetails:{},
            customerDetails: {}

            }
        },
        mounted () {
            this.getAllCustomers();
            this.getAllProducts();
            this.getAllcompanyTaxList();
            this.getAllSalesPersons();
            this.getAllInvoices();
            this.addNewInvoiceItemEntry();
            this.getAllCategories();
            this.getAllCategoryDetails();
            this.invoiceHeaders = this.invoiceHeaders.concat(this.invoiceHeaderPrefix);
            this.invoiceHeaders = this.invoiceHeaders.concat(this.invoiceHeaderPostfix);
            this.handleJSONFields();
            this.getProfile();
        },
        methods: {
            getAllCustomers (context) {
                Axios.get(`${apiURL}/api/v1/customer/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handleCustomerResponse(data)))
            },
            getAllInvoices(){
                Axios.get(`${apiURL}/api/v1/invoice/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handleInvoiceResponse(data)))
            },
            getAllSalesPersons (context){
                Axios.get(`${apiURL}/api/v1/users`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handleUsersResponse(data)))
            },
            getAllPurchaseOrders(){
                Axios.get(`${apiURL}/api/v1/purchaseOrder/Supplier`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handlePurchaseOrderGet(data)))
            },
            clear () {
              this.$refs.form.reset()
             },
             clearStockEntries () {
              this.invoiceItems = [];
             },
             getAllProducts (context) {
                Axios.get(`${apiURL}/api/v1/product/stock`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
            }).then(({data}) => (
                this.handleProductsResponse(data),
                data.forEach((product) => {
                    this.productMap[product._id] = product
                })
            
            ))
            },
            getAllCategories (context) {
                Axios.get(`${apiURL}/api/v1/category/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                    this.handleCategoriesResponse(data)
                ))
            },
            getAllCategoryDetails(){
                Axios.get(`${apiURL}/api/v1/categoryDetails`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                    this.handleCategoryDetailsResponse(data)
                ))
            },
            getAllcompanyTaxList (context) {
                Axios.get(`${apiURL}/api/v1/companyTax/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                    this.handleCompanyTaxResponse(data)
                ))
            },
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             handleNavigationMenu(visibleFlag){
                this.isInvoiceCreate = this.isInvoiceView = this.isCustomerInvoiceView = false
                switch(visibleFlag){
                    case 1: this.isInvoiceCreate = true; break;
                    case 2 : this.isInvoiceView = true; break;
                    case 3 : this.isCustomerInvoiceView = true; break;
                }
             },
             addNewInvoiceItemEntry(){
                 var temp = JSON.parse(JSON.stringify(myInvoceItem));
                 var index = this.invoiceItems.length;
                 temp.index = index;                                 
                 this.invoiceItems.push(temp);
             },
             deleteListItem(index){
                 var temp = [];
                 var  i = 0;
                 this.invoiceItems.forEach(function(obj){
                     if(i != index){
                         temp.push(obj)
                     }
                     obj.index = i;
                     i++;
                 })
                 this.invoiceItems = temp;
             },
             addInvoice(){
                var self = this;
                this.invoice.items = this.invoiceItems;
                 if(this.invoice.dateOfSale == null || this.invoice.category_id == null){
                    self.showMessage('green', 'Please fill required fields before clicking add');   
                    return;
                 }
                 if(this.invoice.items.length == 0){
                    self.showMessage('green', 'Please add atleast 1 item to add to invoice');   
                    return;
                 }

                 this.invoice.isPending = this.isPending;
                 if(this.isPending){ 
                    this.invoice.paidAmount = this.paidAmount;
                 }
                 loading();
                 Axios.put(`${apiURL}/api/v1/stock/`, {stock : this.productStock},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                            self.invoice.subCategories = self.categoryItems;
                            Axios.post(`${apiURL}/api/v1/invoice/`, {invoice : self.invoice},{
                                headers: {
                                'Authorization': Authentication.getAuthenticationHeader(self)
                                }
                            })
                            .then(function(response){
                                removeLoader()
                                self.$refs.form.reset();
                                self.showMessage('green', 'Stock added successfully');
                                self.clearStockEntries();
                                self.getAllInvoices();
                                self.getAllProducts();
                            }).catch(function(data) {
                                removeLoader()
                                self.message = data.message
                            })
                    }).catch(function(data){
                        removeLoader()
                        self.message = data.message
                    })
             },
             handleProductsResponse(data){
                var self = this;
                 self.products = [];
                 if(data){
                    data.forEach(function(obj){
                        if(obj.quantity && obj.quantity != 0){
                            self.products.push({"text":obj.name,"_id":obj._id});
                        }
                    });
                    this.productStock = data;
                    this.backupStock = JSON.parse(JSON.stringify(data));
                }
             },
             handleCustomerResponse(data){
                var self = this;
                 self.customers = [];
                 if(data){
                 data.forEach(function(obj){
                    self.customers.push({"text":obj.name,"_id":obj._id,"address":obj.address,"gstin":obj.gstin});
                 });
                }

             },
             handleUsersResponse(data){
                var self = this;
                 self.salesPersons = [];
                 if(data){
                    data.forEach(function(obj){
                        self.salesPersons.push({"text":obj.username,"_id":obj._id});
                    });
                }

             },
             handlePurchaseOrderGet(data){
                 data.forEach(function(obj){
                    
                    if(obj.recieved_flag){
                        obj.status = "Recieved"
                    }else{
                        obj.status = "Pending"
                    }
                    obj.date_of_order = new Date(obj.date_of_order).toLocaleDateString()
                    obj.date_recieved = new Date(obj.date_recieved).toLocaleDateString()
                 });
                 this.purchaseList = data;
             },
             handleCategoriesResponse(data){
                var self = this;
                 self.categories = [];
                 if(data){
                    data.forEach(function(obj){
                        self.categories.push({"text":obj.name,"_id":obj._id,"fields":obj.fields});
                    });
                }
             },
             activeProduct(obj){
                this.currentStockItem = obj;
                this.currentProduct = obj.productId;
             },
             activeBatch(obj){
                this.currentStockItem = obj;
                var self  = this;
                var tempObj = {};
                this.productStock.forEach(function(prodObj){
                    if(prodObj.batch_number === obj.batchNumber  && prodObj.batch_number != undefined){
                        tempObj = prodObj;
                    }
                });
                obj.sellingPrice = tempObj.selling_price;
                obj.quantityLimit = tempObj.quantity;
             },
             validateQuantity(obj){
                 if(obj.quantityLimit == 0 || obj.quantity > obj.quantityLimit){
                    obj.productId = "";
                    obj.quantity = 0;
                    obj.sellingPrice = "";
                    obj.batchNumber = "";
                    this.refreshStockQuantity();
                    this.showMessage("green","You dont have sufficient quantity for this batch number")
                    return;
                 }
                 this.currentPrice = obj.sellingPrice;
                 this.currentQty = obj.quantity;
                 this.calculateTotal();
             },
             validateSellingPrice(obj){

                 if(obj.sellingPrice < 0){
                    obj.sellingPrice = 0;
                    this.showMessage("green","You cannot enter selling price less than 0");
                    return;
                 }
                this.currentPrice = obj.sellingPrice;
                this.currentQty = obj.quantity;
                this.calculateTotal();
             },
             calculateTotal (){
                 var amount = 0;
                 this.invoiceItems.forEach(function(obj){
                     amount += obj.amount;
                 });
                 this.invoice.totalAmount = amount;
                 this.backupTotalAmount = amount;
                 this.activeGSTBox();
             },
             saveDate1 (date) {
                this.$refs.menu1.save(date)
            },
            handleCategorySelect(){

                var self = this; 
                var fields = [];
                this.categories.forEach(function(obj){
                    if(obj._id == self.invoice.category_id){
                        fields = obj.fields;
                    }
                });  
                this.categoryItems = fields;
                self.invoiceHeaders = [];
                self.invoiceHeaders = self.invoiceHeaders.concat(self.invoiceHeaderPrefix);
                this.categoryItems.forEach(function(obj){
                    self.invoiceHeaders.push( { text: obj, value: obj })
                })
                self.invoiceHeaders = self.invoiceHeaders.concat(self.invoiceHeaderPostfix);      
             },
             handleCategoryDetailsResponse(data){
                var self = this;
                this.categoryDetailsData = data;
             },
             refreshStockQuantity(){
                var self = this;
                var quantityList = {};
                self.productStock = JSON.parse(JSON.stringify(self.backupStock));
                self.invoiceItems.forEach(function(invObj){
                    self.productStock.forEach(function(pstockObj){
                        if(pstockObj._id == invObj.productId && pstockObj.batch_number == invObj.batchNumber){
                            if(pstockObj.quantity > 0 && (pstockObj.quantity - invObj.quantity) >=0 ){
                                pstockObj.quantity = pstockObj.quantity - invObj.quantity;
                            }
                        }
                    })
                });
             },
             activeCategory(){
                var self = this;
                 this.categories.forEach(function(obj){
                    if(obj._id == self.categoryId ){
                        self.currentCategory = obj.text;
                    }
                 });
             },
             activeCustomer(){
                var self = this;
                 this.customers.forEach(function(obj){
                    if(obj._id == self.invoice.customerId ){
                        self.currentCustomerName = obj.text;
                    }
                 });
             },
             activeSalesPerson(){
                 var self = this;
                 this.salesPersons.forEach(function(obj){
                    if(obj._id == self.invoice.salesPersonId ){
                        self.currentSalesPersonName = obj.text;
                    }
                 });
             },
             activeGSTBox(){
                 var self = this;
                 if(this.invoice.isGST){
                    this.resetTaxList();
                    this.invoice.totalAmount = this.backupTotalAmount + ((this.backupTotalAmount * self.taxPercentage)/100);
                 }else{
                    this.invoice.totalAmount = this.backupTotalAmount;
                 }
             },
             resetTaxList(){
                var self = this;
                self.taxPercentage = 0;
                self.invoice.taxList = [];
                self.invoiceTaxList = [];
                    this.companyTaxList.forEach(function(obj){
                        if(self.selectedTaxList.indexOf(obj.name + "(" + obj.value + "%)") > -1){
                            var tempTax = ((self.backupTotalAmount * obj.value) / 100);
                            self.taxPercentage += obj.value;
                            self.invoice.taxList.push(obj.id)
                            self.invoiceTaxList[self.selectedTaxList.indexOf(obj.name + "(" + obj.value + "%)")] = obj.name + " " + obj.value + "%   " + tempTax;
                        }
                    })
             },
             activeSelectTaxTag(){
                 this.resetTaxList();
             },
             activeIsPaid(){
                if(!this.isPending){
                    this.paidAmount = 0;
                }
             },
             validatePendingAmount(){
                if(this.paidAmount >= this.invoice.totalAmount){
                    this.isPending = false;
                    this.paidAmount = 0;
                    this.showMessage("green","Paid amount cannot exceed or be equal to the total amount")
                }
             },
             refreshInvoiceList(data,self,isSearch){
                var tempAmount = 0;
                data.forEach(function(invObj){ 
                    invObj.date_of_sale = new Date(invObj.date_of_sale).toLocaleDateString()
                    self.customers.forEach(function(custObj){
                        if(custObj._id == invObj.customer_id){
                            invObj.customerName = custObj.text;
                        }
                    })
                    invObj.status = "Paid";
                    if(invObj.isPending){
                        invObj.status = "Pending";
                        tempAmount += (invObj.total_amount - invObj.paidAmount);
                    }

                    self.salesPersons.forEach(function(salesObj){
                        if(salesObj._id == invObj.name_of_sales_person){
                            invObj.salesPerson = salesObj.text;
                        }
                    })
                })
                if(isSearch){
                    this.searchCustomerPendingAmount = tempAmount;
                 }
             },
             handleInvoiceResponse(data){
               var self = this;
                this.invoiceCount = data.length;
                this.invoiceList = data;
                this.invoiceListCustomer = data;
                this.invoice.invoiceNumber = "INV-" + (parseInt(this.invoiceCount + 1));
                this.refreshInvoiceList(data,self)
             },
             handleJSONFields(){
                this.invoiceJSONFields = {
                    "Name" : "Name",
                    "Customer" : "Customer",
                    "Category" : "Category",
                    "SalesPerson" : "SalesPerson",
                    "Date of Sale" : "DateofSale",

                }
                this.invoiceJSONData.push({"Customer" : this.currentCustomerName,"Category" : this.currentCategory , "SalesPerson" : this.currentSalesPersonName , "DateofSale" : this.invoice.dateOfSale});
             },
             activeInvoiceItem(currItem){
                this.currentProduct = currItem.productId;
                this.updateProductBatchList();
             },
             activeCustomerStatus(){
                 this.searchStatusSelected = true;
                if(!this.searchInvoiceStatus){
                    this.searchCustomerPendingAmount = 0;
                }
                if(this.isCustomerSelected){
                    this.activeCustomerSearch();
                }
             },
             activeCustomerSearch(){
                var self = this;
                var reqBody = {};
                var extraUrl = "";
                if(this.searchStatusSelected){
                    extraUrl += "isPending=" + this.searchInvoiceStatus;
                }
                this.isCustomerSelected = true;
                loading();
                Axios.get(`${apiURL}/api/v1/invoice/customer/`+ self.searchCustomer + "?" + extraUrl,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        removeLoader();
                        self.invoiceListCustomer = response.data;
                        self.searchCustomerPendingAmount = 0;
                        self.refreshInvoiceList(response.data,self,true)
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })

             },
             updatePendingInvoiceBulk(){
                var self = this;
                var reqBody = {};
                reqBody.isPending = false;
                Axios.put(`${apiURL}/api/v1/invoice/customer/` + this.searchCustomer,{invoice:reqBody },{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Invoice updated successfully');
                        self.getAllInvoices();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })


             },
             updateProductBatchList(){
                var self  = this;
                self.currentStockItem.currentBatchList = [];
                this.productStock.forEach(function(prodObj){
                    if(prodObj._id === self.currentStockItem.productId && prodObj.batch_number != undefined){
                        self.currentStockItem.currentBatchList.push({"text":prodObj.batch_number})
                    }
                });
                var categoryList = {};
                if(this.categoryDetailsData){
                    this.categoryDetailsData.forEach(function(catgObj){
                        if(catgObj.product_id == self.currentStockItem.productId){
                            categoryList = catgObj.properties;
                        }
                    });
                }
                if(!categoryList){
                    categoryList = {};
                        this.categoryItems.forEach(function(obj){
                            categoryList[obj] = "0";
                        });
                }else{
                    this.categoryItems.forEach(function(obj){
                            if(categoryList[obj] == undefined){
                                categoryList[obj] = "0";
                            }
                    });
                }
                for(var catKey in categoryList){
                    self.currentStockItem[catKey] = categoryList[catKey];
                }
             },
             deleteInvoice(invoiceId){
                var self = this;
                 Axios.delete(`${apiURL}/api/v1/invoice/` + invoiceId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Invoice deleted successfully');
                        self.getAllInvoices();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             updatePendingInvoice(invoiceId){
                var self = this;
                var reqBody = {};
                reqBody.isPending = false;
                Axios.put(`${apiURL}/api/v1/invoice/` + invoiceId,{invoice:reqBody },{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Invoice updated successfully');
                        self.getAllInvoices();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })

             },            
             viewInvoice(item){
              var self = this;
              var customerTemp = {};
              this.customers.forEach(function(obj){
                  if(obj._id == item.customer_id){
                    customerTemp = obj;
                  }
              })
              this.customerDetails = customerTemp;
              this.invoiceDetails = item;
              this.viewInvoiceHeaders= [];
              this.viewInvoiceHeaders.push( { text: 'SR NO', value: 'sno' }); 
              this.viewInvoiceHeaders = this.viewInvoiceHeaders.concat(this.invoiceHeaderPrefix);
              var totalAmount = 0;
              for(var key in item.subCategories){  

                  this.viewInvoiceHeaders.push( { text: item.subCategories[key], value: item.subCategories[key] })
              } 
              item.invoice_details.forEach(function(obj){
                totalAmount += obj.amount;
              })
              self.invoiceDetails.taxListView = [];
              if(item.is_gst){
                this.invoiceDetails.showTax = true;
              }else{
                this.invoiceDetails.showTax = false;
              }
              this.invoiceDetails.netAmount = totalAmount;
              if(this.invoiceDetails.showTax){
                  
                this.companyTaxList.forEach(function(obj){
                    if(item.taxList.indexOf(obj.id) > -1){
                        var tempTax = ((totalAmount * obj.value) / 100);
                        self.invoiceDetails.taxListView.push({"name" : obj.name + " (" + obj.value + "%) :" ,"value" :  tempTax});
                    }
                })
              }
              if(item.isPending){
                self.invoiceDetails.isPending = true;
                self.invoiceDetails.amountPaid = item.paidAmount;
              }else{
                self.invoiceDetails.isPending = false;
                self.invoiceDetails.amountPaid = 0;
              }

              
              this.viewInvoiceHeaders.push( { text: 'Selling Price', value: 'sellingPrice' });
              this.viewInvoiceHeaders.push( { text: 'Amount', value: 'amount' })  
              this.viewInvoiceItems= item.invoice_details;
              this.subCategories = item.subCategories;                 
              this.viewDialog =true;
           },
            getProfile (context) {
                Axios.get(`${apiURL}/api/v1/profile/`, {
                headers: {
                'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                this.profile=data[0] ? data[0] : {} 
                ))
            }, 
            print(){
                window.print();
            },
            handleCompanyTaxResponse(data){
                var self = this;
                 self.companyTaxList = [];
                 self.companySelectList = [];
                 if(data){
                 data.forEach(function(obj){
                    self.companyTaxList.push({"name" : obj.name,"value":obj.value,"id":obj._id});
                    self.companySelectList.push(obj.name + "(" + obj.value + "%)" );
                 });
                }
             }      
        },
        watch: {
            currentPrice : function(newData,oldData){
                this.currentStockItem.amount = this.currentPrice * this.currentQty;
                this.calculateTotal();
            }, 
            currentQty : function(newData,oldData){
                this.currentStockItem.amount = this.currentPrice * this.currentQty;
                this.calculateTotal();
                this.refreshStockQuantity();                
            },
            invoiceItems : function(newData,oldData) {            
                this.calculateTotal();
            },
            categoryId: function (newId, oldId) {
                this.invoice.category_id = newId;
                this.handleCategorySelect()
            },
            currentProduct : function(newId, oldId) {
                this.updateProductBatchList()
            }
        },
      }
</script>
<style>
.profile-header{
    border: 1px solid;
}

.logo{
  height: 150px;
  width: 190px;
}
.address{
   width: 60%;
}

.padding-0{
  padding:0 !important;
}
.condensed-data-table thead th{
    padding : 0!important;
    text-align: center !important ;
}

.condensed-data-table tbody td{
    padding : 0 !important;
    text-align: center !important;
}
.text-align-center {
    text-align: center !important;
}
@media print {
 /* styles go here */
 .application--wrap{
     display: none;
 }
 .toolbar__content{
     display: none;
 }
 .table__overflow{
     overflow-x: visible;
     overflow-y:  visible;
 }
.margin-top-2percent {
    margin-top:2%;
}
}
</style>


