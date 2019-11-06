//<<<<<<< HEAD
var apiKey = "95ee31820ec45dc8bd2ef7279ba150f4";

//returns an array of job results to be formatted by the front end
function getJobs(stringJobTitle){


    var queryURL = "http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=e2d98a7c&app_key="+apiKey+"&results_per_page=20&what="+stringJobTitle+"&content-type=application/json&where=toronto";
    var siftedResults = [];
    $.ajax({
        url: queryURL,
        method: "GET"        
    }).then(function(response) {
        i = 0;
        console.log(response.results.length);
        console.log(response);

        response.results.forEach(element => {

            var salaryMin = element.salary_min;
            var salaryMax = element.salary_max;
            let strSalary = "";
            
            if (salaryMin === salaryMax){
                strSalary = salaryMin+"";
            }
            if (salaryMax > salaryMin){
                strSalary = salaryMin + "-" + salaryMax;
            }
            else {
                strSalary = "N/A";
            }
            console.log(strSalary)

            
            //All of the info needed from the Adzuna API
            let jobInfo = {
                JobTitle: element.title,
                StrSalary: strSalary,
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
        console.log(siftedResults);
        return siftedResults;
 
});
}
