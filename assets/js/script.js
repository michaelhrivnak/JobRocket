
var jobsDiv = $("jobs")

var jobsArr = [{}]

displayJobs(jobsArr);

function displayJobs(jobsArr){
    jobsDiv.empty();
    for (var i = 0; i < jobsArr.length;i++){
        
        var cardDiv = $("<div>"); //creating the whole body of the card
        cardDiv.addClass("card");
        cardDiv.attr("data-job",JSON.stringify(jobsArr[i]));
        cardDiv.on('click', function(){createFullJobPost(JSON.parse($(this).attr("data-job")))});

        var cardBody = $("<div>"); //bootstrap for card
        cardBody.addClass("card-body");

        var cardTitle = $("<h5>"); //Title of the card
        cardTitle.addClass("card-title");
        cardTitle.html(jobsArr[i].JobTitle);

        var cardCompanyName = $("<h6>"); //Company Name
        cardSubtitle.addClass("card-subtitle mb-2 text-muted");
        cardSubtitle.html(jobsArr[i].JobMapInfo.CompanyName);

        var cardLocation = $("<h6>"); //Location
        cardSubtitle.addClass("card-subtitle mb-2");
        cardSubtitle.html(jobsArr[i].JobMapInfo.City);

        var cardDescription = $("<p>");
        cardDescription.addClass("description");
        cardDescription.html(jobsArr[i].JobDescription);

        var cardBtn = $("<button>") //applying the button with the URL LINK
        var jobUrlLink = $("<a>").attr("href",jobsArr[i].JobUrl);
        cardBtn.append(jobUrlLink);
        
        cardDiv.append(cardBody.append(
            cardTitle,cardSubtitle,cardCompanyName,cardLocation,cardDescription,cardBtn
        ))
        
        jobsDiv.append(cardDiv);
    }
}

function createFullJobPost(data){
    //make div that looks like:
    //<div id="mapArea"> 
    //    <div id="map"></div>
    //    <div id="directionsPanel"></div>
    //</div>
}
