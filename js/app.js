// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure/ Data State
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name:'Cookie Dinner', calories: 400},
      // { id: 2, name:'Eggs Dinner', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0,
    totalItems: 0
  }

  // Public Method
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // console.log(name, calories);
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      //Creat new item
      newItem = new Item(ID, name, calories);
      // Add to   items array
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function (id) {
      let found = null;

      //Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      })
      return found;
    },
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    
    setCurrentItem: function (item) {
      data.currentItem = item
    },
    getCurrentItem: function () {
      return data.currentItem;
    },

    getTotalCalories: function () {
      let total = 0;
      //loop the items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      //set total cal in data structure
      data.totalCalories = total;

      // Return total 
      return data.totalCalories;
    },
    logData: function () {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li", 
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  }
  
  // Public Method
  return {
  
    populateItemList: function (items) {
      let html = '';

      items.forEach(function(item) {
        html += ` <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories}Calories</em>
        <a href="#" class="secondary-content ">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li> `;
      });
      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';    
      // Creat li element
      const li = document.createElement('li');
       // Add class name
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add Html
      li.innerHTML = ` <strong>${item.name}</strong> <em>${item.calories}Calories</em>
      <a href="#" class="secondary-content ">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      //Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = ` <strong>${item.name}</strong> <em>${item.calories}Calories</em>
          <a href="#" class="secondary-content ">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
       UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelection: function () {
      return UISelectors;
    }
  }
})();


//App Controller
const AppCtrl = (function (ItemCtrl, UICtrl) {
  // console.log(ItemCtrl.logData());

 
//Load Event Listeners
  const loadEventListeners = function () {
  /// Get UI Selectors
    const UISelectors = UICtrl.getSelection();

    // Add Item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Back Item Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);




  } 
  //Add item submit
  const itemAddSubmit = function (e) {

  //  console.log("tm");
    // Get form input from UI controller
    const input = UICtrl.getItemInput();
  //  console.log(input);
    // Check for name and calories input
    if (input.name !=="" & input.calories !=="") {
      //console.log(123);
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add item to UI list
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);
      
      //Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Edit Item click
  const itemEditClick = function (e) {
  //  console.log('test');
    if (e.target.classList.contains('edit-item')) {
    //  console.log('edit-item');
      //Get list  item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id
     // console.log(listId);
      // Break into an array
      const listIdArr = listId.split('-');
      // console.log(listIdArr);
      //Get the actual id
      const id = parseInt(listIdArr[1]);
      //console.log(id);
      //Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      //console.log(itemToEdit);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form 
      UICtrl.addItemToForm();


    }
    
    e.preventDefault();
  }

  // Item Update Submit
  const itemUpdateSubmit = function (e) {
  //  console.log('Update'); 
    //Get item input
    const input = UICtrl.getItemInput();
    
    //update item 
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

     //Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();

     //Add total calories to the UI
     UICtrl.showTotalCalories(totalCalories);        
     
    UICtrl.clearEditState();
    e.preventDefault()
  }


  // Public Method
  return {
    init: function () {
      console.log("Initializing.......");
      // clear edit OR set initial State
      UICtrl.clearEditState();


      // Fetch Items from date structure
      const items = ItemCtrl.getItems()
    //  console.log(items);
      
      // Check if any items
      if (items.length ===0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
      UICtrl.populateItemList(items);

      }
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories); 

      
      //load event listeners
      loadEventListeners();
      
    }
  }
  
})(ItemCtrl, UICtrl);

AppCtrl.init();








































// let a = 100;
// let b = 200;
// if (a == 100) {
//   console.log(true);
// } else {
//   console.log (false);
// }


// let a = 50;
// let b = 50;
// sum = a + b;
// if (sum == 100) {
//   console.log(true);
// } else {
//   console.log(false);
// }


// function count() {
//   let firstNumber = prompt("Enter the First Number" );
//   let secondNumber =  prompt("Enter the Second Number" );
//   if (firstNumber == 100 || secondNumber == 100) {
//     console.log(true)
//   } else {
//     console.log(false);
//   }
  
 

// };
 
// count();

