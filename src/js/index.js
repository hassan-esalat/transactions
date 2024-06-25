const transactionsDom = document.querySelector(".transactions-items");
const loadTransactions = document.querySelector(".load-transactions");
const searchTransactionInput = document.querySelector(".search-transaction");
const priceSort = document.querySelector(".price-sort");
const dateSort = document.querySelector(".date-sort");
const sortData = document.querySelectorAll(".sort-data");
let sortFlag = false;
let sortFlagDate = false;
let pageLoadedFlag = false;
document.addEventListener("DOMContentLoaded", () => {
  // getdata();
  searchTransactionInput.value = "";
});

loadTransactions.addEventListener("click", () => {
  getdata();
  pageLoadedFlag = true;
});
searchTransactionInput.addEventListener("input", searchTransaction);
sortData.forEach((element) => {
  element.addEventListener("click", sortFunc);
});

const app = axios.create({
  baseURL: "http://localhost:3000/transactions",
});

async function sortFunc(e) {
  const res = e.target.dataset.sort;
  if (res === "price") {
    if (!sortFlag) {
      const { data } = await app.get(`?_sort=price&_order=asc`);
      showTransactionsInDom(data);
      e.target.classList.toggle("rtt");
      sortFlag = true;
    } else {
      const { data } = await app.get(`?_sort=price&_order=desc`);
      showTransactionsInDom(data);
      e.target.classList.toggle("rtt");
      sortFlag = false;
    }
  } else if (res === "date") {
    if (!sortFlagDate) {
      const { data } = await app.get(`?_sort=date&_order=asc`);
      showTransactionsInDom(data);
      e.target.classList.toggle("rtt");
      sortFlagDate = true;
    } else {
      const { data } = await app.get(`?_sort=date&_order=desc`);
      showTransactionsInDom(data);
      e.target.classList.toggle("rtt");
      sortFlagDate = false;
    }
  }
}

async function searchTransaction(e) {
  let inputVal = e.target.value;
  // console.log(e.target.value);
  const { data } = await app.get(`?refId_like=${inputVal}`);
  // console.log(data);
  if (pageLoadedFlag) {
    showTransactionsInDom(data);
  }
}

async function getdata() {
  const res = await app.get("?_sort=date&_order=desc");
  // console.log(res.data);
  showTransactionsInDom(res.data);
}

function showTransactionsInDom(transactions) {
  let res = "";
  transactions.forEach((item) => {
    res += ` <div class="transactions-item">
            <span class="transaction-row">${item.id}</span>
            <span class="transaction-type ${
              item.type.includes("برداشت از حساب") ? "color-red" : "color-green"
            }" >${item.type}</span>
            <span class="transaction-price">
              ${item.price}
            </span>
            <span class="transactionre-ref-id">${item.refId}</span>
            <span class="transaction-date">
             ${new Date(item.date).toLocaleDateString("fa-IR")}
            ساعت
            ${new Date(item.date).toLocaleString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            </span>
          </div>`;
  });
  transactionsDom.innerHTML = res;
}
