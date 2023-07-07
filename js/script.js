const navigation = document.querySelector(".navigation");
const menuBtn = document.querySelector(".fa-bars");
const closeBtn = document.querySelector(".close i");
const weatherDetail = document.querySelector(".weather-detail");
const weatherList = document.querySelector(".navigation .list-item");
const addBtn = document.querySelector("form button");
const input = document.querySelector("input");

const apiKey = "d8de21b63dab46db89213222230607";
let listCity = ["jakarta", "london", "tokyo", "paris", "seoul"];
let weatherName;
let weatherImage;
let localData;

const getLocalData = () => {
  let itemValue = localStorage.getItem("weather");
  if (itemValue !== null) {
    localData = itemValue.split(",");
  } else {
    localData = listCity;
    localStorage.setItem("weather", listCity);
  }
};

getLocalData();

const saveToLocalStorage = () => {
  localStorage.setItem("weather", localData);
};

const getWeatherData = (location, status) => {
  console.log(localData);
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        localData = localData.filter((item) => item !== location);
        saveToLocalStorage();
        throw new Error("Terjadi kesalahan ketika pengambilan lokasi");
      }
    })
    .then((data) => {
      dataListInfo(data, status);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
};

const getListCity = () => {
  weatherList.innerHTML = "";
  for (let i = 0; i < localData.length; i++) {
    console.log(localData[i]);
    if (i === 0) {
      getWeatherData(localData[i], "active");
    } else {
      getWeatherData(localData[i]);
    }
  }
};

const dataListInfo = (data, status) => {
  datacheck(data);
  weatherList.innerHTML += `<div class="weather">
  <i class="fa-solid fa-star ${status}"></i>
  <i class="fa-solid fa-xmark delete"></i>
   <div class="weather-logo">
      <img src="asset/${weatherImage}.png" alt="">
      <p>°${data.current.feelslike_c}C</p>
   </div>
   <div class="weather-location">
      <h3 class="location-name">${data.location.name}</h3>
      <h3>${data.location.country}</h3>
      <p>${weatherName}</p>
   </div>
</div>`;

  if (status) {
    dataInfo(data);
  }
};

const addNewLocation = () => {
  for (let i = 0; i < localData.length; i++) {
    if (localData[i] === input.value) {
      alert("Lokasi sudah ada");
      return;
    }
  }
  localData.push(input.value);
  saveToLocalStorage();
  getListCity();
};

const dataInfo = (data) => {
  datacheck(data);
  weatherDetail.innerHTML = `
  <header>
   <img src="asset/${weatherImage}.png" alt="" srcset="">
      <h1>${weatherName}</h1>
      <h3>${data.location.name}</h3>
   </header>

   <div class="detail">
   <div class="about">
         <p>Lokasi</p>
         <p>${data.location.country}</p>
      </div>
      <div class="about">
         <p>Waktu</p>
         <p>${data.location.localtime}</p>
      </div>
      <div class="about">
         <p>Suhu dalam Celcius</p>
         <p>${data.current.feelslike_c}</p>
      </div>
      <div class="about">
         <p>Suhu dalam Fahrenheit</p>
         <p>${data.current.feelslike_f}</p>
      </div>
      <div class="about">
         <p>Arah angin dalam derajat</p>
         <p>${data.current.wind_degree}</p>
      </div>
      <div class="about">
         <p>Kecepatan angin dalam kilometer  per jam</p>
         <p>${data.current.gust_kph}</p>
      </div>
   </div>`;
};

const datacheck = (data) => {
  if (
    data.current.condition.text === "Mist" ||
    data.current.condition.text === "Overcast"
  ) {
    weatherName = "Mendung";
    weatherImage = "mendung";
  } else if (data.current.condition.text === "Partly cloudy") {
    weatherName = "Berawan";
    weatherImage = "berawan";
  } else if (
    data.current.condition.text === "Sunny" ||
    data.current.condition.text === "Clear"
  ) {
    weatherName = "Cerah";
    weatherImage = "cerah";
  } else if (data.current.condition.text === "Patchy rain possible") {
    weatherName = "Hujan";
    weatherImage = "hujan ringan";
  } else if (data.current.condition.text === "Moderate or heavy rain shower") {
    weatherName = "Hujan";
    weatherImage = "hujan deras";
  } else if (data.current.condition.text === "Patchy light rain with thunder") {
    weatherName = "Hujan";
    weatherImage = "hujan petir";
  }
};

menuBtn.addEventListener("click", () => {
  navigation.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  navigation.classList.remove("show");
});

getListCity();
addBtn.addEventListener("click", addNewLocation);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    console.log(e.target);
    let locationName =
      e.target.parentElement.querySelector(".location-name").innerText;
    if (localData.length === 1) {
      alert("Data terakhir tidak bisa dihapus");
    } else {
      localData = localData.filter(
        (item) => item != locationName.toLowerCase()
      );
      saveToLocalStorage();
      getListCity();
    }
  }

  if (
    e.target.classList.contains(
      "weather" || e.target.classList.contains("weather-location")
    )
  ) {
    let locationName = e.target.querySelector(".location-name").innerText;
    let starActive = document.querySelectorAll(".weather .fa-star");
    for (let i = 0; i < starActive.length; i++) {
      if (starActive[i].classList.contains("active")) {
        starActive[i].classList.remove("active");
      }
    }

    localData = localData.filter((item) => item !== locationName.toLowerCase());
    localData.unshift(locationName.toLowerCase());

    saveToLocalStorage();
    getListCity();
  }
});
