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
                                <v-list-tile-title>View Suppliers</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(2)">
                                    <v-list-tile-title>Add Supplier</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(3)">
                                    <v-list-tile-title>Add Customer</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(4)">
                                    <v-list-tile-title>View Customer</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                    </v-menu>
            </v-toolbar>
            
              <!-- <h3>Welcome to Product Management</h3> -->
                <v-container v-if="isSupplierView">
                        <v-subheader class="text-xs-center">Your Suppliers </v-subheader>
                        <v-spacer></v-spacer>
                    <v-layout row wrap >
                    <v-flex d-flex xs10 sm10 md10>     
                        <v-data-table
                        :headers="headersSupplier"
                        :items="suppliers"
                        :pagination.sync="pagination"
                        item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.address }}</td>
                        <td class="text-xs-left">{{ props.item.email }}</td>
                        <td class="text-xs-left">{{ props.item.telephone_number }}</td>
                        <td class="">
                            <v-btn  color="orange" dark small  fab @click="deleteSupplier(props.item._id)">
                            <v-icon>remove</v-icon></v-btn>
                            </td>
                        </template>
                        </v-data-table>
                    </v-flex>
                    </v-layout>
                </v-container> 

                <v-container v-if="isSupplierAdd">
                    <v-layout row wrap v-if="">
                        <v-flex d-flex xs10 sm10 md10>    
                             <v-card class="elevation-12" >
                                <v-toolbar dark color="primary">
                                <v-toolbar-title>Add Supplier</v-toolbar-title>
                                <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                <v-form ref="form">
                                        <v-text-field label="Name"
                                        v-model="supplier.name"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
            
                                        <v-text-field label="Address"
                                        v-model="supplier.address"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>

                                        <v-text-field label="Email Id"
                                        v-model="supplier.emailId"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>

                                        <v-text-field label="Telephone Number"
                                        v-model="supplier.telephoneNumber"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>                              
                                </v-form>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click.native="addSupplier()">add</v-btn>
                                <v-btn @click="clear">clear</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>

                    <v-container  v-if="isCustomerView">
                            <v-subheader class="text-xs-center">Your Customers</v-subheader>
                            <v-spacer></v-spacer>
                        <v-layout row wrap v-if="">
                            <v-flex d-flex xs10 sm10 md10>  
                                <v-data-table
                                :headers="headersCustomer"
                                :items="customers"
                                :pagination.sync="pagination"
                                item-key="text"
                                class="elevation-1">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.name }}</td>
                                        <td class="text-xs-left">{{ props.item.address }}</td>
                                        <td class="text-xs-left">{{ props.item.email }}</td>
                                        <td class="text-xs-left">{{ props.item.telephone_number }}</td>
                                        <td class="">
                                            <v-btn  color="orange" dark small  fab @click="deleteCustomer(props.item._id)">
                                                <v-icon>remove</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-container  v-if="isCustomerAdd">
                        <v-layout row wrap v-if="">
                            <v-flex d-flex xs10 sm10 md10>    
                                <v-card class="elevation-12" >
                                    <v-toolbar dark color="primary">
                                        <v-toolbar-title>Add Customer</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                <v-card-text>
                                <v-form ref="form">
                                        <v-text-field label="Name"
                                        v-model="customer.name"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
            
                                        <v-text-field label="Address"
                                        v-model="customer.address"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>

                                        <v-text-field label="Email Id"
                                        v-model="customer.emailId"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>

                                        <v-text-field label="Telephone Number"
                                        v-model="customer.telephoneNumber"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
                                </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click.native="addCustomer()">add</v-btn>
                                    <v-btn @click="clear">clear</v-btn>
                                </v-card-actions>
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
      import Axios from 'axios'
      import moment from 'moment'
      import Authentication from '@/components/pages/Authentication'
      const apiURL = 'http://localhost:3001'// 'https://focus-budget-manager-api.herokuapp.com'
      export default {
        data () {
          return {
            snackbar: false,
            validated : 0,
            isSupplierAdd : false,
            isSupplierView : true,
            isCustomerAdd: false,
            isCustomerView : false,
            messageColor : 'red',
            category_id : '',
            message : '',
            rules: [ (value) => !!value || 'This field is required' ],
            pagination: {
                sortBy: 'date'
            },
            suppliers: [],
            customers: [],
            headersSupplier: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Address', value: 'address' },
                { text: 'Email Id', value: 'emailId' },
                {text : 'Telephone Number',"value" : 'telephoeNumber'}
                ],
            headersCustomer : [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Address', value: 'address' },
                { text: 'Email Id', value: 'emailId' },
                {text : 'Telephone Number',"value" : 'telephoeNumber'}                
                ], 
            supplier : {
                name : '',
                address : '',
                emailId : '',
                telephoneNumber : ''
            },
            customer : {
                name : '',
                address : '',
                emailId : '',
                telephoneNumber : ''
            }
          }
        },
        mounted () {
            this.getAllSuppliers();
            this.getAllCustomers();
        },
        methods: {
            getAllSuppliers (context) {
                Axios.get(`${apiURL}/api/v1/supplier/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.suppliers = data))
            },
            getAllCustomers (context) {
                Axios.get(`${apiURL}/api/v1/customer/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                    this.customers = data
                ))
            },
            clear () {
              this.$refs.form.reset()
             },
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             addCustomer(){
                 var self = this;
                    Axios.post(`${apiURL}/api/v1/customer/`, {customer:this.customer},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        self.$refs.form.reset();
                        self.showMessage('green', 'Customer added successfully');
                        self.getAllCustomers();
                    }).catch(function(response) {
                        if(response){
                            self.message = response.message
                            self.snackbar = true
                        }
                    })
             },
             addSupplier(){
                 var self = this;
                   Axios.post(`${apiURL}/api/v1/supplier/`, {supplier:this.supplier},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        self.$refs.form.reset();
                        self.showMessage('green', 'Supplier added successfully');
                        self.getAllSuppliers();
                    }).catch(function(response){
                        self.message = response.message
                        self.snackbar = true
                    });
             },
             deleteSupplier(supplierId){
                 console.log(supplierId)
                 var self = this;
                 Axios.delete(`${apiURL}/api/v1/supplier/` + supplierId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Supplier deleted successfully');
                        self.getAllSuppliers();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             deleteCustomer(customerId){
                 console.log(customerId)
                 var self = this;
                 Axios.delete(`${apiURL}/api/v1/customer/` + customerId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Customer deleted successfully');
                        self.getAllCustomers();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             handleNavigationMenu(visibleFlag){
                this.isSupplierView = this.isSupplierAdd = this.isCustomerAdd = this.isCustomerView = false;
                switch(visibleFlag){
                    case 1: this.isSupplierView = true; break;
                    case 2 : this.isSupplierAdd = true; break;
                    case 3 : this.isCustomerAdd = true; break;
                    case 4 : this.isCustomerView = true; break;
                }
             }
             
        },
        watch: {

        },
      }
      </script>