var adzunaApiKey = "95ee31820ec45dc8bd2ef7279ba150f4";
var app_id = "e2d98a7c"
var page = 1;
var results_per_page = 20;
var numPages;

//returns an array of job results to be formatted by the front end
function getJobs(stringJobTitle,page,callback){

    var queryURL = "https://api.adzuna.com/v1/api/jobs/ca/search/"+page+"?app_id="+app_id+"&app_key="+adzunaApiKey+"&results_per_page="+results_per_page+"&what="+stringJobTitle+"&content-type=application/json&where=toronto";
    var siftedResults = [];
    var totalResults;
    $.ajax({
        url: queryURL,
        method: "GET"        
    }).then(function(response) {
        
        totalResults = response.count;
        numPages = Math.ceil(totalResults/results_per_page);
        //console.log(totalResults, response);        

        response.results.forEach(element => {

            var salaryMin = element.salary_min;
            var salaryMax = element.salary_max;
            let strSalary = "";
            
            

            if ((salaryMin > 0 && salaryMax > 0) && ( salaryMin == salaryMax)){
                strSalary = "$"+salaryMin;
            }else if (salaryMax > salaryMin){
                strSalary = "$"+salaryMin + " - $" + salaryMax;
            }else {
                strSalary = "N/A";
            }
            //console.log(strSalary)

            
            //All of the info needed from the Adzuna API
            let jobInfo = {
                JobTitle: element.title,
                StrSalary: strSalary,
                JobDescriptionShort: element.description.substring(0,150)+"...",
                JobDescription: element.description,
                JobUrl: element.redirect_url,
                JobContract: element.contract_time,
                JobMapInfo:{CompanyName: element.company.display_name,
                            City: element.location.display_name,
                            Lat: element.latitude,
                            Long: element.longitude}
            };
            siftedResults.push(jobInfo);
            
        });
        //console.log(siftedResults);
        callback({results: siftedResults, totalResults: totalResults, pages: numPages});
        // return {results: siftedResults, totalResults: totalResults};
 
    });
}
