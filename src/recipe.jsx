import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap-css';
import {Button, Panel, ButtonToolbar,OverlayTrigger, ListGroup, Accordion, ListGroupItem, Input} from 'react-bootstrap'; 
import Modal from 'react-bootstrap/lib/Modal';



var recipes = (typeof localStorage["recipeBook"] != "undefined") ? JSON.parse(localStorage["recipeBook"]) : [ {title: "Pumpkin Pie", ingredients: ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]}, 
  {title: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]}, 
  {title: "Onion Pie", ingredients: ["Onion", "Pie Crust", "Sounds Yummy right?"]}], globalTitle = "", globalIngredients = [];


//Modal to add new recipes
var Addrecipe = React.createClass({
  getInitialState :function()
  {
    return({showModal:false});
  },
  close:function(){
    globalTitle="";
    globalIngredients=[];
    this.setState({showModal :false});
  },
 open: function() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("ingredients")) {
      $("#title").val(globalTitle);
      $("#ingredients").val(globalIngredients);
      if (globalTitle != "") {
        $("#modalTitle").text("Edit Recipe");
        $("#addButton").text("Edit Recipe");
      }
    }
    else requestAnimationFrame(this.open);
  },
  add :function()
  {
    var title = document.getElementById("title").value;
    var ingredients = document.getElementById("ingredients").value.split(",");
    var exists = false;
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].title === title) {
        recipes[i].ingredients = ingredients;
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (title.length < 1) title = "Untitled";
      recipes.push({title: title, ingredients: document.getElementById("ingredients").value.split(",")});
    }
    update();
    this.close();
  },
  render:function()
  {
    return(
    <div>
        <Button  bsSize="large" id="show" onClick={this.open}>
       Add a Recipe
        </Button>
        
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Add a recipe</Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <form>
              <Input type="text" label = "Recipe" placeholder="Enter Recipe Name" id = "title" />
              <Input type="textarea" label = "Ingredients" placeholder="Enter Ingredients, seperated by commas" id="ingredients" />
            </form>
            </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" id="addButton" onClick={this.add}>Add Recipe</Button>
            <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          
        </Modal>
        </div>
    );
  }
})



//Update Function-To upate the UI when new recipes are added
function update()
{
  localStorage.setItem("recipeBook", JSON.stringify(recipes));
  var rows = [];
  for(var j = 0 ; j < recipes.length; j++)
{
  rows.push(
  <Panel header={recipes[j].title} eventKey={j}>
      <Recipe title={recipes[j].title} ingredients={recipes[j].ingredients} index={j} />
  </Panel>
  );
}
  ReactDOM.render(<RecipeBook data={rows}/>, document.getElementById('app'));
}

//Recipe class to display a single recipe 
var Recipe = React.createClass({
  remove:function()
  {
    recipes.splice(this.props.index, 1);
    update();
  },
  edit: function()
  {
    globalTitle=this.props.title;
    globalIngredients = this.props.ingredients;
    document.getElementById('show').click();
  },
  render: function()
  {
    return(
    <div>
        <h4 className = "text-center">Ingredients</h4>
        <IngredientsList ingredients={this.props.ingredients} />
        <ButtonToolbar>
          <Button bsStyle="danger" className="delete" id={"btn-del" + this.props.index} onClick={this.remove}>Delete</Button>
          <Button bsStyle="default" id={"btn-edit" + this.props.index} onClick={this.edit}>Edit</Button>
        </ButtonToolbar>
    </div>
    );
  }
});

//Ingredient list inside the Panel
var IngredientsList = React.createClass({
  render: function()
  {
    var ingredientList = this.props.ingredients.map(function(ingredient){
      return(
      <ListGroupItem>
          {ingredient}
          </ListGroupItem>
      );
    });
    
    return(
    <ListGroup>
        {ingredientList}
    </ListGroup>
    );
  }
});

//RecipeBook class
var RecipeBook = React.createClass({
  render:function()
  {
    return(
      <div>
      <Accordion className = "accordion">
    {this.props.data}
        </Accordion>
        </div>
    );
  }
});

update();
//UI rendering
ReactDOM.render(<Addrecipe />, document.getElementById('button'));


