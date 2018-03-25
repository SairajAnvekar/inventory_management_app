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
                            </v-list>
                    </v-menu>
            </v-toolbar>
            
            <v-container v-if="isStockView">
                    <v-subheader class="text-xs-center">Your Stock </v-subheader>
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
                        <v-btn  color="orange" dark small  fab @click="deleteProduct(props.item._id)">
                        <v-icon>remove</v-icon></v-btn>
                        </td>
                    </template>
                    </v-data-table>
                </v-flex>
                </v-layout>
            </v-container> 

            <v-container v-if="isStockAdd">
                    <v-layout row wrap v-if="">
                        <v-flex d-flex xs10 sm10 md10>    
                             <v-card class="elevation-12" >
                                <v-toolbar dark color="primary">
                                <v-toolbar-title>Add Stock</v-toolbar-title>
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
            isStockAdd : false,
            isStockView : true,
            categoryField : '',
            categoryFields : '',
            categoryItems : [],
            messageColor : 'red',
            category_id : '',
            message : '',
            categoryDetailsData : {},
            rules: [ (value) => !!value || 'This field is required' ],
            pagination: {
                sortBy: 'date'
            },
            products: [],
            categories: [],
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Description', value: 'description' },
                { text: 'Category', value: 'categoryName' },
                {text : 'Quantity',"value" : 'quantity'},
                {text : 'Action',"value" : 'actions'}
                ]
            }
        },
        mounted () {
        },
        methods: {
            getAllStock () {

            },
            clear () {
              this.$refs.form.reset()
             },
             showMessage(color,message){
                this.messageColor = color;
                this.message = message;
                this.snackbar = true;
             },
             handleNavigationMenu(visibleFlag){
                this.isStockView = this.isStockAdd = false
                switch(visibleFlag){
                    case 1: this.isStockView = true; break;
                    case 2 : this.isStockAdd = true; break;
                }
             }
             
        },
        watch: {
        },
      }
      </script>