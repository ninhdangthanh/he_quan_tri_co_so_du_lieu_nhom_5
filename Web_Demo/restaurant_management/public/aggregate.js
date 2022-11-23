//1
document.getElementById("date-from").defaultValue = "2000-01-01"
document.getElementById("date-to").valueAsDate  = new Date()

var listGradeChecked = []

function clickWithMonth() {
    if(document.getElementById('with-month').checked){
        document.getElementById('month-select-option').removeAttribute('hidden')
        document.getElementById('date-from-to-form').setAttribute('hidden' , true)
    } else {
        document.getElementById('date-from-to-form').removeAttribute('hidden')
        document.getElementById('month-select-option').setAttribute('hidden' , true)
    }
}

document.getElementById('get-best-restaurant').addEventListener('submit', function (e) {
    e.preventDefault()
    document.querySelector('.checkbox-top-1#A').checked ? listGradeChecked.push("A") : "" 
    document.querySelector('.checkbox-top-1#B').checked ? listGradeChecked.push("B") : ""
    document.querySelector('.checkbox-top-1#C').checked ? listGradeChecked.push("C") : ""
    document.querySelector('.checkbox-top-1#P').checked ? listGradeChecked.push("P") : ""
    document.querySelector('.checkbox-top-1#Z').checked ? listGradeChecked.push("Z") : ""


    if(document.getElementById('with-month').checked){
        getTopMonthRestaurant({
                month: document.getElementById('month-select-option').value,
                listGrade: listGradeChecked,
                num: document.getElementById('num-res-top-1').value
            })
    } else {
        getTop1Restaurant({
            dateFrom: new Date(formatDate(document.getElementById("date-from").valueAsDate)),
            dateTo: new Date(formatDate(document.getElementById("date-to").valueAsDate)),
            listGrade: listGradeChecked,
            num: document.getElementById('num-res-top-1').value
        })
    }

    listGradeChecked = []
})

function getTop1Restaurant(data) {
    axios({
        method: 'post',
        url: '/api/v1/restaurant/1-1/best-rated',
        data: data
    })
    .then(function (response) {
        renderListDateSearch(response)
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getTopMonthRestaurant(data) {
    axios({
        method: 'post',
        url: '/api/v1/restaurant/top3/best-rated-month',
        data: data
    })
    .then(function (response) {
        renderListDateSearch(response)
    })
    .catch(function (error) {
        console.log(error);
    });
}

function renderListDateSearch(response) {
    document.querySelector('.body_top_rated').innerHTML = response.data.map(item => {
        return `
                <tr class="hover-item-restaurant">
                    <th scope="row">${item._id.restaurant_id}</th>
                    <td>${item._id.name}</td>
                    <td>${item._id.cuisine}</td>
                    <td>${item._id.borough}</td>
                    <td>${item._id.address.street}</td>
                    <td>${item.total}</td>
                    <td><a data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Thêm nhà hàng" href="details.html?restaurantId=${item._id.restaurant_id}"><i class="bi bi-info-circle"></i></a></td>
                    </tr>
                    `
        }).join("")
}


function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/').split("/").reverse().join("-");
}

function padTo2Digits(num) {
return num.toString().padStart(2, '0');
}