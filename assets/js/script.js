var jobsDiv = $("#jobs");
var SavedAddress;
var currentPage;
var currentJob;
var fullJobsDiv = $("#fullJob");
var maxDisplayPages = 7;

//search for jobs button
$("#search").on("click",function(){
    event.preventDefault();
    currentPage = 1;
    currentJob = $("#jobTitle").val().trim();
    getJobs(currentJob,currentPage,displayJobs);
});

//save address
$("#save").on("click",function(){
    event.preventDefault();
    SavedAddress = $("#addressInput").val().trim();
    localStorage.setItem("SavedAddress",JSON.stringify(SavedAddress));
});

function init(){
    SavedAddress = localStorage.getItem("SavedAddress") != null?JSON.parse(localStorage.getItem("SavedAddress")): null;
    if(SavedAddress != null){
        $("#addressInput").val(SavedAddress);
    }
}

//fix margin for the full job column
$("#descriptionColumn").css("margin-left",$("#cardColumn").css("width")).css("top",$("#navbar").outerHeight(true));

//set job card column height
$("#cardColumn").css("height",$(document).innerHeight() - $("#navbar").outerHeight(true)).css("top",$("#navbar").outerHeight(true));

//fixing page element dimensions on resize
$(window).on('resize',function(){
    $("#descriptionColumn").css("margin-left",$("#cardColumn").css("width"));   
    $("#cardColumn").css("height",$(document).innerHeight() - $("#navbar").outerHeight(true)).css("top",$("#navbar").outerHeight(true));

    if($("#directionsPanel")){
        $("#map").css("height",$(window).innerHeight() 
        - $("#navbar").outerHeight(true)-fullJobsDiv.outerHeight(true)-10);
        $("#directionsPanel").height($("#map").height())
                        .css("marginLeft",$("#map").width())
                        .width($("#descriptionColumn").innerWidth(true)-$("#map").width());
    }

});

init();

function displayJobs(jobsObj){
    //erase existing content since we use appends
    jobsDiv.empty();

    //get array of jobs
    var jobsArr = jobsObj.results;
    
    var totalResults = jobsObj.totalResults;
    //display no results message and end out of our function
    if (totalResults == 0){
        jobsDiv.append($("h5").addClass("textWrapper").text("Sorry, no results found, please use another search term"));
        return;
    }
    var pages = jobsObj.pages;

    //build out job cards
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
        cardCompanyName.addClass("card-subtitle mb-2 text-muted");
        cardCompanyName.html(jobsArr[i].JobMapInfo.CompanyName);

        var cardLocation = $("<h6>"); //Location
        cardLocation.addClass("card-subtitle mb-2 text-muted");
        cardLocation.html(jobsArr[i].JobMapInfo.City);

        var cardSalary = $("<h6>"); // Salary
        cardSalary.addClass("card-subtitle mb-2");
        cardSalary.html(jobsArr[i].StrSalary);

        var cardDescription = $("<p>"); //truncated description
        cardDescription.addClass("description");
        cardDescription.html(jobsArr[i].JobDescriptionShort);

        // var cardBtn = $("<button>").addClass("btn btn-primary btn-sm"); //applying the button with the URL LINK
        // var jobUrlLink = $("<a>").attr("href",jobsArr[i].JobUrl).text("Job Link");
        // cardBtn.append(jobUrlLink);
        
        //put it all together
        cardDiv.append(cardBody.append(
             cardTitle,cardTitle,cardCompanyName,cardLocation,cardSalary,cardDescription
        ))
        //add it to the list
        jobsDiv.append(cardDiv);
    }
    //if we have any number of pages, make page buttons
    if (pages > 1){
        var pageNav = $("<nav>").addClass("pageNav").css("text-align","center");
        var ul = $("<ul>").addClass("pagination");
       
        //get our button array
        var pageNumberArray = getPageNumbers(pages);
        //console.log(pageNumberArray);

        //building the page buttons
        for(var i = 0; i < pageNumberArray.length;i++){
            var pageObj = { text: pageNumberArray[i].text, value: pageNumberArray[i].value };             
            var pageBtn = $("<li>").addClass("page-item")
                .append($("<div>").addClass("page-link page-num-" + pageObj.text)
                    .text(pageObj.text)
                    .click({ pageObj: pageObj, pages: pages }, goToPage)
                );
            
            ul.append(pageBtn);
        }
        
        //ES6 version of the button building
        //pageNumberArray.forEach(element => {
        //    console.log("hi");
        //    var pageBtn = $("<li>").addClass("page-item")
        //        .append($("<div>").addClass("page-link page-num-" + element.text)
        //            .text(element.text).on('click', function () {
        //                goToPage(element, pages);

        //            }));
        //    console.log(pageBtn.children());
        //    ul.append(pageBtn);
        //});

        
        pageNav.append(ul);
        
        //add one at the top and one at the bottom
        jobsDiv.append(pageNav.clone(true));
        jobsDiv.prepend(pageNav.clone(true));
        
    }
    $(document).ready(function(){
        $(".page-link").removeClass("active");
        $(".page-num-"+currentPage).addClass("active");
    });
    jobsDiv.prepend($("<h5>").attr("id","resultsCount").addClass("textWrapper").text(totalResults+" jobs found. (Page "+currentPage+" of " +pages+")" ));
}

//function to determing which page to go to after clicking a button
function goToPage(event) {
    
    var pageTextAndValue = event.data.pageObj;
    var numPages = event.data.pages;
    //making sure we don't do anything if we don't need to
    if ((currentPage == 1 && (pageTextAndValue.value == -1 || pageTextAndValue.value == -numPages)) ||
        (currentPage == numPages && (pageTextAndValue.value == 1 || pageTextAndValue.value == numPages)) ||
        (currentPage == pageTextAndValue.text)) {
        return;
    }
    if (typeof pageTextAndValue.text != "number") {
        currentPage += pageTextAndValue.value;
    } else {
        currentPage = pageTextAndValue.value;
    }
    //dealing with over/under flow
    if (currentPage >= numPages) {
        currentPage = numPages;
    } else if (currentPage <= 1) {
        currentPage = 1;
    }

    getJobs(currentJob, currentPage, displayJobs);
}

//build the full description and call map functions
function createFullJobPost(data){
    fullJobsDiv.empty();

    //check that there is an address saved/inputted
    if(SavedAddress == null){
        fullJobsDiv.html("<h3>Please enter your home address and click on the job you wish to see again!</h3>").addClass("textWrapper")
        return;
    }

    var jobFullBody = $("<div>"); //body of the job description
    jobFullBody.addClass("job-body");

    var jobFullTitle = $("<h2>"); //basic job title
    jobFullTitle.addClass("job-title");
    jobFullTitle.html(data.JobTitle);

    var jobFullCompanyName = $("<h3>");//basic company name
    jobFullCompanyName.addClass("job-subtitle");
    jobFullCompanyName.html(data.JobMapInfo.CompanyName);

    var jobFullLocation = $("<h3>"); //basic location of the job
    jobFullLocation.addClass("job-subtitle");
    jobFullLocation.html("Location: "+data.JobMapInfo.City);  
    
    var jobSalary = $("<h5>"); // Salary
    jobSalary.addClass("card-subtitle mb-2");
    jobSalary.html("<b>Expected Salary: </b>" + data.StrSalary);  

    var jobFullDescription = $("<p>");//full job description
    jobFullDescription.addClass("jobDescription");
    jobFullDescription.html("<b>Description:</b> " + data.JobDescription);

    //applying the button with the URL LINK
    var jobBtn  = $("<a>").addClass("btn btn-rounded btn-primary my-sm-0").attr("href",data.JobUrl).attr("target","_blank").text("Go to full job posting");
    
    //put everything together
    fullJobsDiv.append(jobFullBody.append(
        jobFullTitle,  jobFullCompanyName, jobFullLocation, jobSalary, jobFullDescription,jobBtn
    ));
    
    //call the map API to do its thing
    
    $("#map").css("height",$(window).innerHeight() 
    - $("#navbar").outerHeight(true)-fullJobsDiv.outerHeight(true)-10);
    $("#directionsPanel").height($("#map").height())
                        .css("marginLeft",$("#map").width())
                        .width($("#descriptionColumn").innerWidth(true)-$("#map").width());    
    
    MapsAPI.initMap(SavedAddress,data.JobMapInfo,document.getElementById("map"),document.getElementById("directionsPanel"));
    
}
//function to determine what page number buttons to display in the form of an array of text & value objects
function getPageNumbers(pages){
    var result = [];
    //if we can display all of the pages, do that
    if(pages <= maxDisplayPages){
        result.push({text:"<",value:-1});
        for(var i=1;i <= pages;i++){
            result.push({text:i,value:i});
        }
        result.push({text:">",value:1});
    //otherwise...
    }else{
        //if it is in the first n-n/2 numbers, show n with next and last
        if(currentPage <= maxDisplayPages - Math.floor(maxDisplayPages/2)){
            for(var i=1;i <= maxDisplayPages;i++){
                result.push({text:i,value:i});
            }
            result.push({text:">",value:1});
            result.push({text:">>",value:pages});
        //if its in the last n-n/2 numbers, show the last n numbers with previous and first    
        }else if(currentPage >= pages-maxDisplayPages+Math.floor(maxDisplayPages/2)){
            result.push({text:"<<",value:-pages});
            result.push({text:"<",value:-1});
            for(var i=pages-maxDisplayPages;i <= pages;i++){
                result.push({text:i,value:i});
            }
        //otherwise show the surrounding n-2 numbers with first, previous, next and last
        }else{
            result.push({text:"<<",value:-pages});
            result.push({text:"<",value:-1});
            for(var i=currentPage-Math.floor(maxDisplayPages/2)+1; i <= currentPage+Math.floor(maxDisplayPages/2)-1 ;i++){
                result.push({text:i,value:i});
            }
            result.push({text:">",value:1});
            result.push({text:">>",value:pages});
        }    
    }

    return result;
}