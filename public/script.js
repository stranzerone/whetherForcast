async function fetchWeather (){


    try{

        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=8a349082bb2fea1bde1af9894c251850')
        .then(response => response.json())
       .then((data)=>{
     console.log(data)
     const slicedData =    data.list.slice(0,5)


slicedData.map((data,index)=>{
const mainCard = document.querySelector('#forcast')
const card = document.createElement('div')
card.classList.add('card')
card.id= `day`+index
card.innerHTML=Math.floor(data.main.temp-273)
mainCard.appendChild(card)



})

       })

    }catch(error){
        console.error(error)

    }
}


fetchWeather()