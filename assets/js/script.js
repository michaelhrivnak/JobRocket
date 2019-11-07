
var jobsDiv = $("jobs")
var fulljobsDiv = $("fullJobs");

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

    var jobDes= $("<div>"); //job desctiion
    jobDes.addClass("jobsDes");
    jobDes.attr("data-job", JSON.stringify(data[i]));

    var jobFullBody = $("<div>"); //body of the job description
    jobFullBody.addClass("job-body");

    var jobFullTitle = $("<h5>"); //basic job title
    jobFullTitle.addClass("job-title");
    jobFullTitle.text(data[i].JobTitle);

    var jobFullLocation = $("<p>"); //basic location of the job
    jobFullLocation.addClass("job-subtitle");
    jobFullLocation.text(data[i].JobMapInfo.City);

    var jobFullCompanyName = $("<p>");//basic company name
    jobFullCompanyName.addClass("job-subtitle");
    jobFullCompanyName.text(data[i].JobMapInfo.CompanyName);

    var jobFullDescription = $("<p>");//full job description
    jobFullDescription.addClass("jobDescription");
    jobFullDescription.text(data[i].JobDescription);

    var cardBtn = $("<button>") //applying the button with the URL LINK
    var jobUrlLink = $("<a>").attr("href",data[i].JobUrl);
    cardBtn.append(jobUrlLink);

    var mapArea = $("<div>"); //creating a sibling DIV to populate the map under the jobDescription
    mapArea.addClass("mapContainer"); //finish code to API call


    var map = $("<div>"); //generating a map based on the API call
    map.addClass("mapImg"); //finish code to API call 


    var directionsPanel = $("<div>"); //generating directions based on the API call
    directionsPanel.addClass("mapDirections");
    

    jobDes.append(jobFullBody.append(
        jobFullTitle, jobFullLocation, jobFullCompanyName, jobFullDescription, mapArea, map, directionsPanel
    ))
    
    fullJobsDiv.append(jobDes);
    
}
