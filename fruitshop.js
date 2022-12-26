window.onload = function(){
    async function table(){
        const response = await fetch('fruitinfo.json');
        const data = await response.json();
    
        //find out all the duplicated element
        let map = new Map();
        let bucket = [];
        let result = [];
        let fruit_list = []; // fruit list duplicated version
        let unique_fruit = []; // unique fruit list
        let fruit_array = []; // single fruit list
        let desc_asc = false;
        function insertingData(tableData){
            // creating row and cells for both table
            let trname = tableData.fruit_name.toLowerCase();
            let tr= `<tr class='table-row ${trname}' value='${tableData.price}'>
                        <td class="type"><img class="fruit_pic" src='img/${tableData.fruit_name}.jpg' alt=${tableData.fruit_name}  width='50'; height='50';/><p class="fruit_p">${tableData.fruit_name}</p></td>
                        <td class="price"><p class="fruit_p">${tableData.price}</p></td>
                        <td class="last_Updated"><p class="fruit_p">${tableData.last_updated}</p></td>
                        <td class="inventory_count"><p class="fruit_p">${tableData.inventory_count}</p></td>
                    </tr>`       
            return tr;
        }
        function displayTableData(tableData){
            for(let i = 0; i < tableData.length; i++){
                //it will insert into the right table based on the name of the fruit shop;
                if(tableData[i].supplier == 'Vasani Fresh'){
                    // document.querySelector('.table-vf tbody').insertAdjacentHTML('afterbegin',insertingData(tableData[i]));
                    document.querySelector('.table-vf tbody').innerHTML += insertingData(tableData[i]);
                }
                else if(tableData[i].supplier == 'Zeni Fruits'){
                    // document.querySelector('.table-zf tbody').insertAdjacentHTML('afterbegin',insertingData(tableData[i]));
                    document.querySelector('.table-zf tbody').innerHTML += insertingData(tableData[i]);
                }
            }
    

        }

        //adding color to the cheapest one
        function findCheapestPrice(){
            // select all rows in both tables;
            let table1Row = document.querySelectorAll('.table.table-vf tbody tr');
            let table2Row = document.querySelectorAll('.table.table-zf tbody tr');  
            



            // using map and bucket sort in here to find out the frequency of all fruits and find out the unique fruits, and append them to array.
            for(let i = 0; i < data.length; i++){
                fruit_list.push(data[i].fruit_name.toLowerCase());
            }
            for(let i = 0; i < fruit_list.length; i++){
                map.set(fruit_list[i],(map.get(fruit_list[i])|| 0) + 1)
            }
            for(let [ele, freq] of map) {
                bucket[freq] = (bucket[freq] || new Set()).add(ele);
            }
            result = bucket[1];


            unique_fruit = Array.from(result);


            //loop through two tables to compare. start with fruit type, then the price
            table1Row.forEach((ele)=>{
                let fruitType = ele.classList[1];
                let fruitPrice =  ele.querySelector('td:nth-child(2)').innerHTML;
                if(Array.from(result).includes(fruitType)){
                    ele.classList.add('cheapest');
                }
                else{
                    table2Row.forEach((ele1)=>{
                        let fruitType1 = ele1.classList[1];
                        let fruitPrice1 =  ele1.querySelector('td:nth-child(2)').innerHTML;       
                        if(Array.from(result).includes(fruitType1)){
                            ele1.classList.add('cheapest');
                        }
                        else{
                            if(fruitType == fruitType1){
                                if(fruitPrice < fruitPrice1){
                                    ele.classList.add('cheapest');
                                }
                                else{
                                    ele1.classList.add('cheapest');
                                }
                            }      
                        }
                    })



                }

            })     
        }

        // toggle active class to the picture when user wants them to display otherwise stay hidden
        function displayHiddenPic(){
            document.querySelectorAll('.table-row').forEach((ele)=>
                ele.addEventListener('click',function(){
                    ele.querySelector('.type img').classList.toggle('active');
                })
            )
        }
        // filter search bar that will delete unwanted items
        function filterfunc(){

            //find out the array of fruits
            for(let i = 0; i < data.length; i++){
                if( !fruit_array.includes(data[i].fruit_name)){
                    fruit_array.push(data[i].fruit_name)
                }
            }

            // apending them to multiple checkbox list
            for(let i = 0; i < fruit_array.length; i++){
                let fruit = fruit_array[i];
                if(fruit == 'Dragon Fruit'){
                    fruit = 'Dragon';
                }
                document.querySelector('.checkbox').innerHTML += `<input type="checkbox" class="multiple_section" id="${fruit.toLowerCase()}" name="${fruit.toLowerCase()}" value="${fruit.toLowerCase()}">
                <label for="${fruit.toLowerCase()}"> ${fruit}</label><br>`;
            }




            //second version of filterbar, so you can hide multiple at the same time.
            document.querySelectorAll('.multiple_section').forEach((ele)=>{
                ele.addEventListener('click',function(){

                    document.querySelectorAll('.table-row').forEach((item)=>{
                        if(ele.checked){
                            if(item.classList.contains(ele.id)){
                                item.classList.toggle('active');
                            }
                                
                            }
                        else if(!ele.checked){
                            if(item.classList.contains('active')){
                                item.classList.toggle('active');
                            }
                        }
                    })
                })
            })
            

            


            

            
            //getting value from search bar and changing all characters to lower case just in case
            let input_result = document.querySelector('#filterbar');
            input_result.addEventListener('keyup',()=>{
                document.querySelectorAll('.table-row').forEach((ele)=>{

                    //check if the class name can match up with the input, toggle active if true
                    if(ele.classList.contains(input_result.value.toLowerCase())){
                        ele.classList.toggle('active');
                    }
                    // if search bar contains no letters remove all active class to show the full table
                    else if(input_result.value == ''){
                        if(ele.classList.contains('active')){
                            ele.classList.remove('active');
                        }
                    }
                })
            })
        }

        

        //estimate function
        function estimatefunc(){

            let totalnum = {};
            //getting all the fruit type


            document.querySelectorAll('.table-row').forEach((ele)=>{
                let inven_count = Number(ele.querySelector('td:last-child p').innerHTML);
                let fruit_name = ele.querySelector('td:first-child p').innerHTML.toLowerCase();
                if(fruit_name == 'dragon fruit'){
                    fruit_name = 'dragon';
                }
                if(!totalnum[fruit_name]){
                    totalnum[fruit_name] = inven_count;
                }
                else{
                    totalnum[fruit_name] += inven_count;
                }
            })


            // append them all into selection tag
            fruit_array = fruit_array.reverse();
            for(let j = 0; j < fruit_array.length; j++){
                let option = `<option value=${fruit_array[j].toLowerCase()}>${fruit_array[j]}</option>`
                document.querySelector('#fruit_selection').insertAdjacentHTML('afterbegin',option);
            }


            let selection_value = document.querySelector('#fruit_selection');
            let input_result = document.querySelector('#searchbar_estimate');


            let first_half = '';
            let first_result = 0;
            let total_price = 0;
            let temp_price = 0;
            input_result.addEventListener('keyup',()=>{
                document.querySelectorAll('.table-row').forEach((ele)=>{

                    if(input_result.value !== '' && selection_value.value !== '' && input_result.value >= 0){
                        //check if total inventory is greater than input#
                        if(totalnum[selection_value.value] < input_result.value){
                            document.querySelector('.estimation_result .result_estimate').innerHTML = `Exceed maximum inventory`;
                            document.querySelector('.total_price').innerHTML = '';
                        }
                        else{
                            //unique fruit part
                            //checking if fruit is unique, if it is compare the number and display result(dont have to check another store)
                            if(unique_fruit.includes(selection_value.value) && ele.classList.contains(selection_value.value)){
                                if(Number(ele.querySelector('td:last-child p').innerHTML) >= Number(input_result.value)){
                                    document.querySelector('.estimation_result .result_estimate').innerHTML = `You should buy All ${input_result.value}  ${selection_value.value} from ${ele.parentNode.classList[0]} ${ele.parentNode.classList[1]}`;
                                    total_price = (Number(ele.querySelector('.price .fruit_p').innerHTML) * Number(input_result.value)).toFixed(2);
                                    document.querySelector('.total_price').innerHTML = `Total cost is $${total_price}`;
                                }
                                else{
                                    document.querySelector('.estimation_result .result_estimate').innerHTML = `Exceed maximum inventory`;
                                    document.querySelector('.total_price').innerHTML = '';
                                }
                            }


                            //common fruit part
                            // there are two parts when cheapest store can cover all input#, then display string. 
                            else if((!unique_fruit.includes(selection_value.value) && ele.classList.contains(selection_value.value))){
                                if(ele.classList.contains('cheapest')){
                                    if(Number(ele.querySelector('td:last-child p').innerHTML) >= Number(input_result.value)){         
                                        document.querySelector('.estimation_result .result_estimate').innerHTML = `You should buy All ${input_result.value}  ${selection_value.value} from from ${ele.parentNode.classList[0]} ${ele.parentNode.classList[1]}`;
                                        total_price = (Number(ele.querySelector('.price .fruit_p').innerHTML) * Number(input_result.value)).toFixed(2);
                                        document.querySelector('.total_price').innerHTML = `Total cost is $${total_price}`;
                                    }
        
                                    // but if its otherwise, do calculation first and store the number and string to variable first.
                                    else{
                                        first_half =`You should first buy All ${Number(ele.querySelector('td:last-child p').innerHTML)}  ${selection_value.value} from from ${ele.parentNode.classList[0]} ${ele.parentNode.classList[1]} then `;
                                        first_result = Number(input_result.value) - Number(ele.querySelector('td:last-child p').innerHTML);

                                        temp_price = (Number(ele.querySelector('.price .fruit_p').innerHTML) * Number(ele.querySelector('.inventory_count .fruit_p').innerHTML));
                                        

                                    }
                                }
                                else if(!ele.classList.contains('cheapest') && first_result !== 0){

                                    total_price = (temp_price + Number(ele.querySelector('.price .fruit_p').innerHTML) * first_result).toFixed(2);
                                    document.querySelector('.estimation_result .result_estimate').innerHTML = `${first_half}, You should buy the rest ${first_result} from from ${ele.parentNode.classList[0]} ${ele.parentNode.classList[1]} and`;
                                    document.querySelector('.total_price').innerHTML = ` Total cost is $${total_price}`;
                                }
                            }
                        }   
    
                    
    
    
                    }
    
                    else if(input_result.value < 0 || input_result.value.match(/^[A-Za-z]+$/)){ 
                        document.querySelector('.estimation_result .result_estimate').innerHTML = `Invalid String`;
                    }
                    else if(input_result.value =='' || selection_value.value ==''){
                        first_result = 0;
                        total_price = 0;
                        document.querySelector('.estimation_result .result_estimate').innerHTML = '';
                        document.querySelector('.total_price').innerHTML = '';
                    }                
                })
            })
        }


        function displayTable1(tableData){
            for(let i = 0; i < tableData.length; i++){
                //it will insert into the right table based on the name of the fruit shop;
                if(tableData[i].supplier == 'Vasani Fresh'){
                    // document.querySelector('.table-vf tbody').insertAdjacentHTML('afterbegin',insertingData(tableData[i]));
                    document.querySelector('.table-vf tbody').innerHTML += insertingData(tableData[i]);
                }
            }
        }
        function displayTable2(tableData){
            for(let i = 0; i < tableData.length; i++){
                if(tableData[i].supplier == 'Zeni Fruits'){
                    // document.querySelector('.table-zf tbody').insertAdjacentHTML('afterbegin',insertingData(tableData[i]));
                    document.querySelector('.table-zf tbody').innerHTML += insertingData(tableData[i]);
                }
        }
        }
        function sortingfunc(){
            
            document.querySelectorAll('.title-row th').forEach((ele)=>{
                //adding click on eventhandler to each table title
                ele.addEventListener('click',function(){

                    //remove all arrow sign at the beginning
                    document.querySelectorAll('.title-row th').forEach((ele)=>{ele.setAttribute('value','')})

                    // json name
                    let jsoname = ele.classList[1];
                    // check the type of the title from data;
                    let typeChecker = typeof data[0][jsoname];
                    // descending and ascending checker
                    desc_asc = !desc_asc;



                    // table 1
                    if(ele.parentNode.classList[1] == 'vf'){
                        document.querySelector('.table-vf tbody').innerHTML = '';
                        displayTable1(stringNumberSort(desc_asc,jsoname,typeChecker));
                        if(desc_asc){
                            ele.setAttribute('value','asc');
                        }
                        else{
                            ele.setAttribute('value','desc');
                        }
                    }
                    // table 2
                    else{
                        document.querySelector('.table-zf tbody').innerHTML = '';
                        displayTable2(stringNumberSort(desc_asc,jsoname,typeChecker));
                        if(desc_asc){
                            ele.setAttribute('value','asc');
                        }
                        else{
                            ele.setAttribute('value','desc');
                        }
                    }
                    //redo the two functions
                    findCheapestPrice();
                    displayHiddenPic();
                    
            })
            })

        }


        function stringNumberSort(desc_asc, tag,typeChecker){
            // copy data to temp_data
            let temp_data = data;
            // sort method has differnet syntax to handle number and string comaprison, so we check type first before we sort the json obj
            if(typeChecker === 'number'){
                temp_data = temp_data.sort((element1,element2)=>{
                    return desc_asc ? element1[tag] - element2[tag] : element2[tag] - element1[tag];
                })
            }
            if(typeChecker === 'string'){
                temp_data = temp_data.sort((element1,element2)=>{
                    return desc_asc ? element1[tag].localeCompare(element2[tag]) : element2[tag].localeCompare(element1[tag]);
                })
            }
            
            return temp_data;
        }
    

        displayTableData(data);
        findCheapestPrice();
        displayHiddenPic();
        filterfunc();
        estimatefunc();
        sortingfunc();
    }

    
    
    
    table();

    
    
}
