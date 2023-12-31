const url = "http://localhost:3000";
const config = {
  headers: {
    Authorization: `${localStorage.getItem("token")}`, //the token is a variable which holds the token
  },
};

//save expenses when clicked on add and display
const saveExpense = (e) => {
  e.preventDefault();
  console.log(e);
  console.log("hello");
  const expenseInput = document.getElementById("expenseInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const categoryInput = document.getElementById("categoryInput");
  const obj = {
    expenseInput: expenseInput.value,
    descriptionInput: descriptionInput.value,
    categoryInput: categoryInput.value,
    token: localStorage.getItem(`token`),
  };
  console.log(obj);

  axios
    .post(`${url}/expense`, obj)
    .then((data) => {
      console.log(data);
      const result = data.data.data;
      // creating new li node
      const expenseList = document.getElementById("expenseList");
      const newNode = document.createElement("li");
      newNode.innerHTML =
        ` ${result.expenseInput} ${result.descriptionInput} ${result.categoryInput}
                <button onclick="` +
        `deleteExpense('${result.id}')` +
        `">Delete</button>`;
      newNode.id = `${result.id}`;
      // inserting as a first child in expenseList
      expenseList.insertBefore(newNode, expenseList.children[0]);
    })
    .catch((err) => console.log(err));
  expenseInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
};
const addExpense = document.getElementById("addExpense");
addExpense.addEventListener("click", saveExpense);
const displayUsers = (data) => {
  console.log(data);
  const listOfUses = document.getElementById("listOfUses");
  listOfUses.innerHTML += `<li> ${data.name} : ${data.totalcost || 0}`;
};
//end of save expense and display

//offset------------------------------------------------------
const selectOffset = document.getElementById("offsetInput");
selectOffset.addEventListener("change", (e) => {
  localStorage.setItem("offset", e.target.value);
  const token = localStorage.getItem("token");
  if (token !== null) {
    axios
      .get(`${url}/expense?page=1&&offset=${e.target.value}`, config)
      .then((data) => {
        console.log(data.data);
        pagination(data.data);
      })
      .catch((err) => console.log(err));
  }
});

const display = (data) => {
  console.log(data);
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML +=
    `<li id="` +
    `${data.id}` +
    `"> 
    ${data.expenseInput} ${data.descriptionInput} ${data.categoryInput}
    <button onclick="` +
    `deleteExpense('${data.id}')` +
    `">Delete</button>
    </li>`;
};

const prevPage = (num) => {
  let offset = localStorage.getItem("offset");
  axios
    .get(`${url}/expense?page=${num}&&offset=${offset}`, config)
    .then((data) => {
      console.log(data.data);
      pagination(data.data);
    })
    .catch((err) => {
      console.log(err);
      console.log(`error in something`);
    });
};
const nextPage = (num) => {
  let offset = localStorage.getItem("offset");
  axios
    .get(`${url}/expense?page=${num}&&offset=${offset}`, config)
    .then((data) => {
      console.log(data.data);
      pagination(data.data);
    })
    .catch((err) => {
      console.log(err);
      console.log(`error in something`);
    });
};

const pagination = (data) => {
  console.log(data);
  console.log(data.hasNextPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  if (data.hasPrevPage === true) {
    pagination.innerHTML += `<button id="prevPage" onclick="prevPage(${data.prevPage})">${data.prevPage}</button>`;
  }
  pagination.innerHTML += `<button id="currentPage">${data.currentPage}</button>`;
  if (data.hasNextPage === true) {
    pagination.innerHTML += `<button id="nextPage" onclick="nextPage(${data.nextPage})" value="${data.nextPage}">${data.nextPage}</button>`;
  }
  if (data.result.length > 0)
    data.result.forEach((element) => {
      display(element);
    });
};

//logout-------------------------------------------
const logoutUser = () => {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("isPremium");
    alert("You are successfully logout");
    location = `${url}/login.html`;
  });
};

logoutUser();
const deleteExpense = (id) => {
  console.log(id);
  document.getElementById(`${id}`).remove();
  axios
    .delete(`${url}/expense/${id}`, config)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};
//logout------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  let offset = localStorage.getItem("offset");
  const token = localStorage.getItem("token");
  const is_premium = localStorage.getItem("isPremium")
  console.log("15999", is_premium)
  if (token !== null) {
    axios
      .get(`${url}/expense?page=1&&offset=${offset}`, config)
      .then((data) => {
        console.log(data.data);
        pagination(data.data);
      })
      .catch((err) => console.log(err));
  }
  const dashboardBtn = document.getElementById("dashboardBtn");
  const premiumStatus = localStorage.getItem("isPremium");
  console.log(premiumStatus);
  if (premiumStatus == "true") {
    const isPremium = document.getElementById("isPremium");
    const elem = document.getElementById("forpremium").style.visibility='visible';
    console.log(typeof isPremium);
    isPremium.innerHTML = "<p>You are a premium user now</p>";
    dashboardBtn.className = "btn btn-success";
  }
  if (token == undefined || token == "" || token == null) {
    alert("You are not login, Please login first to add Expense");
    window.location = `${url}/login.html`;
  } else {
    const name = localStorage.getItem("userName");
    const userName = document.getElementById("userName");
    userName.innerHTML = `<h3 class=" bg-success m-1 p-3 rounded">${name.toUpperCase()}</h3>`;
    const logout = document.getElementById("logout");
    logout.innerHTML = `<button type="button" id="logout" class="btn btn-outline-danger">Logout</button>`;
  }
});

//payment--------------------------
const handleOpenRazorpay = (data) => {
  console.log(data);
  let options = {
    key: "rzp_test_SakFS05puLVhuN",
    order_id: data.id,
    //this handler is a callback function and gets called when the payment is successful
    handler: function (response) {
      axios.post(`${url}/premium`, response, config).then((response) => {
        console.log('208',response);
        alert("You are a Premium user now");
        location.reload()
        const isPremium = document.getElementById("isPremium");
        console.log(isPremium);
        isPremium.innerHTML = "<p>You are a premium user now</p>";
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isPremium", response.data.is_premium);
      });
    },
  };
  let rzy = new Razorpay(options);
  rzy.open();
};

const premium = document.getElementById("premiumBtn");
if (premium != null) {
  premium.addEventListener("click", (e) => {
    e.preventDefault();
    axios
      .get(`${url}/premium`, config)
      .then((response) => {
        console.log(response);
        handleOpenRazorpay(response.data.order);
      })
      .catch((err) => console.log(err));
  });
}
//Payment done------------------------------

//leaderboard--------------------------------------
dashboardBtn.addEventListener("click", async () => {
  try {
    const data = await axios.get(`${url}/premium/dashboard`, config);
    console.log(data.data.data);
    document.getElementById("listOfUses").innerHTML = "";
    data.data.data.forEach((element) => displayUsers(element));
  } catch { }
});
//leaderboard----------------------------------------

//download-------------------------------------------
function download() {
  axios
    .get(`${url}/user/download`, config)
    .then((response) => {
      if (response.status === 200) {
        //the backend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "expense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
//download---------------------------------------------
