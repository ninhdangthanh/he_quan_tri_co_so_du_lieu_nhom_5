
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
// <!-- handle CRUD -->
    var pagination = 1;
    var res_list = []
    var currentMonth = new Date().getMonth() + 1;
    var keySortElem = document.getElementById('sort-select-3-agg-key')
    var valueSortElem = document.getElementById('sort-select-3-agg-value')


    function objSort(key, value) {
      if(key == 'name') return { name : Number(value) }
      if(key == 'restaurant_id') return { restaurant_id : Number(value) }
      return {name : 1}
    }

    if(pagination == 1) {
      document.querySelector('.arrow_pagination').innerHTML = `
            <button class="btn btn-outline-secondary btn_prev" type="submit">Prev</button>
            <span class="pagination_number">${pagination}</span>
            <button class="btn btn-outline-primary btn_next" type="submit">Next</button>
      `
    }

    document.querySelector(".btn_next").addEventListener("click", function () {
      ++ pagination;
      document.querySelector('.pagination_number').innerText = pagination
      document.querySelector('.btn_prev').classList.remove("btn-outline-secondary")
      document.querySelector('.btn_prev').classList.add("btn-outline-primary")
      getListRestaurant(pagination)
    })
    
    document.querySelector(".btn_prev").addEventListener("click", function () {
      if(pagination > 1) {
        -- pagination;
        document.querySelector('.pagination_number').innerText = pagination
      }
      if(pagination == 1) {
        document.querySelector('.btn_prev').classList.remove("btn-outline-primary")
        document.querySelector('.btn_prev').classList.add("btn-outline-secondary")
      }
      getListRestaurant(pagination)
    })

    function renderListRes(list) {
      document.querySelector('.body_restaurant').innerHTML = list.map(item => {
        return `
            <tr class="hover-item-restaurant">
                <th scope="row">${item.restaurant_id}</th>
                <td>${item.name}</td>
                <td>${item.cuisine}</td>
                <td>${item.borough}</td>
                <td>${item.address.street}</td>
                <td><a href="details.html?restaurantId=${item.restaurant_id}"><i class="bi bi-info-circle"></i></a></td>
                <td><span onClick=submitRated(${item.restaurant_id}) class="rated-restaurant-link" name="${item.name}" id="${item.restaurant_id}"><i class="bi bi-star"></i></span></td>
                <td><a href="edit.html?restaurantId=${item.restaurant_id}"><i class="bi bi-pencil-square"></i></a></td>
                <td><span class="delete-restaurant-link" onClick=deleteRestaurant(${item.restaurant_id})><i class="bi bi-trash"></i></span></td>
            </tr>
        `
    }).join("")
    }

    function getListRestaurant(page) {
      var objSortedd = objSort(keySortElem.value, valueSortElem.value)
      axios({
          method: 'post',
          url: `/api/v1/restaurant/page/${page}`,
          data: {
            objSortedd,
            textSearch : document.getElementById('text-search').value
          }
      })
      .then(function (response) {
        renderListRes(response.data)
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    getListRestaurant(pagination)
    

// rated restaurant

function submitRated(id) {
  document.querySelector('.rated-window').removeAttribute('hidden')
  document.querySelector('.id-table-rated').innerHTML = id
  document.querySelector('.name-table-rated').innerHTML = document.getElementById(id).getAttribute("name")
}

document.querySelector('.overlay').addEventListener('click', function () {
  document.querySelector('.rated-window').setAttribute('hidden',"true")
})

document.querySelector('.rated-btn').addEventListener('click', function () {
  document.querySelector('.rated-window').setAttribute('hidden',"true")
  ratedFunc(
    document.querySelector('.id-table-rated').innerHTML,
    document.querySelector('.rate-grade-select').value,
    document.querySelector('.rate-number-option').value,
  )
})

function ratedFunc(id, grade, score) {
    axios({
        method: 'post',
        url: `/api/v1/grade/rated/${id}/${grade}/${score}`
    })
    .then(function (response) {
        console.log(response);
        alert("Đánh giá restaurant thành công")
        location.reload();
    })
    .catch(function (error) {
        console.log(error);
        alert("Đánh giá restaurant thất bại")
    });
}

function deleteRestaurant(id) {
  var confirmDelete = confirm("Bạn có chắc chắn muốn xóa Restaurant")
  if(confirmDelete) {
    axios({
      method: 'delete',
      url: `/api/v1/restaurant/delete-restaurant/${id}`,
  })
  .then(function (response) {
      console.log(response);
      var confirmSuccess = confirm("Xóa restaurant thành công")
      if(confirmSuccess) {
          location.reload();
      } else {
          location.reload();
      }
  })
  .catch(function (error) {
      console.log(error);
      var confirmFailed = confirm("Xóa restaurant thất bại, vui lòng thử lại")
      if(confirmFailed) {
          location.reload();
      } else {
          location.reload();
      }
  });
  }
}

document.getElementById('third-agg-form').addEventListener('submit', function (e) {
  e.preventDefault()
  getListRestaurant(pagination)
})