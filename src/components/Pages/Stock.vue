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
                                <v-list-tile-title>View Stock</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(2)">
                                    <v-list-tile-title>Add Stock</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(3)">
                                    <v-list-tile-title>View Purchase Orders</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                    </v-menu>
            </v-toolbar>
            
            <v-container v-if="isStockView">
                    <v-subheader class="text-xs-center">Your Stock </v-subheader>
                    <v-spacer></v-spacer>
                <v-layout row wrap >
                <v-flex d-flex xs12 sm12 md12> 
                    <v-card>
                    <v-data-table
                    :headers="headers"
                    :items="stockList"
                    :pagination.sync="pagination"
                    item-key="name"
                    class="elevation-2">
                    <template slot="items" slot-scope="props">
                    <td>{{ props.item.productName }}</td>
                    <td class="text-xs-left">{{ props.item.quantity }}</td>
                    <td class="text-xs-left">{{ props.item.batch_number}}</td>
                    <td class="text-xs-left">{{ props.item.purchase_price }}</td>
                    <td class="text-xs-left">{{ props.item.selling_price }}</td>
                    <td class="text-xs-left">{{ props.item.date }}</td>
                    <td class="">
                        <v-btn  color="orange" dark small  fab @click="deleteStock(props.item._id)">
                        <v-icon>remove</v-icon></v-btn>
                        </td>
                    </template>
                    </v-data-table>
                    </v-card>    
                </v-flex>
                </v-layout>
            </v-container> 
            <v-container  fluid  v-if="isStockAdd">
                    <v-subheader class="text-xs-center headline mb-0">Add Stock </v-subheader>
                    <v-spacer></v-spacer>
                    <v-layout row wrap v-if="">
                        <v-flex d-flex xs12 sm12 md12>    
                                <v-form ref="form"> 
                                <v-layout row justify-space-around> 
                                    <v-flex xs2>
                                        <v-select
                                        label="Supplier"
                                        :items="suppliers"
                                        v-model="stock.supplierId"
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
                                            :return-value.sync="stock.dateOrder"
                                          >
                                            <v-text-field
                                              slot="activator"
                                              label="Date Of Order"
                                              v-model="stock.dateOrder"
                                              :rules="rules"
                                              required
                                              prepend-icon="event"
                                              readonly
                                            ></v-text-field>
                                            <v-date-picker v-model="stock.dateOrder"  @change="saveDate1" no-title scrollable>
                                            </v-date-picker>
                                          </v-menu>
                                    </v-flex>        
                                    <v-flex xs2>   
                                            <v-menu
                                            ref="menu2" lazy
                                            :close-on-content-click="false"
                                            v-model="menu2"
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            :nudge-right="40"
                                            min-width="290px"
                                            :return-value.sync="stock.dateDelivery"
                                          >
                                            <v-text-field
                                              slot="activator"
                                              label="Date Of Delivery"
                                              v-model="stock.dateDelivery"
                                              :rules="rules"
                                              prepend-icon="event"
                                              required
                                              readonly
                                            ></v-text-field>
                                            <v-date-picker v-model="stock.dateDelivery"  @change="saveDate2" no-title scrollable>
                                            </v-date-picker>
                                          </v-menu>    
                                    </v-flex>
                                    <v-flex xs2>        
                                    <v-btn  color="orange" dark small  fab @click="addNewPurchaseEntryItem()">
                                            <v-icon>add</v-icon>
                                    </v-btn> 
                                    </v-flex>
                                    </v-layout>
                                    <v-layout>
                                    <v-flex d-flex xs11 sm11 md11>     
                                        <v-card>
                                        <v-data-table
                                        :headers="StockHeaders"
                                        :items="stockItems"
                                        :pagination.sync="pagination"
                                        item-key="name"
                                        class="elevation-1">
                                        <template slot="items" slot-scope="props">
                                        <tr :active="props.selected" @change="activeRowItem(props.item)">
                                        <td >
                                            <v-select 
                                            :items="products"
                                            v-model="props.item.productId"
                                            item-value="_id"
                                            single-line></v-select>        

                                        </td>
                                        <td class="text-xs-left">
                                                <v-text-field 
                                                v-model="props.item.quantity"
                                                :rules="rules"
                                                required>
                                                </v-text-field>
                                        </td>
                                        <td class="text-xs-left">
                                                <v-text-field 
                                                v-model="props.item.batchNumber"
                                                :rules="rules"
                                                required>
                                                </v-text-field>    
                                        </td>
                                        <td class="text-xs-left">
                                                <v-text-field 
                                                v-model="props.item.purchasePrice"
                                                :rules="rules"
                                                required>
                                                </v-text-field>
                                        </td>
                                        <td class="text-xs-left">
                                            <v-text-field 
                                            v-model="props.item.sellingPrice"
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
                                            <v-btn  color="orange" dark small  fab @click="deleteListItem(props.item.index)">
                                            <v-icon>remove</v-icon></v-btn>
                                            </td>
                                        </tr>
                                        </template>
                                        </v-data-table>
                                        </v-card>
                                        </v-flex>
                                        </v-layout>
                                    <v-layout row wrap align-end >   
                                    <v-flex xs4 >       
                                            <v-btn color="primary" @click.native="addStock()">add</v-btn>
                                            <v-btn @click="clearStockEntries">clear</v-btn>
                                        </v-flex>                                      
                                    <v-flex xs4 offset-xs3>  
                                            <v-text-field 
                                           label="Total Amount"
                                           v-model="stock.totalAmount"
                                           readonly >
                                           </v-text-field>
                                     </v-flex>  
                                    
                                    </v-layout>                                          
                                </v-form>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <v-container v-if="isPurchaseView">
                            <v-subheader class="text-xs-center">Your Purchase Orders </v-subheader>
                            <v-spacer></v-spacer>
                        <v-layout row wrap >
                        <v-flex d-flex xs12 sm12 md12> 
                            <v-card>
                            <v-data-table
                            :headers="purchaseHeaders"
                            :items="purchaseList"
                            :pagination.sync="pagination"
                            item-key="name"
                            class="elevation-2">
                            <template slot="items" slot-scope="props">
                                
                            <td>{{ props.item.supplierName }}</td>
                            <td class="text-xs-left">{{ props.item.date_of_order }}</td>
                            <td class="text-xs-left">{{ props.item.date_recieved}}</td>
                            <td class="text-xs-left">{{ props.item.status }}</td>
                            <td class="text-xs-left">{{ props.item.total_amount }}</td>
                            <td class="">
                                <v-btn  v-if="props.item.recieved_flag == false" color="orange" dark small  fab @click="addStockPurchase(props.item)">
                                <v-icon>update</v-icon></v-btn>
                            </td>
                            </template>
                            </v-data-table>
                            </v-card>    
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
      import Authentication from '@/components/pages/Authentication'
      import StockItem from '@/components/Partials/InvoiceListItem'
      const apiURL = 'http://localhost:3001'// 'https://focus-budget-manager-api.herokuapp.com'
      var myStockObject = {
        productId : "",
        quantity: 0,
        batchNumber : "",
        purchasePrice : 0,
        sellingPrice : 0,
        amount : 0
      };
      export default {
        data () {
          return {
            menu1: false,
            menu2: false,
            snackbar: false,
            validated : 0,
            isStockAdd : false,
            isStockView : true,
            isPurchaseView : false,
            categoryField : '',
            categoryFields : '',
            categoryItems : [],
            purchaseList : [],
            messageColor : 'red',
            suppliers : [],
            category_id : '',
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
            stockList : [],
            stock :{
                supplierId: '',
                dateOrder : null,
                dateDelivery : null,
                totalAmount : 0,
                stockRecieved : true,
                items : []
            },
            products: [],
            stockItems:[],
            categories: [],
            headers: [
                {
                    text: 'Name',
                    value: 'name'
                },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Batch Number', value: 'batchNumber' },
                {text : 'Purchase Price',"value" : 'purchasePrice'},
                {text : 'Selling Price',"value" : 'sellingPrice'},
                {text : 'Date Recieved',"value" : 'dateOfDelivery'},
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
            StockHeaders :[
                {
                    text: 'Name',
                    value: 'name'
                },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Batch Number', value: 'batchNumber' },
                {text : 'Purchase Price',"value" : 'purchasePrice'},
                {text : 'Selling Price',"value" : 'sellingPrice'},
                {text : 'Amount',"value" : 'amount'},
                {text : 'Action',"value" : 'action'}
                ]
            }
        },
        mounted () {
            this.getAllSuppliers();
            this.addNewPurchaseEntryItem();
            this.getAllProducts();
            this.getAllStock();
            this.getAllPurchaseOrders();
        },
        methods: {
           
            getAllStock () {
                var self = this;
                Axios.get(`${apiURL}/api/v1/stock/products`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (self.handleStockResponse(data)))
            },
            getAllSuppliers (context) {
                Axios.get(`${apiURL}/api/v1/supplier/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handleSupplierResponse(data)))
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
              this.stockItems = [];
             },
             getAllProducts (context) {
                Axios.get(`${apiURL}/api/v1/product/category`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.handleProductsResponse(data)))
            },
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             handleNavigationMenu(visibleFlag){
                this.isStockView = this.isStockAdd = this.isPurchaseView = false
                switch(visibleFlag){
                    case 1: this.isStockView = true; break;
                    case 2 : this.isStockAdd = true; break;
                    case 3 : this.isPurchaseView = true; break;
                }
             },
             addNewPurchaseEntryItem(){
                 var temp = JSON.parse(JSON.stringify(myStockObject));
                 var index = this.stockItems.length;
                 temp.index = index;
                 this.stockItems.push(temp);
             },
             deleteListItem(index){
                 var temp = [];
                 var  i = 0;
                 this.stockItems.forEach(function(obj){
                     if(i != index){
                         temp.push(obj)
                     }
                     obj.index = i;
                     i++;
                 })
                 this.stockItems = temp;
             },
             addStock(){
                var self = this;
                this.stock.items = this.stockItems;
                 if(Date.parse(new Date(this.stock.dateDelivery))>Date.parse(new Date(this.stock.dateOrder))){
                     this.stock.stockRecieved = false;
                 }
                 if(this.stock.dateDelivery == null || this.stock.dateOrder== null  || this.stock.supplierId == null){
                    self.showMessage('green', 'Please fill required fields before clicking add');   
                    return;
                 }
                 if(this.stock.items.length == 0){
                    self.showMessage('green', 'Please add atleast 1 item to add to stock');   
                    return;
                 }
                 console.log(this.stock)
                 loading();
                 Axios.post(`${apiURL}/api/v1/purchaseOrder/`, {stock : this.stock},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        if(self.stock.stockRecieved == true){    
                            Axios.post(`${apiURL}/api/v1/stock/all`, {stock : self.stock},{
                                headers: {
                                'Authorization': Authentication.getAuthenticationHeader(self)
                                }
                            })
                            .then(function(response){
                                removeLoader()
                                self.$refs.form.reset();
                                self.showMessage('green', 'Stock added successfully');
                                self.getAllPurchaseOrders();
                                self.getAllStock();
                            }).catch(function(data) {
                                removeLoader()
                                self.message = data.message
                            })
                        }else{
                            removeLoader()
                            self.getAllPurchaseOrders()
                            self.getAllStock();
                            self.$refs.form.reset();
                            self.showMessage('green', 'Stock added successfully');
                        }
                    }).catch(function(data){
                        removeLoader()
                        self.message = data.message
                    })
             },
             addStockPurchase(purchaseObj){
                 var stock = {} , newPurchaseObj = {}
                 stock.items = purchaseObj.product_details;
                 purchaseObj.recieved_flag = true;
                 loading();
                 newPurchaseObj = spliceObject(purchaseObj,['status','supplierName'])   
                 var self = this;
                    Axios.put(`${apiURL}/api/v1/purchaseOrder/` + purchaseObj._id, {stock : newPurchaseObj},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        Axios.post(`${apiURL}/api/v1/stock/all`, {stock : stock},{
                            headers: {
                            'Authorization': Authentication.getAuthenticationHeader(self)
                            }
                        })
                        .then(function(response){
                            removeLoader()
                            self.$refs.form.reset();
                            self.showMessage('green', 'Stock added successfully');
                            self.getAllPurchaseOrders();
                            self.getAllStock();
                        }).catch(function(data) {
                            removeLoader()
                            self.message = data.message
                        })
                    }).catch(function(data){
                        removeLoader()
                        self.message = data.message
                    });
             },
             handleProductsResponse(data){
                var self = this;
                 self.products = [];
                 if(data){
                 data.forEach(function(obj){
                    self.products.push({"text":obj.name,"_id":obj._id});
                 });
                }
             },
             handleSupplierResponse(data){
                var self = this;
                 self.suppliers = [];
                 if(data){
                 data.forEach(function(obj){
                    self.suppliers.push({"text":obj.name,"_id":obj._id});
                 });
                }

             },
             handleStockResponse(data){
                var self = this;
                data.forEach(function(obj){
                    obj.date = new Date(obj.date).toLocaleDateString()
                });
                 self.stockList = data;
                 
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
             activeRowItem (obj){
                 this.currentStockItem = obj;
                 this.currentPrice = obj.purchasePrice;
                 this.currentQty = obj.quantity;

             },
             calculateTotal (){
                 var amount = 0;
                 this.stockItems.forEach(function(obj){
                     amount += obj.amount;
                 });
                 this.stock.totalAmount = amount;
             },
             saveDate1 (date) {
                this.$refs.menu1.save(date)
            },
            saveDate2 (date) {
                this.$refs.menu2.save(date)
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
            },
            stockItems : function(newData,oldData) {
                this.calculateTotal();
            }
        },
      }

</script>


