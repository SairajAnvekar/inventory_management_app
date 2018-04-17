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
                    <td class="">
                        <v-btn icon class="mx-0" @click="deleteInvoice(props.item._id)">
                            <v-icon color="pink">delete</v-icon>
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
                                    <v-btn  color="orange" dark small  fab @click="addNewInvoiceItemEntry()">
                                            <v-icon>add</v-icon>
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
                                        <template slot="footer">
                                        <td colspan="100%">
                                        <v-layout row wrap align-end >   
                                        <v-flex xs3 fluid px-0>
                                            <v-checkbox
                                            label="GST"
                                            @change="activeGSTBox()"
                                            v-model="invoice.isGST"
                                            ></v-checkbox>
                                        </v-flex>
                                        <v-flex xs3 offset-xs6>
                                                <v-text-field 
                                                label="Total Amount"
                                                v-model="invoice.totalAmount"
                                                readonly >
                                                </v-text-field>
                                        </v-flex> 
                                        </v-layout>
                                        </td>
                                        </template>
                                        </v-data-table>
                                        </v-card>
                                        </v-flex>
                                        </v-layout>
                                    <v-layout row wrap align-end >   
                                    <v-flex xs4 >       
                                            <v-btn color="primary" @click.native="addInvoice()">add</v-btn>
                                            <v-btn @click="clearStockEntries">clear</v-btn>
                                            
                                        <!-- <download-excel
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
            categoryField : '',
            categoryFields : '',
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
            invoiceList : [],
            invoice :{
                category_id : '',
                supplierId: '',
                dateOfSale : null,
                totalAmount : 0,
                subCategories : [],
                salesPersonId : "",
                customerId : "",
                items : [],
                isGST : false
            },
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
                {text : 'Action',"value" : 'action'}
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
            invoiceJSONFields : {},
            invoiceCount : 0

            }
        },
        mounted () {
            this.getAllCustomers();
            this.getAllProducts();
            this.getAllInvoices();
            this.getAllSalesPersons();
            this.addNewInvoiceItemEntry();
            this.getAllCategories();
            this.getAllCategoryDetails();
            this.invoiceHeaders = this.invoiceHeaders.concat(this.invoiceHeaderPrefix);
            this.invoiceHeaders = this.invoiceHeaders.concat(this.invoiceHeaderPostfix);
            this.handleJSONFields();
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
                }).then(({data}) => (this.handleProductsResponse(data)))
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
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             handleNavigationMenu(visibleFlag){
                this.isInvoiceCreate = this.isInvoiceView = false
                switch(visibleFlag){
                    case 1: this.isInvoiceCreate = true; break;
                    case 2 : this.isInvoiceView = true; break;
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
                 loading();
                 Axios.put(`${apiURL}/api/v1/stock/`, {stock : this.productStock},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
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
                    console.log(data)
                    this.productStock = data;
                    this.backupStock = JSON.parse(JSON.stringify(data));
                }
             },
             handleCustomerResponse(data){
                var self = this;
                 self.customers = [];
                 if(data){
                 data.forEach(function(obj){
                    self.customers.push({"text":obj.name,"_id":obj._id});
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
                console.log("handle")
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
                 if(this.invoice.isGST){
                    this.invoice.totalAmount = this.backupTotalAmount + ((this.backupTotalAmount * 12.5)/100);
                 }else{
                    this.invoice.totalAmount = this.backupTotalAmount;
                 }
             },
             handleInvoiceResponse(data){
               var self = this;
                this.invoiceCount = data.length;
                this.invoiceList = data;
                this.invoice.invoiceNumber = "INV-" + (parseInt(this.invoiceCount + 1));
                data.forEach(function(invObj){ 
                    invObj.date_of_sale = new Date(invObj.date_of_sale).toLocaleDateString()
                    self.customers.forEach(function(custObj){
                        if(custObj._id == invObj.customer_id){
                            invObj.customerName = custObj.text;
                        }
                    })

                    self.salesPersons.forEach(function(salesObj){
                        if(salesObj._id == invObj.name_of_sales_person){
                            invObj.salesPerson = salesObj.text;
                        }
                    })
                })
                console.log(this.invoiceList)
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


