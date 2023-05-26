import "./App.css";
import React, { useState, useEffect } from "react";

const App = () => <ExpensesApp />;

const mockData = [
  {
    description: "Book",
    amount: 35000, //COP
    category: "Education",
    date: "20/5/2023",
    id: "",
  },

  {
    description: "Taxi ",
    amount: 10000, //COP
    category: "Transportation",
    date: "19/5/2023",
    id: "",
  },
];

const categoryList = [
  "Clothing",
  "Education",
  "Entertainment",
  "Food",
  "General expense",
  "Health Care",
  "Housing",
  "Savings",
  "Transportation",
];

const baseURL = "http://localhost:3001";

const ExpensesApp = () => {
  const [expensesList, setExpensesList] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budget, setBudget] = useState(1000000);

  async function loadExpenses() {
    try {
      const response = await fetch(`${baseURL}/expenses`);
      if (response.ok) {
        const allExpenses = await response.json();
        setExpensesList(allExpenses);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(function () {
    loadExpenses();
  }, []);

  async function onAdd(newExpense) {
    try {
      const response = await fetch(`${baseURL}/expenses`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        const result = await response.json();
        setExpensesList([...expensesList, result]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onDelete(deletedIndex) {
    const selectedExpense = expensesList[deletedIndex];
    const { id } = selectedExpense;
    try {
      const response = await fetch(`${baseURL}/expenses/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExpensesList([
          ...expensesList.slice(0, deletedIndex),
          ...expensesList.slice(deletedIndex + 1),
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onEdit(editIndex, newExpense) {
    const selectedExpense = expensesList[editIndex];
    const { id } = selectedExpense;
    try {
      const response = await fetch(`${baseURL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        const result = await response.json();
        setExpensesList([
          ...expensesList.slice(0, editIndex),
          result,
          ...expensesList.slice(editIndex + 1),
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function calcTotal() {
    let amountArray = expensesList.map((obj) => obj.amount);
    console.log(amountArray);
    setTotalExpenses(amountArray.reduce((acc, cValue) => acc + cValue, 0));
  }

  function updateBudget(newBudget) {
    setBudget(newBudget);
  }

  return (
    <div id="app">
      <ExpensesHeader />
      <ExpensesBalance
        totalExpenses={totalExpenses}
        budget={budget}
        updateBudget={updateBudget}
      />
      <ExpensesForm onAdd={onAdd} calcTotal={calcTotal} />
      <ExpensesList
        fullList={expensesList}
        onDelete={onDelete}
        onEdit={onEdit}
        calcTotal={calcTotal}
      />
    </div>
  );
};

const ExpensesHeader = () => (
  <div id="header">
    <h1>Expense Tracker</h1>
  </div>
);

const ExpensesBalance = ({ totalExpenses, budget, updateBudget }) => {
  const [editBudget, setEditBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  function budgetEdition(event) {
    if (editBudget) {
      updateBudget(newBudget);
    }
    setEditBudget(!editBudget);
  }
  function changeHandler(event) {
    setNewBudget(event.target.value);
  }

  return (
    <div id="balance" className="balanceInfo">
      <div className="balanceCol">
        <span className="balanceTag">
          BUDGET{" "}
          <button
            type="button"
            className={editBudget ? "confirmBtn" : "editBtn"}
            onClick={budgetEdition}
          >
            {editBudget ? <OkSVG /> : <EditSVG />}
          </button>
        </span>
        <span className="balanceData greenText">
          {editBudget ? (
            <input
              type="number"
              className="balanceData"
              onChange={changeHandler}
            ></input>
          ) : (
            budget
          )}
        </span>
      </div>
      <div className="balanceCol">
        <span className="balanceTag ">YOUR BALANCE </span>
        <span className="balanceData {(budget>totalExpenses) ? greenText : redText}">
          {budget - totalExpenses}
        </span>
      </div>
      <div className="balanceCol">
        <span className="balanceTag"> EXPENSES </span>
        <span className="balanceData redText">{totalExpenses}</span>
      </div>
    </div>
  );
};

const ExpensesForm = ({ onAdd, calcTotal }) => {
  const [addAlert, setAddAlert] = useState(false);
  const [newCategory, setNewCategory] = useState("General expense");

  function handleSubmit(event) {
    event.preventDefault();
    const description = event.target.desc.value;
    const amount = Number(event.target.amount.value);
    const category = newCategory || "General expense";
    const date =
      event.target.date.value ||
      Intl.DateTimeFormat(["ban", "id"]).format(Date.now());
    //Intl.DateTimeFormat("es-sp", {dateStyle:"short", timeStyle: "full"} )
    const id = "";
    if (description && amount) {
      setNewCategory(newCategory);
      onAdd({ description, amount, category, date, id });

      calcTotal();
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
      <form onSubmit={handleSubmit} className="inputForm">
        <div className="inputData">
          <input
            type="text"
            name="desc"
            placeholder="Expense description"
            className="inputDesc"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount in COP"
            className="amount"
          />
          <CatSelector
            categoryList={categoryList}
            input={newCategory}
            setInput={setNewCategory}
          />
          <input
            type="date"
            className="amount"
            name="date"
            placeholder={Intl.DateTimeFormat(["ban", "id"]).format(Date.now())}
          />
        </div>
        <div className="inputConfirm">
          <button className="addBtn" type="submit">
            Add Expense
          </button>
        </div>
      </form>
      {addAlert ? (
        <span className="alert">Description and amount are required</span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

const CatSelector = ({ categoryList, input, setInput }) => {
  function changeHandler(event) {
    console.log(event.target.value);
    return setInput(event.target.value);
  }

  return (
    <select onClick={changeHandler}>
      <option selected>Expense type</option>
      {categoryList.map((item, index) => {
        return <option value={item}>{item}</option>;
      })}
    </select>
  );
};

const ExpensesList = ({ fullList, onDelete, onEdit, calcTotal }) => {
  return (
    <div id="historyTable">
      <h2 className="sectionTitle">EXPENSES HISTORY</h2>
      <table className="resultTable">
        <thead>
          <tr>
            <th></th>
            <th className="description">Description</th>
            <th className="amount">Amount [COP]</th>
            <th>Category</th>
            <th className="amount">Date</th>
            <th></th>
          </tr>
        </thead>
        {fullList.length ? (
          <span> </span>
        ) : (
          <span className="alert">Nothing here for now. </span>
        )}
        <tbody>
          {fullList.map((item, index) => {
            return (
              <Expense
                expense={item}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
                calcTotal={calcTotal}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Expense = ({ expense, index, onDelete, onEdit, calcTotal }) => {
  const [itemEdit, setItemEdit] = useState(false);
  const [newDesc, setNewDesc] = useState(expense.description);
  const [newAmount, setNewAmount] = useState(expense.amount);
  const [newCat, setNewCat] = useState(expense.category);
  const [newDate, setNewDate] = useState(expense.date);

  function deleteElement(event) {
    onDelete(index);
    calcTotal();
  }

  function editElement(event) {
    if (itemEdit) {
      expense.description = newDesc;
      expense.amount = Number(newAmount);
      expense.category = newCat;
      expense.date = newDate;
      onEdit(index, expense);
      calcTotal();
    }
    setItemEdit(!itemEdit);
  }

  return (
    <tr>
      <td></td>
      <td className="description">
        {itemEdit ? (
          <EditInput
            input={newDesc}
            setInput={setNewDesc}
            inputType={"text"}
            size={"20"}
          />
        ) : (
          <span>{expense.description}</span>
        )}
      </td>
      <td className="amount">
        {itemEdit ? (
          <EditInput
            input={newAmount}
            setInput={setNewAmount}
            inputType={"text"}
            size={"8"}
          />
        ) : (
          <span>{expense.amount}</span>
        )}
      </td>
      <td className="amount">
        {itemEdit ? (
          <CatSelector
            categoryList={categoryList}
            input={newCat}
            setInput={setNewCat}
          />
        ) : (
          <span>{expense.category}</span>
        )}
      </td>
      <td className="amount">
        {itemEdit ? (
          <EditInput input={newDate} setInput={setNewDate} inputType="date" />
        ) : (
          <span>{expense.date}</span>
        )}
      </td>
      <td>
        <button
          type="button"
          className={itemEdit ? "confirmBtn" : "editBtn"}
          onClick={editElement}
        >
          {itemEdit ? <OkSVG /> : <EditSVG />}
        </button>
        <button type="button" className="deleteBtn" onClick={deleteElement}>
          <DeleteSVG />
        </button>
      </td>
    </tr>
  );
};

const EditInput = ({ input, setInput, inputType, size }) => {
  function changeHandler(event) {
    return setInput(event.target.value);
  }

  return (
    <input
      size={size}
      type={inputType}
      value={input}
      onChange={changeHandler}
    />
  );
};

const OkSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="green"
        d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L10.6 13.8ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
      />
    </svg>
  );
};

const EditSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#1e81b0 "
        d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"
      />
      <path
        fill="#1e81b0 "
        d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"
      />
    </svg>
  );
};

const DeleteSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#dd7037"
        d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"
      />
    </svg>
  );
};

export default App;
