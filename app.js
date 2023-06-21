// //jshint esversion:6
//
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
//
// const app = express();
//
// app.set('view engine', 'ejs');
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
//
//  mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
//
// //Created Schema
// const itemsSchema = new mongoose.Schema({
//   name: String
// });
//
// //Created model
// const Item = mongoose.model("Item", itemsSchema);
//
// //Creating items
// const item1 = new Item({
//   name: "Welcome to your todo list."
// });
//
// const item2 = new Item({
//   name: "Hit + button to create a new item."
// });
//
// const item3 = new Item({
//   name: "<-- Hit this to delete an item."
// });
//
// const defaultItems = [item1, item2, item3];
//
// const listSchema = new mongoose.Schema({
//   name: String,
//   items:[itemsSchema],
// });
//
// const List = mongoose.model("List",listSchema);
//
// // Item.insertMany(defaultItems)
// //   .then(function(){
// //     console.log("Successfully saved into our DB.");
// //   })
// //   .catch(function(err){
// //     console.log(err);
// //   });
//
//
//
// app.get("/", function(req, res) {
//   Item.find({})
//       .then(foundItem => {
//         if (foundItem.length === 0) {
//             Item.insertMany(defaultItems)
//             res.redirect("/");
//         } else {
//           return foundItem;
//         }
//       })
//       .then(savedItem => {
//         res.render("list", {listTitle: "Today", newListItems: savedItem});
//       })
//       .catch(err => console.log(err));
// });
//
//
//
// app.post("/", function (req, res) {
//
//   // const item = req.body.newItem;
//   // if (req.body.list === "Work") {
//   //   workItems.push(item);
//   //   res.redirect("/work");
//   // } else {
//   //   foundItem.push(item);
//   //   res.redirect("/");
//   // }
//
//   const itemName = req.body.newItem;
//   const listName = req.body.list;
//
//   const item = new Item({
//     name:itemName
//   })
//
//  if(listName==="Today"){
//    item.save();
//    res.redirect("/");
//  } else {
//    List.findOne({name:listName})
//    .then(foundList => {
//      foundList.items.push(item);
//      foundList.save();
//      res.redirect("/"+listName);
//    })
//    .catch((err) => {
//      console.log(err);
//    });
//  }
//
// });
//
// app.get("/:customListName",(req,res)=>{
//   const customListName= req.params.customListName;
//
//
//   List.findOne({name: customListName})
//     .then(foundList => {
//       if(!foundList){
//
//         const list = new List({
//           name: customListName,
//           items: defaultItems
//         });
//
//         list.save();
//         res.redirect("/" + customListName);
//       } else {
//         res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
//
// // const friendId = req.body.friendId;
// //   const userId = req.params.id;
// //   User.findByIdAndUpdate(
// //     userId,
// //     { $pull: { friends: friendId } },
// //     { new: true }
// //   )
//
// app.post("/delete", function (req, res) {
//
//   const listName = req.body.listName;
//   const checkItemId = req.body.checkbox;
//
//   if (listName == "Today") {
//     await Item.deleteOne(
//       { _id: checkItemId }
//     );
//     res.redirect("/");
//   }
//   else
//   {
//     await List.findOneAndUpdate(
//       { name: listName },
//       { $pull: { items: { _id: checkItemId } } }
//     );
//     res.redirect("/" + listName);
//   }
// });
//
//
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });
//
// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });









const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://sandeep:sandeep123@cluster0.xggxkhs.mongodb.net/todolistDB");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your TO DO LIST",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<---- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Data inserted");
            res.redirect("/");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  // Check if itemName is not an empty string
  if (itemName.trim() !== '') {
    const item = new Item({
      name: itemName,
    });

    if (listName === "Today") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
        .then((foundItems) => {
          foundItems.items.push(item);
          foundItems.save();
          res.redirect("/" + listName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    if (listName === "Today") {
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
        .then((foundItems) => {
          res.redirect("/" + listName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});


app.post("/delete", function (req, res) {

  const listName = req.body.listName;
  const checkItemId = req.body.checkbox;

  if (listName == "Today") {
    deleteCheckedItem();
  } else {

    deleteCustomItem();
  }

  async function deleteCheckedItem() {
    await Item.deleteOne({ _id: checkItemId });
    res.redirect("/");
  }

  async function deleteCustomItem() {
    await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkItemId } } }
    );
    res.redirect("/" + listName);
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        console.log("saved");
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
