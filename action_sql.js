
var sql = require("mssql");
var ak = require('./client_a.js');
var config = {
        user: 'sa',
        password: 'sa2014',
        server: 'localhost', 
        database: 'PINGTEST',
        port: 51571,
        options: {
		    useColumnNames: true
  		}
    };
var connection = new sql.connect(config, function (err) {
        if (err) console.log(err);
	});
var request = new sql.Request();

function Insert_server(id_dulieu,kichthuoc_goitin, ping_time, ping_ttl,trangthai_goitin) {
	var conn_str = "INSERT INTO dbo.GOITIN ( ID_DULIEU, KICHTHUOC_GOITIN, PING_TIME, PING_TTL,TRANGTHAI_GOITIN) VALUES  ('" +id_dulieu +"','"+ kichthuoc_goitin +"','" + ping_time +"','" + ping_ttl +"','" + trangthai_goitin + "')";
    request.query(conn_str, function (err, recordset) {
        if (err) console.log(err)
    });
}

function Update_trangthai_hoanthanh(id_dulieu,trangthai){
	var conn_str = "UPDATE dbo.DULIEU SET TRANGTHAI = " + trangthai + " WHERE ID_DULIEU = " + id_dulieu;
    request.query(conn_str, function (err, recordset) {
        if (err) console.log(err)
    });
}

function Update_trangthai_DL_TB(id_dulieu,trangthai_tb){
	var conn_str = "UPDATE dbo.DULIEU SET TRANGTHAI_TB = " + trangthai_tb + " WHERE ID_DULIEU = " + id_dulieu;
    request.query(conn_str, function (err, recordset) {
        if (err) console.log(err)
    });
}

function Update_trangthai_toanbo_TB(trangthai_tb,reset_tt){
	var conn_str = "UPDATE dbo.DULIEU SET TRANGTHAI_TB = " + reset_tt + " WHERE TRANGTHAI_TB = " + trangthai_tb;
	request.query(conn_str, function (err, recordset) {
        if (err) console.log(err)
    });
}


function Update_trangthaiTB(id_thietbi,trangthai){
	var conn_str = "UPDATE dbo.THIETBI SET TRANGTHAI = " + trangthai + " WHERE ID_THIETBI = " + id_thietbi;
    request.query(conn_str, function (err, recordset) {
        if (err) console.log(err)
    });
}

function Read_trangthaiTB_byID(id_thietbi){
	var conn_str = "SELECT TRANGTHAI FROM dbo.THIETBI WHERE ID_THIETBI = "  + id_thietbi;
    request.query(conn_str, function (err, result) {
    	var str_send = -1;
        if (err) ak.V1_Update_trangthai_TB(str_send, id_thietbi)
        else{
        	try{
        		str_send = result.recordset[0].TRANGTHAI;
        		ak.V1_Update_trangthai_TB(str_send, id_thietbi);
        	} catch(e) {
        		ak.V1_Update_trangthai_TB(str_send, id_thietbi);
        	}
        }
    });
}

function Reset_setting_byID_TB(id_thietbi){
	var conn_str = "SELECT ID_DULIEU,IP_SERVER,CHUKY_PING,SOGOITINGUI FROM dbo.DULIEU WHERE ID_THIETBI = " + id_thietbi + " AND TRANGTHAI_TB <> 2 ";
	request.query(conn_str, function (err, result) {
		var str_send = -1;
		if (err) ak.V1_Reset_setting(str_send)
		else {
			try{
				var id_dulieu = result.recordset[0].ID_DULIEU; 
				var ip_server = result.recordset[0].IP_SERVER; 
				var chuky_ping = result.recordset[0].CHUKY_PING;
				var sotingui = result.recordset[0].SOGOITINGUI;
				var ad_server = ip_server.split(".");
				var str_send = "{'id_dulieu' : " + id_dulieu + ", 'ad1' : " + ad_server[0] + ", 'ad2' : " + ad_server[1] + ", 'ad3' : " + ad_server[2] + ", 'ad4' : " + ad_server[3] + ", 'chuky_ping' : " + chuky_ping + ", 'sogoitingui' : " + sotingui + "}";
						
				ak.V1_Reset_setting(str_send, id_thietbi);
			} catch(e) {
				ak.V1_Reset_setting(str_send);
			}
		}
	})
}
function Update_trangthaiHD_TB(id_thietbi,trangthai_hd){
	var conn_str = "UPDATE dbo.THIETBI SET TRANGTHAI_HD = " + trangthai_hd + " WHERE ID_THIETBI = " + id_thietbi;
    request.query(conn_str, function (err, recordset) {
        if (err) return null;
    });
}
function Update_trangthaiHD_TB1(id_thietbi,trangthai){
	var conn_str = "UPDATE dbo.THIETBI SET TRANGTHAI = " + trangthai + " WHERE ID_THIETBI = " + id_thietbi;
    request.query(conn_str, function (err, recordset) {
        if (err) return null;
    });
}

function read_trangthai_DL_TB_ById(id_dulieu, tt){
	var conn_str = "SELECT TRANGTHAI_TB FROM dbo.DULIEU WHERE ID_DULIEU = " + id_dulieu;
    request.query(conn_str, function (err, result) {
        var str_send = -1;
        if (err) ak.V1_Update_trangthai_DL_tb(str_send, id_dulieu, tt)
        else{
        	try{
        		str_send = result.recordset[0].TRANGTHAI_TB;
        		ak.V1_Update_trangthai_DL_tb(str_send, id_dulieu, tt);
        	} catch(e) {
        		ak.V1_Update_trangthai_DL_tb(str_send, id_dulieu, tt);
        	}
        } 
    });
}

module.exports.Insert_server=Insert_server;
module.exports.Update_trangthai_hoanthanh=Update_trangthai_hoanthanh;
module.exports.read_trangthai_DL_TB_ById=read_trangthai_DL_TB_ById;
module.exports.Update_trangthai_DL_TB=Update_trangthai_DL_TB;
module.exports.Update_trangthaiTB=Update_trangthaiTB;
module.exports.Read_trangthaiTB_byID=Read_trangthaiTB_byID;
module.exports.Update_trangthai_toanbo_TB=Update_trangthai_toanbo_TB;
module.exports.Reset_setting_byID_TB=Reset_setting_byID_TB;
module.exports.Update_trangthaiHD_TB=Update_trangthaiHD_TB;
module.exports.Update_trangthaiHD_TB1=Update_trangthaiHD_TB1;