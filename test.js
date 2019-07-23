var ac = require('./action_sql.js');

	// var request = new sql.Request(connection);
	// request.query('SELECT ID_DULIEU, CHUKY_PING FROM dbo.DULIEU', function (err, result) {
            
 //            if (err) console.log(err)

 //            // send records as a responseresult.recordset[0]
 //            console.log(result);
            
 //        });
 function hhh(){
 	setInterval(function(){
 		ac.read();
 		
 	}, 1500);
 }

function myFunc(mess) {
	setInterval(function() {

	  var now = new Date();
	  console.log(now.toJSON());

	}, mess);
}

//myFunc(1000);
setTimeout(hhh, 1500);