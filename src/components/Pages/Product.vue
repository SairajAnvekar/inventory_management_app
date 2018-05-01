<template>
        <v-content>
         <v-layout>
            <app-header></app-header>

            <v-container>
            <v-toolbar  class="elevation-0 transparent" floating dense flat height=30  >
                    <!-- <v-menu offset-y>
                            <v-btn color="primary" dark slot="activator">Actions</v-btn>
                            <v-list>
                              <v-list-tile @click.native="handleNavigationMenu(1)">
                                <v-list-tile-title>View Products</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(2)">
                                    <v-list-tile-title>Add Product</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(3)">
                                    <v-list-tile-title>Add Category</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(4)">
                                    <v-list-tile-title>View Category</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(5)">
                                    <v-list-tile-title>Add Tax</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click.native="handleNavigationMenu(6)">
                                    <v-list-tile-title>View Tax</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                    </v-menu> -->

                    <v-toolbar-items  >
                            <v-btn-toggle  mandatory  v-model="toggleStart">
                                <v-btn flat class="" onclick="" @click.native="handleNavigationMenu(1)">View Product</v-btn>
                                <v-btn flat  @click.native="handleNavigationMenu(2)" class="">Add Product</v-btn>
                                <v-btn flat  @click.native="handleNavigationMenu(3)">Add Category</v-btn>
                                <v-btn flat  @click.native="handleNavigationMenu(4)">View Category</v-btn>
                                <v-btn flat  @click.native="handleNavigationMenu(5)">Add Tax</v-btn>
                                <v-btn flat  @click.native="handleNavigationMenu(6)">View Tax</v-btn>
                            </v-btn-toggle>
                        </v-toolbar-items>
            </v-toolbar>
            
              
                <!-- <h3>Welcome to Product Management</h3> -->
                <v-container v-if="isProductView">
                        <!-- <v-subheader class="text-xs-center">Your Products </v-subheader> -->
                        <v-spacer></v-spacer>
                    <v-layout row wrap >
                    <v-flex d-flex xs10 sm10 md10>     
                        <v-data-table
                        :headers="headers"
                        :items="products"
                        :pagination.sync="pagination"
                        item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.description }}</td>
                        <td class="text-xs-left">{{ props.item.categoryName }}</td>
                        <td class="">
                            <v-btn icon class="mx-0" @click="deleteProduct(props.item._id)">
                                    <v-icon color="pink">delete</v-icon>
                                </v-btn>
                            </td>
                        </template>
                        </v-data-table>
                    </v-flex>
                    </v-layout>
                </v-container> 

                <v-container v-if="isProductAdd">
                    <v-layout row wrap v-if="">
                        <v-flex d-flex xs10 sm10 md10>    
                             <v-card class="elevation-12" >
                                <v-toolbar dark color="primary">
                                <v-toolbar-title>Add Product</v-toolbar-title>
                                <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                <v-form ref="form">
                                        <v-text-field label="Name"
                                        v-model="product.name"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
            
                                        <v-text-field label="Description"
                                        v-model="product.description"
                                        prepend-icon="account_box"
                                        :rules="rules"
                                        required>
                                        </v-text-field>

                                        <v-select
                                        :items="categories"
                                        v-model="category_id"
                                        item-value="_id"
                                        
                                        label="Category"
                                        single-line></v-select>

                                        <div v-for="(item,i) in categoryItems" >
                                            <!-- {{item}} <input type="text" id="" class="subCategories" /> -->
                                            <v-text-field :label="item" :ref="'fields_'+i" v-model="subcategories[item]"></v-text-field>
                                        </div>                                
                                </v-form>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click.native="addProduct()">add</v-btn>
                                <v-btn @click="clear">clear</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>

                    <v-container  v-if="isCategoryView">
                            <!-- <v-subheader class="text-xs-center">Your Categories</v-subheader> -->
                            <v-spacer></v-spacer>
                        <v-layout row wrap v-if="">
                            <v-flex d-flex xs10 sm10 md10>  
                                <v-data-table
                                :headers="headersCategories"
                                :items="categories"
                                :pagination.sync="pagination"
                                item-key="text"
                                class="elevation-1">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.text }}</td>
                                        <td class="">
                                            <v-btn icon class="mx-0" @click="deleteCategory(props.item._id)">
                                                    <v-icon color="pink">delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-container  v-if="isCategoryAdd">
                        <v-layout row wrap v-if="">
                            <v-flex d-flex xs10 sm10 md10>    
                                <v-card class="elevation-12" >
                                    <v-toolbar dark color="primary">
                                        <v-toolbar-title>Add Category</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                <v-card-text>
                                <v-form ref="form">
                                    <v-text-field label="Name"
                                    v-model="category.name"
                                    :rules="rules"
                                    required>
                                    </v-text-field>

                             <br>
                                <v-select label="Field" chips tags solo prepend-icon="filter_list" append-icon="" clearable v-model="category.fields">
                                <template slot="selection" slot-scope="data">
                                    <v-chip close @input="remove(data.item)" :selected="data.selected">
                                    <strong>{{ data.item }}</strong>&nbsp;                                 
                                    </v-chip>
                                </template>
                                </v-select>

                                </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click.native="addCategory()">add</v-btn>
                                    <v-btn @click="clear">clear</v-btn>
                                </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-container  v-if="isTaxView">
                            <!-- <v-subheader class="text-xs-center">Your Company Tax</v-subheader> -->
                            <v-spacer></v-spacer>
                        <v-layout row wrap v-if="">
                            <v-flex d-flex xs10 sm10 md10>  
                                <v-data-table
                                :headers="headersCompanyTax"
                                :items="companyTaxList"
                                :pagination.sync="pagination"
                                item-key="text"
                                class="elevation-1">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.text }}</td>
                                        <td>{{ props.item.value }} %</td>
                                        <td class="">
                                            <v-btn  icon class="mx-0" @click="deleteTax(props.item._id)">
                                                <v-icon color="pink">delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-container  v-if="isTaxAdd">
                            <v-layout row wrap v-if="">
                                <v-flex d-flex xs10 sm10 md10>    
                                    <v-card class="elevation-12" >
                                        <v-toolbar dark color="primary">
                                            <v-toolbar-title>Add Tax</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                        </v-toolbar>
                                    <v-card-text>
                                    <v-form ref="form">
                                        <v-text-field label="Name"
                                        v-model="companyTax.name"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
                                        <v-text-field label="Percentage"
                                        v-model="companyTax.value"
                                        :rules="rules"
                                        required>
                                        </v-text-field>
                                    </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" @click.native="addTax()">add</v-btn>
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
            toggleStart : 0,
            validated : 0,
            isProductAdd : false,
            isProductView : true,
            isCategoryAdd: false,
            isCategoryView : false,
            isTaxAdd : false,
            isTaxView : false,
            categoryField : '',
            categoryFields : '',
            categoryItems : [],
            messageColor : 'red',
            category_id : '',
            message : '',
            subcategories : {},
            categoryDetailsData : {},
            rules: [ (value) => !!value || 'This field is required' ],
            pagination: {
                sortBy: 'date'
            },
            products: [],
            categories: [],
            companyTaxList : [],
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Description', value: 'description' },
                { text: 'Category', value: 'categoryName' },
                {text : 'Action',"value" : 'actions'}
                ],
            headersCategories : [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                {text : 'Action',"value" : 'actions'}
                ], 
            headersCompanyTax :[
                { text: 'Name',align: 'left',value: 'name'},
                { text: 'Percentage',align: 'left',value: 'percentage'},
                {text : 'Action',"value" : 'actions'}
            ] ,  
            product : {
                name : '',
                description : '',
                category_id : ''
            },
            category : {
                name : '',
                fields : []
            },
            categoryDetails :{
                subCategories : []
            },
            companyTax : {
                name : "",
                value : 0
            }
          }
        },
        mounted () {
            this.getAllCategories();
            this.getAllProducts();
            this.getAllcompanyTaxList();
        },
        methods: {
            getAllProducts (context) {
                Axios.get(`${apiURL}/api/v1/product/category`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (this.products = data))
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
            getAllcompanyTaxList (context) {
                Axios.get(`${apiURL}/api/v1/companyTax/`, {
                headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                }
                }).then(({data}) => (
                    this.handleCompanyTaxResponse(data)
                ))
            },
            clear () {
              this.$refs.form.reset()
             },
             addField(){
                if(this.categoryField != ""){
                    this.category.fields.push(this.categoryField);
                    this.categories = '';
                    this.categoryField = '';
                    this.categoryFields = this.category.fields.join(",");
                }
             },
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             addCategory(){
                 var self = this;
                    Axios.post(`${apiURL}/api/v1/category/`, {category:this.category},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        self.$refs.form.reset();
                        showMessage('green', 'Category added successfully');
                        self.getAllCategories();
                    }).catch(function(data){
                        self.message = data.message
                    })
             },
             addTax(){
                 var self = this;
                    Axios.post(`${apiURL}/api/v1/companyTax/`, {companyTax:this.companyTax},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                        self.getAllcompanyTaxList();
                        self.$refs.form.reset();
                        showMessage('green', 'Company Tax added successfully');
                    }).catch(function(data){
                        self.message = data.message
                    })
             },
             addProduct(){
                 var self = this;

                   Axios.post(`${apiURL}/api/v1/product/`, {product:this.product},{
                        headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                        }
                    })
                    .then(function(response){
                            self.categoryDetailsData = {
                            categoryId : self.product.category_id,
                            properties : self.subcategories,
                            productId : response.data.Product._id
                        }   
                        self.getAllProducts();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    });
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
             handleCompanyTaxResponse(data){
                var self = this;
                 self.companyTaxList = [];
                 if(data){
                 data.forEach(function(obj){
                    self.companyTaxList.push({"text":obj.name,"_id":obj._id,"value":obj.value});
                 });
                }
             },
             handleCategorySelect(){
                var self = this; 
                var fields = [];
                this.categories.forEach(function(obj){
                    if(obj._id == self.product.category_id){
                        fields = obj.fields;
                    }
                });  
                this.categoryItems = fields;
             },
             deleteProduct(productId){
                 console.log(productId)
                 var self = this;
                 Axios.delete(`${apiURL}/api/v1/product/` + productId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Product deleted successfully');
                        self.getAllProducts();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             deleteCategory(categoryId){
                 console.log(categoryId)
                 var self = this;
                 Axios.delete(`${apiURL}/api/v1/category/` + categoryId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.showMessage('green', 'Category deleted successfully');
                        self.getAllCategories();
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             deleteTax(taxId){
                 console.log(taxId)
                 var self = this;
                 Axios.delete(`${apiURL}/api/v1/companyTax/` + taxId,{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                    self.getAllcompanyTaxList();
                        self.showMessage('green', 'Company tax has been deleted successfully');
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                        self.snackbar = true
                    })
             },
             handleNavigationMenu(visibleFlag){
                this.isProductAdd = this.isProductView = this.isCategoryAdd = this.isCategoryView = this.isTaxAdd = this.isTaxView = false;
                switch(visibleFlag){
                    case 1: this.isProductView = true; break;
                    case 2 : this.isProductAdd = true; break;
                    case 3 : this.isCategoryAdd = true; break;
                    case 4 : this.isCategoryView = true; break;
                    case 5 : this.isTaxAdd = true; break;
                    case 6 : this.isTaxView = true; break;
                }
             }
             
        },
        watch: {
            category_id: function (newId, oldId) {
                this.product.category_id = newId;
                this.handleCategorySelect()
            },
            categoryDetailsData : function(newData,oldData){
                var self = this;
                Axios.post(`${apiURL}/api/v1/categoryDetails`, {categoryDetails:newData},{
                    headers: {
                    'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                })
                .then(function(response){
                        self.$refs.form.reset();
                        self.showMessage('green', 'Category Details added successfully');
                    }).catch(({response: {data}}) => {
                        self.message = data.message
                    })
            }
        },
      }
      </script>