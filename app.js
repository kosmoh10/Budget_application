//budgetController
var budgetController = (function()
{
    var Expence = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };

    Expence.prototype.calcPerventage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    };

    Expence.prototype.getPercentage=function(){
        return this.percentage;
    }

    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type]=sum;
    };
    


    var data ={
        allItems:{
            exp :[],
            inc :[]
        },
        totals:{
            exp : 0,
            inc : 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem : function(type,des,val){
            var newItem,ID;

            //create new ID 
            if(data.allItems[type].length>0)
            {
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else
            {
                ID=0;
            }
            if(type==='exp'){
                newItem = new Expence(ID,des,val);
            }
            else if(type ==='inc'){
                newItem=new Income(ID,des,val);
            }
            // Push it into our data Structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },

        deleteItem : function(type,ID){
            // data.allItems[type][id];
            var ids,index;
            
            ids = data.allItems[type].map(function(curr){
                // console.log(curr.id);
                return curr.id;
            });
            
            // console.log(ids+'   '+ids[ID]);


            index = ids.indexOf(ID);
            

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){

            //update total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget 
            // console.log(data.totals.inc);
            data.budget=data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }else{
                data.percentage=-1;
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPerventage(data.totals.inc);
            });
        },

        getPercentage:function(){
            var allPerc =data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget:function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function(){
            console.log(data);            
        }
    };


})();





























var UIController= (function() {

    var DOMstrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLable:'.budget__value',
        incomeLable:'.budget__income--value',
        expensesLable:'.budget__expenses--value',
        percentageLable:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLable:'.item__percentage',
        dateLable:'.budget__title--month'
    };

        var formatNumber = function(num,type){
            var numSplit,int,dec;
            num=Math.abs(num);
            num=num.toFixed(2);

            numSplit=num.split('.');
            int = numSplit[0];
            
            if(int.length>3){
                int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
                        
            dec = numSplit[1];

            return (type ==='exp' ? '-' : '+')+" "+ int +'.'+ dec;

        };




    return{
        getinput:function(){

            return {
            type : document.querySelector(DOMstrings.inputType).value,
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
        },

        addListItem :function(obj,type){
            //creat html string with placeholder text
            var html, newHtml,element;


            if(type==='inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';            
            }
            // replace 
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

            //insert the html into dom

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(selectorID){
            var el =document.getElementById(selectorID);
            document.getElementById(selectorID).parentNode.removeChild(el);
        },
        clearFields: function(){
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            fieldsArr=Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            var type;
            obj.budget>0 ? type='inc':type='exe';

            document.querySelector(DOMstrings.budgetLable).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLable).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLable).textContent=formatNumber(obj.totalExp,'exe');
            

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLable).textContent=obj.percentage;
            }else{
                document.querySelector(DOMstrings.percentageLable).textContent='N/A';
            }
        },

        displayPercentages:function(percentage){

            var fields=document.querySelectorAll(DOMstrings.expensesPercLable);

            var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i],i);
                }
            };

            nodeListForEach(fields,function(current,index){

                if(percentage[index]>0){
                    current.textContent=percentage[index]+'%';
                }else{
                    current.textContent='N/A';
                }
            });

        },

        displayMonth: function(){
            var now,year,month;
            
            now=new Date();
            year=now.getFullYear();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];

            month=months[now.getMonth()];
            document.querySelector(DOMstrings.dateLable).textContent=month+'  '+year;

        },

        getDOMStrings : function(){
            return DOMstrings;
        }
    };
})();





























var controller=(function (budgetCtrl,UICtrl){

    var setupEventListners=function (){
        var DOM=UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13|| event.which===13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget=function()
    {
        // 1 calculate the budget
        budgetCtrl.calculateBudget();

        // 2 return the budget
        var budget = budgetCtrl.getBudget();

        // 3 display the budget 
        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function(){
        
        //1- calculate the percentage
        budgetCtrl.calculatePercentages();
        
        var percentage = budgetCtrl.getPercentage();

        //up

        UICtrl.displayPercentages(percentage);
        //
    };

    var ctrlAddItem =function(){
        var input,newItem;
        //1 get the filed input data
        input = UICtrl.getinput();

        if(input.description!=="" && !isNaN(input.value) && input.value>0){

            //2 add the item to the budget controller
            newItem=budgetCtrl.addItem(input.type,input.description,input.value);
    
    
            //3 add the item to tht ui
            UICtrl.addListItem(newItem,input.type);
    
            // clear the fields
            UICtrl.clearFields();

            // calculate and update the budget
            updateBudget();
            //4 calculate and update the percentage
            updatePercentage();   
            //5 display the budget on the UI
        }

    };
    var ctrlDeleteItem = function(event){
        var itemID;
        var splitID; 
        
        // itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID !==null){
            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);

            // delete the item from the data structure

            budgetCtrl.deleteItem(type,ID);

            // delete the item form the UI

            UICtrl.deleteListItem(itemID);

            //update and show the new budget
            updateBudget();

            // update the percentage
            updatePercentage();
        }




    };

    return {
        init : function(){
            console.log('Application has started');
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage: 'N/A'
            });
            setupEventListners();
            UICtrl.displayMonth();
        }
    }

})(budgetController,UIController);

controller.init();