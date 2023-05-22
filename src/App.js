import "./App.css";
import React, { useState } from "react";

const App = () => <ExpensesApp />;

const mockData = [
  {
    description: "Book",
    amount: 35000, //COP
    category: "Education",
    date: "20/5/2023",
  },

  {
    description: "Taxi ",
    amount: 10000, //COP
    category: "Transportation",
    date: "19/5/2023",
  },
];

const ExpensesApp = () => {
  const [list, setList] = useState(mockData);

  function onAdd(newExpense) {
    setList([...list, newExpense]);
    console.log(list);
  }
  function onDelete(deletedIndex) {
    setList([...list.slice(0, deletedIndex), ...list.slice(deletedIndex + 1)]);
  }

  function onEdit(editIndex, newExpense) {
    setList([
      ...list.slice(0, editIndex),
      newExpense,
      ...list.slice(editIndex + 1),
    ]);
  }

  return (
    <div id="app">
      <ExpensesHeader />
      <ExpensesForm onAdd={onAdd} />
      <ExpensesList fullList={list} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
};

const ExpensesHeader = () => (
  <div id="header">
    <h2>Expenses Tracker</h2>
  </div>
);

const ExpensesForm = ({ onAdd }) => {
  const [addAlert, setAddAlert] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const description = event.target.desc.value;
    const amount = Number(event.target.amount.value);
    const category = event.target.category.value || "Miscellaneous";
    const date =
      event.target.date.value ||
      Intl.DateTimeFormat(["ban", "id"]).format(Date.now());
    if (description && amount) {
      onAdd({ description, amount, category, date });
      if (addAlert) {
        setAddAlert(!addAlert);
      }
    } else {
      setAddAlert(!addAlert);
    }
    event.target.reset();
  }

  return (
    <div id="form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="desc"
          placeholder="Expense description"
          required
        />
        <input type="number" name="amount" placeholder="Amount" required />
        <input type="text" name="category" placeholder="Category" />
        <input
          type="text"
          name="date"
          value={Intl.DateTimeFormat(["ban", "id"]).format(Date.now())}
        />
        <button type="submit">Add Expense</button>
      </form>
      {addAlert ? (
        <span>Description and amount are required.</span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

const ExpensesList = ({ fullList, onDelete, onEdit }) => {
  return (
    <div>
      <table id="table1">
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th></th>
        </tr>
        {fullList.length ? "" : <span>Nothing here for now. </span>}

        {fullList.map((item, index) => {
          return (
            <Expense
              expense={item}
              index={index}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          );
        })}
      </table>
    </div>
  );
};

const Expense = ({ expense, index, onDelete, onEdit }) => {
  const [itemEdit, setitemEdit] = useState(false);
  const [newDesc, setNewDesc] = useState(expense.description);
  const [newAmount, setNewAmount] = useState(expense.amount);
  const [newCat, setNewCat] = useState(expense.category);
  const [newDate, setNewDate] = useState(expense.date);

  function deleteElement(event) {
    onDelete(index);
  }

  function editElement(event) {
    if (itemEdit) {
      expense.description = newDesc;
      expense.amount = newAmount;
      expense.category = newCat;
      expense.date = newDate;
      onEdit(index, expense);
    }
    setitemEdit(!itemEdit);
  }

  return (
    <tr>
      <td>
        {itemEdit ? (
          <EditInput input={newDesc} setInput={setNewDesc} />
        ) : (
          <span>{expense.description}</span>
        )}
      </td>
      <td>
        {itemEdit ? (
          <EditInput input={newAmount} setInput={setNewAmount} />
        ) : (
          <span>{expense.amount}</span>
        )}
      </td>
      <td>
        {itemEdit ? (
          <EditInput input={newCat} setInput={setNewCat} />
        ) : (
          <span>{expense.category}</span>
        )}
      </td>
      <td>
        {itemEdit ? (
          <EditInput input={newDate} setInput={setNewDate} />
        ) : (
          <span>{expense.date}</span>
        )}
      </td>
      <td>
        <button
          className={itemEdit ? "okButton" : "editButton"}
          onClick={editElement}
        >
          {itemEdit ? "Ok" : "Edit"}
        </button>
        <button onClick={deleteElement}>Delete</button>
      </td>
    </tr>
  );
};

const EditInput = ({ input, setInput }) => {
  function changeHandler(event) {
    return setInput(event.target.value);
  }

  return <input type="text" value={input} onChange={changeHandler} />;
};

export default App;
