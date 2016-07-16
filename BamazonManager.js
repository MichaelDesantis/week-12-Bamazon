//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
});

//Functions
function displayAll() {
    //show all ids, names, and products from database.
    connection.query('SELECT * FROM Products', function(error, response) {
        if (error) { console.log(error) };
        //New instance of our constructor
        var theDisplayTable = new Table({
            //declare the value categories
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            //set widths to scale
            colWidths: [10, 30, 18, 10, 14]
        });
        //for each row of the loop
        for (i = 0; i < response.length; i++) {
            //push data to table
            theDisplayTable.push(
                [response[i].ItemID, response[i].ProductName, response[i].DepartmentName, response[i].Price, response[i].StockQuantity]
            );
        }
        //log the completed table to console
        console.log(theDisplayTable.toString());
        inquireForUpdates();
    });
}; //end displayAll

function inquireForUpdates() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below to manage your store:",
        choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product"]
    }]).then(function(answers) {
        switch (answers.action) {

            case 'Restock Inventory':
                restockRequest();
                break;

            case 'Add New Product':
                addRequest();
                break;

            case 'Remove An Existing Product':
                console.log("removing");
                removeRequest();
                break;
        }
    });
}; //end inquireForUpdates

function restockRequest() {
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to restock?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to add?"
        },

    ]).then(function(answers) {
        //set captured input as variables, pass variables as parameters.
        var quantityAdded = answers.Quantity;
        var IDOfProduct = answers.ID;
        restockDatabase(IDOfProduct, quantityAdded);
    });
}; //end restockRequest

function restockDatabase(id, quant) {
    connection.query('SELECT * FROM Products WHERE ItemID = ' + id, function(error, response) {
        if (error) { console.log(error) };
        connection.query('UPDATE Products SET StockQuantity = StockQuantity + ' + quant + ' WHERE ItemID = ' + id);
        displayAll();
    });
}; //end restockDatabase

function addRequest() {
    inquirer.prompt([

        {
            name: "Name",
            type: "input",
            message: "What is the name of the item you wish to stock?"
        },
        {
            name: 'Category',
            type: 'input',
            message: "What is the category for this product?"
        },
        {
            name: 'Price',
            type: 'input',
            message: "How much would you like this to cost?"
        },
        {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to add?"
        },

    ]).then(function(answers){
    	var name = answers.Name;
    	var category = answers.Category;
    	var price = answers.Price;
    	var quantity = answers.Quantity;
    	buildNewItem(name,category,price,quantity);
    });
}; //end addRequest

function buildNewItem(name,category,price,quantity){
	console.log(name,category,price,quantity);
	connection.query('INSERT INTO Products (ProductName,DepartmentName,Price,StockQuantity) VALUES("' + name + '","' + category + '",' + price + ',' + quantity +  ')');
	displayAll();

};//end buildNewItem

function removeRequest(){
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to remove?"
        }]).then(function(answer){
        	var id = answer.ID;
        	removeFromDatabase(id);
        });
};//end removeRequest

function removeFromDatabase(id){
	connection.query('DELETE FROM Products WHERE ItemID = ' + id);
	displayAll();
};//end removeFromDatabase

displayAll();
