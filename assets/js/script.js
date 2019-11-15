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
    //TODO: deal with large numbers of pages
    if (pages > 1){
        var pageNav = $("<nav>").addClass("pageNav").css("text-align","center");
        var ul = $("<ul>").addClass("pagination");
       
        var pageNumberArray = getPageNumbers(pages);
        console.log(pageNumberArray);

        for(var i = 0; i < pageNumberArray.length;i++){
            var pageObj = pageNumberArray[i];
            console.log(pageObj,currentPage);
            ul.append($("<li>").addClass("page-item")
                .append($("<div>").addClass("page-link page-num-"+pageObj.text).text(pageObj.text).on('click',function(){
                
                console.log($(this),currentPage,pageObj.value,pages);
                if((currentPage == 1 && (pageObj.value == -1 || pageObj.value == -pages)) &&
                (currentPage == pages && (pageObj.value == 1 || pageObj.value == pages))){
                    return;
                }
                if(typeof pageObj.text != "number"){
                    currentPage += pageObj.value;
                }else{
                    currentPage = pageObj.value;
                }
                
                if(currentPage >= pages){
                    currentPage = pages;
                }else if(currentPage <= 1){
                    currentPage = 1;
                }

                getJobs(currentJob,currentPage,displayJobs);
            }))); 
        }

        
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


function getPageNumbers(pages){
    var result = [];
    if(pages <= maxDisplayPages){
        result.push({text:"<",value:-1});
        for(var i=1;i <= pages;i++){
            result.push({text:i,value:i});
        }
        result.push({text:">",value:1});
    }else{
        if(currentPage <= maxDisplayPages - Math.floor(maxDisplayPages/2)){
            for(var i=1;i <= maxDisplayPages;i++){
                result.push({text:i,value:i});
            }
            result.push({text:">",value:1});
            result.push({text:">>",value:pages});
        }else if(currentPage >= pages-maxDisplayPages+Math.floor(maxDisplayPages/2)){
            result.push({text:"<<",value:-pages});
            result.push({text:"<",value:-1});
            for(var i=pages-maxDisplayPages;i <= pages;i++){
                result.push({text:i,value:i});
            }
        }else{
            result.push({text:"<<",value:-pages});
            result.push({text:"<",value:-1});
            for(var i=currentPage-Math.floor(maxDisplayPages/2); i <= currentPage+Math.floor(maxDisplayPages/2) ;i++){
                result.push({text:i,value:i});
            }
            result.push({text:">",value:1});
            result.push({text:">>",value:pages});
        }    
    }

    return result;
}