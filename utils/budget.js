exports.calculate_total_used_amount = (transactions, budgetEntity) => {
  let budgetObj = {};

  for (let transaction of transactions) {
    let category_name = transaction.transactions_category.category_name;

    if (budgetObj[category_name] == undefined) {
      budgetObj[category_name] = transaction.transaction_amount;
    } else {
      budgetObj[category_name] += transaction.transaction_amount;
    }  
  }
    
  let budgetList = [];
  for (let budget of budgetEntity) {     
    let amount_used = budgetObj[budget.budget_category.category_name];
    if (!amount_used) {
      amount_used = 0;
    }
    let percentage_used = (amount_used / budget.budget_total) * 100;
    budgetList.push({
      _id: budget._id,
      budget_name: budget.budget_name,
      budget_total: budget.budget_total,
      budget_category: budget.budget_category.category_name,
      percentage_used: percentage_used.toFixed(2),
      amount_used: amount_used,
    });
  }

  return budgetEntity;
};
